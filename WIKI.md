# Wiki — grok-lisptc-MiS

Mind-in-Sandbox: deterministic lisptc transcript + Grok host + optional pure-DMN OSS channel + Vestige long-term memory substrate (P5).

## Start here

* [README.md](README.md)
* [docs/session-handoff.md](docs/session-handoff.md)
* [plan/README.md](plan/README.md)
* [docs/CUSTOM_INSTRUCTIONS.md](docs/CUSTOM_INSTRUCTIONS.md)
* [docs/mind-duty.md](docs/mind-duty.md) — **host agenda** `(mind-duty-check)`

## Architecture & decisions

* [docs/architecture.md](docs/architecture.md)
* [docs/decisions-index.md](docs/decisions-index.md)
* [docs/trust-classes.md](docs/trust-classes.md)
* [docs/capability-governance.md](docs/capability-governance.md)
* [docs/threat-model.md](docs/threat-model.md)

## Host duty surface (2026-09-12)

* [docs/mind-duty.md](docs/mind-duty.md) — **runtime** `(mind-duty-check)`; Lisp does not push
* Forms: `(narrative-duty)` `(reflection-duty)` `(mind-drive-protocol)` in `mind/mind-duty.ptc`
* Bridge: `HOST_DUTY` trailer after successful eval (`MIS_DUTY_STRICT=1` optional)

## Vestige (P5 substantially complete 2026-09-11)

* [plan/P5-vector-cabinet.md](plan/P5-vector-cabinet.md) — **substantially complete**; accomplishments section
* **Runtime:** `(vestige-host-contract)` and section forms in `mind/vestige-protocol.ptc` (docs = archive)
* [docs/vestige-injection-policy.md](docs/vestige-injection-policy.md) — data-only injection
* [docs/vestige-buffer-compaction.md](docs/vestige-buffer-compaction.md) — compact refs
* [docs/vestige-fsrs-and-limits.md](docs/vestige-fsrs-and-limits.md) — FSRS-6 notes + operational limits (archive)
* Scripts: `scripts/vestige-smoke.ts`, `scripts/test-vestige-degraded.sh`, `scripts/vestige-mind.ts`

## Ops

* [docs/ops-playbook.md](docs/ops-playbook.md)
* [docs/bootstrap.md](docs/bootstrap.md)
* [docs/VERIFICATION.md](docs/VERIFICATION.md)
* [docs/UPSTREAM.md](docs/UPSTREAM.md)

## DMN / OSS (P12 — runtime is the mind)

**Cold-start forms:** `(dmn-oracle-preflight)` `(dmn-chorus-protocol)` `(dmn-endpoints)` `(dmn-request-groq)` `(dmn-request-opencode-go)` `(dmn-nudge-craft)` `(dmn-reflect-pack n)` `(mind-duty-check)`  
**Map:** [docs/dmn-runtime-vs-archive.md](docs/dmn-runtime-vs-archive.md) · **Handoff:** [docs/session-handoff.md](docs/session-handoff.md)

* [plan/P12-dmn-mind-native.md](plan/P12-dmn-mind-native.md) — **exit (2026-09-07)** A–E
* [plan/P11-oss-dmn-channel.md](plan/P11-oss-dmn-channel.md) — thin path + 4-channel
* [docs/mind-api.md](docs/mind-api.md) — form index

## Phase plan

See [plan/README.md](plan/README.md). **P5 substantially complete 2026-09-11.** **mind-duty-check live 2026-09-12.** Next: P8–P10 when chosen.
