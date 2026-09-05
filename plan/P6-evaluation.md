# P6 — Evaluation & Hardening

**Status:** substantially met (2026-09-05) — elevated 2026-09-04 (GLM+Terra); full method body restored after accidental summary compression
**Depends on:** P0.1 complete (trust base); P2–P4 solid (helpers work)
**Priority:** **ELEVATED** — do this immediately after P0.1, before any P7–P11 expansion

## Goal
Prove the DMN loop improves agent behavior, not just self-description. Establish falsifiable metrics. Prevent regressions.

This phase is the gate for P7–P11 expansion. Do not start P7+ until P6 exit criteria pass.

## Gate decision (2026-09-05)

**Substantially met — not fully closed.** Offline eval harness green; pure-DMN OSS channel verified (DMN vs control split; retune loop documented). Post-reflection error study PASS. Goal-drift qualitative scenario PASS (harness proves *represent → reflect-apply → re-align*; it does **not** prove autonomous drift detection). `(audit-self-schema-evidence)` implemented (lenient). Remaining: formal capability-denial suite, richer malicious fixtures (Lisp-injection, stale-manifest). Soft-start P7 under dual-write is allowed; P8–P11 automation still gated on stronger close or explicit waiver.

See also: [docs/post-reflection-error-study.md](../docs/post-reflection-error-study.md), [docs/goal-drift-scenario.md](../docs/goal-drift-scenario.md).

## Park decision (2026-09-05)

**Residuals parked by host + user decision.** Soft-start of P7 was already allowed; full P7 exit is complete under dual-write discipline. Remaining items are deferred, not denied:

| Item | Status | Notes |
|------|--------|-------|
| Formal capability-denial suite | **parked** | No full capability loader yet; prevalidate + trust classes are partial substitute. Revisit with P5 Vestige load path. |
| Richer malicious fixtures (Lisp-injection in OSS, stale-manifest) | **parked** | Continuity dual-claim + existing malicious form path cover core risk; dedicated fixture files deferred. |
| Stronger autonomous goal-drift detection | **parked** | Qualitative harness PASS; autonomous detection not required for narrative/protocol work. |
| Full claim of “P6 closed for P11 automation” | **soft waiver** | P11 may proceed on protocol formalization; do not claim unattended automation until capability-denial is stronger. |

P7–P11 narrative and OSS-channel work may continue. Capability-denial becomes blocking again when a real capability loader (e.g. Vestige MCP) is introduced.

## Why elevated
Both GLM and Terra independently concluded that P6 was under-prioritized. The original plan deferred evaluation until after P7–P9, meaning the project would build five subsystems before testing whether any of them work. This revision moves P6 to immediately after P0.1.
