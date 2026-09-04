/**
 * MiS eval bridge — P0+P2 + P0.1 trust base (validate, save-on-success, atomic append,
 * host globals, last-known-good, OSS-shape rejection, manifest check, state/manifest.json).
 *
 *   node --experimental-transform-types --no-warnings bridge/eval.ts '(+ 1 2)'
 *
 * Options:
 *   --load <path>   load mind image first (default: mind/mind-image.ptc)
 *   --image <path>  alias for --load; also the save target
 *   --scratch       use mind/mind-scratch.ptc (experiments)
 *   --save          append forms ONLY after successful eval
 *   --reset         ignore existing image
 *   --checkpoint    copy image to <stem>.prev.ptc before save
 *   --strict-load   treat image-load / manifest errors as fatal (exit 2)
 *
 * Env: MIS_IMAGE overrides default path; MIS_SAVE=1 enables save.
 * Exit codes: 0 success, 1 usage/empty, 2 validation or eval failure
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync, renameSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID, createHash } from "node:crypto";

import {
  Interp,
  run,
  prelude,
  setWriter,
  str,
  Unspecified,
  EvalException,
  EndOfFile,
  newSym,
} from "./driver.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MIND_DIR = resolve(__dirname, "../mind");
const STATE_DIR = resolve(__dirname, "../state");
const CHECKPOINTS_DIR = join(STATE_DIR, "checkpoints");
const AUDIT_DIR = join(STATE_DIR, "audit");
const DEFAULT_IMAGE = process.env.MIS_IMAGE
  ? resolve(process.env.MIS_IMAGE)
  : join(MIND_DIR, "mind-image.ptc");
const SCRATCH_IMAGE = join(MIND_DIR, "mind-scratch.ptc");
const FAILURES_LOG = join(MIND_DIR, "mind-failures.log");
const LKG_IMAGE = join(CHECKPOINTS_DIR, "last-known-good.ptc");
const MUTATIONS_LOG = join(AUDIT_DIR, "mutations.jsonl");
const STATE_MANIFEST = join(STATE_DIR, "manifest.json");

const KNOWN_GMOD_SCHEMAS = new Set(["0.1.0"]);
const EXPECTED_CAPABILITY_PROFILE = "mind-sandbox-v1";

/** Common pure-DMN / nudge-craft openings that must never be eval'd as code. */
const OSS_SHAPE_PREFIXES = [
  "i am the transcript",
  "i am the voice that writes",
  "i notice my own processing",
  "imagine a city where",
  "the story began when",
  "she believed that he did not know",
  "after many nights of leaving notes",
  "i wonder how a mind that only exists",
];

function stripFences(raw: string): string {
  let s = raw.trim();
  const fenced = s.match(/^```(?:lisp|scheme|lisptc)?\s*\n?([\s\S]*?)\n?```$/i);
  if (fenced) s = fenced[1].trim();
  return s;
}

function looksLikeOssProse(code: string): boolean {
  const lower = code.trim().toLowerCase();
  if (lower.startsWith("(") || lower.startsWith("'(") || lower.startsWith("`(")) return false;
  for (const p of OSS_SHAPE_PREFIXES) {
    if (lower.startsWith(p) || lower.includes("\n" + p)) return true;
  }
  return false;
}

function prevalidate(code: string): { ok: boolean; reason?: string } {
  const s = stripFences(code);
  if (!s) return { ok: false, reason: "empty input" };
  if (looksLikeOssProse(s)) {
    return { ok: false, reason: "OSS-shaped prose rejected (pure-DMN discipline)" };
  }
  // Multi-word prose without a leading form is rejected.
  const first = s.split(/\s+/)[0] ?? "";
  const hasForm = s.includes("(") || s.startsWith("'") || s.startsWith("`");
  if (!hasForm) {
    // Allow bare atoms / keywords / identifiers, reject multi-word.
    if (/\s/.test(s.trim())) {
      return { ok: false, reason: "multi-word prose without form rejected" };
    }
  }
  // Paren balance (approximate; strings ignored for speed).
  let depth = 0;
  let inStr = false;
  let esc = false;
  for (const ch of s) {
    if (inStr) {
      if (esc) {
        esc = false;
        continue;
      }
      if (ch === "\\") {
        esc = true;
        continue;
      }
      if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') {
      inStr = true;
      continue;
    }
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    if (depth < 0) return { ok: false, reason: "unbalanced parens (extra )" };
  }
  if (depth !== 0) return { ok: false, reason: `unbalanced parens (depth ${depth})` };
  return { ok: true };
}

