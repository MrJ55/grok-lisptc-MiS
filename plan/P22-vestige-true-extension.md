# P22 — Vestige as true extension (E)

**Status:** planned  
**Depends on:** [P5-vector-cabinet.md](P5-vector-cabinet.md), [adr/0012-vestige-true-extension.md](../adr/0012-vestige-true-extension.md), [adr/0013-peer-minds.md](../adr/0013-peer-minds.md)  
**Doc:** [docs/vestige-as-extension.md](../docs/vestige-as-extension.md)

## Goal

Vestige is the long-term **store** the transcript **indexes into**. Each local mind is the only authoritative surface that instance talks to. Not a second cabinet—for Orchestrator **or** peers.

P5 = substrate + safety. P22 = discipline + index completeness + **peer-mind profiles**.

---

## Peer-mind rules (Model B)

| Actor | Vestige profile (default) | Path |
|-------|---------------------------|------|
| Orchestrator | `read+ingest` | mind → bridge → adapter; compact ref in **canonical** image |
| Peer | **`read` only** | mind → bridge → adapter; optional compact ref in **role** image only |
| Peer ingest | Not default | Time-bounded grant **or** propose text on blackboard; Orchestrator ingests |

- No peer “Vestige notebook” as autobiography.  
- No raw MCP UI replacing `(mind-duty-check)`.  
- If Vestige disconnected (current ops note): degraded mode; minds still boot; do not claim fresh durable search.

---

## Objectives

1. **Index completeness** — Durable episodes that matter get Vestige id **and** in-image compact ref (canonical or role-local as appropriate), or explicit defer in mind.
2. **Host/peer protocol** — Long-term recall is mind-mediated for every instance.
3. **No parallel identity** — Autobiography / schema / high duties stay in canonical image; Vestige is not wiki-of-self.
4. **Blackboard** — Envelopes may carry `vestige-ids`; promotions still Orchestrator-only.
5. **Metrics (P21 optional)** — Fraction of recalls/changes with mind-side refs vs orphans.

---

## Checklist

- [ ] [docs/session-handoff.md](../docs/session-handoff.md): mind indexes Vestige; no dual-file identity; peer read-only default.
- [ ] Audit `scripts/vestige-mind.ts` / smoke for paths that skip compact-ref logging.
- [ ] [docs/architecture.md](../docs/architecture.md): index vs substrate + peer profile one-liner.
- [ ] Orphan policy: Vestige-only content without ref → index duty or non-authoritative bulk.
- [ ] Bridge `vestigeProfile` enforced per role ([bridge-contract.md](../docs/bridge-contract.md)).
- [ ] Optional: post-ingest `(dmn-log-vestige-ref …)` checklist for Orchestrator; role-local variant for peers on read-activated items.
- [ ] Compaction: prefer refs over full text ([vestige-buffer-compaction.md](../docs/vestige-buffer-compaction.md)).
- [ ] Cross-link [P20-capacity-tiers.md](P20-capacity-tiers.md).
- [ ] Verification: degraded boot; identity from schema/chapters without Vestige; peer ingest attempt rejected without grant.

---

## Explicit non-goals

- Replacing schema/autobiography with vectors.  
- Auto-promotion of retrieved text into any mind image.  
- Bulk legacy migration (optional).  
- Vestige as orchestrator or sole project store.  
- Peer write access as default.

---

## Exit criteria

| Criterion | Measure |
|-----------|---------|
| Authority | Docs state mind as sole identity surface per instance; canonical sole mutator |
| Index path | Ingest → compact ref default for Orchestrator |
| Peer safety | Read-only profile default; no peer canonical/Vestige identity split |
| No second cabinet | No workflow that files “who we are” only in Vestige |
| Degraded | Boot + honest disclosure without Vestige |

## Related

- [P5-vector-cabinet.md](P5-vector-cabinet.md)  
- [P17-async-workflow.md](P17-async-workflow.md)  
- [P20-capacity-tiers.md](P20-capacity-tiers.md)  
- [P21-measurement.md](P21-measurement.md)  
- https://github.com/samvallad33/vestige (MCP only; never link)  
