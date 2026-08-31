# Mind API

| Form | Purpose |
|------|---------|
| `(mis-version)` | `"mis-helpers-0.2"` |
| `(mis-ping)` | `pong` |
| `(mis-note msg)` | echo |
| `(mis-register 'sym)` | track in `*mis-known*` |
| `(mis-state-summary)` | version, ping, known |

Sample defs in image: `square` `triple` `double` `quadruple` `half`.

`--scratch` → `mind-scratch.ptc`. `--image` / `MIS_IMAGE` for alternate paths.

Push: `scripts/push-mind-image.sh` or Grok GitHub tool. Do not push scratch as main.
