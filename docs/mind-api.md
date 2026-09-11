# Mind API

## Live (P0–P4 + P0.1 + P5 Vestige host-mediated + P7 narrative + P12 exit)

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
| `(mind-recall q k)` / `(mind-record-event …)` / `(mind-backfill-cause …)` / `(mind-check-contradictions …)` / `(mind-memory-status)` | Host-mediated Vestige surface (reminders; host runs scripts/vestige-mind.ts) |
| `(vestige-config)` / `(vestige-status)` / `(vestige-set-status s)` | Vestige config + local status |
| `(audit-reality-status)` / `(audit-autobiography-grounding)` / `(audit-self-schema-evidence)` | audits |
| `(promote-candidate id)` | host-mediated candidate gate |
| `(dmn-narrate …)` / `(dmn-chapter-close …)` / `(dmn-chapter-commit title)` / `(dmn-narrative-candidate …)` | narrative candidates |
| `(dmn-tension-seeds)` / `(dmn-arc)` / `(dmn-autobiography n)` | arc |
| **`(dmn-oracle-preflight)`** | **required before Chorus** — `ok` or `blocked` |
| **`(dmn-oracle-set u g c)`** / **`(dmn-oracle-clear)`** / **`(dmn-oracle-get)`** | oracle triple |
| **`(dmn-oracle-candidates)`** | suggested triples from tensions (host still sets) |
| **`(dmn-chorus-roster)`** / **`(dmn-nudge-craft)`** / **`(dmn-chorus-protocol)`** | protocol from image |
| **`(dmn-endpoints)`** / **`(dmn-request-groq)`** / **`(dmn-request-opencode-go)`** | call locks — Go `/zen/go/v1` only; Groq `include_reasoning` false |
| **`(dmn-suggest-seed tension)`** | incomplete first-person seed |
| **`(dmn-chorus-interpret weave sticky triple)`** | Host-mediated interpret reminder after weave |

## Pure-DMN OSS (P11) + Chorus contract (P12 exit 2026-09-07)

P12 made procedure **mind-native**: preflight, roster, endpoints, request params, craft, dual-write keys, interpret duty, reflect-pack oracle surface, handoff/WIKI pointers. Docs = archive; see [dmn-runtime-vs-archive.md](./dmn-runtime-vs-archive.md).

- `bridge/oss.ts` — parameter lock; zero system prompt; Pulse Meter; dual-write + audit
- Roster: oss20 EN + oss120 EN (Groq) + ds_go EN + ds_go ZH (OpenCode Go; host translates ZH)
- **Before Chorus:** `(dmn-oracle-preflight)` must be `ok`
- **After Chorus:** interpret sticky → Act / veto / no-clear-guidance; dual-write must include oracle keys
- All OSS output `:reality-status imagined`; never eval as Lisp

## Vestige (P5 substantially complete 2026-09-11)

- Adapter: `bridge/vestige-adapter.ts` (profiles, queueOnDegraded)
- Scripts: `vestige-smoke.ts`, `test-vestige-degraded.sh`, `vestige-mind.ts`
- Docs: vestige-injection-policy, vestige-buffer-compaction, vestige-fsrs-and-limits
- Full legacy buffer→refs migration: **skipped** (optional)

## Planned (P8–P10)
Scenes, prospection, wander — see plan files.
