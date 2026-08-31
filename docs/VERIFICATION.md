# Verification — P0–P2 (2026-08-31)

Runtime: `/tmp/mis` after bootstrap. **22 scenarios; mind remained usable after every failure.**

## Summary

| Area | Result |
|------|--------|
| Bootstrap + smoke | PASS |
| Core helpers & defs | PASS |
| P0 validate-before-eval | PASS |
| P0 save-only-on-success | PASS |
| P0 no brick on errors | PASS |
| P0 checkpoint | PASS |
| P2 state summary / register | PASS |
| P2 scratch isolation | PASS |
| Fenced Lisp | PASS |
| Persistence across process | PASS |

## Function results

| Form | Result |
|------|--------|
| `(mis-version)` | `"mis-helpers-0.2"` |
| `(mis-ping)` | `pong` |
| `(square 5)` | 25 |
| `(triple 4)` | 12 |
| `(double 7)` | 14 |
| `(quadruple 5)` | 20 |
| `(half 8)` | 4.0 |
| combined list | `("mis-helpers-0.2" pong 4 9 8 20 4.0 …)` |

## Safety

| Input | exit | Image saved? | Recovered? |
|-------|------|--------------|------------|
| prose + `--save` | 2 | No | Yes |
| unbalanced + `--save` | 2 | No | Yes |
| `(triple "nope")` | 2 | No | `(triple 9)` → 27 |
| undefined + `--save` | 2 | No | Yes |
| scratch `(double 2)` | 2 | N/A | main `(double 3)` → 6 |

## Reproduce

```bash
bash scripts/bootstrap.sh
cd /tmp/mis
node --experimental-transform-types --no-warnings bridge/eval.ts \
  '(list (square 2) (triple 3) (double 4) (quadruple 5) (half 8))'
```
