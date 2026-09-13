# P10 — In-session wander (no Midnight Note, no Page Passer)

**Status:** implemented 2026-09-13  
**Runtime:** `mind/wander.ptc`  
**Plan:** [plan/P10-spontaneous-wander.md](../plan/P10-spontaneous-wander.md)

## Craft gate

Live OSS only via `(dmn-wander-oss)` / `(dmn-oss-seed-commit)`. See [oss-craft-gate.md](./oss-craft-gate.md).

## Forms

| Form | Role |
|------|------|
| `(dmn-wander n)` | Imagined candidate shells |
| `(dmn-wander-oss)` | Canonical suggest-seed + check/commit |
| `(dmn-wander-record …)` | Store candidates; OSS without craft accrues debt |
| `(dmn-monologue n)` | Imagined monologue |
| `(dmn-salience-hint)` | Host routing |

## Invariants

- `:reality-status imagined`, `:trust-class candidate`
- No auto-save identity; never eval OSS as Lisp
- Proposal files: `mind/wander-proposals-YYYYMMDD.ptc` (do not import)
