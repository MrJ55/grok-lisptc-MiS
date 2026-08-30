/**
 * MiS eval bridge — string-in / string-out for a stripped lisptc MemoryRepl.
 *
 *   NODE_PATH=/tmp/mis-node/node_modules \
 *   node --experimental-transform-types --no-warnings bridge/eval.ts '(+ 1 2)'
 *
 * Options:
 *   --load <path>   load a mind image first (default: mind/mind-image.ptc)
 *   --save          append the evaluated forms to the image after success
 *   --reset         ignore existing image
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
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
const DEFAULT_IMAGE = join(MIND_DIR, "mind-image.ptc");

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
  eval(code: string): string {
    let out = "";
    const prev = setWriter((s: string) => {
      out += s;
    });
    try {
      const value = run(this.currentInterp, code);
      if (value !== Unspecified) out += `${str(value)}\n`;
    } catch (ex) {
      if (ex instanceof EvalException) out += `${ex}\n`;
      else if (ex === EndOfFile)
        out += "unbalanced expression (unexpected end of input)\n";
      else throw ex;
    } finally {
      setWriter(prev);
    }
    return out;
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
  const result = repl.eval(src);
  console.error(`[mis] loaded ${path} (${src.length} chars)`);
  if (result.trim()) console.error(result.trim());
}

function appendTranscript(forms: string, path: string) {
  ensureMindDir();
  const stamp = new Date().toISOString();
  const block = `\n;; --- ${stamp} ---\n${forms.trim()}\n`;
  const prev = existsSync(path) ? readFileSync(path, "utf8") : "";
  writeFileSync(path, prev + block);
  console.error(`[mis] appended forms to ${path}`);
}

// --- CLI ---
const args = process.argv.slice(2);
let loadPath = DEFAULT_IMAGE;
let doSave = process.env.MIS_SAVE === "1";
let doReset = false;
let code: string | null = null;

for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === "--load" && args[i + 1]) loadPath = resolve(args[++i]);
  else if (a === "--save") doSave = true;
  else if (a === "--reset") doReset = true;
  else if (a === "-") {
    // read stdin later
  } else if (!a.startsWith("-")) code = a;
}

if (!code) {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
  code = Buffer.concat(chunks).toString("utf8");
}

if (!code || !code.trim()) {
  console.error("usage: eval.ts [--load path] [--save] [--reset] '<lisp forms>'");
  process.exit(1);
}

ensureMindDir();
const repl = new MemoryRepl();
if (!doReset) loadImage(repl, loadPath);

const result = repl.eval(code);
process.stdout.write(result);

if (doSave) appendTranscript(code, loadPath);
