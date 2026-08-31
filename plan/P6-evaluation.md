# P6 — Evaluation & Hardening

**Status:** planned  
**Depends on:** P4 (and ideally some real multi-turn use)

## Goal
Prove the DMN loop improves agent behavior, not just self-description.

## Objective
- Fixed task sequences that induce repeated mistakes.
- Metrics: repeated-error rate before/after reflection, schema stability, image growth rate.
- Hardening: rate limits on reflection, human/Grok review hooks for large schema diffs.

## Implementation method
- Scripted eval scenarios under `docs/` or `scripts/`.
- Record baseline vs post-reflection outcomes in learnings-log or a small metrics file.

## Checklist
- [ ] Define 2–3 multi-turn scenarios
- [ ] Measure recovery after reflection
- [ ] Document quantitative exit criteria in plan/README

## Exit criteria
At least one scenario shows fewer repeated failures after a reflection cycle; no safety regressions vs P0.
