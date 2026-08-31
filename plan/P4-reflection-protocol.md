# P4 — Reflection Protocol (Grok-driven DMN cycle)

**Status:** active / implement now  
**Depends on:** P0–P3 complete

## Goal
Make background-style consolidation an **explicit, repeatable, Grok-owned turn** that updates the self-schema from recent episodes without a long-running Node daemon.

## Objective
1. Define a standard reflection turn Grok can issue any time (especially after idle or after errors).
2. Provide helper forms that package “fetch episodes + current schema → produce update”.
3. Persist successful reflections with `--save` (optional `--checkpoint`).
4. Document ops so a blank session can run a reflection without inventing protocol.

## Why not a Node heartbeat?
Sandbox tool-call processes are ephemeral. A Grok-driven turn is reliable, inspectable, and matches ADR 0001 (Grok is host).

## Implementation method

### A. Protocol (host side)
```
1. (optional) checkpoint: eval with --checkpoint before mutation
2. Gather: (list (mis-schema) (dmn-fetch-unreflected 10))
3. Reason in natural language (Grok): failures, patterns, goal drift
4. Emit ONE form:
     (progn
       (update-self-schema '((:working-insights . (...))
                             (:episodic-summary . "...")
                             (:last-reflection . "ISO-or-label")))
       (mis-state-summary))
5. Eval with --save
6. Optionally push image to GitHub
```

### B. Lisp helpers (mind side)
Add thin wrappers (keep single-line docs):

- `(dmn-reflect-pack n)` → `(list :schema <schema> :episodes <last-n>)` for host consumption  
- `(dmn-apply-reflection insights summary label)` → builds the update-self-schema call internally  

Prefer pure data out; Grok still decides the *content* of insights.

### C. Ops artifacts
- `docs/reflection-protocol.md` — copy-pasteable for Grok
- Optional skill `skills/mis-reflect/SKILL.md`
- Log each reflection as an episode with meta `"reflection"`

## Checklist
- [ ] Add `(dmn-reflect-pack n)` to image
- [ ] Add `(dmn-apply-reflection insights summary label)` (insights = list of symbols or short strings)
- [ ] Write `docs/reflection-protocol.md`
- [ ] Run ≥2 full reflection turns in sandbox; confirm schema + image growth
- [ ] Register new symbols via `mis-register`
- [ ] Update `docs/mind-api.md` and `plan/README.md` status → P4 done or in progress
- [ ] Optional: `skills/mis-reflect/SKILL.md`
- [ ] Optional: auto-push note after reflection

## Task breakdown (execute in order)
1. Bootstrap current image.
2. Define and `--save` the two helpers.
3. Execute reflection turn #1 (synthesize from existing episodes/smoke data).
4. Execute reflection turn #2 after logging a deliberate “error-like” episode.
5. Write docs/reflection-protocol.md.
6. Push mind-image + docs + plan status.

## Exit criteria
- From cold start, Grok can run a reflection using only plan + mind-api + reflection-protocol docs.
- After reflection, `(mis-insights)` and `:last-reflection` change and survive process restart.
- Failed reflection forms still do not poison the image (P0 holds).

## Non-goals (this phase)
- SQLite / vector search (P5)
- Automatic idle timers inside Node
- Unconstrained self-modifying code beyond schema keys
