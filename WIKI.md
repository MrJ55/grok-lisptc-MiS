# Wiki — grok-lisptc-MiS

Mind-in-Sandbox: deterministic lisptc transcript + Grok host + optional pure-DMN OSS channel + Vestige long-term memory substrate (P5).

## Start here

* [README.md](README.md)
* [docs/session-handoff.md](docs/session-handoff.md)
* [plan/README.md](plan/README.md)
* [docs/CUSTOM_INSTRUCTIONS.md](docs/CUSTOM_INSTRUCTIONS.md)
* [docs/mind-duty.md](docs/mind-duty.md) — **host agenda** `(mind-duty-check)`
* [docs/p8-scenes.md](docs/p8-scenes.md) — **P8** replay and scenes
* [docs/p9-prospection.md](docs/p9-prospection.md) — **P9** simulation packs

## Architecture & decisions

* [docs/architecture.md](docs/architecture.md)
* [docs/decisions-index.md](docs/decisions-index.md)
* [docs/trust-classes.md](docs/trust-classes.md)

## P9 prospection (implemented 2026-09-12)

* [docs/p9-prospection.md](docs/p9-prospection.md) — `(dmn-simulate-future)` `(dmn-simulate-counterfactual)` `(dmn-log-simulation)`
* Module: `mind/prospection.ptc` — all results `:reality-status simulated`; never auto-exec

## P8 scenes (implemented 2026-09-12)

* [docs/p8-scenes.md](docs/p8-scenes.md) — `(dmn-replay)` `(dmn-scene-from)` `(dmn-tag-episode)`
* Module: `mind/scenes.ptc`

## Host duty surface (2026-09-12)

* [docs/mind-duty.md](docs/mind-duty.md) — `(mind-duty-check)`; bridge `HOST_DUTY` trailer

## Vestige (P5 substantially complete)

* Runtime: `(vestige-host-contract)` · scripts/vestige-*

## DMN / OSS (P12 exit)

Cold-start: `(dmn-oracle-preflight)` `(dmn-chorus-protocol)` `(mind-duty-check)` `(dmn-simulate-future nil)`

## Phase plan

See [plan/README.md](plan/README.md). **P8+P9 implemented 2026-09-12.** Next: **P10** when chosen.
