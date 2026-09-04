# P4 — Reflection Protocol

**Status:** done → **revised 2026-09-04** (GLM+Terra synthesis) — helpers live; candidate-first apply path

## Goal
Grok-driven consolidation: pack recent state, derive insights, apply updates deliberately.

## Objective
- `(dmn-reflect-pack n)` → schema + recent episodes.
- `(dmn-apply-reflection insights summary label)` updates schema and logs a reflection episode.
- Optional OSS texture as **candidate** only (never auto-applied).
- Protocol documented in `docs/reflection-protocol.md` and mis-reflect skill.

## Implementation method
- Host calls reflect-pack, reasons, then apply-reflection with explicit insights.
- After P0.1, prefer candidate proposals + `(promote-candidate …)` for higher-stakes updates.
- All reflection-sourced claims tagged with appropriate `:reality-status` (usually `:inferred`).

## Checklist
- [x] `dmn-reflect-pack` / `dmn-apply-reflection` implemented (2026-09-04 Tier-1)
- [x] Registered in `*mis-known*`
- [ ] Candidate-first path documented for P0.1
- [ ] Reflection episodes always include `:reality-status`
- [ ] Smoke test covers reflect-pack

## Exit criteria
Cold start can run `(dmn-reflect-pack 5)` without unbound errors; apply-reflection updates schema and buffer durably on `--save`.
