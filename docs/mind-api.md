# Mind API

| Form | Purpose |
|------|---------|
| `(mis-version)` | `"mis-helpers-0.3"` (+ P4 helpers) |
| `(mis-ping)` | `pong` |
| `(mis-note msg)` | echo |
| `(mis-register 'sym)` | track in `*mis-known*` |
| `(mis-state-summary)` | version, ping, known, schema |
| `(mis-schema)` | current `*self-schema*` alist |
| `(mis-insights)` | `:working-insights` value |
| `(update-self-schema alist)` | merge keys into `*self-schema*` |
| `(dmn-log-episode input result meta)` | push episode; pass nil for meta if unused |
| `(dmn-fetch-unreflected n)` | up to N recent episodes |
| `(dmn-reflect-pack n)` | `(list :schema … :episodes …)` for host |
| `(dmn-apply-reflection insights summary label)` | schema update + reflection episode |

Sample defs: `square` `triple` `double` `quadruple` `half`.

`--scratch` → `mind-scratch.ptc`. `--image` / `MIS_IMAGE` for alternate paths.  
`--checkpoint` copies image to `*.prev.ptc` before save.

Reflection ops: [docs/reflection-protocol.md](./reflection-protocol.md).
