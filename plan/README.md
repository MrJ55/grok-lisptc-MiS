# Plan — grok-lisptc-MiS

**Last updated:** 2026-08-31  
**How to use this folder in a blank session:** start with [P00-cold-start.md](./P00-cold-start.md), then this table, then the active phase file.

| ID | File | Status | One-line |
|----|------|--------|----------|
| P00 | [P00-cold-start.md](./P00-cold-start.md) | reference | Restore mind + orientation |
| P0 | [P0-safety.md](./P0-safety.md) | done | Validate, save-on-success, no brick |
| P1 | [P1-ux-pins.md](./P1-ux-pins.md) | done | English-first, upstream pins |
| P2 | [P2-helpers-scratch-push.md](./P2-helpers-scratch-push.md) | done | Mind API, scratch, push |
| P3 | [P3-self-schema.md](./P3-self-schema.md) | mostly done | Self-schema + episodic buffer |
| P4 | [P4-reflection-protocol.md](./P4-reflection-protocol.md) | done | Grok-driven reflection turns |
| P5 | [P5-vector-cabinet.md](./P5-vector-cabinet.md) | optional | External vestige store |
| P6 | [P6-evaluation.md](./P6-evaluation.md) | planned | Metrics & hardening |

## Current focus
**P4 done.** Next optional: P5 vector cabinet or P6 evaluation metrics.

## Architecture (stable)
- **Host:** Grok (emits Lisp, owns permanence).
- **Mind:** transcript image `mind/mind-image.ptc` loaded every process.
- **Bridge:** `bridge/eval.ts` — validate → eval → save only on success.
- **Runtime:** `/tmp/mis` via `scripts/bootstrap.sh` (auto Reader fix).

## Mind API
See [docs/mind-api.md](../docs/mind-api.md). P4 added `dmn-reflect-pack` and `dmn-apply-reflection`.

## Critical historical fix
Reader `tryToParse`: use `n !== undefined && n !== null` (bootstrap applies automatically). Details: [src/READER-FIX.md](../src/READER-FIX.md).
