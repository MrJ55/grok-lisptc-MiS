# Bridge Contract — sandbox ↔ comet-mcp

The sandbox bridge is present in **every** live Grok tab sandbox that participates in multi-agent coordination.

## Responsibilities

1. Detect new or changed files under `artifacts/blackboard/` (scan on duty boundary or lightweight watcher).
2. Maintain high-water marks per channel.
3. Enqueue injection-requests into the correct per-role queue under `queues/<target>/`.
4. Respect busy-leases before requesting injection.
5. Call the ngrok → [comet-mcp](https://github.com/MrJ55/comet-mcp) endpoint with the head of the target queue (or a small batch).
6. Record delivery receipts when comet-mcp acknowledges.
7. Never evaluate Lisp or mutate the permanent mind image.

## Purity (same as Vestige)

- No `fetch` / sockets inside lisptc eval ([adr/0009-injection-pipeline.md](../adr/0009-injection-pipeline.md)).
- TypeScript bridge owns HTTP; extends existing [bridge/](../bridge/) without replacing `eval.ts` / `oss.ts` / `vestige-adapter.ts`.

## Detection model

Chat windows cannot poll. Recommended v1: duty-boundary scan + explicit host-mediated notify form implemented in the TypeScript eval host, not inside pure Lisp.

## Per-target queues (race control)

```
artifacts/blackboard/queues/
  orchestrator/
  generator-a/
  generator-b/
  analyst/
  critic/
  mutator/
```

- FIFO by filename timestamp or sequence.
- Heartbeat injects **one** head item per target per tick unless force.
- Dedup: same `id` not injected twice without new receipt cycle.

## Busy check

Before inject: read `state/busy/<target>.json` if present; if `until` > now → skip inject, keep queue. Agent sets busy at claim; clears on result+receipt.

## Failure modes

- Target busy → leave item in queue, retry later.
- ngrok / comet-mcp unreachable → log, keep queue intact, surface duty to host.
- Duplicate detection → idempotent by injection-request id.

## Bootstrap

Every participating sandbox starts the bridge as part of standard bootstrap (alongside MiS restore).

## Related

- [docs/blackboard-schema.md](blackboard-schema.md)
- [adr/0011-per-sandbox-bridge.md](../adr/0011-per-sandbox-bridge.md)
- [plan/P14-bridge-watcher.md](../plan/P14-bridge-watcher.md)
