# Mind API

| Form | Purpose |
|------|---------|
| `(mis-version)` | `"mis-helpers-0.3"` |
| `(mis-ping)` | `pong` |
| `(mis-note msg)` | echo |
| `(mis-register 'sym)` | track in `*mis-known*` |
| `(mis-state-summary)` | version, ping, known, schema |
| `(mis-schema)` | current `*self-schema*` alist |
| `(mis-insights)` | `:working-insights` value |
| `(update-self-schema alist)` | merge keys into `*self-schema*` |
| `(dmn-log-episode input result meta)` | push episode (newest first); pass nil for meta if unused |
| `(dmn-fetch-unreflected n)` | up to N recent episodes |

Sample defs in image: `square` `triple` `double` `quadruple` `half`.

`--scratch` → `mind-scratch.ptc`. `--image` / `MIS_IMAGE` for alternate paths.  
`--checkpoint` copies image to `*.prev.ptc` before save.

Push: `scripts/push-mind-image.sh` or Grok GitHub tool. Do not push scratch as main.
