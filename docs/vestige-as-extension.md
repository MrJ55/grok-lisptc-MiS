# Vestige as true extension (not a second cabinet)

**Intent:** Vestige is the long-term memory **store**; each lisptc transcript **indexes** into it; the **local mind is the only authoritative surface** that instance talks to for identity, agenda, and growth.

Under [adr/0013-peer-minds.md](../adr/0013-peer-minds.md), every Grok tab is a MiS instance. Vestige rules must hold for **Orchestrator and peers**.

## Authority model

```
human / host chat (per tab)
      ↓
  local mind (canonical or role image)
      │
      ├── schema / role bias, duties, compact episodic refs
      │
      └── host-mediated ops → bridge → Vestige HTTP MCP
                │
                └── ranked full-text episodes, causal tools (substrate)
```

| Surface | Holds | Treat as |
|---------|--------|----------|
| Canonical mind | Team identity, autobiography, global duties | **Authoritative (Orchestrator writes)** |
| Role mind | Peer competence, local episodes | **Authoritative for that role only** |
| Vestige | Full episodic mass, FSRS, backfill | **Substrate only** |
| Blackboard | Tasks/results candidates | Coordination, not identity |
| Wiki / GitHub | Decision archive | Archive, not runtime identity |

## Profiles

| Actor | Default Vestige profile |
|-------|-------------------------|
| Orchestrator | `read+ingest` → compact ref in **canonical** image |
| Peer | **`read` only** → optional compact ref in **role** image |
| Peer ingest | Grant or blackboard propose → Orchestrator ingests |

## Practice

1. **Ingest** — Orchestrator: ingest then `(dmn-log-vestige-ref …)` in canonical image ([vestige-buffer-compaction.md](vestige-buffer-compaction.md)).  
2. **Recall** — Always mind → bridge → adapter; data only; never eval bodies as Lisp.  
3. **Promotion** — Never auto-save Vestige text into any image; P0 gates.  
4. **Degraded** — Vestige down/disconnected: minds boot; disclose stale search; compact refs still useful.  
5. **Blackboard** — Envelopes may list `vestige-ids`; Orchestrator sole canonical mutator.

## Anti-patterns

- Filing “who we are” in Vestige.  
- Peer or host using raw Vestige as parallel notebook.  
- Peer ingest without grant.  
- Claiming durable memory is “in Vestige” with no mind-side ref.  
- Eval of recall as Lisp.

## Implementation surface

| Piece | Role |
|-------|------|
| `bridge/vestige-adapter.ts` | Typed HTTP MCP |
| `mind/vestige-ops.ptc` | Host-mediated contract |
| `dmn-log-vestige-ref` | Index row |
| Bridge `vestigeProfile` | Enforce read vs ingest per role |
| P22 checklist | Close dual-cabinet gaps |

## Related

- [adr/0012-vestige-true-extension.md](../adr/0012-vestige-true-extension.md)  
- [plan/P22-vestige-true-extension.md](../plan/P22-vestige-true-extension.md)  
- [role-contracts.md](role-contracts.md)  
- [vestige-injection-policy.md](vestige-injection-policy.md)  
