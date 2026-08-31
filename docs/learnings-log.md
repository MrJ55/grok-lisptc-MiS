# Learnings log

Append durable observations here. Newest first.

## 2026-08-31 — P0 executed

- Hardened `bridge/eval.ts`: strip fences, paren/string prevalidate, `{ok,output}` eval, save only if ok, failures → `mind-failures.log`, exit 2 on fail, `--checkpoint`.
- Hardened `scripts/bootstrap.sh`: ensure lisp.ts/arith.ts from artifacts or upstream curl; smoke must exit 0.
- Verified: prose rejected; unbalanced rejected; define+save persists; EvalException keeps defs; undefined fn no-save; checkpoint revert works.
- Note: `(/ 1 0)` is success in lisptc (Infinity), not an exception.
- Revert: `docs/P0-REVERT.md` + `/tmp/mis-p0-backup/`.

## 2026-08-31 — review-by-all synthesis

- Mapped Pi-Lisptc multi-review to MiS; P0 gaps were validate/save/bootstrap lisp.ts.

## 2026-08-30 — v0 mind loop

- Stripped MemoryRepl + zod only; transcript image; runtime under `/tmp/mis`.
