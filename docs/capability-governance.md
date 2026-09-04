# Capability Governance (P0.1 framework)

**Status:** design baseline 2026-09-04  
**Phase:** [plan/P0.1-state-governance.md](../plan/P0.1-state-governance.md)  
**ADR (planned):** 0007

## Principle

**Deny by default.** Capabilities are absent unless explicitly loaded. The interpreter starts with `extensions: []`.

## Profiles (design only — not all implemented)

| Profile | Permitted purpose | Authorization |
|---------|-------------------|---------------|
| `mind-read-v1` | Safe project inspection | Automatic |
| `mind-memory-read-v1` | Vestige recall, graph, causal backfill | Automatic |
| `mind-candidate-write-v1` | Bounded candidate creation | Policy-gated |
| `reflection-v1` | Read, compute, candidate claims/procedures | No direct promotion |
| `vestige-maintenance-v1` | Consolidation, dedup, suppression | Explicit policy |
| `git-governed-write-v1` | Approved repository writes | User confirmation |
| `secrets-v1` | Sensitive credential resolution | Explicit elevated grant |
| `external-action-v1` | Remote side effects | User confirmation |

## Descriptor fields (when a capability is loaded)

Each loaded binding should declare:

- name
- profile
- effect (`read` / `write`)
- scope
- input / output schemas
- audit level
- confirmation rule
- revocability

## Implementation status

- [x] Deny-by-default baseline (`extensions: []` in bridge)
- [x] Profiles documented
- [ ] `CapabilityDescriptor` schema
- [ ] `mind-load-capability` / `mind-unload-capability` / `mind-capabilities` / `mind-execute` helpers
- [ ] ADR 0007 formal decision record
- [ ] First real capability load (Vestige / P5) follows this framework

## Related

- Trust classes — [docs/trust-classes.md](./trust-classes.md)
- Threat model — [docs/threat-model.md](./threat-model.md)
