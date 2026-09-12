# P9 — Prospection (simulation packs)

**Status:** implemented 2026-09-12  
**Runtime:** `mind/prospection.ptc`  
**Plan:** [plan/P9-prospection.md](../plan/P9-prospection.md)

## Forms

| Form | Role |
|------|------|
| `(dmn-simulate-pack mode seed)` | Structured pack: mode, seed, scene, predicted-outcomes placeholders |
| `(dmn-simulate-future seed\|nil)` | Mode `future`; default seed = active goals + arc |
| `(dmn-simulate-counterfactual seed\|nil)` | Mode `counterfactual`; default = newest error episode + scene |
| `(dmn-simulate-other-mind seed)` | Mode `other-mind` |
| `(dmn-log-simulation mode seed-summary outcomes schema-delta confidence)` | Store completed sim in `*simulation-results*` |
| `(dmn-simulation-results n)` | Read recent sims |
| `(dmn-counterfactual-curriculum failure-id)` | Host protocol after failure (backfill + OSS texture + sim + reflect) |
| `(dmn-active-goals)` | Schema `:active-goals` |
| `(audit-simulation-leak)` | Non-simulated rows in `*simulation-results*` |

## Result shape

Every pack and logged result carries:

- `:reality-status simulated`
- `:trust-class candidate`
- `:must-not` includes `eval-predicted-outcomes-as-lisp`, `auto-execute-predicted-actions`, `merge-into-observed-history`
- `:as-of` timestamp

## Host rules

1. Grok fills `:predicted-outcomes` / deltas in natural language or symbols — **never** `(eval ...)` them.
2. Optional Vestige `(mind-backfill-cause id)` and OSS pure-DMN texture (`:imagined`) before insight.
3. Promote insights only via `(dmn-apply-reflection ...)` or `(promote-candidate ...)`.
4. Scenes from P8 are valid seeds.

## Example

```text
(dmn-simulate-future nil)
(dmn-simulate-counterfactual nil)
(dmn-log-simulation 'future "goals..." '(outcome-a outcome-b) '((k . v)) 'medium)
(dmn-counterfactual-curriculum 'p8-error-fixture)
```
