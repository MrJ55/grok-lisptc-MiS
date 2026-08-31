# P10 — Spontaneous Thought & Wander Loop

**Status:** planned  
**Depends on:** P7–P9 useful enough to sample from  
**DMN subsystem:** Spontaneous / Mind-wandering + Salience (host-side)

## Goal
Approximate DMN “default” activity: generate **candidate** thoughts when external demand is low, without a long-lived sandbox process.

## Objective
- `(dmn-wander budget)` samples autobiography, tensions, errors → candidates.
- Append-only truncated `*monologue*`.
- **Scheduled wander** = external or next-session **proposal file only** (never auto-save mutations).
- Salience (host): errors → reflect+counterfactual; goal done → chapter close; idle → wander.

## Implementation method
### Survival across sessions
Process RAM does **not** survive Grok session boundaries. Durable channels: `mind-image.ptc` (git), `mind/wander-proposals.ptc`, external cron/GitHub Action that only writes proposals. Next P00: review proposals; selective apply via P4/P7.

### Primitives
- `(dmn-wander n)` → candidates
- `(dmn-monologue-push thought)` / `(dmn-monologue n)`

## Checklist
- [ ] Spec proposal file format and path
- [ ] Implement wander + monologue helpers
- [ ] One manual wander turn produces actionable candidates
- [ ] Document “no auto-save from wander” invariant
- [ ] P00 mentions reviewing proposals
- [ ] Optional: GitHub Action stub for proposals only

## Exit criteria
Wander candidates reviewable in a later session without any process staying alive; P0 holds.

## Non-goals
- Always-on Node heartbeat in the Grok sandbox
- Unbounded monologue growth
