# P13 — Blackboard layer overview

**Status:** planned  
**Last updated:** 2026-09-15 (peer minds Model B locked — ADR 0013)

Multi-agent blackboard on MiS P0–P12 + peer minds. Preserves: pure mind, validate-before-eval, save-only-on-success, **sole canonical mutator** (Orchestrator), uniform stack for all Grok tabs.

## Phase map

| Phase | File | Status | One-line |
|-------|------|--------|----------|
| P13 | this file | planned | Overview + entry |
| P13.0 | [P13.0-blackboard-cold-start.md](P13.0-blackboard-cold-start.md) | planned | Layout + bridge stub |
| P13.1 | [P13.1-blackboard-schema.md](P13.1-blackboard-schema.md) | planned | Envelope schema v0.2 |
| P14 | [P14-bridge-watcher.md](P14-bridge-watcher.md) | planned | Detector + queues + ngrok + save gates |
| P15 | [P15-injection-path.md](P15-injection-path.md) | planned | mind→bridge→ngrok→comet-mcp→CDP |
| P16 | [P16-role-contracts.md](P16-role-contracts.md) | planned | Peer minds + Orchestrator |
| P17 | [P17-async-workflow.md](P17-async-workflow.md) | planned | Authorize→materialize→claim→result |
| P18 | [P18-closed-loop-D.md](P18-closed-loop-D.md) | planned | Local D + team D |
| P19 | [P19-soft-autonomy-F.md](P19-soft-autonomy-F.md) | planned | Proposals + host gate |
| P20 | [P20-capacity-tiers.md](P20-capacity-tiers.md) | planned | Hot/warm/cold |
| P21 | [P21-measurement.md](P21-measurement.md) | planned | Experience-shift metrics |
| P22 | [P22-vestige-true-extension.md](P22-vestige-true-extension.md) | planned | Vestige index + peer read-only |

## Locked design decisions

- **Model B peer minds** — [adr/0013-peer-minds.md](../adr/0013-peer-minds.md)  
- Mind authorizes; bridge writes (symmetry with Vestige)  
- Context packet on tasks (schema v0.2)  
- Coarse job claims for Grok peers  
- Peers: Vestige read-only default; role-image permanence; no canonical save  

## Docs

- [docs/blackboard-architecture.md](../docs/blackboard-architecture.md)  
- [docs/blackboard-schema.md](../docs/blackboard-schema.md)  
- [docs/bridge-contract.md](../docs/bridge-contract.md)  
- [docs/role-contracts.md](../docs/role-contracts.md)  
- ADRs [0008](../adr/0008-artifacts-blackboard.md)–[0013](../adr/0013-peer-minds.md)  

## External

- https://github.com/MrJ55/comet-mcp  
