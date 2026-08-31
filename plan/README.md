# Plan — grok-lisptc-MiS

Revised 2026-08-31 after ingesting review-by-all. P0 completed same day.

Full mapping: [docs/review-by-all-synthesis.md](../docs/review-by-all-synthesis.md).

---

## v0 (done 2026-08-30)

- [x] Strip MemoryRepl + vendor core sources
- [x] Transcript image + load path
- [x] Bootstrap script path
- [x] Handoff docs, custom instructions, ADRs
- [x] GitHub repo as durable home

---

## P0 — Safety & restore (**done 2026-08-31**)

| Task | Status | Verified |
|------|--------|----------|
| **Validate before eval** | Done | Prose / unbalanced → exit 2, no eval, no save |
| **Save only on success** | Done | `--save` only after `ok`; failures → `mind-failures.log` |
| **No reset on EvalException** | Done | type error then `(triple 9)` still works |
| **Bootstrap provides `lisp.ts`** | Done | Artifacts or upstream curl; smoke must pass |
| **Smoke + persistence** | Done | define → save → new process → call |
| **Checkpoint** | Done | `--checkpoint` → `mind-image.prev.ptc` |

Revert: [docs/P0-REVERT.md](../docs/P0-REVERT.md) + `/tmp/mis-p0-backup/`.

---

## P1 — Hardening & UX (next)

| Task | Exit criteria |
|------|---------------|
| English-first user contract in custom instructions | Documented |
| Pin lisptc SHA | UPSTREAM.md |
| string-trim awareness | Learnings note |

## P2 / P3

Helpers, optional GitHub push, vector cabinet — see earlier plan body.

## Invariants

1. EvalException → report, keep defs, no reset
2. Image grows only from successful evals
3. Invalid input never reaches `run()`
4. Grok is sole host
5. User-facing answers plain language unless asked for Lisp
