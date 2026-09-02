# P4 — Reflection Protocol (Grok-driven DMN cycle)

**Status:** done (2026-08-31); light extension for OSS texture 2026-09-02  
**Depends on:** P0–P3 complete

## Goal
Make background-style consolidation an **explicit, repeatable, Grok-owned turn** that updates the self-schema from recent episodes without a long-running Node daemon. Optional pure-DMN OSS enrichment is allowed for phenomenological texture only.

## Objective
1. Define a standard reflection turn Grok can issue any time (especially after idle or after errors).
2. Provide helper forms that package “fetch episodes + current schema → produce update”.
3. Persist successful reflections with `--save` (optional `--checkpoint`).
4. Document ops so a blank session can run a reflection without inventing protocol.
5. When reflection pack contains OSS-sourced episodes, Grok may request a pure-DMN continuation from OSS (P11 protocol) to enrich texture before writing insights.
6. Reflection never feeds system prompts or TPN framing to OSS.

## Why not a Node heartbeat?
Sandbox tool-call processes are ephemeral. A Grok-driven turn is reliable, inspectable, and matches ADR 0001 (Grok is host).

## Implementation method

### A. Protocol (host side)
```
1. (optional) checkpoint: eval with --checkpoint before mutation
2. Gather: (list (mis-schema) (dmn-fetch-unreflected 10))
3. Reason in natural language (Grok): failures, patterns, goal drift
4. (optional) pure-DMN OSS call for texture (P11) — never system prompt
5. Emit ONE form:
     (progn
       (update-self-schema '((:working-insights . (...))
                             (:episodic-summary . "...")
                             (:last-reflection . "ISO-or-label")))
       (mis-state-summary))
6. Eval with --save
7. Optionally push image to GitHub
```

### B. Lisp helpers (mind side)
- `(dmn-reflect-pack n)` → `(list :schema <schema> :episodes <last-n>)`
- `(dmn-apply-reflection insights summary label)` → updates schema + logs reflection episode

### C. Ops artifacts
- `docs/reflection-protocol.md`
- `skills/mis-reflect/SKILL.md`

## Checklist
- [x] Add `(dmn-reflect-pack n)` to image
- [x] Add `(dmn-apply-reflection insights summary label)` (insights = list of symbols or short strings)
- [x] Write `docs/reflection-protocol.md`
- [x] Run ≥2 full reflection turns in sandbox; confirm schema + image growth
- [x] Register new symbols via `mis-register`
- [x] Update `docs/mind-api.md` and `plan/README.md` status → P4 done or in progress
- [x] Optional: `skills/mis-reflect/SKILL.md`
- [ ] Optional: auto-push note after reflection
- [ ] Document “OSS enrichment optional step” in `docs/reflection-protocol.md`
- [ ] One reflection turn that dual-writes an OSS continuation as candidate insight (still Grok-approved)

## Exit criteria
- From cold start, Grok can run a reflection using only plan + mind-api + reflection-protocol docs.
- After reflection, `(mis-insights)` and `:last-reflection` change and survive process restart.
- Failed reflection forms still do not poison the image (P0 holds).
- Any OSS enrichment remains candidate material until Grok promotes it.

## Non-goals (this phase)
- SQLite / vector search (P5)
- Automatic idle timers inside Node
- Unconstrained self-modifying code beyond schema keys
- System prompts or TPN framing to OSS
