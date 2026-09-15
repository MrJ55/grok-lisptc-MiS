# Vestige as true extension (not a second cabinet)

**Intent:** Vestige is the long-term memory **store**; the lisptc transcript **indexes** into it; the **mind is the only authoritative surface** the host talks to for identity, agenda, and permanent growth.

## Authority model

```
human / host chat
      ↓
  mind (lisptc image)     ← only durable “cabinet” the host maintains
      │
      ├── schema, autobiography, duties, compact episodic refs
      │
      └── host-mediated ops → Vestige HTTP MCP
                │
                └── ranked full-text episodes, causal/contradiction tools
```

| Surface | Holds | Host may treat as |
|---------|--------|-------------------|
| Mind image | Identity, agenda, compact refs, trust | **Authoritative** |
| Vestige | Full episodic mass, FSRS rank, backfill | **Substrate only** |
| Wiki / GitHub docs | Archive of decisions | Archive, not runtime identity |

## What “extension” means in practice

1. **Ingest path** — After Vestige ingest, host records a compact ref in the image (`dmn-log-vestige-ref`), not a second prose copy ([vestige-buffer-compaction.md](vestige-buffer-compaction.md)).
2. **Recall path** — Prefer mind-facing forms / documented host CLI that returns structured data into the turn, then optional compact update in-image. Do not maintain a parallel “Vestige notebook” the host reads instead of `(mind-duty-check)` / schema.
3. **Promotion** — Nothing retrieved from Vestige auto-saves into permanent identity. Promote still uses P0 validate → eval → save-on-success and reality-status discipline.
4. **Degraded** — If Vestige is down, mind still runs; compact refs remain; host discloses degraded search ([P5](../plan/P5-vector-cabinet.md)).
5. **Blackboard** — Multi-agent coordination may reference Vestige ids in envelopes; the mind (Orchestrator) remains sole mutator of identity ([blackboard-architecture.md](blackboard-architecture.md)).

## Anti-patterns (second cabinet)

- Filing goals, autobiography, or “who we are” primarily in Vestige.
- Host answering from raw Vestige dumps without mind context/duties.
- Parallel permanent docs that bypass the image and Vestige index.
- Eval of recalled text as Lisp.
- Claiming durable memory is “in Vestige” when the image has no index/ref for it.

## Implementation surface (existing + P22)

| Piece | Role |
|-------|------|
| `bridge/vestige-adapter.ts` | Typed HTTP MCP; no link to AGPL server |
| `mind/vestige-ops.ptc` / config | Host-mediated Lisp contract |
| `dmn-log-vestige-ref` | Index row in episodic buffer |
| Injection policy | Data-only recall |
| P22 checklist | Close remaining dual-cabinet gaps |

## Related

- [adr/0012-vestige-true-extension.md](../adr/0012-vestige-true-extension.md)
- [plan/P22-vestige-true-extension.md](../plan/P22-vestige-true-extension.md)
- [plan/P5-vector-cabinet.md](../plan/P5-vector-cabinet.md)
- [vestige-injection-policy.md](vestige-injection-policy.md)
- [session-handoff.md](session-handoff.md)