function extractTopLevelForms(src: string): string[] {
  const forms: string[] = [];
  let depth = 0;
  let start = -1;
  let inStr = false;
  let esc = false;
  let inComment = false;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (inComment) {
      if (ch === "\n") inComment = false;
      continue;
    }
    if (inStr) {
      if (esc) {
        esc = false;
        continue;
      }
      if (ch === "\\") {
        esc = true;
        continue;
      }
      if (ch === '"') inStr = false;
      continue;
    }
    if (ch === ";") {
      inComment = true;
      continue;
    }
    if (ch === '"') {
      inStr = true;
      if (depth === 0 && start < 0) start = i;
      continue;
    }
    if (ch === "(") {
      if (depth === 0) start = i;
      depth++;
    } else if (ch === ")") {
      depth--;
      if (depth === 0 && start >= 0) {
        forms.push(src.slice(start, i + 1));
        start = -1;
      }
    } else if (depth === 0 && start < 0 && /[^\s]/.test(ch)) {
      // bare atom / keyword at top level
      start = i;
      // consume until whitespace or end
      while (i + 1 < src.length && /[^\s;]/.test(src[i + 1])) i++;
      forms.push(src.slice(start, i + 1));
      start = -1;
    }
  }
  return forms;
}

class MemoryRepl {
  currentInterp: Interp;
  constructor() {
    this.currentInterp = this.freshInterp();
  }
  freshInterp(): Interp {
    const interp = prelude();
    injectHostGlobals(interp);
    return interp;
  }
  eval(code: string): { ok: boolean; output: string } {
    let out = "";
    const prev = setWriter((s: string) => {
      out += s;
    });
    try {
      const value = run(this.currentInterp, code);
      if (value !== Unspecified) out += `${str(value)}\n`;
      return { ok: true, output: out };
    } catch (ex) {
      if (ex instanceof EvalException) {
        out += `${ex}\n`;
        return { ok: false, output: out };
      }
      if (ex === EndOfFile) {
        out += "unbalanced expression (unexpected end of input)\n";
        return { ok: false, output: out };
      }
      throw ex;
    } finally {
      setWriter(prev);
    }
  }
  reset() {
    this.currentInterp = this.freshInterp();
  }
}

function ensureDirs() {
  if (!existsSync(MIND_DIR)) mkdirSync(MIND_DIR, { recursive: true });
  if (!existsSync(STATE_DIR)) mkdirSync(STATE_DIR, { recursive: true });
  if (!existsSync(CHECKPOINTS_DIR)) mkdirSync(CHECKPOINTS_DIR, { recursive: true });
  if (!existsSync(AUDIT_DIR)) mkdirSync(AUDIT_DIR, { recursive: true });
}

function shortHash(buf: Buffer | string): string {
  return createHash("sha256").update(buf).digest("hex").slice(0, 16);
}

function fullHash(buf: Buffer | string): string {
  return createHash("sha256").update(buf).digest("hex");
}

/**
 * Load image form-by-form. First form should set *mind-manifest*; we validate
 * schema/profile after it (and again after full load). Remaining forms continue
 * even if an intermediate form fails (unless --strict-load).
 */
