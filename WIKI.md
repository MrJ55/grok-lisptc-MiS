# Wiki — grok-lisptc-MiS

Mind-in-Sandbox: deterministic lisptc transcript + Grok host + optional pure-DMN OSS channel + Vestige long-term memory substrate (P5).

## Start here

* [README.md](README.md)
* [docs/session-handoff.md](docs/session-handoff.md)
* [plan/README.md](plan/README.md)
* [docs/CUSTOM_INSTRUCTIONS.md](docs/CUSTOM_INSTRUCTIONS.md)

## Architecture & decisions

* [docs/architecture.md](docs/architecture.md)
* [docs/decisions-index.md](docs/decisions-index.md)
* [docs/trust-classes.md](docs/trust-classes.md)
* [docs/capability-governance.md](docs/capability-governance.md)
* [docs/threat-model.md](docs/threat-model.md)

## Vestige (P5 substantially complete 2026-09-11)

* [plan/P5-vector-cabinet.md](plan/P5-vector-cabinet.md) — **substantially complete**; accomplishments section
* [docs/vestige-injection-policy.md](docs/vestige-injection-policy.md) — data-only injection
* [docs/vestige-buffer-compaction.md](docs/vestige-buffer-compaction.md) — compact refs
* [docs/vestige-fsrs-and-limits.md](docs/vestige-fsrs-and-limits.md) — FSRS-6 notes + operational limits
* Scripts: `scripts/vestige-smoke.ts`, `scripts/test-vestige-degraded.sh`, `scripts/vestige-mind.ts`

## Ops

* [docs/ops-playbook.md](docs/ops-playbook.md)
* [docs/bootstrap.md](docs/bootstrap.md)
* [docs/VERIFICATION.md](docs/VERIFICATION.md)
* [docs/UPSTREAM.md](docs/UPSTREAM.md)

## DMN / OSS (P12 — runtime is the mind)

**Cold-start forms:** `(dmn-oracle-preflight)` `(dmn-chorus-protocol)` `(dmn-endpoints)` `(dmn-request-groq)` `(dmn-request-opencode-go)` `(dmn-nudge-craft)` `(dmn-reflect-pack n)`  
**Map:** [docs/dmn-runtime-vs-archive.md](docs/dmn-runtime-vs-archive.md) · **Handoff:** [docs/session-handoff.md](docs/session-handoff.md)

* [plan/P12-dmn-mind-native.md](plan/P12-dmn-mind-native.md) — **exit (2026-09-07)** A–E; oracle/protocol/endpoints in mind; F deferred optional
* [plan/P11-oss-dmn-channel.md](plan/P11-oss-dmn-channel.md) — thin path + 4-channel (prerequisite, live)
* [docs/mind-api.md](docs/mind-api.md) — form index
* [docs/mind-drive-protocol.md](docs/mind-drive-protocol.md) — optional Think(Chorus) step
* [docs/reflection-protocol.md](docs/reflection-protocol.md)
* [docs/DMN-gpt-oss-20b-probe.md](docs/DMN-gpt-oss-20b-probe.md) — param provenance (archive)
* [docs/oss-nudge-craft.md](docs/oss-nudge-craft.md) — **archive**; runtime = `(dmn-nudge-craft)`
* [docs/chorus-geometry-20260906.md](docs/chorus-geometry-20260906.md) — **case study**; runtime params/endpoints in mind
* [docs/observer-salience.md](docs/observer-salience.md) · [docs/page-passer.md](docs/page-passer.md)
* [docs/related-work.md](docs/related-work.md) · [plan/CREATIVE-MECHANISMS.md](plan/CREATIVE-MECHANISMS.md)

### Proposal files (imagined only — never eval)

See `mind/oss-proposals-*.ptc` — dual-write candidates only.

## Phase plan

See [plan/README.md](plan/README.md). **P5 substantially complete 2026-09-11.** Next: P8–P10 when chosen.
