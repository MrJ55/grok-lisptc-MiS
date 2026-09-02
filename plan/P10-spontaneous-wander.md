# P10 — Spontaneous Thought & Wander Loop

**Status:** planned  
**Depends on:** P7–P9 useful enough to sample from; P11 OSS channel  
**DMN subsystem:** Spontaneous / Mind-wandering + Salience (host-side)

## Goal
Approximate DMN “default” activity: generate **candidate** thoughts when external demand is low, without a long-lived sandbox process. Primary generator for free-form candidates is OSS 20B under the P11 pure-DMN protocol.

## Objective
- `(dmn-wander budget)` samples autobiography, tensions, errors → candidates.
- Append-only truncated `*monologue*`.
- **Scheduled wander = external or next-session proposal file only** (never auto-save mutations).
- Primary generator for wander candidates is OSS 20B (P11 parameter lock, zero system prompt).
- Salience (host): errors → reflect + optional OSS counterfactual; goal done → chapter close; idle → OSS wander call → proposal file.

## Implementation method
### Survival across sessions
Process RAM does **not** survive Grok session boundaries. Durable channels: `mind-image.ptc` (git), `mind/oss-proposals-YYYYMMDD.ptc` / `mind/wander-proposals.ptc`, external cron/GitHub Action that only writes proposals. Next P00: review proposals; selective apply via P4/P7.

### Primitives
- `(dmn-wander n)` → candidates
- `(dmn-monologue-push thought)` / `(dmn-monologue n)`

## Checklist
- [ ] Spec proposal file format and path (`mind/oss-proposals-YYYYMMDD.ptc` or `mind/wander-proposals.ptc`)
- [ ] Implement wander + monologue helpers
- [ ] One manual wander turn that calls OSS (blank prefix + soft seed from arc) and writes a proposal file
- [ ] Document “no auto-save from wander / OSS” invariant
- [ ] P00 mentions reviewing proposals
- [ ] Optional: GitHub Action stub for proposals only

## Exit criteria
Wander candidates (including OSS-sourced) are reviewable in a later session without any process staying alive; P0 holds.

## Non-goals
- Always-on Node heartbeat in the Grok sandbox
- Unbounded monologue growth
- System prompts or TPN framing to OSS
