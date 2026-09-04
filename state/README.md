# state/ — runtime trust artifacts (P0.1)

This directory holds **derived / audit** material, not the symbolic mind itself.

| Path | Role |
|------|------|
| `checkpoints/last-known-good.ptc` | Copy of the durable image taken immediately before each successful `--save` |
| `audit/mutations.jsonl` | Append-only mutation journal (actor, hashes, timestamps) |

Created automatically by `bridge/eval.ts` on first `--save`. Safe to gitignore local contents if desired; the schema is documented in [plan/P0.1-state-governance.md](../plan/P0.1-state-governance.md).
