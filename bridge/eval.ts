/**
 * MiS eval bridge — P0+P2 (validate, save-on-success, --scratch/--image).
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
 *
 * Env: MIS_IMAGE overrides default path; MIS_SAVE=1 enables save.
 * Exit codes: 0 success, 1 usage/empty, 2 validation or eval failure
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  Interp,
  run,
  prelude,
  setWriter,
  str,
  Unspecified,
  EvalException,
  EndOfFile,
} from "./driver.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MIND_DIR = resolve(__dirname, "../mind");
const DEFAULT_IMAGE = process.env.MIS_IMAGE
  ? resolve(process.env.MIS_IMAGE)
  : join(MIND_DIR, "mind-image.ptc");
const SCRATCH_IMAGE = join(MIND_DIR, "mind-scratch.ptc");
const FAILURES_LOG = join(MIND_DIR, "mind-failures.log");

function stripFences(raw: string): string {
  let s = raw.trim();
  const fenced = s.match(/^```(?:lisp|scheme|lisptc)?\s*\n?([\s\S]*?)\n?```$/i);
  if (fenced) s = fenced[1].trim();
  return s;
}

function prevalidate(code: string): string | null {
  if (!code.trim()) return "empty input";
  const trimmed = code.trim();
  if (!trimmed.includes("(") && !/^-?\d+(\.\d+)?$/.test(trimmed) && !/^"[^"]*"$/.test(trimmed) && !/^[a-zA-Z_*?!+\-*/<>=][\w\-?!*]*$/.test(trimmed)) {
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

function ensureMindDir() {
  if (!existsSync(MIND_DIR)) mkdirSync(MIND_DIR, { recursive: true });
}

function loadImage(repl: MemoryRepl, path: string) {
  if (!existsSync(path)) {
    console.error(`[mis] no image at ${path} — starting fresh`);
    return;
  }
  const src = readFileSync(path, "utf8");
  if (!src.trim()) return;
  const { ok, output } = repl.eval(src);
  console.error(`[mis] loaded ${path} (${src.length} chars) ok=${ok}`);
  if (output.trim()) console.error(output.trim());
  if (!ok) {
    console.error(`[mis] warning: image load reported errors (definitions may be partial)`);
  }
}

function appendTranscript(forms: string, path: string) {
  ensureMindDir();
  const stamp = new Date().toISOString();
  const block = `\n;; --- ${stamp} ---\n${forms.trim()}\n`;
  const prev = existsSync(path) ? readFileSync(path, "utf8") : "";
  writeFileSync(path, prev + block);
  console.error(`[mis] appended forms to ${path}`);
}

function logFailure(forms: string, reason: string) {
  ensureMindDir();
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
let code: string | null = null;

for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if ((a === "--load" || a === "--image") && args[i + 1]) loadPath = resolve(args[++i]);
  else if (a === "--scratch") loadPath = SCRATCH_IMAGE;
  else if (a === "--save") doSave = true;
  else if (a === "--reset") doReset = true;
  else if (a === "--checkpoint") doCheckpoint = true;
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
  console.error("usage: eval.ts [--load|--image path] [--scratch] [--save] [--reset] [--checkpoint] '<lisp forms>'");
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

ensureMindDir();
const repl = new MemoryRepl();
if (!doReset) loadImage(repl, loadPath);

const { ok, output } = repl.eval(stripped);
process.stdout.write(output);

if (!ok) {
  console.error(`[mis] eval failed — image NOT updated`);
  logFailure(stripped, "eval-error");
  process.exit(2);
}

if (doSave) {
  if (doCheckpoint) checkpointImage(loadPath);
  appendTranscript(stripped, loadPath);
}

process.exit(0);
