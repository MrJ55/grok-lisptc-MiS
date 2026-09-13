# Mind duty surface (host agenda)

**Status:** live 2026-09-12; **P8–P10 ripeness 2026-09-13**  
**Runtime authority:** `mind/mind-duty.ptc` — query the image, not this file alone.  
**Constraint:** lisptc **cannot push** to Grok. Duties are computed in the image; the host **must poll** and act.

## Forms

| Form | Role |
|------|------|
| **`(mind-duty-check)`** | Full agenda + `:kinds` + high/medium counts |
| `(narrative-duty)` / `(reflection-duty)` | Section predicates |
| `(replay-duty)` / `(prospection-duty)` / `(wander-duty)` | P8 / P9 / P10 ripeness |
| `(duty-mark-discharged kind)` | Clear today's mark after host acts |
| `(mind-drive-protocol)` | Wave steps including duty discharge |

## P8–P10 ripeness (2026-09-13)

| Kind | Priority | Ripe when | Discharge |
|------|----------|-----------|-----------|
| `replay` | high | Error episodes in buffer and not marked today | `(dmn-replay-errors n)` + scene; `(duty-mark-discharged 'replay)` |
| `prospection` | high | Errors and not marked today | `(dmn-simulate-counterfactual nil)` + log; mark `prospection` |
| `prospection` | medium | Goals and no future mark today | `(dmn-simulate-future nil)` + log; mark `prospection-future` |
| `wander` | medium | Tensions and no wander record/mark today | `(dmn-wander n)` / record; mark `wander` |

Trailer prints `kinds=replay,prospection,...` when present.

## Bridge

`HOST_DUTY: high=N medium=M kinds=...` after successful eval.  
`MIS_DUTY_STRICT=1` fails on high unless form matches discharge allowlist (includes replay/simulate/wander/duty-mark).

## Host obligations

1. Bootstrap: `(mind-duty-check)`.
2. **High** duties: discharge or log observed defer — then `(duty-mark-discharged kind)`.
3. User-drive and mind-drive both poll; mind does not push.