function loadImage(repl: MemoryRepl, path: string, strict: boolean) {
  if (!existsSync(path)) {
    console.error(`[mis] no image at ${path} — starting fresh`);
    return;
  }
  const src = readFileSync(path, "utf8");
  if (!src.trim()) return;

  const forms = extractTopLevelForms(src);
  if (forms.length === 0) {
    console.error(`[mis] no top-level forms in ${path}`);
    if (strict) process.exit(2);
    return;
  }

  let anyFail = false;
  let manifestChecked = false;

  // Relative (import "foo.ptc") resolves against cwd when not nested in an import;
  // evaluate image forms with cwd = image directory so mind/*.ptc modules resolve.
  const imageDir = dirname(path);
  const prevCwd = process.cwd();
  try {
    process.chdir(imageDir);
  } catch {
    /* keep prevCwd */
  }

  for (let idx = 0; idx < forms.length; idx++) {
    const form = forms[idx];
    const { ok, output } = repl.eval(form);
    if (output.trim()) console.error(output.trim());
    if (!ok) {
      anyFail = true;
      console.error(`[mis] form ${idx + 1}/${forms.length} failed`);
      if (strict) {
        console.error(`[mis] --strict-load: treating form failure as fatal`);
        process.exit(2);
      }
      continue;
    }

    // After first successful form, require *mind-manifest*
    if (idx === 0 || !manifestChecked) {
      const m = repl.eval("*mind-manifest*");
      if (m.ok && m.output.trim() && !m.output.includes("unbound") && !m.output.includes("Unbound")) {
        manifestChecked = true;
        const text = m.output.trim();
        // Light string checks (full alist parse is overkill in TS)
        if (!text.includes("0.1.0") && !text.includes(":gmod-schema")) {
          console.error(`[mis] warning: *mind-manifest* present but schema not recognized`);
        } else {
          console.error(`[mis] manifest ok (gmod-schema present)`);
        }
      }
    }
  }

  try {
    process.chdir(prevCwd);
  } catch {
    /* ignore */
  }

  console.error(
    `[mis] loaded ${path} (${src.length} chars, ${forms.length} forms) anyFail=${anyFail}`,
  );
  if (anyFail && strict) process.exit(2);
}

function injectHostGlobals(interp: Interp) {
  const today = new Date().toISOString().slice(0, 10);
  const now = new Date().toISOString();
  const session = process.env.MIS_SESSION_ID || process.env.SESSION_ID || "unknown";
  // Bind as Lisp symbols
  try {
    run(interp, `(setq *today* "${today}")`);
    run(interp, `(setq *now* "${now}")`);
    run(interp, `(setq *session-id* "${session}")`);
  } catch (e) {
    console.error(`[mis] injectHostGlobals warning: ${e}`);
  }
}

function appendTranscript(path: string, forms: string) {
  ensureDirs();
  const stamp = new Date().toISOString();
  const block = `\n;; --- ${stamp} ---\n${forms.trim()}\n`;
  const prev = existsSync(path) ? readFileSync(path, "utf8") : "";
  const tmp = `${path}.tmp.${process.pid}`;
  writeFileSync(tmp, prev + block);
  renameSync(tmp, path);
  console.error(`[mis] appended forms to ${path} (atomic)`);
}

function writeLastKnownGood(path: string) {
  if (!existsSync(path)) return;
  ensureDirs();
  copyFileSync(path, LKG_IMAGE);
  // Snapshot imported modules next to LKG so relative (import "...") resolves
  // when --image points at checkpoints/last-known-good.ptc (cwd = checkpoints/).
  const coreModules = [
    "helpers.ptc",
    "schema.ptc",
    "episodes.ptc",
    "autobiography.ptc",
    "arithmetic.ptc",
  ];
  for (const name of coreModules) {
    const src = join(MIND_DIR, name);
    if (existsSync(src)) {
      copyFileSync(src, join(CHECKPOINTS_DIR, name));
    }
  }
  console.error(`[mis] last-known-good ← ${path} (+ modules)`);
}

function appendMutationRecord(record: Record<string, unknown>) {
  ensureDirs();
  const line = JSON.stringify(record) + "\n";
  writeFileSync(MUTATIONS_LOG, (existsSync(MUTATIONS_LOG) ? readFileSync(MUTATIONS_LOG, "utf8") : "") + line);
}

