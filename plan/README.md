# Plan — grok-lisptc-MiS (grok-mis-oss-dmn)

**Last updated:** 2026-09-04 (P0 exit-complete; next P6 Evaluation)  
**Blank session:** start [P00-cold-start.md](./P00-cold-start.md) → this table → active phase file.  
**Creative mechanisms:** [CREATIVE-MECHANISMS.md](./CREATIVE-MECHANISMS.md)  
**OSS-DMN channel:** [P11-oss-dmn-channel.md](./P11-oss-dmn-channel.md)  
**Sources of ideas:** [docs/related-work.md](../docs/related-work.md)  
**Audit synthesis:** [review-by-all/](../review-by-all/)  
**Revised contracts:** [revised-plan-GLM/](../revised-plan-GLM/)

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

## Status table

| ID | File | Status | One-line |
|----|------|--------|----------|
| P00 | [P00-cold-start.md](./P00-cold-start.md) | verified 2026-09-04 | Restore mind + verify + review OSS proposals |
| **P0** | [P0-safety.md](./P0-safety.md) | **exit-complete** | Validate, atomic save-on-success, form-by-form, LKG, no brick |
| P0.1 | [P0.1-state-governance.md](./P0.1-state-governance.md) | exit substantially met | Trust, reality-status, upstream lock, transactional persistence, CI |
| P1 | [P1-ux-pins.md](./P1-ux-pins.md) | done | English-first, upstream pins |
| P2 | [P2-helpers-scratch-push.md](./P2-helpers-scratch-push.md) | done | Mind API, scratch, push |
| P3 | [P3-self-schema.md](./P3-self-schema.md) | done | Self-schema + episodic buffer (trim restored) |
| P4 | [P4-reflection-protocol.md](./P4-reflection-protocol.md) | done | `dmn-reflect-pack` / `dmn-apply-reflection` live |
| **P6** | [P6-evaluation.md](./P6-evaluation.md) | **active next** | Metrics, smoke CI, continuity tests |
| P7 | [P7-narrative-self.md](./P7-narrative-self.md) | planned (after P6) | Autobiography + arc + OSS dual-write |
| P8 | [P8-replay-scenes.md](./P8-replay-scenes.md) | planned | Tagged replay + scene packs |
| P9 | [P9-prospection.md](./P9-prospection.md) | planned | Future / counterfactual / light ToM |
| P10 | [P10-spontaneous-wander.md](./P10-spontaneous-wander.md) | planned | Wander + monologue + proposal files |
| P11 | [P11-oss-dmn-channel.md](./P11-oss-dmn-channel.md) | design / parallel | Soft-nudge, dual-channel, Chorus, Pulse Meter |
| P5 | [P5-vector-cabinet.md](./P5-vector-cabinet.md) | optional later | Managed vector / Vestige adapter |

## Current focus

1. **P00** + **P0** closed (2026-09-04).
2. **P0.1** exit substantially met.
3. **P6 — Evaluation** is the active next phase before P7–P11 expansion.

## Novel extensions (design targets, not yet implemented)

| # | Extension | Primary phase(s) | Status |
|---|-----------|------------------|--------|
| 1 | Chorus of Many Voices | P11 | design |
| 2 | Midnight Note (sleep-stage) | P10, P11 | design |
| 3 | Pulse Meter | P11 | design |
| 4 | Third-voice bridge | P9, P4 | design |
| 5 | Page Passer | P10, P11 | design |
| 6 | The Observer (salience log) | host + P11 | design |

Full contrast: [docs/gmod-extensions-contrast-20260902.md](../docs/gmod-extensions-contrast-20260902.md).

## Architecture (stable)

- **Host:** Grok (emits Lisp, owns permanence, mediates all OSS calls, owns salience switch).
- **Mind:** transcript image `mind/mind-image.ptc` (v0.4).
- **Bridge:** validate → form-by-form load → eval → atomic save only on success; injects `*today*` / `*now*`; LKG + mutations + state/manifest.
- **Runtime:** `/tmp/mis` via `scripts/bootstrap.sh` (pinned upstream; hash-checked).
- **Pin:** `UPSTREAM.lock.json` + `scripts/verify-upstream.sh` + CI.
- **OSS role:** pure DMN candidate-texture generator; never receives system/TPN framing.

## Resource policy

Prefer symbolic in-image state; offload heavy search to managed APIs; never full local RAG stack in sandbox.
