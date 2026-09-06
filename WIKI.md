# Wiki — grok-lisptc-MiS

Mind-in-Sandbox: deterministic lisptc transcript + Grok host + optional pure-DMN OSS channel.

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

## Ops

* [docs/ops-playbook.md](docs/ops-playbook.md)
* [docs/bootstrap.md](docs/bootstrap.md)
* [docs/VERIFICATION.md](docs/VERIFICATION.md)
* [docs/UPSTREAM.md](docs/UPSTREAM.md)

## DMN / OSS

* [plan/P11-oss-dmn-channel.md](plan/P11-oss-dmn-channel.md) — thin path + 4-channel (live)
* [plan/P12-dmn-mind-native.md](plan/P12-dmn-mind-native.md) — **active next:** oracle preflight, protocol in mind, interpret duty
* [docs/reflection-protocol.md](docs/reflection-protocol.md)
* [docs/DMN-gpt-oss-20b-probe.md](docs/DMN-gpt-oss-20b-probe.md)
* [docs/gmod-extensions-contrast-20260902.md](docs/gmod-extensions-contrast-20260902.md)
* [docs/oss-nudge-craft.md](docs/oss-nudge-craft.md) — archive; runtime craft moves into mind under P12
* [docs/oss-nudge-exercise-20260905.md](docs/oss-nudge-exercise-20260905.md)
* [docs/chorus-probe-20260905.md](docs/chorus-probe-20260905.md)
* [docs/chorus-geometry-20260906.md](docs/chorus-geometry-20260906.md) — geometry + bilingual case study
* [docs/observer-salience.md](docs/observer-salience.md)
* [docs/page-passer.md](docs/page-passer.md)
* [docs/related-work.md](docs/related-work.md)
* [plan/CREATIVE-MECHANISMS.md](plan/CREATIVE-MECHANISMS.md)

### Proposal files (imagined only)

* [mind/oss-proposals-20260906-geometry-chorus.ptc](mind/oss-proposals-20260906-geometry-chorus.ptc)
* [mind/oss-proposals-20260906-geometry-chorus-bilingual.ptc](mind/oss-proposals-20260906-geometry-chorus-bilingual.ptc)
* [mind/oss-proposals-20260906-dmn-tpn-chorus-live.ptc](mind/oss-proposals-20260906-dmn-tpn-chorus-live.ptc)

## Roles

* **Host:** Grok — Lisp forms, salience switch, sole mutator, mediates OSS
* **Mind image:** durable transcript state (`mind/*.ptc`) — **runtime authority for DMN procedure under P12**
* **OSS / Chorus:** pure DMN only (zero system prompt). Roster: **gpt-oss-20b + gpt-oss-120b (Groq, EN)** + **deepseek-v4-flash (OpenCode Go, EN + ZH)**. Host weaves + translates ZH; never auto-promote.
* **Oracle contract (P12):** before any Chorus — state unfinished decision, sought guidance, success criterion; after — interpret sticky → Act / veto / no-clear-guidance
* **Hand-off:** dual-write episodes + proposal files; never auto-promote
* **Trust:** untrusted content never evaluated as Lisp

## Narrative & Mind-drive (P7)

* [plan/P7-narrative-self.md](plan/P7-narrative-self.md) — **exit**
* [docs/mind-drive-protocol.md](docs/mind-drive-protocol.md)
* [docs/narrative-tension-seeds.md](docs/narrative-tension-seeds.md)
* Autobiography: 4 grounded chapters (Genesis → Mind-drive → P6 eval → P7 exit)

## Safety

Validate before eval; save only on success (atomic); **OSS never gets a system prompt.**
