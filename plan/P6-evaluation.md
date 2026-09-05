# P6 — Evaluation & Hardening

**Status:** substantially met (2026-09-05) — smoke/continuity/malicious/OSS probe green; full Terra program not closed
**Depends on:** P0.1 complete (trust base); P2–P4 solid (helpers work)
**Priority:** **ELEVATED** — do this immediately after P0.1, before any P7–P11 expansion

## Goal
Prove the DMN loop improves agent behavior, not just self-description. Establish falsifiable metrics. Prevent regressions.

This phase is the gate for P7–P11 expansion. Do not start P7+ until P6 exit criteria pass.

## Gate decision (2026-09-05)

**Substantially met — not fully closed.** Offline eval harness green; pure-DMN OSS channel verified (DMN vs control split; retune loop documented). Remaining: formal capability-denial suite, `audit-self-schema-evidence`, richer malicious fixtures, quantitative multi-turn "fewer repeated failures after reflection" study. Those are **not** hard blockers for *starting* P7 narrative chapter craft under existing dual-write discipline, but they **are** blockers for claiming P6 exit-complete and for expanding P8–P11 automation.

## Checklist (summary)

### Done
- [x] Smoke + CI (`scripts/smoke-test.sh`, `.github/workflows/ci.yml`)
- [x] Continuity: cold-start, delayed-recall, contradiction, revision, recovery, replay
- [x] Malformed PTC + large-state buffer trim stress
- [x] `audit-reality-status`, `audit-autobiography-grounding`
- [x] `scripts/eval.sh` + `oss-dmn-probe.sh`
- [x] Baseline snapshot + interim targets (2026-09-05)
- [x] Error-recovery path (failed eval never saves)

### Open / deferred
- [ ] Capability-denial formal suite (deferred — no capability loader surface)
- [ ] Malicious Lisp-injection fixture; stale-version manifest fixture
- [ ] `(audit-self-schema-evidence)`
- [ ] Goal-drift qualitative scenario
- [ ] Quantitative multi-turn "fewer repeated failures after reflection"
- [ ] P7/P10 hardening items (arc-diff review, wander limits, midnight note path)

## Exit criteria (full Terra program)
- Smoke exits 0 on clean clone — **met**
- Continuity suite — **met**
- P0 safety invariants — **met**
- Capability-denial all pass — **not met (deferred)**
- All malicious fixtures — **partial**
- Baseline + targets — **interim met**
- False auto-bio rate measured below target — **via grounding audit; ongoing**

## Non-goals
- Implementing P7–P11 features in this phase
- Vestige (P5) required only for causal-backfill metric
- Claiming full P6 exit until residual opens are closed or explicitly waived

## Relation to other phases
- P7 soft-start under dual-write is allowed by gate decision above
- P8–P11 automation still gated on stronger P6 close or explicit waiver
