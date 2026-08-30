# Ops playbook (short)

## New session

1. Read WIKI.md + session-handoff.md.
2. `bash scripts/bootstrap.sh` (or manual steps in bootstrap.md).
3. Smoke: `(mis-ping)` and any known user functions.
4. Proceed with goal; use `--save` for permanent definitions.

## After useful definitions

```bash
cd /tmp/mis
node --experimental-transform-types --no-warnings bridge/eval.ts --save '(defun …)'
# then commit + push mind/mind-image.ptc from the repo clone
```

## Failure modes

| Symptom | Action |
|---------|--------|
| `Cannot find package 'zod'` | Re-run bootstrap; ensure `node_modules` sits under `/tmp/mis` |
| Image load prints errors | Inspect `mind/mind-image.ptc` for bad forms; edit or `--reset` |
| OOM / install hangs | Do **not** full monorepo install; stay on stripped path |
| Process dies between turns | Expected; image is the source of truth |

## Git hygiene

- Never commit API keys or `.env`.
- Prefer small commits of `mind/mind-image.ptc` + docs/learnings-log.md.
