# P8 — Structured Replay & Scene Construction

**Status:** planned → **revised 2026-09-04** (GLM+Terra synthesis) — gated on P6; requires reality-status; Vestige integration
**Depends on:** P7 (or at least P3 buffer), **P6 (evaluation gate)**
**DMN subsystem:** Episodic / Hippocampal (DMN-inspired)

## Goal
Upgrade the flat episodic buffer into **tagged, replayable episodes** and extract **scene packs** suitable for simulation and narrative.

## P6 gate
Do not start P8 until P6 exit criteria pass.

## Objective
- Tag episodes (valence, error?, goal-relevance, novelty, social?, **reality-status**).
- Importance- or tag-weighted replay, not only "last N".
- Extract lightweight scene structures: actors, setting, actions, outcome, affect.
- Feed scenes into P9 prospection and P7 narrative.
- **Replay uses frozen `as-of` checkpoint references** (Terra recommendation) — outputs marked `:reality-status simulated` unless explicitly reconstructing recorded history.
- **Vestige integration (P5):** `(mind-recall-sequence from to)` uses Vestige's temporal graph for long-range replay; in-image buffer is working set only.

## Implementation method
- Extend episode record via meta tags or parallel tag map.
- Prefer fixed-arity helpers; pass `nil` for unused fields.
- Primitives: `(dmn-tag-episode …)` `(dmn-replay query-or-tag n)` `(dmn-scene-from episode)`
- After errors, bias replay toward `:error` tags before reflection.
- **Replay results are `:reality-status simulated`** — they are reconstructions, not observations. The original episodes retain their original reality-status.
- **Vestige-backed replay (P5):** `(mind-recall-sequence :from event-a :to event-b)` retrieves the temporal neighborhood from Vestige; in-image buffer holds only compact references.

### Episode tag vocabulary (extended)

| Tag | Values | Purpose |
|---|---|---|
| `:valence` | positive, negative, neutral | Affective tagging |
| `:error?` | t, nil | Error episode flag |
| `:goal-relevance` | high, medium, low, nil | Goal-relatedness |
| `:novelty` | high, medium, low | Novelty score |
| `:social?` | t, nil | Social interaction flag |
| `:reality-status` | observed, reported, inferred, hypothesized, imagined, planned, simulated, retracted | **Required** (P0.1) |
| `:source` | grok, oss-dmn, user, vestige | Provenance |
| `:vestige-id` | UUID | Vestige memory ID (after P5) |

## Checklist
- [ ] Document episode record + tag vocabulary (including `:reality-status`)
- [ ] Implement tag + replay + scene-from primitives
- [ ] `(dmn-replay 'error 5)` works after cold load
- [ ] `(dmn-scene-from …)` produces stable shape for P9
- [ ] **Replay results tagged `:reality-status simulated`**
- [ ] **Frozen `as-of` checkpoint references** for replay (Terra)
- [ ] Update mind-api + learnings-log
- [ ] **P5 dependency:** `(mind-recall-sequence ...)` backed by Vestige (if P5 done)
- [ ] One replay query returns non-trivial filtered set

## Exit criteria
- `(dmn-replay 'error 5)` and `(dmn-scene-from …)` work after cold load.
- Scenes are data-only (never executed as actions).
- Replay results are tagged `:reality-status simulated`.
- `(audit-reality-status)` returns empty for all replayed scenes.

## Non-goals
- Full temporal knowledge graph (Vestige handles this after P5)
- Local embedding search (P5 — Vestige)
- Auto-promotion of replayed content into observed history
