# Mind API (helpers)

Helpers live in `mind/mind-image.ptc` (and `mind/helpers.ptc` as source of truth for the helper block).

| Form | Purpose |
|------|---------|
| `(mis-version)` | Helper version string (`"mis-helpers-0.2"`) |
| `(mis-ping)` | Health → `pong` |
| `(mis-note msg)` | Echo / placeholder note |
| `(mis-register 'sym)` | Add symbol to `*mis-known*` |
| `(mis-state-summary)` | `( (version …) (ping …) (known …) )` |

**Convention:** after `(defun foo …)`, call `(mis-register 'foo)` before `--save` so the summary stays accurate.

## Images

| Image | Flag / env | Role |
|-------|------------|------|
| `mind/mind-image.ptc` | default, `--load` / `--image` | Permanent mind |
| `mind/mind-scratch.ptc` | `--scratch` | Experiments; not permanent |

## Push

```bash
bash scripts/push-mind-image.sh
```

Scratch should NOT be pushed as the permanent mind.
