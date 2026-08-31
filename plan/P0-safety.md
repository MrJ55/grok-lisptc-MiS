# P0 — Safety

**Status:** done (verified 2026-08-31)

## Goal
Make it impossible for ordinary mistakes to brick or poison the permanent mind.

## Objective
- Reject non-Lisp / unbalanced input before eval.
- Append to the image **only** after successful eval.
- Preserve definitions across runtime errors (no `reset` on `EvalException`).
- Log failures separately; support soft checkpoint before save.

## Implementation method
- `bridge/eval.ts`: `stripFences`, `prevalidate` (paren depth + prose heuristic), `eval` → `{ok, output}`, save gated on `ok`, `mind-failures.log`, `--checkpoint` → `*.prev.ptc`.
- Exit codes: 0 success, 1 usage, 2 validation/eval failure.

## Checklist (all done)
- [x] Fence stripping for markdown code blocks
- [x] Pre-validation rejects prose and unbalanced forms
- [x] Save only on success
- [x] No reset on ordinary eval errors
- [x] Failures logged to `mind/mind-failures.log`
- [x] `--checkpoint` support
- [x] Verified in docs/VERIFICATION.md (22 scenarios)

## Exit criteria
Definitions survive injected errors; failed forms never appear in `mind-image.ptc`.
