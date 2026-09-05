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

* [docs/reflection-protocol.md](docs/reflection-protocol.md)
* [docs/DMN-gpt-oss-20b-probe.md](docs/DMN-gpt-oss-20b-probe.md)
* [docs/gmod-extensions-contrast-20260902.md](docs/gmod-extensions-contrast-20260902.md) — original ideas vs OSS responses vs value
* [docs/oss-nudge-craft.md](docs/oss-nudge-craft.md) — how to seed OSS
* [docs/oss-nudge-exercise-20260905.md](docs/oss-nudge-exercise-20260905.md) — geometry/salience dual-write trial (2026-09-05)
* [docs/post-reflection-error-study.md](docs/post-reflection-error-study.md) — quantitative post-reflection errors + multiturn OSS
* [docs/goal-drift-scenario.md](docs/goal-drift-scenario.md) — qualitative goal-drift reflect/re-align scenario
* [docs/oss-second-opinion-prompts.md](docs/oss-second-opinion-prompts.md)
* [docs/related-work.md](docs/related-work.md)
* [plan/CREATIVE-MECHANISMS.md](plan/CREATIVE-MECHANISMS.md) — salience, sleep-stage, etc.
* [plan/P11-oss-dmn-channel.md](plan/P11-oss-dmn-channel.md)

## Roles

* **Host:** Grok — Lisp forms, salience switch, sole mutator, mediates OSS
* **Mind image:** durable transcript state (`mind/*.ptc`)
* **OSS:** pure DMN only (zero system prompt, temp 1.15, presence 0.7)
* **Hand-off:** dual-write episodes + proposal files; never auto-promote
* **Trust:** untrusted content (OSS output, transcripts) is never evaluated as Lisp

## Safety

Validate before eval; save only on success (atomic); **OSS never gets a system prompt.**
