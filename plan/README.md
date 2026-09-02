# Plan — grok-lisptc-MiS (grok-mis-oss-dmn)

**Last updated:** 2026-09-02  
**Blank session:** start [P00-cold-start.md](./P00-cold-start.md) → this table → active phase file.  
**Creative mechanisms:** [CREATIVE-MECHANISMS.md](./CREATIVE-MECHANISMS.md)  
**OSS-DMN channel:** [P11-oss-dmn-channel.md](./P11-oss-dmn-channel.md)  
**Sources of ideas:** [docs/related-work.md](../docs/related-work.md)  
**Extensions contrast (original → OSS shape → value):** [docs/gmod-extensions-contrast-20260902.md](../docs/gmod-extensions-contrast-20260902.md)

## Core invariant (grok-mis-oss-dmn)

Grok is the sole host that may mutate the durable symbolic mind.  
**OSS 20B** (`openai/gpt-oss-20b`) is used **only** as a pure DMN generator:
- Zero system prompt
- Bare prefixes or soft-nudge seeds drawn from MiS state
- Temperature ≈ 1.15 / presence_penalty ≈ 0.7
- All OSS output = candidate material only
- Grok decides what (if anything) is promoted into Lisp forms
- No auto-save of OSS text; dual-write + proposal files are the only hand-off channels

See `docs/DMN-gpt-oss-20b-probe.md` for the behavioural probe and parameter lock.  
Provenance of ideas: `docs/related-work.md`.

## Status table

| ID | File | Status | One-line |
|----|------|--------|----------|
| P00 | [P00-cold-start.md](./P00-cold-start.md) | permanent ref | Restore mind + review OSS proposals |
| P0 | [P0-safety.md](./P0-safety.md) | done | Validate, save-on-success, no brick |
| P1 | [P1-ux-pins.md](./P1-ux-pins.md) | done | English-first, upstream pins |
| P2 | [P2-helpers-scratch-push.md](./P2-helpers-scratch-push.md) | done | Mind API, scratch, push |
| P3 | [P3-self-schema.md](./P3-self-schema.md) | mostly done | Self-schema + episodic buffer |
| P4 | [P4-reflection-protocol.md](./P4-reflection-protocol.md) | done | Grok-driven consolidation (+ optional OSS texture) |
| **P7** | [P7-narrative-self.md](./P7-narrative-self.md) | **next** | Autobiography + arc + OSS dual-write |
| P8 | [P8-replay-scenes.md](./P8-replay-scenes.md) | planned | Tagged replay + scene packs |
| P9 | [P9-prospection.md](./P9-prospection.md) | planned | Future / counterfactual / light ToM (OSS-assisted) |
| P10 | [P10-spontaneous-wander.md](./P10-spontaneous-wander.md) | planned | Wander + monologue + OSS proposal files + sleep-stage Action |
| **P11** | [P11-oss-dmn-channel.md](./P11-oss-dmn-channel.md) | **new / parallel** | Soft-nudge library, parameter lock, dual-channel, salience, Chorus, Pulse Meter |
| P5 | [P5-vector-cabinet.md](./P5-vector-cabinet.md) | optional | Managed vector search scale-out |
| P6 | [P6-evaluation.md](./P6-evaluation.md) | planned | Metrics & hardening |

## DMN map (five subsystems + OSS channel → phases)

| Subsystem | Phases | Role |
|-----------|--------|------|
| Narrative Self | P7 | Autobiography, arc, continuous “me” story |
| Episodic / hippocampal | P3, P8 | Buffer, tags, replay, scenes |
| Prospective / imagination | P9 | Future, counterfactual, light ToM (constructive simulation) |
| Spontaneous / wander | P10 | Candidates when TPN is quiet; no live daemon; sleep-stage proposals |
| Consolidation / reflection | P4 | Schema update from episodes |
| **OSS-DMN channel** | **P11** | Pure DMN generator (geometry-preserving) for proposals & texture |
| Salience switch | host + P10/P11 | When to reflect / narrate / wander / call OSS (VOC-style / Observer) |
| Vector cabinet | P5 | Optional searchable long-term store |

## Novel extensions integrated (from contrast report)

| # | Extension (OSS shape) | Primary phase(s) | Pointer |
|---|-----------------------|------------------|--------|
| 1 | Multi-model ensemble (**Chorus of Many Voices**) | P11 | [§1](../docs/gmod-extensions-contrast-20260902.md#1-multi-model-pure-dmn-ensemble) |
| 2 | Sleep-stage scheduler (**Midnight Note** + ink/pencil filter) | P10, P11, CREATIVE | [§2](../docs/gmod-extensions-contrast-20260902.md#2-sleep-stage-scheduler-github-action--quiet-hours) |
| 3 | Research instrument (**Pulse Meter**) | P11 | [§3](../docs/gmod-extensions-contrast-20260902.md#3-gmod-as-a-research-instrument) |
| 4 | Counterfactual curriculum / offline RL (**Third-voice bridge**) | P9, P4 | [§4](../docs/gmod-extensions-contrast-20260902.md#4-counterfactual-curriculum-as-offline-rl) |
| 5 | Cross-agent proposal exchange (**Page Passer**) | P10, P11 | [§5](../docs/gmod-extensions-contrast-20260902.md#5-cross-agent-proposal-exchange) |
| 6 | Salience-VOC dashboard (**The Observer**) | host + P11, CREATIVE | [§6](../docs/gmod-extensions-contrast-20260902.md#6-salience-voc-dashboard) |

Full contrast (original idea → prompt path → OSS response → practical value): [docs/gmod-extensions-contrast-20260902.md](../docs/gmod-extensions-contrast-20260902.md).

## Architecture (stable)

- **Host:** Grok (emits Lisp, owns permanence, mediates all OSS calls, owns salience switch).
- **Mind:** transcript image `mind/mind-image.ptc`.
- **Bridge:** validate → eval → save only on success.
- **Runtime:** `/tmp/mis` via `scripts/bootstrap.sh` (auto Reader fix).
- **Session survival:** git image + optional proposal files + external APIs — not process RAM.
- **OSS role:** pure DMN residual-stream geometry provider; never receives system/TPN framing.

## Current focus

**P7 — Narrative Self** (primary) in parallel with **P11 — OSS-DMN Channel**.  
Implement autobiography + arc primitives and close further grounded chapters; simultaneously deepen the pure-DMN protocol with Chorus multi-model dual-write, Pulse Meter scoring, Observer logging, and the Midnight Note sleep-stage proposal Action.

## Resource policy

Prefer symbolic in-image state; offload heavy search to managed APIs; never full local RAG stack in sandbox. See P5 and P10/P11 notes.

## Critical historical fix

Reader `tryToParse`: `n !== undefined && n !== null` (bootstrap auto-applies). [src/READER-FIX.md](../src/READER-FIX.md).
