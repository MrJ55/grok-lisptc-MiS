# 05 — Unified Recommendations

Combined, deduplicated, and prioritized recommendations from both GLM and Terra. Each recommendation cites its source(s) and includes severity, effort, and concrete steps.

---

## Priority tiers

- **Tier 1 (Critical, do first):** Fix broken correctness claims and supply-chain risks. ~3 hours total.
- **Tier 2 (High, do next):** Hardening — tests, transactional persistence, modularization. ~5 hours.
- **Tier 3 (Medium, design now implement soon):** Governance framework — trust classes, reality-status, capability profiles. ~4 hours design + ongoing.
- **Tier 4 (Low, defer):** Process improvements, doc classification, Vestige integration. Variable.

---

## Tier 1 — Critical (do first)

### UR1 — Implement `dmn-reflect-pack` and `dmn-apply-reflection`

**Source:** GLM F1 / R1
**Severity:** Critical
**Effort:** 30 minutes

Add to `mind/mind-image.ptc`:

```lisp
(defun dmn-reflect-pack (n)
  "Return (list :schema *self-schema* :episodes (dmn-fetch-unreflected n))."
  (list :schema *self-schema* :episodes (dmn-fetch-unreflected n)))

(defun dmn-apply-reflection (insights summary label)
  "Append INSIGHTS to :working-insights, set :episodic-summary and :last-reflection, log a reflection episode, return state summary."
  (let ((current (let ((pair (assoc :working-insights *self-schema*)))
                   (if pair (cdr pair) nil))))
    (update-self-schema
      (list (cons :working-insights (append current insights))
            (cons :episodic-summary summary)
            (cons :last-reflection label))))
  (dmn-log-episode "reflection" summary (list :source 'reflection :label label)))
```

Add both to `*mis-known*` list (line 4).

**Terra's improvement (defer to P0.1):** `dmn-apply-reflection` should create a *candidate* proposal, not directly mutate. Promotion is a separate step. For now, GLM's patch restores documented behavior.

**Verify:**
```bash
cd /tmp/mis
node --experimental-transform-types --no-warnings bridge/eval.ts '(dmn-reflect-pack 5)'
node --experimental-transform-types --no-warnings bridge/eval.ts --save \
  '(dmn-apply-reflection (quote (test)) "test" "2026-09-04-test")'
```

---

### UR2 — Restore buffer trim in `dmn-log-episode`

**Source:** GLM F2 / R2
**Severity:** High
**Effort:** 10 minutes

Replace `mind/mind-image.ptc` lines 46–49 with the version from `mind/helpers.ptc` lines 66–77 (which has the trim logic).

**Terra's improvement (defer to P5):** The buffer should eventually be backed by Vestige, which has FSRS-6 fading + dedup. The in-image buffer becomes a working set, not the full history.

---

### UR3 — Inject `*today*` from the bridge; fix hardcoded dates

**Source:** GLM F3 / R3
**Severity:** High
**Effort:** 20 minutes

1. In `bridge/eval.ts`, after `const repl = new MemoryRepl();`, inject host globals:
```typescript
import { newSym } from "./driver.ts";  // already exported

function injectHostGlobals(interp: InstanceType<typeof Interp>) {
  interp.defineGlobal(newSym("*today*"), new Date().toISOString().slice(0, 10));
  interp.defineGlobal(newSym("*now*"), new Date().toISOString());
}

// In MemoryRepl.freshInterp():
freshInterp() {
  const interp = new Interp({ extensions: [] });
  run(interp, prelude);
  injectHostGlobals(interp);
  return interp;
}
```

2. Update `mind/mind-image.ptc` `dmn-narrate` and `dmn-chapter-close` to use `*today*` instead of `"2026-09-02"`.

**Terra's improvement (defer to P0.1):** Add `valid_from` / `valid_until` temporal fields to episodes and chapters. The `*today*` global is the minimal fix; Terra's temporal model is the target.

---

