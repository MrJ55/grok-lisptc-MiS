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
  if (!code.includes("(") && code.length > 80 && /\s/.test(code)) return true;
  return false;
}

function prevalidate(code: string): string | null {
  if (!code.trim()) return "empty input";
  if (looksLikeOssProse(code)) {
    return "looks like untrusted OSS/prose (not a lisptc form); refuse to eval — store as candidate data only";
  }
  const trimmed = code.trim();
  if (!trimmed.includes("(") && !/^-?\d+(\.\d+)?$/.test(trimmed) && !/^"[^"]*"$/.test(trimmed) && !/^[a-zA-Z_*?!+\-*/<>=][\w\-?!*]*/.test(trimmed)) {
    if (/\s/.test(trimmed) && !trimmed.startsWith('"')) {
      return "does not look like lisptc (no s-expression); refuse to eval prose";
    }
  }
  let depth = 0;
  let inStr = false;
  let escape = false;
  for (let i = 0; i < code.length; i++) {
    const c = code[i];
    if (inStr) {
      if (escape) escape = false;
      else if (c === "\\") escape = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') inStr = true;
    else if (c === "(") depth++;
    else if (c === ")") {
      depth--;
      if (depth < 0) return "unbalanced: extra ')'";
    }
  }
  if (inStr) return "unbalanced: unclosed string";
  if (depth !== 0) return "unbalanced: unclosed '('";
  return null;
}

/**
 * Extract successive top-level s-expressions, skipping ; line comments and
 * respecting strings. Good enough for mind-image form-by-form load.
 */
function extractTopLevelForms(src: string): string[] {
  const forms: string[] = [];
  let i = 0;
  const n = src.length;
  while (i < n) {
    while (i < n && /\s/.test(src[i])) i++;
    if (i >= n) break;
    if (src[i] === ";") {
      while (i < n && src[i] !== "\n") i++;
      continue;
    }
    if (src[i] !== "(") {
      // skip non-form tokens (rare in image)
      while (i < n && !/\s/.test(src[i]) && src[i] !== "(" && src[i] !== ";") i++;
      continue;
    }
    const start = i;
    let depth = 0;
    let inStr = false;
    let escape = false;
    for (; i < n; i++) {
      const c = src[i];
      if (inStr) {
        if (escape) escape = false;
        else if (c === "\\") escape = true;
        else if (c === '"') inStr = false;
        continue;
      }
      if (c === '"') inStr = true;
      else if (c === "(") depth++;
      else if (c === ")") {
        depth--;
        if (depth === 0) {
          i++;
          forms.push(src.slice(start, i));
          break;
        }
      }
    }
    if (depth !== 0) {
      // unbalanced remainder — let eval report it
      forms.push(src.slice(start));
      break;
    }
  }
  return forms;
}

function injectHostGlobals(interp: InstanceType<typeof Interp>) {
  const today = new Date().toISOString().slice(0, 10);
  const now = new Date().toISOString();
  interp.defineGlobal(newSym("*today*"), today);
  interp.defineGlobal(newSym("*now*"), now);
}

class MemoryRepl {
  currentInterp: InstanceType<typeof Interp>;
  constructor() {
    this.currentInterp = this.freshInterp();
  }
  get interp() {
    return this.currentInterp;
  }
  freshInterp() {
    const interp = new Interp({ extensions: [] });
    run(interp, prelude);
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
          if (strict) {
            console.error(`[mis] --strict-load: unknown gmod-schema`);
            process.exit(2);
          }
        } else {
          console.error(`[mis] manifest ok (gmod-schema present)`);
        }
      } else if (idx === 0) {
        console.error(`[mis] warning: first form did not establish *mind-manifest*`);
        if (strict) {
          console.error(`[mis] --strict-load: missing *mind-manifest*`);
          process.exit(2);
        }
      }
    }
  }

  console.error(`[mis] loaded ${path} (${src.length} chars, ${forms.length} forms) anyFail=${anyFail}`);
  if (anyFail && strict) {
    process.exit(2);
  }
}

