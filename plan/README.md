# Plan — grok-lisptc-MiS

P0–P2 complete as of 2026-08-31.

---

## v0 / P0 / P1 — done

See earlier commits and docs.

## P2 — Mind API & ops (**done 2026-08-31**)

| Task | Status |
|------|--------|
| `mis-state-summary` / `mis-register` / `*mis-known*` | Done — helpers 0.2 |
| Optional GitHub push | Done — `scripts/push-mind-image.sh` + Grok GitHub tool |
| Scratch vs main | Done — `--scratch`, `mind-scratch.ptc` |
| Docs | `docs/mind-api.md` |

## P3 — Cabinet (optional next)

Vector / Vestige-style store; replace-not-accumulate; never eval raw memory text.

## Invariants

1. EvalException → keep defs, no reset
2. Image grows only from successful evals
3. Invalid input never reaches `run()`
4. Grok is sole host
5. User-facing answers in plain language

```bash
bash scripts/bootstrap.sh
cd /tmp/mis
node --experimental-transform-types --no-warnings bridge/eval.ts '(mis-state-summary)'
```
