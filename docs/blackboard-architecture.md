# Blackboard architecture (multi-agent layer)

This document extends MiS with a shared, asynchronous multi-agent coordination layer. The permanent Lisp mind remains the sole mutator of identity.

## Layers

| Layer | Location | Authority |
|-------|----------|-----------|
| Mind (lisptc) | warm image in `artifacts` / this repo | Sole mutator of permanent identity |
| Blackboard | `artifacts/blackboard/` | Shared candidate + coordination state |
| Bridge | every live sandbox | Detection, queuing, ngrok client |
| Injection | ngrok → [comet-mcp](https://github.com/MrJ55/comet-mcp) → CDP | Delivery only |
| Host / Orchestrator | primary Comet Grok tab | Constitutional decisions, promotions |
| Role agents | other tabs (own hot `/tmp/mis`) | Specialized contributions |

## Injection pipeline (only path)

```
MiS / role host
  → sandbox bridge (detect / enqueue)
  → ngrok
  → comet-mcp (local PC)
  → CDP
  → target Grok tab composer
```

comet-mcp has **no** access to artifacts. The sandbox bridge is the sensor and translator.

## Blackboard layout (target)

```
artifacts/blackboard/
├── state/           # goals, metrics, high-water marks, busy leases
├── tasks/           # open work items
├── claims/          # atomic claims
├── results/         # completed envelopes
├── receipts/        # seen / finished
├── queues/          # per-role injection queues
│   ├── orchestrator/
│   ├── generator-a/
│   └── ...
└── archive/         # compacted history
```

## Async principles

- No polling inside chat windows.
- Wake-up via Comet heartbeat / injection or user activation.
- File create / atomic claim = event.
- Per-role queues + busy leases prevent races across multi-stage workflows.
- Any live sandbox can detect a write and request an injection (bridge present everywhere).

## Safety

- Blackboard never becomes the executable image.
- Permanent changes still require MiS validate → eval → save-only-on-success ([plan/P0-safety.md](../plan/P0-safety.md)).
- Reality-status and promote-candidate discipline unchanged ([plan/P3-self-schema.md](../plan/P3-self-schema.md)).
- Bridge is I/O only; it does not evaluate Lisp or mutate identity.

## Related

- [docs/blackboard-schema.md](blackboard-schema.md)
- [docs/bridge-contract.md](bridge-contract.md)
- [docs/role-contracts.md](role-contracts.md)
- [adr/0008-artifacts-blackboard.md](../adr/0008-artifacts-blackboard.md)
- [plan/P13-blackboard-overview.md](../plan/P13-blackboard-overview.md)
