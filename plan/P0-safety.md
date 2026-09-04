# P0 — Safety

**Status:** exit-complete (2026-09-04 — checklist reconciled against live bridge + prevalidate tighten)
**Verified:** 2026-08-31 original; 2026-09-04 GLM revision items closed

## Goal
Make it impossible for ordinary mistakes to brick or poison the permanent mind.

## Objective
- Reject non-Lisp / unbalanced input before eval.
- Append to the image **only** after successful eval.
- Preserve definitions across runtime errors (no `reset` on `EvalException`).
- Log failures separately; support soft checkpoint before save.
- **Atomic save** — a crash mid-save must not corrupt the image.
- **Form-by-form image load** — a single broken form must not silently drop subsequent forms.
- **Crash recovery** — `last-known-good.ptc` fallback when the newest image is corrupt.

## Implementation method
- `bridge/eval.ts`: `stripFences`, `prevalidate` (paren depth + prose/OSS heuristics + bare-atom allowlist), `eval` → `{ok, output}`, save gated on `ok`, `mind-failures.log`, `--checkpoint` → `*.prev.ptc`.
- **Atomic save:** `appendTranscript` writes to `path.tmp.<pid>` then `renameSync` (POSIX-atomic).
- **Form-by-form load:** `loadImage` uses `extractTopLevelForms(src)` and evaluates each form independently. Per-form failures report index; subsequent forms still load unless `--strict-load`.
- **Automatic checkpoint:** `--save` always creates `state/checkpoints/last-known-good.ptc` before appending.
- Exit codes: 0 success, 1 usage, 2 validation/eval failure.

## Checklist
- [x] Fence stripping for markdown code blocks
- [x] Pre-validation rejects prose and unbalanced forms
- [x] Save only on success
- [x] No reset on ordinary eval errors
- [x] Failures logged to `mind/mind-failures.log`
- [x] `--checkpoint` support
- [x] Verified in docs/VERIFICATION.md (baseline scenarios)
- [x] **Atomic save via `renameSync`** (UR9 — temp file + atomic rename)
- [x] **Form-by-form image load** (UR10 — `extractTopLevelForms` + per-form error reporting)
- [x] **Automatic `last-known-good.ptc` checkpoint** before every `--save`
- [x] **`--strict-load` flag** fails process if any image form errors
- [x] **Crash recovery test** — `scripts/test-crash-recovery.sh` (corrupt image → LKG boots)
- [x] **`prevalidate` token policy** — multi-word prose rejected; bare atoms allow `:keyword`, `<=`, `>=`, `string->symbol` (UR7)
- [x] **`mind-failures.log` policy** — ephemeral (`*.log` gitignored); documented in `docs/ops-playbook.md` (UR19)

## Exit criteria
- [x] Definitions survive injected errors; failed forms never appear in `mind-image.ptc`.
- [x] Atomic rename path: prior valid state or new state — never a partial file.
- [x] A single broken/failing form does not silently drop later forms; load reports failure and continues (or exits under `--strict-load`).
- [x] `last-known-good.ptc` is bootable after simulated failure.
- [x] Multi-word prose rejected at prevalidate (exit 2), not at eval.

## Non-goals (this phase)
- Trust class enforcement (P0.1)
- Capability governance (P0.1)
- Transactional audit trail with operation IDs (P0.1)
- Compatibility manifest validation (P0.1)

## Relation to P0.1
P0 establishes the minimal safety bridge (validate, save-on-success, no-reset, atomicity, form-by-form, LKG). P0.1 builds the trust base on top: trust classes, capability profiles, transactional persistence with audit trail, compatibility manifest.
