# P6 — Evaluation & Hardening

**Status:** planned  
**Depends on:** P4; stronger after P7–P9

## Goal
Prove the DMN loop improves agent behavior, not just self-description.

## Objective
- Multi-turn scenarios that induce repeated mistakes.
- Metrics: repeated-error rate, schema stability, image growth, chapter grounding (refs present).
- Hardening: wander rate limits, review for large arc diffs, proposal-only scheduled path.

## Checklist
- [ ] Define 2–3 multi-turn scenarios
- [ ] Measure recovery after reflection (+ optional narrative close)
- [ ] Check autobiography chapters cite episode refs
- [ ] Document quantitative exit criteria in plan/README

## Exit criteria
At least one scenario shows fewer repeated failures after a full cycle; no P0 regressions.