### UR4 — Revert `src/arith.ts` to upstream; delete Reader patch

**Source:** GLM F4 / R4
**Severity:** High
**Effort:** 15 minutes

1. Delete `src/arith.ts` (or replace with upstream content from `https://raw.githubusercontent.com/1hachem/lisptc/2c10ea8/packages/interpreter/src/arith.ts`).
2. Delete `src/READER-FIX.md`.
3. In `scripts/bootstrap.sh`, delete lines 36–41 (the sed patch).
4. Re-run `bash scripts/bootstrap.sh` and verify smoke test passes.

**Terra's contribution (parallel):** Adopt `UPSTREAM.lock.json` (see UR6) to formalize the pin.

---

### UR5 — Vendor `src/lisp.ts` directly into the repo

**Source:** GLM R5 + Terra §4 P0
**Severity:** High
**Effort:** 5 minutes

```bash
curl -fsSL -o src/lisp.ts \
  https://raw.githubusercontent.com/1hachem/lisptc/2c10ea8ed6edb16e065b746a7f52080956b895de/packages/interpreter/src/lisp.ts
sha256sum src/lisp.ts  # verify
git add src/lisp.ts
```

Pin to specific commit SHA (not `main`). Update `scripts/bootstrap.sh` to use vendored copy (already preferred per lines 17–26). Remove or gate the curl fallback.

---

### UR6 — Add `UPSTREAM.lock.json` and `scripts/verify-upstream.sh`

**Source:** Terra §4 P0 + GLM R5
**Severity:** High
**Effort:** 30 minutes

Create `UPSTREAM.lock.json`:
```json
{
  "lisptc_repository": "https://github.com/1hachem/lisptc",
  "lisptc_commit": "2c10ea8ed6edb16e065b746a7f52080956b895de",
  "lisp_source_path": "packages/interpreter/src/lisp.ts",
  "arith_source_path": "packages/interpreter/src/arith.ts",
  "lisp_source_sha256": "<compute from vendored src/lisp.ts>",
  "arith_source_sha256": "<compute from vendored src/arith.ts>",
  "patch_id": null,
  "patched_sha256": null,
  "license": "MIT",
  "capability_profile": "mind-sandbox-v1",
  "acquired_at": "2026-09-04T00:00:00Z"
}
```

Create `scripts/verify-upstream.sh`:
```bash
#!/usr/bin/env bash
set -euo pipefail
EXPECTED_LISP=$(jq -r .lisp_source_sha256 UPSTREAM.lock.json)
EXPECTED_ARITH=$(jq -r .arith_source_sha256 UPSTREAM.lock.json)
ACTUAL_LISP=$(sha256sum src/lisp.ts | cut -d' ' -f1)
ACTUAL_ARITH=$(sha256sum src/arith.ts | cut -d' ' -f1)
if [[ "$EXPECTED_LISP" != "$ACTUAL_LISP" ]]; then
  echo "FAIL: src/lisp.ts hash mismatch" >&2
  exit 1
fi
if [[ "$EXPECTED_ARITH" != "$ACTUAL_ARITH" ]]; then
  echo "FAIL: src/arith.ts hash mismatch" >&2
  exit 1
fi
echo "OK: upstream sources match lock file"
```

Run in CI (see UR8).

---

## Tier 2 — High (do next)

### UR7 — Fix medium code defects (U13, U14, U15)

**Source:** GLM F5, F6, F7 / R6, R7
**Severity:** Medium
**Effort:** 30 minutes total

