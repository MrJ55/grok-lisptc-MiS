# Mind API

## Live (P0–P4)

| Form | Purpose |
|------|---------|
| `(mis-version)` | version string |
| `(mis-ping)` | `pong` |
| `(mis-note msg)` | echo |
| `(mis-register 'sym)` | track in `*mis-known*` |
| `(mis-state-summary)` | version, ping, known, schema |
| `(mis-schema)` | `*self-schema*` alist |
| `(mis-insights)` | `:working-insights` |
| `(update-self-schema alist)` | merge into schema |
| `(dmn-log-episode input result meta)` | push episode (nil meta ok; optional `:source 'oss-dmn`) |
| `(dmn-fetch-unreflected n)` | up to N recent episodes |
| `(dmn-reflect-pack n)` | `(:schema … :episodes …)` |
| `(dmn-apply-reflection insights summary label)` | schema + reflection episode |

Sample defs: `square` `triple` `double` `quadruple` `half`.

Flags: `--scratch`, `--image` / `MIS_IMAGE`, `--checkpoint`, `--save` (success only).

## Planned (P7–P11)

| Form | Phase | Purpose |
|------|-------|---------|
| `(dmn-narrate …)` `(dmn-chapter-close …)` | P7 | Autobiography chapters |
| `(dmn-arc)` `(dmn-autobiography n)` | P7 | Arc / chapter readers |
| `(dmn-tag-episode …)` `(dmn-replay …)` | P8 | Tags + filtered replay |
| `(dmn-scene-from episode)` | P8 | Scene pack for simulation |
| `(dmn-simulate-pack …)` / simulate results | P9 | Future / counterfactual data |
| `(dmn-wander n)` `(dmn-monologue-*)` | P10 | Spontaneous candidates |
| OSS dual-write / proposal helpers | P11 | Capture pure-DMN continuations as candidates only |

Exact arities land when each phase is implemented. Reflection ops: [reflection-protocol.md](./reflection-protocol.md).  
OSS pure-DMN protocol: [plan/P11-oss-dmn-channel.md](../plan/P11-oss-dmn-channel.md) and [DMN-gpt-oss-20b-probe.md](./DMN-gpt-oss-20b-probe.md).

## Global rule for OSS

Any episode or candidate that originates from gpt-oss-20b must carry source metadata and must never be auto-promoted. Grok is the only agent that may turn an OSS continuation into a committed schema / chapter / insight update.
