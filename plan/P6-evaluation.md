# P6 — Evaluation & Hardening

**Status:** substantially met (2026-09-05) — smoke/continuity/malicious/OSS probe green; full Terra program not closed
**Depends on:** P0.1 complete (trust base); P2–P4 solid (helpers work)
**Priority:** **ELEVATED** — do this immediately after P0.1, before any P7–P11 expansion

## Goal
Prove the DMN loop improves agent behavior, not just self-description. Establish falsifiable metrics. Prevent regressions.

This phase is the gate for P7–P11 expansion. Do not start P7+ until P6 exit criteria pass.

## Gate decision (2026-09-05)

**Substantially met — not fully closed.** Offline eval harness green; pure-DMN OSS channel verified; post-reflection error study PASS; `(audit-self-schema-evidence)` implemented (lenient). Remaining: formal capability-denial suite, richer malicious fixtures. Those are **not** hard blockers for *starting* P7 narrative chapter craft under existing dual-write discipline, but they **are** blockers for claiming P6 exit-complete and for expanding P8–P11 automation.

## Checklist (summary)

See also [docs/post-reflection-error-study.md](../docs/post-reflection-error-study.md).

### Done
- [x] Smoke + CI
- [x] Continuity suite
- [x] Malformed PTC + buffer trim stress
- [x] `audit-reality-status`, `audit-autobiography-grounding`
- [x] `audit-self-schema-evidence` (lenient: bare inferred symbols OK; observed/reported need `:evidence`)
- [x] `scripts/eval.sh` + OSS probe
- [x] Baseline + interim targets
- [x] Post-reflection error study PASS
- [x] Error-recovery path (failed eval never saves)

### Open / deferred
- [ ] Capability-denial formal suite (deferred — no capability loader surface)
- [ ] Malicious Lisp-injection fixture; stale-version manifest fixture
- [ ] Goal-drift qualitative scenario
- [ ] P7/P10 hardening items (arc-diff review, wander limits, midnight note path)

## Exit criteria (full Terra program)
- Smoke / continuity / P0 safety — **met**
- Post-reflection error study — **met**
- Schema evidence audit — **met (lenient)**
- Capability-denial — **not met (deferred)**
- All malicious fixtures — **partial**

## Relation to other phases
- P7 soft-start under dual-write is allowed by gate decision above
- P8–P11 automation still gated on stronger P6 close or explicit waiver
