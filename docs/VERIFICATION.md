# Verification — P0–P2 / post P0.1+P1 (2026-09-04)

Runtime: `/tmp/mis` after `bash scripts/bootstrap.sh`.
Executable suite: `bash scripts/smoke-test.sh` (+ crash/malicious tests).

## Summary

| Area | Result |
|------|--------|
| Bootstrap + verify-upstream | PASS |
| Core helpers & defs | PASS |
| P0 validate-before-eval | PASS |
| P0 save-only-on-success | PASS |
| P0 form-by-form + LKG | PASS (`test-crash-recovery`, `test-malicious-ptc`) |
| P1 upstream arith / half 8 | PASS (`4.0`) |
| P2 state summary / register | PASS |

## Function results (current image helpers v0.4)

| Form | Result |
|------|--------|
| `(mis-version)` | `"mis-helpers-0.4"` |
| `(mis-ping)` | `pong` |
| `(square 5)` | `25` |
| `(half 8)` | `4.0` |
| `(audit-reality-status)` | `nil` |
| `(promote-candidate 'x)` | host-mediated plist |

## Reproduce

```bash
bash scripts/verify-upstream.sh
bash scripts/bootstrap.sh
bash scripts/smoke-test.sh
bash scripts/test-crash-recovery.sh
bash scripts/test-malicious-ptc.sh
```
