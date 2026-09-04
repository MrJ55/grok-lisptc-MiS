# Mind API

## Live (P0–P4 + P0.1 partial)

| Form | Purpose |
|------|---------|
| `(mis-version)` | version string (`mis-helpers-0.4`) |
| `(mis-ping)` | `pong` |
| `(mis-note msg)` | echo |
| `(mis-register 'sym)` | track in `*mis-known*` |
| `(mis-state-summary)` | version, ping, known, schema, arc, auto-len, **manifest** |
| `(mis-schema)` | `*self-schema*` alist |
| `(mis-insights)` | `:working-insights` |
| `(update-self-schema alist)` | merge into schema |
| `(dmn-log-episode input result meta)` | push episode; **defaults `:reality-status observed` if missing** |
| `(dmn-fetch-unreflected n)` | up to N recent episodes |
| `(dmn-reflect-pack n)` | `(:schema … :episodes …)` |
| `(dmn-apply-reflection insights summary label)` | schema + reflection episode (`:reality-status inferred`) |
| `(audit-reality-status)` | list of episodes missing `:reality-status` (empty = clean) |
| `(dmn-narrate summary title)` | append chapter (`:reality-status observed`) |
| `(dmn-chapter-close title summary refs)` | append chapter with refs |
| `(dmn-arc)` | narrative arc |
| `(dmn-autobiography n)` | up to N chapters |

Globals of note:

| Symbol | Role |
|--------|------|
| `*mind-manifest*` | First form in image; schema / helpers / pin metadata (P0.1) |
| `*self-schema*` | Durable self model |
| `*episodic-buffer*` | Newest-first episodes (max `*episodic-max*`) |
| `*autobiography*` | Chapter list |
| `*narrative-arc*` | Current chapter / open threads / tensions |
| `*today*` / `*now*` | Host-injected date/time (bridge) |

Sample defs: `square` `triple` `double` `quadruple` `half`.

Flags: `--scratch`, `--image` / `MIS_IMAGE`, `--checkpoint`, `--save` (success only), `--strict-load`.

On `--save` the bridge also refreshes `state/checkpoints/last-known-good.ptc` and appends a line to `state/audit/mutations.jsonl`.

## Planned (P7–P11 / remaining P0.1)

| Form | Phase | Purpose |
|------|-------|---------|
| `(promote-candidate id)` | P0.1 | Validate + apply a candidate from proposal store |
| `(dmn-tag-episode …)` `(dmn-replay …)` | P8 | Tags + filtered replay |
| `(dmn-scene-from episode)` | P8 | Scene pack for simulation |
| `(dmn-simulate-pack …)` | P9 | Future / counterfactual data |
| `(dmn-wander n)` `(dmn-monologue-*)` | P10 | Spontaneous candidates |
| OSS dual-write / proposal helpers | P11 | Capture pure-DMN continuations as candidates only |

## Global rule for OSS

Any episode or candidate that originates from gpt-oss-20b must carry source metadata and **`:reality-status imagined`**, and must never be auto-promoted. Grok is the only agent that may turn an OSS continuation into a committed schema / chapter / insight update. Raw OSS prose is **rejected by `prevalidate`** if submitted as code.

Trust classes: [docs/trust-classes.md](./trust-classes.md).  
Reflection ops: [reflection-protocol.md](./reflection-protocol.md).  
OSS pure-DMN protocol: [plan/P11-oss-dmn-channel.md](../plan/P11-oss-dmn-channel.md).
