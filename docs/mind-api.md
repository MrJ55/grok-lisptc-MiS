# Mind API

## Live (P0–P4 + P0.1 partial + P7 narrative)

| Form | Role |
|------|------|
| `(mis-version)` | helpers version string |
| `(mis-ping)` | health check → `pong` |
| `(mis-note msg)` | echo helper |
| `(mis-register sym)` | register into `*mis-known*` |
| `(mis-state-summary)` | version, known, schema, arc, auto-len, buffer-len, manifest, session |
| `(mis-schema)` / `(mis-insights)` | schema readers |
| `(update-self-schema alist)` | merge into `*self-schema*` (new keys first) |
| `(dmn-log-episode input result meta)` | push episode; default `:reality-status observed`; stamp `:recorded-at` |
| `(dmn-fetch-unreflected n)` | up to N recent episodes |
| `(dmn-reflect-pack n)` | `(:schema … :episodes …)` |
| `(dmn-apply-reflection insights summary label)` | schema + reflection episode (`:reality-status inferred`) |
| `(audit-reality-status)` | episodes/chapters missing `:reality-status` (empty = clean) |
| `(audit-autobiography-grounding)` | chapters lacking grounded evidence (empty = clean) |
| `(audit-self-schema-evidence)` | structured observed/reported insights missing `:evidence` (empty = clean; bare symbols OK) |
| `(promote-candidate id)` | host-mediated candidate gate (no auto-mutate) |
| `(dmn-narrate summary title)` | propose observed chapter **candidate** (no auto-bio mutation) |
| `(dmn-chapter-close title summary refs)` | propose chapter **candidate** only; host commits later |
| `(dmn-chapter-commit title)` | commit matching candidate into `*autobiography*` |
| `(dmn-narrative-candidate title summary source-id)` | dual-write **imagined** candidate (OSS/texture) |
| `(dmn-tension-seeds)` | host-side `(tension\|thread symbol)` list from arc |
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
| `*narrative-candidates*` | Chapter proposals awaiting commit (P7) |
| `*today*` / `*now*` / `*session-id*` | Host-injected (bridge) |

Sample defs: `square` `triple` `double` `quadruple` `half`.

Flags: `--scratch`, `--image` / `MIS_IMAGE`, `--checkpoint`, `--save` (success only), `--strict-load`.

On `--save` the bridge also refreshes `state/checkpoints/last-known-good.ptc` and appends a line to `state/audit/mutations.jsonl`.

## Planned (P8–P11)

| Form | Phase | Purpose |
|------|-------|---------|
| `(dmn-tag-episode …)` `(dmn-replay …)` | P8 | Tags + filtered replay |
| `(dmn-scene-from episode)` | P8 | Scene pack for simulation |

Reflection ops: [reflection-protocol.md](./reflection-protocol.md).  
OSS pure-DMN protocol: [plan/P11-oss-dmn-channel.md](../plan/P11-oss-dmn-channel.md).

## Narrative / dual-write (P7 exit)

- **Grok** is the narrator; Lisp stores chapters Grok commits.
- `(dmn-chapter-close …)` / `(dmn-narrate …)` → **candidates only** (`*narrative-candidates*`).
- `(dmn-chapter-commit title)` → host gate into durable `*autobiography*`.
- `(dmn-narrative-candidate …)` → imagined OSS/texture candidates. Never eval OSS prose as code.
- Promote path: review candidate → optional rewrite → `(dmn-chapter-commit …)` + `--save`.
- `(audit-autobiography-grounding)` must stay empty for observed chapters.
