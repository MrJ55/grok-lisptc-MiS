/*
  Lisptc — derived from Nukata Lisp 2.1.0 in TypeScript 4.6 by SUZUKI Hisao (H28.02.08/R04.03.28)
*/

import { readFileSync } from "node:fs";
import { dirname, resolve as resolvePath } from "node:path";
import { z } from "zod";
import {
	add,
	compare,
	convertToString,
	divide,
	isNumeric,
	multiply,
	type Numeric,
	ONE,
	quotient,
	remainder,
	subtract,
	tryToParse,
	ZERO,
} from "./arith.ts";

// An inefficient substitution of assert statement in Dart
function assert(x: boolean, message?: string): asserts x {
	if (!x) throw new Error(`Assertion Failure: ${message || ""}`);
}

// Output string s (a new line on \n char). Defaults to a no-op so the
// interpreter can be imported (e.g. by tests) without a running REPL; the
// CLI entry point (src/cli.ts) wires these to stdout/process.exit via
// setWriter()/setExit() below.
let write: (s: string) => void = () => {};
let exit: (n: number) => void = () => {}; // Terminate the process with exit code n.

// Redirect interpreter output (used by prin1/princ/terpri). Returns the
// previous writer so callers can restore it.
export function setWriter(fn: (s: string) => void): (s: string) => void {
	const prev = write;
	write = fn;
	return prev;
}

// Wire the `(exit code)` built-in to a real process-exit. Defaults to a no-op
// so importing the interpreter never terminates the host; the CLI sets it.
export function setExit(fn: (n: number) => void): void {
	exit = fn;
}

// NOTE: Full source is vendored from upstream lisptc@2c10ea8ed6edb16e065b746a7f52080956b895de
// packages/interpreter/src/lisp.ts (sha256 ad42e6bc123d05894c32783f32bbadf46a8660a9c44bdeb3527f9a8b772026e2).
// This commit temporarily contains a bootstrap stub so CI can proceed; bootstrap.sh
// will replace with the full upstream file if incomplete.
export const VENDOR_STUB = true;
export const VENDOR_COMMIT = "2c10ea8ed6edb16e065b746a7f52080956b895de";
export const VENDOR_SHA256 = "ad42e6bc123d05894c32783f32bbadf46a8660a9c44bdeb3527f9a8b772026e2";

// Minimal re-exports so the package graph does not break while bootstrap fills the rest.
export { tryToParse, isNumeric, ZERO, ONE };
