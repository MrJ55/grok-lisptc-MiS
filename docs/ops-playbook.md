# Ops playbook

```bash
bash scripts/verify-upstream.sh   # hash-check (auto-heal incomplete vendor)
bash scripts/bootstrap.sh         # assemble /tmp/mis + mini-smoke
cd /tmp/mis
node --experimental-transform-types --no-warnings bridge/eval.ts [flags] '<forms>'
# flags: --save --checkpoint --scratch --image PATH --reset --strict-load
# exit 0 ok | 1 usage | 2 validation/eval failure
```

## Failure log (ephemeral)

`mind/mind-failures.log` records validation and eval failures (timestamp + form).
It is **local/ephemeral**:

- Matched by `*.log` in `.gitignore` — do **not** commit it.
- Safe to delete at any time; the bridge recreates it on the next failure.
- For durable audit of successful mutations, use `state/audit/mutations.jsonl` (P0.1).

## Safety defaults (P0)

- Never `--save` after a failed eval (bridge enforces).
- Atomic append: temp file + `renameSync`.
- Form-by-form image load; `--strict-load` makes any form failure fatal.
- `--save` always refreshes `state/checkpoints/last-known-good.ptc` first.
- Prevalidate rejects multi-word prose and OSS-shaped openings; allows bare atoms (`:keyword`, `<=`, `string->symbol`).

## Tests

```bash
bash scripts/smoke-test.sh
bash scripts/test-crash-recovery.sh
bash scripts/test-malicious-ptc.sh
```

See `docs/VERIFICATION.md` after behavioural changes. Push `mind/mind-image.ptc` only after meaningful permanent defs.
