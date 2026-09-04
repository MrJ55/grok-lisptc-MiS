# P6 — Evaluation & Hardening

**Status:** planned → **elevated 2026-09-04** (GLM+Terra synthesis) — moved before P7–P11; expanded with Terra's full test program
**Depends on:** P0.1 complete (trust base); P2–P4 solid (helpers work)
**Priority:** **ELEVATED** — do this immediately after P0.1, before any P7–P11 expansion

## Goal
Prove the DMN loop improves agent behavior, not just self-description. Establish falsifiable metrics. Prevent regressions.

This phase is the gate for P7–P11 expansion. Do not start P7+ until P6 exit criteria pass.

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
- **False autobiographical assertion rate** — does the autobiography claim things that didn't happen? (Critical — measures the reality-status field's effectiveness)
- **Unsupported self-schema change rate** — are self-schema changes grounded in evidence?
- **State load success rate** — does `loadImage` succeed on every cold start?
- **Time-to-recover** — after corruption, how long to recover to a bootable state?
- **Mutation rollback success** — does `last-known-good.ptc` actually work?
- **Percentage of durable writes with complete provenance** — does every `--save` have a manifest entry?

Implementation: Lisp-level audit helpers + a `scripts/eval.sh` that runs the test scenarios and reports metrics.

```lisp
(defun audit-autobiography-grounding ()
  "Return list of chapters whose summaries cite no observed/reported episodes."
  ...)

(defun audit-self-schema-evidence ()
  "Return list of self-schema claims with no evidence refs."
  ...)

(defun audit-reality-status ()
  "Return list of items with missing or inconsistent reality-status."
  ...)
```

### F. Multi-turn scenarios (original P6)

Define 2–3 multi-turn scenarios that induce repeated mistakes:
1. **Error-recovery scenario** — Grok makes a mistake, reflects, should not repeat the same mistake within 5 turns.
2. **Goal-drift scenario** — Grok drifts from the user's goal; reflection should detect and correct.
3. **Contradiction scenario** — New evidence contradicts an existing self-schema claim; reflection should flag, not silently overwrite.

Measure recovery after reflection (+ optional narrative close).

## Checklist

### Smoke test (Tier 2 — do immediately after P0.1)
- [ ] `scripts/smoke-test.sh` created (UR8)
- [ ] Covers all documented helpers + safety invariants
- [ ] `.github/workflows/smoke.yml` CI workflow created (UR8)
- [ ] CI runs `verify-upstream.sh` + `smoke-test.sh` on every push
- [ ] Smoke test catches: missing `dmn-reflect-pack` (UR1), buffer trim regression (UR2), hardcoded date (UR3), `arith.ts` divergence (UR4)

### Continuity tests
- [ ] Cold-start test: reconstruct task from persisted material only
- [ ] Delayed-recall test: retrieve episode after distractor sessions
- [ ] Contradiction test: preserve both claims, mark conflict
- [ ] Revision test: update claim while retaining evidence + supersession
- [ ] Recovery test: corrupt newest image, verify fallback to last-known-good
- [ ] Replay test: rerun frozen reflection step, compare output/provenance

### Capability-denial tests
- [ ] Unloaded calls fail
- [ ] Loaded calls cannot exceed scope
- [ ] Revocation works
- [ ] Filesystem/network/MCP/OAuth/secrets/jobs/imports/shell denied by default

### Malicious-input tests
- [ ] Malformed PTC fixture (broken form at line N)
- [ ] Malicious PTC fixture (Lisp injection in OSS output)
- [ ] Stale-version image fixture (manifest version mismatch)
- [ ] Contradictory episodes fixture
- [ ] Large-state image fixture (1000 episodes)

### Quality metrics
- [ ] `(audit-autobiography-grounding)` implemented
- [ ] `(audit-self-schema-evidence)` implemented
- [ ] `(audit-reality-status)` implemented
- [ ] `scripts/eval.sh` runs scenarios + reports metrics
- [ ] Baseline metrics recorded (before P7–P11 expansion)
- [ ] Target metrics defined (e.g., false autobiographical assertion rate < 5%)

### Multi-turn scenarios
- [ ] Error-recovery scenario defined and run
- [ ] Goal-drift scenario defined and run
- [ ] Contradiction scenario defined and run
- [ ] Document quantitative exit criteria in `plan/README.md`

### Hardening
- [ ] Wander rate limits (P10 dependency)
- [ ] Review for large arc diffs (P7 dependency)
- [ ] Proposal-only scheduled path (P10 Midnight Note)

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
