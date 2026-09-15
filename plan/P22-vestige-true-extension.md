# P22 — Vestige as true extension (E)

**Status:** planned  
**Depends on:** [P5-vector-cabinet.md](P5-vector-cabinet.md) (substantially complete substrate)  
**ADR:** [adr/0012-vestige-true-extension.md](../adr/0012-vestige-true-extension.md)  
**Doc:** [docs/vestige-as-extension.md](../docs/vestige-as-extension.md)

## Goal

Make Vestige the **long-term store the transcript indexes into**, with the **mind remaining the only authoritative surface** the host talks to—not a second filing cabinet beside the image.

P5 delivered substrate + safety (HTTP MCP, profiles, degraded mode, no eval). P22 delivers **product discipline and index completeness** so host workflow cannot split identity across two stores.

## Objectives

1. **Index completeness** — New durable episodes that matter for continuity get a Vestige id **and** an in-image compact ref (or explicit defer logged in mind).
2. **Host protocol** — Session handoff and duty surface state that long-term recall is mind-mediated; raw Vestige is not the narrative authority.
3. **No parallel identity** — Autobiography / schema / high duties stay in-image; Vestige is not used as wiki-of-self.
4. **Operational metrics (optional with P21)** — Fraction of permanent changes and recalls that have mind-side refs vs orphan Vestige-only content.
5. **Blackboard alignment** — Role envelopes may carry `:vestige-id`; promotions still Orchestrator/mind only.

## Checklist

- [ ] Update [docs/session-handoff.md](../docs/session-handoff.md) with “mind indexes Vestige; host does not dual-file identity.”
- [ ] Audit host scripts (`scripts/vestige-mind.ts`, smoke) for paths that skip compact-ref logging; close gaps or document required host step.
- [ ] Clarify in [docs/architecture.md](../docs/architecture.md) the index vs substrate one-liner (link to vestige-as-extension).
- [ ] Define “orphan” policy: content only in Vestige without ref → either index duty or accept as non-authoritative bulk.
- [ ] Optional: mind form or host checklist for post-ingest `(dmn-log-vestige-ref …)`.
- [ ] Optional: compaction duty when buffer grows—prefer refs over full text ([vestige-buffer-compaction.md](../docs/vestige-buffer-compaction.md)).
- [ ] Cross-link P20 capacity tiers: cold/warm episodic mass in Vestige; hot image stays lean.
- [ ] Verification note: degraded mode still boots; identity answers still come from schema/chapters without requiring Vestige.

## Explicit non-goals

- Replacing `*self-schema*` or autobiography with vectors (unchanged from P5).
- Auto-promotion of retrieved text into `mind-image.ptc`.
- Bulk migration of all legacy fat episodes (still optional).
- Making Vestige the orchestrator or sole durable store for the project.

## Exit criteria

| Criterion | Measure |
|-----------|---------|
| Authority | Host docs + handoff state mind as sole identity surface |
| Index path | Ingest → compact ref is default documented path |
| No second cabinet | No recommended workflow that files identity only in Vestige |
| Safety | P5 injection policy + degraded mode still hold |
| Capacity | Image stays index-heavy; mass stays in Vestige (align P20) |

## Related

- [plan/P5-vector-cabinet.md](P5-vector-cabinet.md)
- [plan/P20-capacity-tiers.md](P20-capacity-tiers.md)
- [plan/P21-measurement.md](P21-measurement.md)
- External: https://github.com/samvallad33/vestige (MCP only; never link)
