# Bridge Contract — sandbox ↔ blackboard ↔ comet-mcp ↔ Vestige

The sandbox bridge is present in **every** live Grok tab that participates. Under Model B every tab is a full MiS instance ([adr/0013-peer-minds.md](../adr/0013-peer-minds.md)).

## Responsibilities

1. **Mind-gated I/O** — Perform filesystem/HTTP side effects only after host/mind authorization for this turn (same purity as Vestige adapter).
2. Detect new or changed files under `artifacts/blackboard/` (duty-boundary scan or lightweight watcher).
3. Maintain high-water marks per channel.
4. Validate envelope **required fields** (schema v0.2: `author-role`, `author-mind-id`, …) on write when acting as writer.
5. Enqueue injection-requests under `queues/<target>/`.
6. Respect busy-leases before requesting injection.
7. Call ngrok → [comet-mcp](https://github.com/MrJ55/comet-mcp) with queue head (or small batch).
8. Record delivery receipts when acknowledged.
9. **Save gate:** if configured `role != orchestrator`, reject `--save` targeting the canonical mind image path; allow role-image path only.
10. Vestige: call adapter with configured profile (`read` vs `read+ingest`); never from inside lisptc eval.
11. Never evaluate Lisp or mutate identity itself.

## Purity

- No `fetch` / sockets inside lisptc eval ([adr/0009-injection-pipeline.md](../adr/0009-injection-pipeline.md)).
- TypeScript owns HTTP; extends [bridge/](../bridge/) alongside `eval.ts`, `oss.ts`, `vestige-adapter.ts`.

## Per-instance config (required)

| Key | Purpose |
|-----|--------|
| `role` | orchestrator \| generator-a \| … |
| `author-mind-id` | Lineage stamp on envelopes |
| `canonicalImagePath` | Read-all; write only if role=orchestrator |
| `roleImagePath` | Peer read/write |
| `vestigeProfile` | `read` (default peer) \| `read+ingest` (orchestrator default) |
| `queueName` | Directory under `queues/` |
| `ngrokBaseUrl` | Env/secret; never commit |

## Detection model

Chat cannot poll. v1: duty-boundary scan + explicit host-mediated notify in the TS eval host (not pure Lisp).

## Per-target queues

```
artifacts/blackboard/queues/
  orchestrator/
  generator-a/
  generator-b/
  analyst/
  critic/
  mutator/
```

- FIFO by filename / sequence.
- Heartbeat injects one head item per target per tick unless force.
- Dedup by injection-request `id`.

## Busy check

Before inject: if `state/busy/<target>.json` has `until` > now → skip, keep queue. Peer sets busy on claim; clears on receipt finished/failed/rejected (or lease expiry policy).

## Write paths (symmetric)

| Event | Authorizing mind | Bridge action |
|-------|------------------|---------------|
| Dispense | Orchestrator | write task + enqueue target |
| Claim | Peer | write claim + busy |
| Result | Peer | write result + receipt; clear busy; optional orch queue |
| Completion notice | Peer or orch | enqueue orchestrator |
| Vestige recall | Local (peer or orch) | adapter read |
| Vestige ingest | Orchestrator (default) | adapter ingest + host logs compact ref in **canonical** image |

## Failure modes

- Target busy → leave queue, retry later.
- ngrok / comet-mcp down → log, keep queue, surface duty.
- Schema validation fail → do not write; return error to host.
- Peer canonical save attempt → hard reject.
- Duplicate inj id → idempotent skip.

## Bootstrap

Every participating sandbox: restore MiS (role + canonical read as configured) **and** start bridge with config above.

## Related

- [blackboard-schema.md](blackboard-schema.md)  
- [role-contracts.md](role-contracts.md)  
- [adr/0011-per-sandbox-bridge.md](../adr/0011-per-sandbox-bridge.md)  
- [plan/P14-bridge-watcher.md](../plan/P14-bridge-watcher.md)  
- [plan/P17-async-workflow.md](../plan/P17-async-workflow.md)  
