# OSS pure-DMN craft gate (runtime)

**Status:** live 2026-09-13  
**Authority:** `mind/dmn-protocol.ptc` + `mind/wander.ptc` + `craft-duty`

## Host rule (mandatory)

Never call Groq/OpenCode for pure-DMN without:

1. `(dmn-nudge-craft)` — prefer/avoid
2. `(dmn-suggest-seed thread)` — **only** allowed user-message strings
3. `(dmn-oss-seed-check text)` — must show `:ok t`
4. `(dmn-oss-seed-commit text)` — must show `:status committed`
5. HTTP body: **exactly** the committed seed; zero system prompt

## Forms

| Form | Role |
|------|------|
| `(dmn-oss-seed-check text)` | `:ok` only if text equals a catalog suggest-seed |
| `(dmn-oss-seed-commit text)` | Sets `*oss-craft-ok-today*`; rejects otherwise |
| `(dmn-oss-host-rule)` | Steps reminder |
| `(dmn-wander-oss)` | Thread seed + check + commit; returns `:user-message` |
| `(dmn-oss-note-uncrafted)` | Process debt if host fired without commit |
| `(craft-duty)` | Medium duty while uncrafted count > 0 |

## Rejection example

Hand-rolled problem-spec seed → `:ok nil` `:reason not-from-dmn-suggest-seed`.

Canonical: `(dmn-suggest-seed 'pure-dmn-vs-tpn-pressure)` → `:ok t`.

## Wander

`(dmn-wander-oss)` does not pass kitchen-sink goals/errors into the HTTP message.
