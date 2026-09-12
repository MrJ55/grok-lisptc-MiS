# Wiki — grok-lisptc-MiS

Mind-in-Sandbox: deterministic lisptc transcript + Grok host + optional pure-DMN OSS channel + Vestige long-term memory substrate (P5).

## Start here

* [README.md](README.md)
* [docs/session-handoff.md](docs/session-handoff.md)
* [plan/README.md](plan/README.md)
* [docs/CUSTOM_INSTRUCTIONS.md](docs/CUSTOM_INSTRUCTIONS.md)
* [docs/mind-duty.md](docs/mind-duty.md) — **host agenda** `(mind-duty-check)`
* [docs/p8-scenes.md](docs/p8-scenes.md) — **P8** replay and scenes

## Architecture & decisions

* [docs/architecture.md](docs/architecture.md)
* [docs/decisions-index.md](docs/decisions-index.md)
* [docs/trust-classes.md](docs/trust-classes.md)
* [docs/capability-governance.md](docs/capability-governance.md)
* [docs/threat-model.md](docs/threat-model.md)

## P8 scenes (implemented 2026-09-12)

* [docs/p8-scenes.md](docs/p8-scenes.md) — `(dmn-replay)` `(dmn-scene-from)` `(dmn-tag-episode)`
* Module: `mind/scenes.ptc` — simulated replay + as-of; host-mediated `(mind-recall-sequence)`

## Host duty surface (2026-09-12)

* [docs/mind-duty.md](docs/mind-duty.md) — **runtime** `(mind-duty-check)`; Lisp does not push
* Forms: `(narrative-duty)` `(reflection-duty)` `(mind-drive-protocol)` in `mind/mind-duty.ptc`
* Bridge: `HOST_DUTY` trailer after successful eval (`MIS_DUTY_STRICT=1` optional)

## Vestige (P5 substantially complete 2026-09-11)

* [plan/P5-vector-cabinet.md](plan/P5-vector-cabinet.md)
* **Runtime:** `(vestige-host-contract)` in `mind/vestige-protocol.ptc`
* Scripts: `scripts/vestige-smoke.ts`, `scripts/test-vestige-degraded.sh`, `scripts/vestige-mind.ts`

## Ops

* [docs/ops-playbook.md](docs/ops-playbook.md)
* [docs/bootstrap.md](docs/bootstrap.md)
* [docs/VERIFICATION.md](docs/VERIFICATION.md)
* [docs/UPSTREAM.md](docs/UPSTREAM.md)

## DMN / OSS (P12 — runtime is the mind)

**Cold-start forms:** `(dmn-oracle-preflight)` `(dmn-chorus-protocol)` `(dmn-endpoints)` `(mind-duty-check)` `(dmn-replay 'error 5)`  
**Map:** [docs/dmn-runtime-vs-archive.md](docs/dmn-runtime-vs-archive.md) · **Handoff:** [docs/session-handoff.md](docs/session-handoff.md)

* [plan/P12-dmn-mind-native.md](plan/P12-dmn-mind-native.md) — **exit**
* [docs/mind-api.md](docs/mind-api.md) — form index

## Phase plan

See [plan/README.md](plan/README.md). **P8 implemented 2026-09-12.** Next: P9–P10 when chosen.
