# Mind API

## Live (P0–P4 + P0.1 partial + P7 narrative + P12 oracle/protocol)

| Form | Role |
|------|------|
| `(mis-version)` | helpers version (`mis-helpers-0.7`) |
| `(mis-ping)` | health → `pong` |
| `(mis-note msg)` | echo |
| `(mis-register sym)` | register into `*mis-known*` |
| `(mis-state-summary)` | version, known, schema, arc, buffer, **oracle**, manifest, session |
| `(mis-schema)` / `(mis-insights)` | schema readers |
| `(update-self-schema alist)` | merge schema |
| `(dmn-log-episode …)` / `(dmn-fetch-unreflected n)` / `(dmn-reflect-pack n)` / `(dmn-apply-reflection …)` | episodic + reflection |
| `(audit-reality-status)` / `(audit-autobiography-grounding)` / `(audit-self-schema-evidence)` | audits |
| `(promote-candidate id)` | host-mediated candidate gate |
| `(dmn-narrate …)` / `(dmn-chapter-close …)` / `(dmn-chapter-commit title)` / `(dmn-narrative-candidate …)` | narrative candidates |
| `(dmn-tension-seeds)` / `(dmn-arc)` / `(dmn-autobiography n)` | arc |
| **`(dmn-oracle-preflight)`** | **required before Chorus** — `ok` or `blocked` |
| **`(dmn-oracle-set u g c)`** / **`(dmn-oracle-clear)`** / **`(dmn-oracle-get)`** | oracle triple |
| **`(dmn-oracle-candidates)`** | suggested triples from tensions (host still sets) |
| **`(dmn-chorus-roster)`** / **`(dmn-nudge-craft)`** / **`(dmn-chorus-protocol)`** | protocol from image |
| **`(dmn-suggest-seed tension)`** | incomplete first-person seed |
| **`(dmn-chorus-interpret weave sticky triple)`** | host-mediated interpret reminder |

## Pure-DMN OSS (P11) + Chorus contract (P12)

- `bridge/oss.ts` — parameter lock; zero system prompt; Pulse Meter; dual-write + audit
- Roster: oss20 EN + oss120 EN (Groq) + ds_go EN + ds_go ZH (OpenCode Go; host translates ZH)
- **Before Chorus:** `(dmn-oracle-preflight)` must be `ok`
- **After Chorus:** interpret sticky → Act / veto / no-clear-guidance; dual-write must include oracle keys (see `(dmn-chorus-protocol)` `:dual-write` / `:observer`)
- All OSS output `:reality-status imagined`; never eval as Lisp

## Planned (P8–P10)
Scenes, prospection, wander — see plan files.
