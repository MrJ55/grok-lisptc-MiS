# Wiki — grok-lisptc-MiS

Mind-in-Sandbox: deterministic lisptc transcript + Grok host + optional pure-DMN OSS channel + Vestige long-term memory substrate (P5) + **multi-agent peer minds** (blackboard branch).

## Start here

* [README.md](README.md)
* [docs/session-handoff.md](docs/session-handoff.md)
* [plan/README.md](plan/README.md)
* [docs/mind-duty.md](docs/mind-duty.md) — host agenda `(mind-duty-check)`

## Blackboard / peer minds (branch `blackboard`)

* **ADR:** [adr/0013-peer-minds.md](adr/0013-peer-minds.md) — Model B; team members + sole canonical mutator
* **Overview:** [plan/P13-blackboard-overview.md](plan/P13-blackboard-overview.md)
* **Architecture:** [docs/blackboard-architecture.md](docs/blackboard-architecture.md)
* **Schema v0.2:** [docs/blackboard-schema.md](docs/blackboard-schema.md) — context packets, author lineage
* **Roles:** [docs/role-contracts.md](docs/role-contracts.md)
* **Bridge:** [docs/bridge-contract.md](docs/bridge-contract.md)
* **Workflow:** [plan/P17-async-workflow.md](plan/P17-async-workflow.md)
* **Vestige extension:** [docs/vestige-as-extension.md](docs/vestige-as-extension.md) · [plan/P22-vestige-true-extension.md](plan/P22-vestige-true-extension.md)
* Injector: https://github.com/MrJ55/comet-mcp

**Invariant:** local mind authorizes → local bridge I/O; peers do not save canonical identity; Vestige is substrate (peers read-only by default).

## P10 wander (implemented 2026-09-13)

* [docs/p10-wander.md](docs/p10-wander.md) — in-session only; Midnight Note + Page Passer skipped
* Module: `mind/wander.ptc` — `(dmn-wander)` `(dmn-wander-record)` `(dmn-monologue)`

## P9 prospection (implemented 2026-09-12)

* [docs/p9-prospection.md](docs/p9-prospection.md)
* Module: `mind/prospection.ptc`

## P8 scenes (implemented 2026-09-12)

* [docs/p8-scenes.md](docs/p8-scenes.md)
* Module: `mind/scenes.ptc`

## Host duty / Vestige / P12

* [docs/mind-duty.md](docs/mind-duty.md) · `(vestige-host-contract)` · `(dmn-chorus-protocol)`

## Phase plan

See [plan/README.md](plan/README.md). **P8+P9+P10 implemented.** Blackboard P13–P22 + peer minds planned on branch `blackboard`.
