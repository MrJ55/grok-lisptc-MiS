# P8 — Replay & Scenes

**Status:** planned (after P6; revised 2026-09-04)

## Goal
Support tagged replay of episode clusters as “scenes” for reflection, narrative, and prospection.

## Objective
- Scene packs: named groups of episode refs + summary.
- Replay helper returns structured scene for host or OSS texture.
- Optional link to P5/Vestige graph later.

## Checklist
- [ ] Scene record schema (`:title`, `:episode-refs`, `:summary`, `:reality-status`)
- [ ] `dmn-scene-pack` / `dmn-replay` helpers
- [ ] Integration with reflection and narrative phases
- [ ] No auto-promotion of OSS scene text

## Exit criteria
Host can request a scene by tag and receive a stable, provenance-bearing pack without mutating the mind unless explicitly saved.
