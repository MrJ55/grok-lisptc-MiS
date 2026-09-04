# P3 — Self-Schema & Episodic Buffer

**Status:** done → **revised 2026-09-04** (trim restored; reality-status seeded)

## Goal
Maintain a durable self-model (`*self-schema*`) and a bounded episodic buffer that reflection can consume.

## Objective
- `*self-schema*` alist with core-values, goals, insights, summaries.
- `update-self-schema` merges without reversing entry order incorrectly.
- `*episodic-buffer*` + `*episodic-max*` with trim on log.
- Episodes carry optional `:reality-status` (required after P0.1).
- Helpers: `mis-schema`, `mis-insights`, `dmn-log-episode`, `dmn-fetch-unreflected`.

## Checklist
- [x] `*self-schema*` live in mind-image
- [x] `update-self-schema` order fixed (2026-09-04)
- [x] Episodic trim restored in `dmn-log-episode`
- [x] `:reality-status` seeded on existing episodes
- [ ] Strict required reality-status validation (P0.1)
- [ ] Optional rename `dmn-fetch-unreflected` → `dmn-fetch-recent` or real filter

## Exit criteria
Schema and buffer survive cold start; buffer never grows unbounded; reflection can pack recent episodes.
