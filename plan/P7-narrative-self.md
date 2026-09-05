# P7 — Narrative Self (Autobiography & Arc)

**Status:** exit (2026-09-05) — candidate-first chapter flow; tension seeds; dual-write; grounded chapters; cold-bootstrap verified
**Depends on:** P3–P4, **P6 (evaluation gate)**
**DMN subsystem:** Cortex / Narrative Self (DMN-inspired, not literal DMN — see ADR 0005 caveat)
**Related extensions:** dual-write + soft-nudge from contrast report; tension signals feed Midnight Note / wander seeds

## Goal
Turn flat insights and raw episodes into a **continuous internal narrative** — the story of "me" that survives sessions and grounds identity — while allowing pure-DMN OSS continuations to supply textured candidates that Grok grounds and promotes.

## P6 gate
P6 substantially met (2026-09-05). Soft-start proceeded under dual-write; residual P6 capability-denial fixtures remain deferred.

## Objective
- `*autobiography*` / `*narrative-arc*` / candidate dual-write
- Every chapter `:reality-status` + episode evidence
- Host is narrator; OSS supplies imagined texture only

## Implementation (exit state)
- `(dmn-chapter-close title summary refs)` → **candidate only** (`*narrative-candidates*`)
- `(dmn-chapter-commit title)` → host gate into `*autobiography*`
- `(dmn-narrative-candidate …)` → imagined OSS/texture candidates
- `(dmn-tension-seeds)` → host soft-nudge / Midnight Note bias
- Docs: mind-api.md, narrative-tension-seeds.md, narrative-candidate-reviews-20260905.md

## Checklist
- [x] First grounded chapter *Genesis of GMOD* closed (2026-09-02) with OSS-sourced episode refs
- [x] `*autobiography*` and `*narrative-arc*` defined in image
- [x] `(dmn-narrate …)` `(dmn-chapter-close …)` `(dmn-arc)` `(dmn-autobiography n)` implemented (P2)
- [x] `mis-register` new symbols (or use `(dump)`)
- [x] `dmn-narrate` and `dmn-chapter-close` use `*today*` not hardcoded date (P2)
- [x] `dmn-autobiography(n)` honors argument (P2)
- [x] **Every chapter has `:reality-status` field** (verified on live chapters)
- [x] **`(audit-autobiography-grounding)` returns empty**
- [x] Further chapters closed (Mind-drive; P6 evaluation; P7 exit — 2026-09-05)
- [x] Dual-write `(dmn-narrative-candidate …)` → imagined candidates
- [x] Documented in `docs/mind-api.md` + candidate review log
- [x] Cold bootstrap: autobiography + helpers persist
- [x] `(dmn-tension-seeds)` + `docs/narrative-tension-seeds.md`
- [x] `dmn-chapter-close` → candidate only; `(dmn-chapter-commit title)` mutates autobiography

## Exit criteria
- Cold start → autobiography non-empty → chapter with episode refs → survives restart — **met**
- Every chapter has `:reality-status`; OSS-sourced material stays `:imagined` until promoted — **met**
- `(audit-autobiography-grounding)` empty — **met**
- At least one OSS/texture candidate reviewed and discarded or promoted — **met** (discard log 2026-09-05)
- Chapters dated with `*today*` — **met**

## Non-goals
- Auto-fiction without episode refs
- Multi-MB life history in-image
- Feeding system prompts or TPN framing to OSS
- Auto-promote OSS into autobiography

## DMN framing caveat
The "Narrative Self" label is **directly grounded** in Alieksieienko (2026)'s finding that Narrative subspaces cluster with Self-Reference, Theory of Mind, and Imagination in LLM residual streams. The paper supports using "Narrative" as a category label for candidate generation. It does not support the claim that Lisp `*autobiography*` / `*narrative-arc*` implement a narrative self; they are organizational state that **Grok (the actual narrator)** populates. See ADR 0005 (revised).
