# Plan — grok-lisptc-MiS

P0 and P1 complete as of 2026-08-31.

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

| Task | Status |
|------|--------|
| Validate before eval | Done |
| Save only on success | Done |
| No reset on EvalException | Done |
| Bootstrap provides lisp.ts | Done |
| Smoke + persistence | Done |
| Checkpoint | Done |

Revert: [docs/P0-REVERT.md](../docs/P0-REVERT.md).

---

## P1 — Hardening & UX (**done 2026-08-31**)

| Task | Status |
|------|--------|
| English-first user contract | Done — CUSTOM_INSTRUCTIONS + session-handoff + reseed |
| Pin lisptc SHA / content hashes | Done — `docs/UPSTREAM.md` |
| string-trim awareness | Done — UPSTREAM + learnings |
| Checkpoint / failure log | Already in P0 |

---

## P2 — Mind API & ops (next, optional)

| Task | Exit criteria |
|------|---------------|
| `(mis-state-summary)` / richer helpers | One form dumps useful mind status |
| Optional GitHub push of mind image | Documented or scripted |
| Scratch vs main image | Optional isolate experiments |

## P3 — Cabinet layer (later)

Vector / Vestige-style store with replace-not-accumulate; never eval raw memory text.

## Invariants

1. EvalException → report, keep defs, no reset
2. Image grows only from successful evals
3. Invalid input never reaches `run()`
4. Grok is sole host
5. User-facing answers plain language unless asked for Lisp

## Next

```bash
bash scripts/bootstrap.sh
cd /tmp/mis
node --experimental-transform-types --no-warnings bridge/eval.ts '(list (mis-version) (mis-ping) (triple 3))'
```
