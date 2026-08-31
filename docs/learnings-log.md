# Learnings log

Newest first.

## 2026-08-31 — P1 (UX + pins)

- English-first contract in CUSTOM_INSTRUCTIONS and session-handoff.
- `docs/UPSTREAM.md`: lisptc HEAD `2c10ea8…`, sha256 of vendored lisp.ts / arith.ts.
- string-trim bug confirmed: `_whitespace?` uses two-char `"\\t"` literals; avoid relying on it in MiS.

## 2026-08-31 — P0 executed

- Hardened bridge: validate, save-only-on-success, failures log, checkpoint, no reset on EvalException.
- Bootstrap ensures lisp.ts; smoke must pass.

## 2026-08-31 — review-by-all synthesis

- Mapped Pi-Lisptc multi-review to MiS; deferred Fireworks grammar / Pi extension concerns.

## 2026-08-30 — v0 mind loop

- Stripped MemoryRepl + zod; transcript image; runtime under `/tmp/mis`.
