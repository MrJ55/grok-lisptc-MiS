/**
 * Thin driver that re-exports the interpreter under relative paths
 * so Node --experimental-transform-types can load it.
 */
export {
  Interp,
  run,
  prelude,
  setWriter,
  str,
  Unspecified,
  EvalException,
  EndOfFile,
  newSym,
  Cell,
} from "../src/lisp.ts";