- **U13 (`dmn-fetch-unreflected` doesn't filter):** Rename to `dmn-fetch-recent` (simplest) or implement `:reflected` tag filter. GLM R6 has both options.
- **U14 (`dmn-autobiography(n)` ignores n):** Implement the take-N logic. GLM R7 has the patch.
- **U15 (`update-self-schema` reverses new entries):** Fix the cons/reverse order. GLM R7 has the patch.

---

### UR8 — Add smoke test + CI

**Source:** GLM R8 + Terra §6, §8
**Severity:** High
**Effort:** 1 hour (smoke test) + 1 hour (CI)

1. Create `scripts/smoke-test.sh` (GLM R8 has the full script). Tests:
   - `(mis-version)`, `(mis-ping)`, `(mis-state-summary)`, `(mis-schema)`, `(mis-insights)`
   - `(dmn-log-episode ...)`, `(dmn-fetch-unreflected 5)`
   - `(dmn-reflect-pack 5)` — will fail until UR1 is applied
   - `(dmn-arc)`, `(dmn-autobiography 1)`
   - `(square 5)`, `(half 8)`
   - Safety: prose rejected (exit 2), unbalanced rejected (exit 2)

2. Create `.github/workflows/smoke.yml`:
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

3. Long-term: expand toward Terra's test program (continuity tests, capability denial, malicious input fixtures, quality metrics). See `02-TERRA-EXTENSIONS.md` §2.8.

---

### UR9 — Atomic save

**Source:** GLM F8 / R9 + Terra §4 P0
**Severity:** Medium (crash safety)
**Effort:** 15 minutes (minimal) or 2 hours (full transaction)

**Minimal fix (GLM R9):** Replace `appendTranscript` in `bridge/eval.ts` with temp-file-rename pattern:
```typescript
function appendTranscript(forms: string, path: string) {
  ensureMindDir();
  const stamp = new Date().toISOString();
  const block = `\n;; --- ${stamp} ---\n${forms.trim()}\n`;
  const prev = existsSync(path) ? readFileSync(path, "utf8") : "";
  const tmp = `${path}.tmp.${process.pid}`;
  writeFileSync(tmp, prev + block);
  renameSync(tmp, path);  // atomic on POSIX
  console.error(`[mis] appended forms to ${path}`);
}
```

**Full transaction (Terra §4 P0, defer to P0.1):**
- `state/manifest.json` with before/after hashes, actor, timestamp, operation ID
- `state/checkpoints/last-known-good.ptc` as automatic fallback
- `state/audit/mutations.jsonl` append-only journal
- Fault injection test that crashes at each stage

---

### UR10 — Form-by-form image load

**Source:** GLM F9 / R10
**Severity:** Medium
**Effort:** 1 hour

Replace `loadImage` in `bridge/eval.ts` with form-by-form evaluation that reports per-form failures. GLM R10 has the full implementation (`splitTopLevelForms` helper + per-form eval loop).

**Terra's improvement (defer to P0.1):** Validate the manifest (§2.3) before evaluating any forms. Verify post-load state against a hash.

---

### UR11 — Modularize `mind-image.ptc` via `import`

**Source:** GLM R12 + Terra §3.1
**Severity:** Medium (maintainability)
**Effort:** 1 hour

Split `mind/mind-image.ptc` into:
```
mind/
  mind-image.ptc          ;; loader: (import "helpers.ptc") (import "schema.ptc") ...
  helpers.ptc             ;; mis-version, mis-ping, mis-note, mis-register, mis-state-summary
  schema.ptc              ;; *self-schema*, update-self-schema, mis-schema, mis-insights
  episodes.ptc            ;; *episodic-buffer*, *episodic-max*, dmn-log-episode, dmn-fetch-unreflected, dmn-reflect-pack, dmn-apply-reflection
  autobiography.ptc       ;; *autobiography*, *narrative-arc*, dmn-narrate, dmn-chapter-close, dmn-arc, dmn-autobiography
  arithmetic.ptc          ;; square, triple, double, quadruple, half
```

The loader (`mind-image.ptc`) becomes:
```lisp
;; MiS mind image — loader
;; Order matters: helpers first, then state, then functions that depend on state.
(import "helpers.ptc")
(import "schema.ptc")
(import "episodes.ptc")
(import "autobiography.ptc")
(import "arithmetic.ptc")
```

**Important:** Use `(import "...")` not `(load "...")`. `load` is not an upstream builtin (see §4.5 of this synthesis). `import` resolves paths relative to the importing file's directory.

**Delete the duplicate `mind/helpers.ptc`** — it's an older parallel copy that has caused confusion (F2 regression). The new `helpers.ptc` replaces it.

**Terra's improvement (defer to P0.2+):** `mind-image.ptc` becomes a generated projection, not directly editable. Built by `scripts/build-mind-image.ts` from governed state in `state/`.

---

## Tier 3 — Medium (design now, implement soon)

### UR12 — Adopt trust classes for content

**Source:** Terra §8 of build spec
**Severity:** Medium (security)
**Effort:** 2 hours design + 2 hours implementation

Adopt Terra's five-class model (untrusted / candidate / approved / derived / immutable). For v0, implement a simpler three-class model:

- **untrusted:** transcript text, OSS output, retrieved memory content — never evaluated as Lisp
- **candidate:** parsed proposal awaiting validation — stored in `mind/oss-proposals-*.ptc`, not in `mind-image.ptc`
- **approved:** Grok-authored Lisp that has passed `prevalidate` + `eval` — goes in `mind-image.ptc`

Implementation:
- `bridge/eval.ts` `prevalidate` already rejects prose (crude untrusted filter). Extend it to also reject strings that look like OSS output (heuristic: contains "I am the transcript" or other nudge-craft prefixes).
- Add a `(promote-candidate candidate-id)` Lisp helper that validates and applies a candidate from `oss-proposals-*.ptc`.
- Document the promotion flow in `docs/trust-classes.md`.

---

### UR13 — Add reality-status field

**Source:** Terra §5
**Severity:** Medium (data integrity)
**Effort:** 1 hour design + 1 hour implementation

Add `:reality-status` as a required field in:
- Every episode record (extend `dmn-log-episode` signature)
- Every autobiography chapter (extend `dmn-narrate` / `dmn-chapter-close`)
- Every self-schema claim (extend `update-self-schema`)

Eight values: `observed | reported | inferred | hypothesized | imagined | planned | simulated | retracted`

Migration: tag existing episodes retroactively:
- OSS-sourced entries → `:imagined`
- Hardcoded `*self-schema*` defaults → `:observed` or `:inferred`
- *Genesis of GMOD* chapter → `:observed` (the host restoration) with `:imagined` sub-elements (the OSS line)

Add audit helper:
```lisp
(defun audit-reality-status ()
  "Return list of items with missing or inconsistent reality-status."
  ...)
```

---

### UR14 — Adopt capability governance framework

**Source:** Terra §3.3 + Lisptc-Native-Tools Addendum
**Severity:** Medium (future-proofing)
**Effort:** Design only for now (~2 hours)

Document Terra's capability profiles in `docs/capability-governance.md`:
- `mind-read-v1` — safe project inspection (automatic)
- `mind-memory-read-v1` — Vestige recall (automatic)
- `mind-candidate-write-v1` — bounded candidate creation (policy-gated)
- `reflection-v1` — read, compute, candidate claims (no direct promotion)
- `vestige-maintenance-v1` — consolidation, dedup (explicit policy)
- `git-governed-write-v1` — approved repo writes (user confirmation)
- `secrets-v1` — credential resolution (explicit elevated grant)
- `external-action-v1` — remote side effects (user confirmation)

When the first capability is loaded (likely Vestige in P5), implement:
- `CapabilityDescriptor` schema (name, profile, effect, scope, input/output schemas, audit level, confirmation rule, revocability)
- Operation event log (`state/audit/operations.jsonl`)
- `mind-load-capability`, `mind-unload-capability`, `mind-capabilities`, `mind-execute` Lisp helpers

Keep `extensions: []` for now. The framework is the design; implementation happens when tools are needed.

---

### UR15 — Add compatibility tuple / manifest

**Source:** Terra §3.2
**Severity:** Medium (forward compatibility)
**Effort:** 1 hour

Add manifest as first form in `mind-image.ptc`:
```lisp
(setq *mind-manifest*
  '((:gmod-schema . "0.1.0")
    (:helpers-version . "0.3")
    (:lisptc-commit . "2c10ea8ed6edb16e065b746a7f52080956b895de")
    (:lisptc-source-sha256 . "<hash>")
    (:capability-profile . "mind-sandbox-v1")
    (:created-at . "2026-09-02T00:00:00Z")))
```

`bridge/eval.ts` `loadImage` should:
1. Eval the manifest form first
2. Check `:gmod-schema` against a known version list
3. Check `:lisptc-commit` against `UPSTREAM.lock.json`
4. Warn (or fail with `--strict-load`) on mismatch
5. Only then eval the rest of the image

---

### UR16 — Soften DMN claims; elevate P6

**Source:** GLM §1.2.2 / R14 + Terra §5, §7
**Severity:** Medium (academic honesty + evaluation)
**Effort:** 1 hour doc edit + ongoing metric definition

1. In `adr/0005-dmn-subsystems.md`, `plan/CREATIVE-MECHANISMS.md`, `docs/gmod-extensions-contrast-20260902.md`:
   - "DMN subsystem" → "DMN-inspired subsystem"
   - "geometry-preserving proposal engine" → "candidate-texture generator (hypothesized to preserve DMN-like residual geometry)"
   - Add caveat: "The DMN framing is a metaphor inspired by neuroscience literature. The Lisp data structures do not implement a DMN."

2. Move P6 (Evaluation) to immediately after P0.1, before P7–P11 expansion.

3. Define P6 metrics (Terra §6):
   - False autobiographical assertion rate
   - Unsupported self-schema change rate
   - State load success rate
   - Time-to-recover
   - Mutation rollback success
   - Percentage of durable writes with complete provenance

4. Run the same task with and without the DMN loop enabled; compare outcomes (Terra Milestone D).

---

## Tier 4 — Low (defer)

### UR17 — Add `CONTRIBUTING.md`, `SECURITY.md`, CI extras

**Source:** Terra §8
**Severity:** Low (process)
**Effort:** 1 hour

- `CONTRIBUTING.md`: state-changing code review expectations, security boundaries, commit-message convention (`state(episode): ...`, `mind(schema): ...`, `runtime(upstream): ...`)
- `SECURITY.md`: reporting, capability policy, sensitive-state handling, secret scanning
- CI extras: lint, typecheck, link checking, secret scanning (beyond the smoke test in UR8)

---

### UR18 — Document classification index

**Source:** Terra OSS-DMN-MIS-PROTOCOL-SPEC §10 Phase A
**Severity:** Low (navigation)
**Effort:** 1 hour

Add `docs/INDEX.md` or front-matter tags classifying each doc as:
`research-record | protocol-source | operational-playbook | architecture-decision | experiment-result | historical-artifact | active-spec | deprecated`

Terra's mapping (§2.6 of this synthesis) is accurate and can be used directly.

---

### UR19 — Commit `mind-failures.log` or document ephemerality

**Source:** GLM F14 / R15
**Severity:** Low (ops)
**Effort:** 5 minutes

Either add `mind/mind-failures.log` to `scripts/push-mind-image.sh` line 11, or document in `docs/ops-playbook.md` that it's intentionally ephemeral. Superseded by Terra's operation-event log (UR14) when that is implemented.

---

### UR20 — Adopt incremental commits

**Source:** GLM F13
**Severity:** Low (process)
**Effort:** Ongoing

Commit incrementally going forward. Use Terra's commit-message convention (UR17). Tag releases. Keep an internal branch with full history even if squashing before publishing.

---

### UR21 — Defer Vestige integration to P5

**Source:** Terra §7 of build spec (entire Vestige proposal)
**Severity:** Low (deferred — high value but premature)
**Effort:** Variable (design + integration)

**Do NOT implement until:**
- UR1–UR6 complete (foundation solid)
- License compatibility reviewed (Vestige is AGPL-3.0; fork is MIT; MCP-subprocess integration is likely safe, direct code linking is not)
- P0.1 (trust base) complete
- In-image state grown enough to justify external storage

**When implemented:**
- Follow Terra's adapter pattern: `bridge/vestige-adapter.ts` is the only path to Vestige
- Use MCP subprocess integration (`vestige-mcp`) to preserve license separation
- Map Lisp operations to Vestige tools (see §4.7 of this synthesis for the mapping table)
- Add `mind-memory-read-v1` capability profile (UR14)
- Implement degraded mode (boot from last projection if Vestige unavailable)

**Vestige capabilities the fork would gain:**
- `backfill` — retroactive salience backfill (causal root-cause finding) — directly serves P9 prospection
- `contradictions` (via `recall` mode) — contradiction detection — serves trust-class enforcement
- `smart_ingest` — prediction-error gating + dedup — better than the fork's manual episode logging
- FSRS-6 spaced repetition — automatic memory fading — better than the fork's `*episodic-max*` trim
- `graph` — spreading activation — serves P8 replay/scenes

---

### UR22 — Protocol registry (long-term)

**Source:** Terra OSS-DMN-MIS-PROTOCOL-SPEC §4–§9
**Severity:** Low (deferred — ambitious)
**Effort:** Variable

Adopt when the fork has ≥5 OSS/DMN prompt variants or when prompt evolution becomes a pain point. Start with:
- `protocols/REGISTRY.yaml` (id, version, source-doc, parameters, capability-profile)
- GLM's `bridge/oss.ts` (R13) as the minimal runner
- Defer Terra's full compiler/runner/evaluator stack

---

## Summary: priority order and effort

| # | Recommendation | Tier | Effort | Source |
|---|---|---|---|---|
| UR1 | Implement `dmn-reflect-pack` + `dmn-apply-reflection` | 1 | 30 min | GLM |
| UR2 | Restore buffer trim | 1 | 10 min | GLM |
| UR3 | Inject `*today*`; fix hardcoded dates | 1 | 20 min | GLM |
| UR4 | Revert `arith.ts`; delete Reader patch | 1 | 15 min | GLM |
| UR5 | Vendor `src/lisp.ts` | 1 | 5 min | Both |
| UR6 | `UPSTREAM.lock.json` + verify script | 1 | 30 min | Both |
| UR7 | Fix medium code defects (U13–U15) | 2 | 30 min | GLM |
| UR8 | Smoke test + CI | 2 | 2 hr | Both |
| UR9 | Atomic save | 2 | 15 min (minimal) / 2 hr (full) | Both |
| UR10 | Form-by-form image load | 2 | 1 hr | GLM |
| UR11 | Modularize via `import` | 2 | 1 hr | Both |
| UR12 | Trust classes | 3 | 4 hr | Terra |
| UR13 | Reality-status field | 3 | 2 hr | Terra |
| UR14 | Capability governance framework | 3 | 2 hr design | Terra |
| UR15 | Compatibility tuple / manifest | 3 | 1 hr | Terra |
| UR16 | Soften DMN claims; elevate P6 | 3 | 1 hr + ongoing | Both |
| UR17 | `CONTRIBUTING.md`, `SECURITY.md`, CI extras | 4 | 1 hr | Terra |
| UR18 | Document classification index | 4 | 1 hr | Terra |
| UR19 | Commit failure log | 4 | 5 min | GLM |
| UR20 | Incremental commits | 4 | Ongoing | GLM |
| UR21 | Vestige integration (P5) | 4 | Variable | Terra |
| UR22 | Protocol registry (long-term) | 4 | Variable | Terra |

**Tier 1 total:** ~2 hours
**Tier 1+2 total:** ~8 hours
**Tier 1+2+3 total:** ~17 hours

**Recommended first session:** UR1–UR6 (Tier 1, ~2 hours) + UR8 (smoke test, 1 hour). This fixes all critical defects, makes the cold-start verification step work, and prevents regressions. Everything else can follow incrementally.
