# src/

Minimal lisptc core required by the stripped MemoryRepl.

- `arith.ts` — numeric helpers (vendored here).
- `lisp.ts` — full interpreter. **If missing from this clone**, copy from:
  - Upstream: https://github.com/1hachem/lisptc/blob/main/packages/interpreter/src/lisp.ts
  - Or from the original sandbox: `/home/workdir/artifacts/mis/src/lisp.ts`

The file is ~73 KB / 2385 lines. Bootstrap expects it under `src/lisp.ts`.
