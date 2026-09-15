# P18 — Closed-loop growth (D)

**Status:** planned  
**Depends on:** P17, [P4-reflection-protocol.md](P4-reflection-protocol.md), [adr/0013-peer-minds.md](../adr/0013-peer-minds.md)

## Goal

Reflection and results become visible stimuli and, when accepted, verified permanent updates—with **two loops** under peer minds.

## Loops

### Local D (peer role mind)

Observe role work → optional local reflect → improve role image / next candidates. **No** canonical `--save`.

### Team D (Orchestrator canonical mind)

Observe blackboard results/receipts → `(dmn-reflect-pack)` / promote-candidate → materialize if needed → inject proposals → decide → **save-on-success** on canonical image → verify → repeat.

### Index E (optional join)

Orchestrator may Vestige-ingest + `dmn-log-vestige-ref` in canonical image ([P22](P22-vestige-true-extension.md)).

## Cycle (team)

Observe → reflect → materialize blackboard → inject → promote/reject (save-on-success) → verify → repeat.

## Tasks

- [ ] Map reflection pack fields to blackboard evaluations/results.
- [ ] Rejection/defer → episodes (canonical).
- [ ] Peer local reflection does not target canonical path (bridge gate).
- [ ] Link capacity compaction ([P20-capacity-tiers.md](P20-capacity-tiers.md)).

## Exit criteria

Documented dry-run: peer result → Orchestrator reflect → (mock) canonical save; peer role-image save does not touch canonical.

## Related

- [docs/role-contracts.md](../docs/role-contracts.md)  
- [P17-async-workflow.md](P17-async-workflow.md)  
