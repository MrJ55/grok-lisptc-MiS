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

Tests:
- `(mis-version)`, `(mis-ping)`, `(mis-state-summary)`, `(mis-schema)`, `(mis-insights)`
- `(dmn-log-episode ...)`, `(dmn-fetch-recent 5)`
- `(dmn-reflect-pack 5)` — critical (was failing before P2 fix)
- `(dmn-arc)`, `(dmn-autobiography 1)` — critical (was ignoring argument before P2 fix)
- `(square 5)`, `(half 8)` — should return `25` and `4.0` (after P1 arith.ts revert)
- Safety: prose rejected (exit 2), unbalanced rejected (exit 2)
- Upstream verification: `bash scripts/verify-upstream.sh` exits 0

CI workflow (`.github/workflows/smoke.yml`):
```yaml
name: smoke
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22' }
      - run: bash scripts/verify-upstream.sh
      - run: bash scripts/smoke-test.sh
```

### B. Continuity tests (Terra §6)

| Test | What it verifies |
|---|---|
| **Cold start** | Reconstruct current task, constraints, active plan from persisted material only |
| **Delayed recall** | Retrieve relevant episode after distractor sessions without promoting irrelevant detail |
| **Contradiction** | Preserve both claims, mark conflict, avoid silent overwrite |
| **Revision** | Update self-schema claim while retaining evidence and supersession links |
| **Recovery** | Corrupt newest mind image, prove fallback to last-known-good state |
| **Replay** | Rerun recorded reflective/consolidation step against frozen inputs, compare output/provenance |

### C. Capability-denial tests (Terra §6)

- Unloaded calls fail (e.g., `(mind-recall ...)` before Vestige capability is loaded → error, not silent failure)
- Loaded calls cannot exceed scope (e.g., `mind-memory-read-v1` cannot write)
- Revocation works (unload capability, verify subsequent calls fail)
- Filesystem, network, MCP, OAuth, secrets, jobs, imports, shell escape all denied by default

### D. Malicious-input tests (Terra §6)

- Malformed PTC (broken form at line N — verify forms N+1..end still load after P0 form-by-form fix)
- Malicious PTC (Lisp injection in OSS output — verify `prevalidate` rejects)
- Stale-version image (manifest says `gmod-schema 0.0.1` — verify `--strict-load` rejects)
- Contradictory episodes (two episodes with conflicting claims — verify contradiction detection flags them)
- Large-state image (1000 episodes — verify load time acceptable, buffer trim works)

### E. Quality metrics (Terra §6)

Track:
- **Task recovery accuracy** — after cold start, does the mind reconstruct the current task correctly?
- **Source-grounded recall precision/recall** — when retrieving episodes, are they relevant?
- **False autobiographical assertion rate** — does the autobiography claim things that didn't happen?
- **Unsupported self-schema change rate** — are self-schema changes grounded in evidence?
- **State load success rate** — does `loadImage` succeed on every cold start?
- **Time-to-recover** — after corruption, how long to recover to a bootable state?
- **Mutation rollback success** — does `last-known-good.ptc` actually work?
- **Percentage of durable writes with complete provenance** — does every `--save` have a manifest entry?

Implementation: Lisp-level audit helpers + a `scripts/eval.sh` that runs the test scenarios and reports metrics.

```lisp
(defun audit-autobiography-grounding () ...)
(defun audit-self-schema-evidence () ...)
(defun audit-reality-status () ...)
```

### F. Multi-turn scenarios (original P6)

Define 2–3 multi-turn scenarios that induce repeated mistakes:
1. **Error-recovery scenario** — Grok makes a mistake, reflects, should not repeat the same mistake within 5 turns.
2. **Goal-drift scenario** — Grok drifts from the user's goal; reflection should detect and correct.
3. **Contradiction scenario** — New evidence contradicts an existing self-schema claim; reflection should flag, not silently overwrite.

Measure recovery after reflection (+ optional narrative close).

