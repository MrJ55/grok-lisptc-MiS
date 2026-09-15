# Blackboard architecture (multi-agent layer)

Shared asynchronous coordination for **peer MiS instances** (Model B). Canonical Lisp identity remains sole-mutator (Orchestrator). See [adr/0013-peer-minds.md](../adr/0013-peer-minds.md).

## Layers

| Layer | Location | Authority |
|-------|----------|-----------|
| Canonical mind | warm canonical image | **Sole** mutator of permanent identity (Orchestrator) |
| Role minds | warm `mind/roles/<role>.ptc` (convention) | Each peer mutates **only** its role image |
| Blackboard | `artifacts/blackboard/` | Shared candidate + coordination state (not identity) |
| Bridge | **every** live sandbox | Detect, queue, ngrok client, schema-gated writes |
| Injection | ngrok → [comet-mcp](https://github.com/MrJ55/comet-mcp) → CDP | Delivery only |
| Vestige | HTTP MCP via bridge | Substrate; peers **read-only** by default ([vestige-as-extension.md](vestige-as-extension.md)) |

## Uniform instance

Every Grok tab:

```
hot /tmp/mis  +  role (and optional canonical read) image
      ↓
local mind authorizes
      ↓
local bridge I/O  →  artifacts/blackboard  and/or Vestige adapter  and/or ngrok inject
```

Same codebase; config selects `role`, images, `vestigeProfile`, `queueName`.

## Injection pipeline (only path)

```
local mind authorizes
  → sandbox bridge (write envelope / enqueue)
  → ngrok
  → comet-mcp (local PC)
  → CDP
  → target Grok tab composer (wake notice only)
```

comet-mcp has **no** access to artifacts. Detection and context materialization live in the sandbox bridge.

## Blackboard layout

```
artifacts/blackboard/
├── state/           # busy leases, high-water, metrics
├── tasks/           # open work (context packets)
├── claims/          # atomic job claims
├── results/         # completed envelopes
├── receipts/        # seen / finished / failed
├── queues/          # per-role injection queues
│   ├── orchestrator/
│   ├── generator-a/
│   └── ...
└── archive/         # compacted history
```

## Async principles

- No polling inside chat windows.
- Wake via Comet heartbeat / injection or user activation.
- File create / atomic claim = event.
- Per-role queues + busy leases prevent races.
- Any live sandbox may detect a write and request inject for another target.
- **Mind authorizes; bridge writes** — including Orchestrator dispense and peer results.

## Safety

- Blackboard never becomes the executable identity image.
- Canonical changes: validate → eval → save-only-on-success ([plan/P0-safety.md](../plan/P0-safety.md)).
- Reality-status / promote-candidate unchanged ([plan/P3-self-schema.md](../plan/P3-self-schema.md)).
- Bridge does not evaluate Lisp or mutate identity; it gates save paths by role.
- Vestige recall is data-only ([vestige-injection-policy.md](vestige-injection-policy.md)).

## Related

- [blackboard-schema.md](blackboard-schema.md) v0.2  
- [bridge-contract.md](bridge-contract.md)  
- [role-contracts.md](role-contracts.md)  
- [adr/0008-artifacts-blackboard.md](../adr/0008-artifacts-blackboard.md)  
- [plan/P13-blackboard-overview.md](../plan/P13-blackboard-overview.md)  
- [plan/P17-async-workflow.md](../plan/P17-async-workflow.md)  
