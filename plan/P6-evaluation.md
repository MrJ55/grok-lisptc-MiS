# P6 — Evaluation & Hardening

**Status:** substantially met (2026-09-05) — smoke/continuity/OSS/post-reflection/goal-drift green; full Terra program not closed
**Depends on:** P0.1 complete (trust base); P2–P4 solid (helpers work)
**Priority:** **ELEVATED**

## Gate decision (2026-09-05)

**Substantially met — not fully closed.** Offline harness green; pure-DMN OSS verified; post-reflection error study PASS; goal-drift qualitative PASS; `(audit-self-schema-evidence)` implemented (lenient). Remaining: formal capability-denial suite, richer malicious fixtures. Soft-start P7 under dual-write is allowed; P8–P11 automation still gated on stronger close or explicit waiver.

## Checklist (summary)

### Done
- [x] Smoke + CI
- [x] Continuity suite
- [x] `audit-reality-status`, `audit-autobiography-grounding`, `audit-self-schema-evidence`
- [x] Post-reflection error study PASS
- [x] Goal-drift qualitative scenario PASS (`scripts/test-goal-drift.sh`, docs/goal-drift-scenario.md)
- [x] Baseline + interim targets

### Open / deferred
- [ ] Capability-denial formal suite (deferred — no capability loader surface)
- [ ] Malicious Lisp-injection fixture; stale-version manifest fixture
- [ ] P7/P10 hardening items (arc-diff review, wander limits, midnight note path)

## Relation to other phases
- P7 soft-start under dual-write allowed
- P8–P11 automation still gated on stronger P6 close or waiver
