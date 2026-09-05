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

## Objective
- Multi-turn scenarios that induce repeated mistakes.
- Metrics: repeated-error rate, schema stability, image growth, chapter grounding (refs present).
- Hardening: wander rate limits, review for large arc diffs, proposal-only scheduled path.
- **Smoke test** (automated, runs on every push).
- **Continuity tests** (cold start, delayed recall, contradiction, revision, recovery, replay).
- **Quality metrics** (false autobiographical assertion rate, unsupported self-schema change rate, etc.).
- **Capability-denial tests** (unloaded calls fail; loaded calls cannot exceed scope).
- **Malicious-input tests** (OSS-shaped strings, broken forms, prompt injection).

## Implementation method

### A. Smoke test (UR8 — minimal, do first)

`scripts/smoke-test.sh` — automated regression test for documented helpers. Runs on every push via CI.

### B. Continuity tests

| Scenario | Intent |
|----------|--------|
| **Cold start** | Bootstrap + reflect-pack + autobiography non-empty |
| **Delayed recall** | Episode survives reload |
| **Contradiction** | Preserve both claims, mark conflict |
| **Revision** | Update schema with supersession |
| **Recovery** | Fallback to last-known-good |
| **Replay** | Rerun reflective step against frozen inputs |

### C. Capability-denial tests (Terra §6) — **PARKED**

- Unloaded calls fail — deferred (no capability loader)
- Loaded calls cannot exceed scope — deferred
- Revocation — deferred
- Full matrix — deferred until P5 / capability loader exists

### D. Malicious-input tests — **PARKED (partial)**

- Malicious PTC fixture (Lisp injection in OSS output) — open / parked
- Stale-version image fixture — open / parked
- Contradiction coverage via continuity dual-claim — done

## Exit criteria
- `bash scripts/smoke-test.sh` exits 0 on a clean clone.
- At least one multi-turn scenario shows fewer repeated failures after a full cycle.
- No P0 regressions (all P0 safety invariants hold).
- All continuity tests pass (cold start, delayed recall, contradiction, revision, recovery, replay).
- All capability-denial tests pass. **(parked — soft waiver)**
- All malicious-input tests pass (malformed/malicious/stale/contradictory/large-state). **(partial; richer fixtures parked)**
- Baseline metrics recorded; target metrics defined.
- False autobiographical assertion rate is measured and below target.

## Non-goals
- Implementing P7–P11 features (this phase evaluates, doesn't expand)
- Vestige integration (P5 — but P5 should be done before P6's causal-backfill metric is meaningful)
- Full DMN subsystem implementation (P7–P11 come after this gate)

## Relation to other phases
- **P0.1 must be done first** (trust base, reality-status, manifest — P6 metrics depend on these)
- **P5 (Vestige) should be done before P6's causal-backfill metric** — but P6's other metrics don't depend on Vestige
- **P7–P11 are gated on P6** — soft waiver accepted 2026-09-05 for narrative/protocol work; capability-denial becomes blocking again when a real capability loader is introduced.