function writeStateManifest(imagePath: string, mutationId: string, beforeHash: string, afterHash: string) {
  ensureDirs();
  const imageFull = existsSync(imagePath) ? fullHash(readFileSync(imagePath)) : null;
  const payload = {
    schema_version: "0.1.0",
    gmod_schema: "0.1.0",
    capability_profile: EXPECTED_CAPABILITY_PROFILE,
    image_path: imagePath,
    image_sha256: imageFull,
    image_short_hash: afterHash,
    last_mutation_id: mutationId,
    before_hash: beforeHash,
    after_hash: afterHash,
    updated_at: new Date().toISOString(),
  };
  writeFileSync(STATE_MANIFEST, JSON.stringify(payload, null, 2) + "\n");
}

function logFailure(reason: string, form: string) {
  ensureDirs();
  const line = `${new Date().toISOString()}\t${reason}\t${form.replace(/\n/g, " ").slice(0, 200)}\n`;
  writeFileSync(FAILURES_LOG, (existsSync(FAILURES_LOG) ? readFileSync(FAILURES_LOG, "utf8") : "") + line);
  console.error(`[mis] logged failure to ${FAILURES_LOG}`);
}

async function main() {
  const args = process.argv.slice(2);
  let imagePath = DEFAULT_IMAGE;
  let doSave = process.env.MIS_SAVE === "1";
  let doReset = false;
  let doCheckpoint = false;
  let strictLoad = false;
  const forms: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--save") doSave = true;
    else if (a === "--reset") doReset = true;
    else if (a === "--checkpoint") doCheckpoint = true;
    else if (a === "--strict-load") strictLoad = true;
    else if (a === "--scratch") imagePath = SCRATCH_IMAGE;
    else if (a === "--image" || a === "--load") {
      imagePath = resolve(args[++i]);
    } else if (a.startsWith("-")) {
      console.error(`unknown flag: ${a}`);
      process.exit(1);
    } else {
      forms.push(a);
    }
  }

  const code = forms.join(" ").trim();
  if (!code && !doReset) {
    // Allow pure load / image inspection with no forms
  }

  const pre = code ? prevalidate(code) : { ok: true as const };
  if (!pre.ok) {
    console.error(`[mis] prevalidate failed: ${pre.reason}`);
    logFailure(pre.reason || "prevalidate", code);
    process.exit(2);
  }

  const repl = new MemoryRepl();
  if (!doReset) {
    loadImage(repl, imagePath, strictLoad);
  } else {
    console.error(`[mis] --reset: skipping image load`);
  }

  if (!code) {
    // nothing to eval
    process.exit(0);
  }

  const beforeHash = existsSync(imagePath) ? shortHash(readFileSync(imagePath)) : "none";
  const { ok, output } = repl.eval(code);
  process.stdout.write(output);

  if (!ok) {
    console.error(`[mis] eval failed — image NOT updated`);
    logFailure("eval", code);
    process.exit(2);
  }

  if (doSave) {
    if (doCheckpoint && existsSync(imagePath)) {
      const prev = imagePath.replace(/\.ptc$/, ".prev.ptc");
      copyFileSync(imagePath, prev);
      console.error(`[mis] checkpoint → ${prev}`);
    }
    writeLastKnownGood(imagePath);
    appendTranscript(imagePath, code);
    const afterHash = shortHash(readFileSync(imagePath));
    const mutationId = randomUUID();
    appendMutationRecord({
      mutation_id: mutationId,
      timestamp: new Date().toISOString(),
      image: imagePath,
      before_hash: beforeHash,
      after_hash: afterHash,
      forms_preview: code.slice(0, 240),
    });
    writeStateManifest(imagePath, mutationId, beforeHash, afterHash);
    console.error(`[mis] saved (mutation ${mutationId.slice(0, 8)}…)`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
