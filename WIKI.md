# grok-lisptc-MiS — Wiki

**Mind-in-Sandbox for Grok** using a stripped [lisptc](https://github.com/1hachem/lisptc) `MemoryRepl`.  
Repo: https://github.com/MrJ55/grok-lisptc-MiS

**Status (2026-08-31):** v0 + **P0 + P1 + P2 complete and verified.** See [docs/VERIFICATION.md](./docs/VERIFICATION.md).

## What this is

- **Host:** Grok — decides Lisp forms, talks to the user in plain language.
- **Mind:** lisptc REPL state as transcript image (`mind/mind-image.ptc`).
- **Bridge:** `bridge/eval.ts` — validate → eval → optional save (never on failure).
- **Runtime:** `/tmp/mis` via `scripts/bootstrap.sh` (dep: `zod` only).

No Fireworks GBNF in this chat path; safety is validation + save-only-on-success.

## Read order (blank session)

1. This file
2. [docs/CUSTOM_INSTRUCTIONS.md](./docs/CUSTOM_INSTRUCTIONS.md)
3. [docs/session-handoff.md](./docs/session-handoff.md)
4. [docs/bootstrap.md](./docs/bootstrap.md)
5. [docs/permanence.md](./docs/permanence.md)
6. [plan/README.md](./plan/README.md)
7. [docs/VERIFICATION.md](./docs/VERIFICATION.md)
8. [docs/mind-api.md](./docs/mind-api.md)
9. [docs/UPSTREAM.md](./docs/UPSTREAM.md)
10. [docs/learnings-log.md](./docs/learnings-log.md)

## Quick start

```bash
bash scripts/bootstrap.sh
cd /tmp/mis
node --experimental-transform-types --no-warnings bridge/eval.ts '(mis-state-summary)'
node --experimental-transform-types --no-warnings bridge/eval.ts \
  '(list (square 2) (triple 3) (double 4) (quadruple 5) (half 8))'
```

## Mind API

`(mis-version)` `(mis-ping)` `(mis-note msg)` `(mis-register 'sym)` `(mis-state-summary)`  
Sample defs: `square` `triple` `double` `quadruple` `half`

## Safety / UX / Ops

P0: validate, save-on-success, no reset, checkpoint, failures log.  
P1: English-first; UPSTREAM pins; string-trim caveat.  
P2: summary/register; `--scratch`; push script.

## Next

Optional **P3** vector cabinet.