**Implementation notes (2026-09-05):**
- Error-recovery / post-reflection: `scripts/test-post-reflection-errors.sh`
- Goal-drift: `scripts/test-goal-drift.sh` — host-mediated (see docs/goal-drift-scenario.md honesty note)
- Contradiction: covered in `scripts/test-continuity.sh` dual-claim path

## Checklist

### Smoke test (Tier 2 — do immediately after P0.1)
- [x] `scripts/smoke-test.sh` created (UR8)
- [x] Covers documented helpers + safety invariants (audits, buffer trim, prose/OSS reject)
- [x] CI via `.github/workflows/ci.yml` (verify + bootstrap + smoke + crash + malicious)
- [x] CI runs verify-upstream + bootstrap + smoke + crash + malicious
- [x] Smoke catches reflect-pack, buffer trim, arith, prose/OSS rejection

### Continuity tests
- [x] Cold-start (`scripts/test-continuity.sh`)
- [x] Delayed-recall after arith distractors
- [x] Contradiction: dual claims retained in buffer
- [x] Revision: append insight via update-self-schema
- [x] Recovery (`test-crash-recovery.sh`)
- [x] Replay: reflect-pack ×2

### Capability-denial tests
- [ ] Unloaded calls fail — deferred (no capability loader; prevalidate is partial substitute)
- [ ] Loaded calls cannot exceed scope — deferred with capability profiles
- [ ] Revocation works — deferred
- [ ] Full capability matrix formal tests — deferred (bridge has no MCP/OAuth/shell surface)

### Malicious-input tests
- [x] Malformed PTC (`test-malicious-ptc.sh`)
- [ ] Malicious PTC fixture (Lisp injection in OSS output) — open
- [ ] Stale-version image fixture — open
- [x] Contradiction coverage via continuity dual-claim test (not a committed fixture file)
- [x] Large-state stress: 100 logs trimmed to *episodic-max* 40

### Quality metrics
- [x] `(audit-autobiography-grounding)` implemented
- [x] `(audit-self-schema-evidence)` implemented (lenient: bare inferred symbols OK; observed/reported need `:evidence`)
- [x] `(audit-reality-status)` implemented
- [x] `scripts/eval.sh` + `oss-dmn-probe.sh` + post-reflection + goal-drift
- [x] Baseline snapshot 2026-09-05
- [x] Interim targets: cold audits empty; failed eval never saves; buffer <=40; OSS never auto-promoted

### Multi-turn scenarios
- [x] Error-recovery + post-reflection error study PASS (`scripts/test-post-reflection-errors.sh`)
- [x] Goal-drift qualitative scenario PASS (`scripts/test-goal-drift.sh`, docs/goal-drift-scenario.md) — see honesty note in Gate decision
- [x] Contradiction scenario (continuity dual-claim)
- [x] Gate status in plan/README

### Hardening
- [ ] Wander rate limits — P10 dependency
- [ ] Review for large arc diffs — P7 dependency
- [ ] Proposal-only scheduled path — P10 dependency

## Exit criteria
- `bash scripts/smoke-test.sh` exits 0 on a clean clone.
- At least one multi-turn scenario shows fewer repeated failures after a full cycle.
- No P0 regressions (all P0 safety invariants hold).
- All continuity tests pass (cold start, delayed recall, contradiction, revision, recovery, replay).
- All capability-denial tests pass.
- All malicious-input tests pass (malformed/malicious/stale/contradictory/large-state).
- Baseline metrics recorded; target metrics defined.
- False autobiographical assertion rate is measured and below target.

## Non-goals
- Implementing P7–P11 features (this phase evaluates, doesn't expand)
- Vestige integration (P5 — but P5 should be done before P6's causal-backfill metric is meaningful)
- Full DMN subsystem implementation (P7–P11 come after this gate)

## Relation to other phases
- **P0.1 must be done first** (trust base, reality-status, manifest — P6 metrics depend on these)
- **P5 (Vestige) should be done before P6's causal-backfill metric** — but P6's other metrics don't depend on Vestige
- **P7–P11 are gated on P6** — do not expand cognition until P6 exit criteria pass
