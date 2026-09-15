# Architecture — grok-lisptc-MiS

Deterministic **lisptc** transcript image(s) + **Grok host(s)** + pure-DMN OSS/Chorus + Vestige long-term **substrate** + (branch `blackboard`) multi-agent **peer minds** on a shared artifacts blackboard.

## Layers

```
human goals
    ↓
Grok host tab(s) — Orchestrator and/or peer roles (Model B)
    ↓
local mind authorizes (duty, claim, result, recall, dispense)
    ↓
bridge/  (eval.ts, vestige-adapter.ts, future blackboard watcher)
    ├── validate / load image / eval / HOST_DUTY / optional --save
    ├── Vestige HTTP MCP (ranked episodic mass; not identity)
    ├── artifacts/blackboard/  (tasks, claims, results, queues — coordination)
    └── ngrok → comet-mcp → CDP  (wake inject only; planned)
    ↓
mind image(s)
    ├── canonical mind-image.ptc     ← Orchestrator sole mutator
    └── role minds (e.g. mind/roles/<role>.ptc)  ← peer local growth
```

**Host owns:** when to discharge duties, what to `--save`, managerial promote decisions.  
**Mind owns the agenda:** `(mind-duty-check)` and related forms; bridge surfaces `HOST_DUTY`. See [mind-duty.md](./mind-duty.md).

**Runtime authority is the mind** (per instance). Docs and wiki are archive/navigation, not a second cabinet.

### Peer minds (ADR 0013)

| Concern | Rule |
|---------|------|
| Stack | Same MiS + bridge codebase every tab |
| Canonical identity | Orchestrator `--save` only |
| Role competence | Peer may save **role** image only |
| I/O | Mind authorizes → bridge writes (blackboard, Vestige, inject) |
| Vestige | Peers **read-only** by default; Orchestrator ingest + canonical compact refs |

Details: [role-contracts.md](./role-contracts.md) · [blackboard-architecture.md](./blackboard-architecture.md) · [adr/0013-peer-minds.md](../adr/0013-peer-minds.md)

### Vestige (extension, not cabinet)

Long-term store the transcript **indexes into** via compact refs. Never identity; never eval recall as Lisp. Degraded if disconnected. [vestige-as-extension.md](./vestige-as-extension.md) · [plan/P5-vector-cabinet.md](../plan/P5-vector-cabinet.md) · [plan/P22-vestige-true-extension.md](../plan/P22-vestige-true-extension.md)

## Trust

Untrusted text (OSS, Vestige recall, other roles’ free text, raw web) is **never** evaluated as Lisp. See [trust-classes.md](./trust-classes.md).

## Related

- [session-handoff.md](./session-handoff.md)
- [mind-api.md](./mind-api.md)
- [bridge-contract.md](./bridge-contract.md)
- [dmn-runtime-vs-archive.md](./dmn-runtime-vs-archive.md)
- [plan/README.md](../plan/README.md)
