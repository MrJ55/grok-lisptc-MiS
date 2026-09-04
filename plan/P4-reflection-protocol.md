# P4 — Reflection Protocol (Grok-driven DMN cycle)

**Status:** exit-complete (2026-09-04 — pack/apply live; two sandbox turns; docs synced)
**Revised:** 2026-09-04 (GLM+Terra synthesis)

## Goal
Make background-style consolidation an **explicit, repeatable, Grok-owned turn** that updates the self-schema from recent episodes without a long-running Node daemon. Optional pure-DMN OSS enrichment is allowed for phenomenological texture only.

## Objective
1. Define a standard reflection turn Grok can issue any time.
2. Implement `dmn-reflect-pack` and `dmn-apply-reflection`.
3. Package "fetch episodes + current schema → produce update".
4. Persist successful reflections with `--save` / `--checkpoint`.
5. Document ops for blank-session reflection.
6. Optional pure-DMN OSS enrichment; never system prompts to OSS.
7. OSS dual-write remains candidate until `(promote-candidate …)`.

## Checklist
- [x] **`(dmn-reflect-pack n)` implemented** in `mind/episodes.ptc`
- [x] **`(dmn-apply-reflection insights summary label)` implemented** in `mind/episodes.ptc`
- [x] Both registered in `*mis-known*`
- [x] `docs/mind-api.md` updated with actual signatures
- [x] `docs/reflection-protocol.md` updated with working examples + OSS optional step
- [x] `skills/mis-reflect/SKILL.md` updated — verification step works
- [x] `docs/session-handoff.md` cold-start step uses `(dmn-reflect-pack 5)`; active phase corrected
- [x] Run ≥2 full reflection turns in sandbox; schema + image growth confirmed
- [x] Reflection episode logged with `:reality-status inferred`
- [x] Document "OSS enrichment optional step" in `docs/reflection-protocol.md`
- [x] Dual-write path documented: OSS → candidate; `(promote-candidate)` host-mediated (no auto-mutate)
- [ ] Optional later: change `dmn-apply-reflection` itself to candidate-only (keep direct apply for host-approved insights)

## Exit criteria
- [x] From cold start, reflection works using plan + mind-api + reflection-protocol docs
- [x] `(dmn-reflect-pack 5)` returns `(list :schema … :episodes …)`
- [x] After `(dmn-apply-reflection …)` with `--save`, insights and `:last-reflection` change and survive restart
- [x] Failed reflection forms do not poison the image (P0)
- [x] OSS enrichment remains candidate until Grok promotes
- [x] Reflection episodes tagged `:reality-status inferred`

## Non-goals (this phase)
- SQLite / vector search (P5)
- Automatic idle timers inside Node
- Unconstrained self-modifying code beyond schema keys
- System prompts or TPN framing to OSS

## Historical note
Earlier checklists falsely claimed pack/apply existed before implementation. As of 2026-09-04 they are real in `mind/episodes.ptc`, exercised twice in sandbox, and documented.
