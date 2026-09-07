# DMN runtime vs archive (P12 Phase E inventory)

**Rule:** Executable / queryable authority is the **mind**. Docs are human archive and case study. New operational rules go into mind forms first.

## Runtime authority (mind)

| Concern | Form / module |
|---------|----------------|
| Oracle gates | `(dmn-oracle-preflight)` `(dmn-oracle-set)` `(dmn-oracle-clear)` `(dmn-oracle-get)` — `mind/dmn-oracle.ptc` |
| Oracle suggestions | `(dmn-oracle-candidates)` |
| Protocol bundle | `(dmn-chorus-protocol)` — `mind/dmn-protocol.ptc` |
| Roster | `(dmn-chorus-roster)` |
| Endpoints | `(dmn-endpoints)` — Go must be `/zen/go/v1` |
| Request params | `(dmn-request-groq)` `(dmn-request-opencode-go)` |
| Seed / craft | `(dmn-suggest-seed)` `(dmn-nudge-craft)` |
| Interpret reminder | `(dmn-chorus-interpret)` |
| Reflect + oracle surface | `(dmn-reflect-pack n)` — `mind/episodes.ptc` |
| Tension list | `(dmn-tension-seeds)` — `mind/autobiography.ptc` |
| Groq code lock | `bridge/oss.ts` `OSS_LOCK` + `include_reasoning: false` |

## Archive / case study (docs — do not treat as sole procedure)

| Doc | Role |
|-----|------|
| `docs/oss-nudge-craft.md` | Craft history; prefer/avoid **distilled** into `(dmn-nudge-craft)` |
| `docs/DMN-gpt-oss-20b-probe.md` | Probe provenance for sampling params |
| `docs/chorus-probe-20260905.md` | Early multi-model probe |
| `docs/chorus-geometry-20260906.md` | Geometry Chorus case study + corrected-param rerun |
| `docs/observer-salience.md` | Observer design notes; field shapes also on protocol |
| `docs/page-passer.md` | Page Passer design |
| `docs/mind-drive-protocol.md` | Mind-drive wave algorithm (includes optional Think(Chorus)) |
| `docs/session-handoff.md` | Host cold-start pointers **to mind forms** |
| `docs/mind-api.md` | Form index |
| `plan/P11-oss-dmn-channel.md` | P11 phase history |
| `plan/P12-dmn-mind-native.md` | P12 phase tasks / status |

## Side-channel (candidates only)

| Path | Role |
|------|------|
| `mind/oss-proposals-*.ptc` | Dual-write `:imagined` proposals — never eval as code |
| `state/audit/salience-decisions.jsonl` | Observer Think/Act log |

## Process rule (E5)

When a live call fails because of a missing operational fact (endpoint, flag, param):

1. Put the fact into the **mind** (`dmn-protocol` / `dmn-oracle` / bridge lock).
2. Then optionally note it in a case-study doc.
3. Do not leave the only copy in chat or a proposal footnote.