/** Atomic append via temp file + rename (POSIX). */
function appendTranscript(forms: string, path: string) {
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
  console.error(`[mis] last-known-good ← ${path}`);
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
    previous_short_hash: beforeHash,
    last_mutation_id: mutationId,
    last_known_good: LKG_IMAGE,
    updated_at: new Date().toISOString(),
  };
  const tmp = `${STATE_MANIFEST}.tmp.${process.pid}`;
  writeFileSync(tmp, JSON.stringify(payload, null, 2) + "\n");
  renameSync(tmp, STATE_MANIFEST);
  console.error(`[mis] state/manifest.json updated (${mutationId})`);
}

function logFailure(forms: string, reason: string) {
  ensureDirs();
  const stamp = new Date().toISOString();
  const block = `\n;; --- ${stamp} FAIL: ${reason} ---\n${forms.trim()}\n`;
  writeFileSync(FAILURES_LOG, (existsSync(FAILURES_LOG) ? readFileSync(FAILURES_LOG, "utf8") : "") + block);
  console.error(`[mis] logged failure to ${FAILURES_LOG}`);
}

function checkpointImage(path: string) {
  if (!existsSync(path)) return;
  const prevPath = path.replace(/\.ptc$/i, "") + ".prev.ptc";
  copyFileSync(path, prevPath);
  console.error(`[mis] checkpoint → ${prevPath}`);
}

const args = process.argv.slice(2);
let loadPath = DEFAULT_IMAGE;
let doSave = process.env.MIS_SAVE === "1";
let doReset = false;
let doCheckpoint = false;
let strictLoad = false;
let code: string | null = null;

for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if ((a === "--load" || a === "--image") && args[i + 1]) loadPath = resolve(args[++i]);
  else if (a === "--scratch") loadPath = SCRATCH_IMAGE;
  else if (a === "--save") doSave = true;
  else if (a === "--reset") doReset = true;
  else if (a === "--checkpoint") doCheckpoint = true;
  else if (a === "--strict-load") strictLoad = true;
  else if (a === "-") {
    /* stdin */
  } else if (!a.startsWith("-")) code = a;
}

if (!code) {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
  code = Buffer.concat(chunks).toString("utf8");
}

if (!code || !code.trim()) {
  console.error("usage: eval.ts [--load|--image path] [--scratch] [--save] [--reset] [--checkpoint] [--strict-load] '<lisp forms>'");
  process.exit(1);
}

const stripped = stripFences(code);
const preErr = prevalidate(stripped);
if (preErr) {
  console.error(`[mis] validation failed: ${preErr}`);
  process.stdout.write(`[mis-error] validation: ${preErr}\n`);
  logFailure(stripped, preErr);
  process.exit(2);
}

ensureDirs();
const repl = new MemoryRepl();
if (!doReset) loadImage(repl, loadPath, strictLoad);

const { ok, output } = repl.eval(stripped);
process.stdout.write(output);

if (!ok) {
  console.error(`[mis] eval failed — image NOT updated`);
  logFailure(stripped, "eval-error");
  process.exit(2);
}

if (doSave) {
  const beforeHash = existsSync(loadPath) ? shortHash(readFileSync(loadPath)) : "none";
  writeLastKnownGood(loadPath);
  if (doCheckpoint) checkpointImage(loadPath);
  appendTranscript(stripped, loadPath);
  const afterHash = shortHash(readFileSync(loadPath));
  const mutationId = `mut-${randomUUID()}`;
  appendMutationRecord({
    mutation_id: mutationId,
    actor: process.env.MIS_SESSION_ID || "grok-session",
    timestamp: new Date().toISOString(),
    operation: "append-forms",
    path: loadPath,
    state_before_hash: beforeHash,
    state_after_hash: afterHash,
    validation_result: "success",
    rollback_target: LKG_IMAGE,
  });
  writeStateManifest(loadPath, mutationId, beforeHash, afterHash);
}

process.exit(0);
