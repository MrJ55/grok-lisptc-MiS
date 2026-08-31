# Plan — grok-lisptc-MiS

Revised 2026-08-31 after ingesting  
[Pi-Lisptc/review-by-all](https://github.com/MrJ55/Pi-Lisptc/tree/main/review-by-all)  
(synthesis of GLM5p3, Luna, Sonnet, Terra, Gemini).  
Full mapping: [docs/review-by-all-synthesis.md](../docs/review-by-all-synthesis.md).

---

## v0 (done 2026-08-30)

- [x] Strip MemoryRepl + vendor core sources (`lisp.ts`, `arith.ts`)
- [x] Transcript image + load path
- [x] Bootstrap script path
- [x] Handoff docs, custom instructions, ADRs
- [x] GitHub repo as durable home

---

## Revised priorities (MiS-relevant only)

### P0 — Safety & restore (do before any "living mind" claims)

| Task | Why (review) | Exit criteria |
|------|----------------|---------------|
| **Validate before eval** | Unanimous A4 / R05 | Fenced or invalid input → no eval, clear error, no save |
| **Save only on success** | Image poison / R01 family | `--save` runs only after clean eval; failed forms never appended |
| **No reset on EvalException** | B1 / R01 (already mostly true) | Test: define → force error → definition still present |
| **Bootstrap always provides `lisp.ts`** | Runtime incomplete on clone | `scripts/bootstrap.sh` curls upstream or copies artifacts; smoke passes |
| **Smoke + persistence test** | B7, B10 | One script: load image → `(mis-ping)` → define → save → new process → call |

### P1 — Hardening & UX

| Task | Why | Exit criteria |
|------|-----|---------------|
| Checkpoint / rollback | Sonnet ADR-0004 data-loss; soft recovery | Optional `mind-image.prev.ptc` before risky saves |
| Failure log (not image) | Audit without poison | Failed forms → `mind-failures.log` or stderr only |
| English-first user contract | User Lisp weak | Custom instructions + handoff: Grok always answers user in plain language |
| Pin lisptc SHA | A9 / R03 | Document SHA of vendored `lisp.ts` / `arith.ts` in `docs/` or `UPSTREAM.md` |
| `string-trim` awareness | R10 | Note in learnings; avoid or patch if we rely on trim with tabs |

### P2 — Mind API & ops

| Task | Why | Exit criteria |
|------|-----|---------------|
| `(mis-state-summary)` / richer helpers | Operability | One form dumps defined symbols or last N transcript stamps |
| Auto-push mind image to GitHub (optional) | Cross-session durability | Documented manual or scripted push after save |
| Scratch vs main image | Isolate experiments | Optional `mind-scratch.ptc` that never overwrites main |

### P3 — Cabinet layer (later)

| Task | Why | Exit criteria |
|------|-----|---------------|
| Vestige / Pinecone (or free vector) | A5 cabinet; R06 adapter pattern | Adapter with quality threshold; **replace** turn list, never raw `eval(text)` (R11 / Terra) |
| MCP re-enable | Optional | Only under higher RAM / explicit need |

### Explicitly deferred (Pi-Lisptc-only)

- Prompt cache Layer 0/2 inside a Pi system prompt  
- Fireworks grammar / `tool-call` provider modes  
- Pi extension hooks, profiles `pi-default` / `lisp-mind`  
- Full Autolith RLM / SBCL patterns  
- INTERPRETER_SOURCE in system prompt as a correctness dependency for Grok  

---

## Critical path (MiS)

```text
P0 validate + save-on-success + bootstrap lisp.ts + smoke
  → P1 checkpoint + English UX + pin SHA
  → P2 helpers + optional GitHub push
  → P3 vector cabinet (if needed)
```

No multi-week Pi scaffolding. Core "safe living mind" is P0–P1.

---

## Invariants (must not regress)

1. **I-ERR-1:** `EvalException` → report, preserve definitions, do not reset.  
2. **I-SAVE-1:** Permanent image grows only from successful evals.  
3. **I-VAL-1:** Invalid / unparsed input never reaches `run()`.  
4. **I-HOST-1:** Grok is sole host; bridge only evaluates.  
5. **I-UX-1:** User-facing answers are plain language unless the user asks for Lisp.

---

## Next concrete step

Implement P0 in `bridge/eval.ts` + `scripts/bootstrap.sh`, then run:

```bash
bash scripts/bootstrap.sh
cd /tmp/mis
node --experimental-transform-types --no-warnings bridge/eval.ts '(list (mis-version) (mis-ping))'
# then define / save / new process / call  (persistence gate)
```
