# P0 — Safety

**Status:** done (verified 2026-08-31); **revised 2026-09-04** (GLM+Terra synthesis) — atomic save + form-by-form load added

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
- `bridge/eval.ts`: `stripFences`, `prevalidate` (paren depth + prose heuristic), `eval` → `{ok, output}`, save gated on `ok`, `mind-failures.log`, `--checkpoint` → `*.prev.ptc`.
- **Atomic save:** `appendTranscript` writes to `path.tmp.<pid>` then `renameSync` (POSIX-atomic). No read-then-write.
- **Form-by-form load:** `loadImage` splits the image into top-level forms via `splitTopLevelForms(src)` and evaluates each independently. Per-form failures are reported with form index and content preview; subsequent forms still load.
- **Automatic checkpoint:** `--save` always creates `state/checkpoints/last-known-good.ptc` before appending (not opt-in).
- Exit codes: 0 success, 1 usage, 2 validation/eval failure.

## Checklist
- [x] Fence stripping for markdown code blocks
- [x] Pre-validation rejects prose and unbalanced forms
- [x] Save only on success
- [x] No reset on ordinary eval errors
- [x] Failures logged to `mind/mind-failures.log`
- [x] `--checkpoint` support
- [x] Verified in docs/VERIFICATION.md (22 scenarios)
- [ ] **Atomic save via `renameSync`** (UR9 — temp file + atomic rename, no read-then-write)
- [ ] **Form-by-form image load** (UR10 — `splitTopLevelForms` helper + per-form error reporting)
- [ ] **Automatic `last-known-good.ptc` checkpoint** before every `--save` (not opt-in)
- [ ] **`--strict-load` flag** that fails bootstrap if any form in the image errors
- [ ] **Crash recovery test** — corrupt the newest image, verify fallback to `last-known-good.ptc`
- [ ] **`prevalidate` regex fix** — use upstream `tokenPattern()` or expand to accept `:keyword`, `string->symbol`, `<=`, `>=` (UR7 sub-item)
- [ ] **Commit `mind-failures.log`** to repo (or document ephemerality in `docs/ops-playbook.md`) — UR19

## Exit criteria
- Definitions survive injected errors; failed forms never appear in `mind-image.ptc`.
- A crash between `readFileSync` and `writeFileSync` (simulated by `kill -9`) leaves either the prior valid state or the new state — never a partial file.
- A single broken form at line N of the image does not silently drop forms at lines N+1..end; instead, the load reports "form N failed: <error>" and continues.
- `last-known-good.ptc` is bootable after any failed `--save`.

## Non-goals (this phase)
- Trust class enforcement (P0.1)
- Capability governance (P0.1)
- Transactional audit trail with operation IDs (P0.1)
- Compatibility manifest validation (P0.1)

## Relation to P0.1
P0 establishes the minimal safety bridge (validate, save-on-success, no-reset). P0.1 builds the trust base on top: trust classes, capability profiles, transactional persistence with audit trail, compatibility manifest. P0 must be solid before P0.1 starts.
