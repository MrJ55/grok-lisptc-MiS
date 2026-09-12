# P8 — Structured Replay & Scene Construction

**Status:** **implemented 2026-09-12** (core forms + docs); revised 2026-09-04 plan retained
**Depends on:** P7 (or at least P3 buffer), **P6 (evaluation gate)**
**DMN subsystem:** Episodic / Hippocampal (DMN-inspired)

## Goal
Upgrade the flat episodic buffer into **tagged, replayable episodes** and extract **scene packs** suitable for simulation and narrative.

## P6 gate
Do not start P8 until P6 exit criteria pass. (P6 substantially met — residual parked.)

## Objective
- Tag episodes (valence, error?, goal-relevance, novelty, social?, **reality-status**).
- Importance- or tag-weighted replay, not only "last N".
- Extract lightweight scene structures: actors, setting, actions, outcome, affect.
- Feed scenes into P9 prospection and P7 narrative.
- **Replay uses frozen `as-of` checkpoint references** — outputs marked `:reality-status simulated`.
- **Vestige integration (P5):** `(mind-recall-sequence from to)` host-mediated temporal neighborhood; in-image buffer is working set only.

## Implementation method
- Runtime module: `mind/scenes.ptc` (imported from mind-image).
- Primitives: `(dmn-tag-episode …)` `(dmn-replay query-or-tag n)` `(dmn-scene-from episode)`
- Replay results are `:reality-status simulated` with `:as-of` and `:checkpoint-ref`.
- Docs: [docs/p8-scenes.md](../docs/p8-scenes.md)

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
- [x] Document episode record + tag vocabulary (including `:reality-status`)
- [x] Implement tag + replay + scene-from primitives
- [x] `(dmn-replay 'error 5)` works after cold load
- [x] `(dmn-scene-from …)` produces stable shape for P9
- [x] **Replay results tagged `:reality-status simulated`**
- [x] **Frozen `as-of` checkpoint references** for replay (Terra)
- [x] Update mind-api + docs (learnings optional)
- [x] **P5 dependency:** `(mind-recall-sequence ...)` host-mediated form present
- [x] One replay query returns non-trivial filtered set

## Exit criteria
- `(dmn-replay 'error 5)` and `(dmn-scene-from …)` work after cold load. **met**
- Scenes are data-only (never executed as actions). **met**
- Replay results are tagged `:reality-status simulated`. **met**
- `(audit-reality-status)` returns empty for all replayed scenes. **n/a to packs** (packs are not buffer rows)

## Non-goals
- Full temporal knowledge graph (Vestige handles this after P5)
- Local embedding search (P5 — Vestige)
- Auto-promotion of replayed content into observed history

## What this accomplishes for Grok-MiS (2026-09-12)

Episodes are no longer only a flat newest-first list. The host can **tag**, **filter-replay**, and **extract scenes** for P9 prospection and P7 narrative, with simulated reality-status and as-of freeze. Vestige sequence remains host-mediated. Scenes are never auto-executed.
