# Mind API

## Live (P0–P4 + P0.1 + P5 Vestige host-mediated + P7 narrative + P12 exit + duty surface)

| Form | Role |
|------|------|
| `(mis-version)` | helpers version (`mis-helpers-0.7`) |
| `(mis-ping)` | health → `pong` |
| `(mis-note msg)` | echo |
| `(mis-register sym)` | register into `*mis-known*` |
| `(mis-state-summary)` | version, known, schema, arc, buffer, **oracle**, manifest, session |
| `(mis-schema)` / `(mis-insights)` | schema readers |
| `(update-self-schema alist)` | merge schema |
| `(dmn-log-episode …)` / `(dmn-fetch-unreflected n)` / `(dmn-reflect-pack n)` / `(dmn-apply-reflection …)` | episodic + reflection (+ oracle surface on reflect-pack) |
| `(dmn-log-vestige-ref id summary meta)` | P5 compact episodic ref (full text in Vestige) |
| `(episodic-ref-p rec)` / `(episodic-compact-count)` | Compact buffer helpers |
| `(mind-recall q k)` / `(mind-record-event …)` / `(mind-backfill-cause …)` / `(mind-check-contradictions …)` / `(mind-memory-status)` | Host-mediated Vestige surface |
| `(vestige-config)` / `(vestige-status)` / `(vestige-set-status s)` | Vestige config + local status |
| **`(vestige-host-contract)`** | **Runtime Vestige host rules** (docs = archive) |
| `(vestige-injection-rules)` / `(vestige-degraded-protocol)` / `(vestige-working-set-rules)` / `(vestige-profile-rules)` | Contract sections |
| **`(mind-duty-check)`** | **Host agenda** — narrative/reflection (poll; no push) |
| `(narrative-duty)` / `(reflection-duty)` / `(mind-drive-protocol)` | Duty sections |
| `(audit-reality-status)` / `(audit-autobiography-grounding)` / `(audit-self-schema-evidence)` | audits |
| `(promote-candidate id)` | host-mediated candidate gate |
| `(dmn-narrate …)` / `(dmn-chapter-close …)` / `(dmn-chapter-commit title)` / `(dmn-narrative-candidate …)` | narrative candidates |
| `(dmn-tension-seeds)` / `(dmn-arc)` / `(dmn-autobiography n)` | arc |
| **`(dmn-oracle-preflight)`** | **required before Chorus** — `ok` or `blocked` |
| **`(dmn-oracle-set u g c)`** / **`(dmn-oracle-clear)`** / **`(dmn-oracle-get)`** | oracle triple |
| **`(dmn-oracle-candidates)`** | suggested triples from tensions (host still sets) |
| **`(dmn-chorus-roster)`** / **`(dmn-nudge-craft)`** / **`(dmn-chorus-protocol)`** | protocol from image |
| **`(dmn-endpoints)`** / **`(dmn-request-groq)`** / **`(dmn-request-opencode-go)`** | call locks |
| **`(dmn-suggest-seed tension)`** | incomplete first-person seed |
| **`(dmn-chorus-interpret …)`** | Host-mediated interpret reminder after weave |

## Host duty (2026-09-12)

- Module: `mind/mind-duty.ptc`
- Doc: [mind-duty.md](./mind-duty.md)
- Bridge: `HOST_DUTY` trailer; env `MIS_DUTY_TRAILER` / `MIS_DUTY_STRICT`

## Vestige (P5 substantially complete 2026-09-11)

- Adapter: `bridge/vestige-adapter.ts`
- Scripts: `vestige-smoke.ts`, `test-vestige-degraded.sh`, `vestige-mind.ts`
- Runtime host contract: `mind/vestige-protocol.ptc`
- Docs: vestige-injection-policy, vestige-buffer-compaction, vestige-fsrs-and-limits (**archive**)

## Planned (P8–P10)

Scenes, prospection, wander — see plan files.
