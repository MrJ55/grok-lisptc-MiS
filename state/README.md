# state/ — runtime trust artifacts (P0.1)

This directory holds **derived / audit** material, not the symbolic mind itself.

| Path | Role |
|------|------|
| `manifest.json` | Current state manifest (schema version, image hash, last mutation ID, LKG ref) — rewritten atomically on every successful `--save` |
| `checkpoints/last-known-good.ptc` | Copy of the durable image taken immediately before each successful `--save` |
| `audit/mutations.jsonl` | Append-only mutation journal (actor, hashes, timestamps, rollback target) |
| `audit/operations.jsonl` | (schema reserved) capability operation events — populated when first capability is loaded (P5+) |

Created automatically by `bridge/eval.ts` on first `--save`. Safe to gitignore local contents if desired; the schema is documented in [plan/P0.1-state-governance.md](../plan/P0.1-state-governance.md).

## manifest.json shape (v0.1.0)

```json
{
  "schema_version": "0.1.0",
  "gmod_schema": "0.1.0",
  "capability_profile": "mind-sandbox-v1",
  "image_path": ".../mind/mind-image.ptc",
  "image_sha256": "<full>",
  "image_short_hash": "<16 hex>",
  "previous_short_hash": "<16 hex>",
  "last_mutation_id": "mut-<uuid>",
  "last_known_good": ".../state/checkpoints/last-known-good.ptc",
  "updated_at": "ISO-8601"
}
```
