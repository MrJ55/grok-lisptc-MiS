# P8 — Structured Replay & Scene Construction

**Status:** planned  
**Depends on:** P7 (or at least P3 buffer)  
**DMN subsystem:** Episodic / Hippocampal

## Goal
Upgrade the flat episodic buffer into **tagged, replayable episodes** and extract **scene packs** suitable for simulation and narrative.

## Objective
- Tag episodes (valence, error?, goal-relevance, novelty, social?).
- Importance- or tag-weighted replay, not only “last N”.
- Extract lightweight scene structures: actors, setting, actions, outcome, affect.
- Feed scenes into P9 prospection and P7 narrative.

## Implementation method
- Extend episode record via meta tags or parallel tag map.
- Prefer fixed-arity helpers; pass `nil` for unused fields.
- Primitives: `(dmn-tag-episode …)` `(dmn-replay query-or-tag n)` `(dmn-scene-from episode)`
- After errors, bias replay toward `:error` tags before reflection.

## Checklist
- [ ] Document episode record + tag vocabulary
- [ ] Implement tag + replay + scene-from primitives
- [ ] Seed tags on existing smoke/error-sim episodes
- [ ] One replay query returns non-trivial filtered set
- [ ] Scene extraction produces stable shape for P9
- [ ] Update mind-api + learnings-log

## Exit criteria
`(dmn-replay 'error 5)` and `(dmn-scene-from …)` work after cold load; scenes are data-only.

## Non-goals
- Full temporal knowledge graph
- Local embedding search (P5)
