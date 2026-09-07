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

## DMN / OSS (P12 — runtime is the mind)

**Cold-start forms:** `(dmn-oracle-preflight)` `(dmn-chorus-protocol)` `(dmn-endpoints)` `(dmn-request-groq)` `(dmn-request-opencode-go)` `(dmn-nudge-craft)` `(dmn-reflect-pack n)`  
**Map:** [docs/dmn-runtime-vs-archive.md](docs/dmn-runtime-vs-archive.md) · **Handoff:** [docs/session-handoff.md](docs/session-handoff.md)

* [plan/P12-dmn-mind-native.md](plan/P12-dmn-mind-native.md) — oracle + protocol in mind; checklist is source of truth for remaining items
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

* [mind/oss-proposals-20260906-geometry-oracle-chorus-rerun.ptc](mind/oss-proposals-20260906-geometry-oracle-chorus-rerun.ptc) — **param-correct geometry under oracle**
* [mind/oss-proposals-20260906-geometry-oracle-chorus.ptc](mind/oss-proposals-20260906-geometry-oracle-chorus.ptc)
* [mind/oss-proposals-20260906-geometry-chorus-bilingual.ptc](mind/oss-proposals-20260906-geometry-chorus-bilingual.ptc)
* [mind/oss-proposals-20260906-dmn-tpn-chorus-live.ptc](mind/oss-proposals-20260906-dmn-tpn-chorus-live.ptc)

## Roles

* **Host:** Grok — Lisp forms, salience switch, sole mutator, mediates OSS
* **Mind image:** durable transcript (`mind/*.ptc`) — **runtime authority** for DMN/Chorus procedure
* **OSS / Chorus:** pure DMN only (zero system prompt). Roster: **gpt-oss-20b + gpt-oss-120b (Groq, EN)** + **deepseek-v4-flash (OpenCode Go, EN + ZH)**. Host weaves + translates ZH; never auto-promote.
* **Endpoints:** `(dmn-endpoints)` — OpenCode Go is **`/zen/go/v1` only** (not bare `/zen/v1`)
* **Params:** `(dmn-request-groq)` / `(dmn-request-opencode-go)` — Go temp 1.0; same presence/frequency/top_p as Groq; Groq `include_reasoning: false`
* **Oracle contract:** before any Chorus — unfinished / guidance / success; after — interpret sticky → Act / veto / no-clear-guidance
* **Hand-off:** dual-write proposals + Observer; never auto-promote
* **Trust:** untrusted content never evaluated as Lisp

## Narrative & Mind-drive (P7)

* [plan/P7-narrative-self.md](plan/P7-narrative-self.md) — **exit**
* [docs/mind-drive-protocol.md](docs/mind-drive-protocol.md)
* [docs/narrative-tension-seeds.md](docs/narrative-tension-seeds.md)
* Autobiography: 4 grounded chapters (Genesis → Mind-drive → P6 eval → P7 exit)

## Safety

Validate before eval; save only on success (atomic); **OSS never gets a system prompt.**
