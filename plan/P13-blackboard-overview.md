# P13 — Blackboard layer overview

**Status:** planned  
**Last updated:** 2026-09-15 (ported from design thread onto this branch)

Multi-agent blackboard coordination on top of MiS P0–P12. Preserves: pure mind, validate-before-eval, save-only-on-success, sole-mutator host.

## Phase map (this arc)

| Phase | File | Status | One-line |
|-------|------|--------|----------|
| P13 | this file | planned | Overview + entry |
| P13.0 | [P13.0-blackboard-cold-start.md](P13.0-blackboard-cold-start.md) | planned | Layout + bridge stub |
| P13.1 | [P13.1-blackboard-schema.md](P13.1-blackboard-schema.md) | planned | Envelope schema |
| P14 | [P14-bridge-watcher.md](P14-bridge-watcher.md) | planned | Detector + queues + ngrok |
| P15 | [P15-injection-path.md](P15-injection-path.md) | planned | MiS→bridge→ngrok→comet-mcp→CDP |
| P16 | [P16-role-contracts.md](P16-role-contracts.md) | planned | Orchestrator / Generator / … |
| P17 | [P17-async-workflow.md](P17-async-workflow.md) | planned | dispense → claim → result → receipt |
| P18 | [P18-closed-loop-D.md](P18-closed-loop-D.md) | planned | Reflection → inject → promote |
| P19 | [P19-soft-autonomy-F.md](P19-soft-autonomy-F.md) | planned | Proposals + host gate |
| P20 | [P20-capacity-tiers.md](P20-capacity-tiers.md) | planned | Hot/warm/cold + compaction |
| P21 | [P21-measurement.md](P21-measurement.md) | planned | Experience-shift metrics |

## Design sources (2026-09-14 thread)

- Ambient context / heartbeat injection
- Pure mind + bridge I/O boundary (Vestige pattern)
- Shared `artifacts` as blackboard
- Async multi-role coordination without chat polling
- Gap: comet-mcp cannot see artifacts; bridge in every sandbox; per-role queues
- Closed-loop growth (D) and soft autonomy (F)
- Tiered capacity for exponential mind growth

## Docs

- [docs/blackboard-architecture.md](../docs/blackboard-architecture.md)
- [docs/blackboard-schema.md](../docs/blackboard-schema.md)
- [docs/bridge-contract.md](../docs/bridge-contract.md)
- [docs/role-contracts.md](../docs/role-contracts.md)
- ADRs: [0008](../adr/0008-artifacts-blackboard.md)–[0011](../adr/0011-per-sandbox-bridge.md)

## External

- https://github.com/MrJ55/comet-mcp
