# Plan — grok-lisptc-MiS (DMN-enhanced)

**Last updated:** 2026-08-31  
**Blank session:** start [P00-cold-start.md](./P00-cold-start.md) → this table → active phase file.  
**Creative mechanisms:** [CREATIVE-MECHANISMS.md](./CREATIVE-MECHANISMS.md)

## Status table

| ID | File | Status | One-line |
|----|------|--------|----------|
| P00 | [P00-cold-start.md](./P00-cold-start.md) | reference | Restore mind + orientation |
| P0 | [P0-safety.md](./P0-safety.md) | done | Validate, save-on-success, no brick |
| P1 | [P1-ux-pins.md](./P1-ux-pins.md) | done | English-first, upstream pins |
| P2 | [P2-helpers-scratch-push.md](./P2-helpers-scratch-push.md) | done | Mind API, scratch, push |
| P3 | [P3-self-schema.md](./P3-self-schema.md) | mostly done | Self-schema + episodic buffer |
| P4 | [P4-reflection-protocol.md](./P4-reflection-protocol.md) | done | Grok-driven reflection turns |
| **P7** | [P7-narrative-self.md](./P7-narrative-self.md) | **next** | Autobiography + narrative arc |
| P8 | [P8-replay-scenes.md](./P8-replay-scenes.md) | planned | Tagged replay + scene packs |
| P9 | [P9-prospection.md](./P9-prospection.md) | planned | Future / counterfactual / light ToM |
| P10 | [P10-spontaneous-wander.md](./P10-spontaneous-wander.md) | planned | Wander + monologue + proposals |
| P5 | [P5-vector-cabinet.md](./P5-vector-cabinet.md) | optional | Managed vector search scale-out |
| P6 | [P6-evaluation.md](./P6-evaluation.md) | planned | Metrics & hardening |

## DMN map (five subsystems → phases)

| Subsystem | Phases | Role |
|-----------|--------|------|
| Narrative Self | P7 | Autobiography, arc, continuous “me” story |
| Episodic / hippocampal | P3, P8 | Buffer, tags, replay, scenes |
| Prospective / imagination | P9 | Future, counterfactual, light ToM (constructive simulation) |
| Spontaneous / wander | P10 | Candidates when TPN is quiet; no live daemon |
| Consolidation / reflection | P4 | Schema update from episodes |
| Salience switch | host + P10 | When to reflect / narrate / wander |
| Vector cabinet | P5 | Optional searchable long-term store |

## Architecture (stable)

- **Host:** Grok (emits Lisp, owns permanence).
- **Mind:** transcript image `mind/mind-image.ptc`.
- **Bridge:** validate → eval → save only on success.
- **Runtime:** `/tmp/mis` via `scripts/bootstrap.sh` (auto Reader fix).
- **Session survival:** git image + optional proposal files + external APIs — not process RAM.

## Current focus

**P7 — Narrative Self.** Implement autobiography + arc primitives and close at least one grounded chapter from existing episodes.

## Resource policy

Prefer symbolic in-image state; offload heavy search to managed APIs; never full local RAG stack in sandbox. See P5 and P10 notes.

## Critical historical fix

Reader `tryToParse`: `n !== undefined && n !== null` (bootstrap auto-applies). [src/READER-FIX.md](../src/READER-FIX.md).
