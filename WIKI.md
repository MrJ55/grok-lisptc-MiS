# grok-lisptc-MiS — Wiki

**Mind-in-Sandbox for Grok** using a stripped [lisptc](https://github.com/1hachem/lisptc) `MemoryRepl`.  
Repo: https://github.com/MrJ55/grok-lisptc-MiS

**Status (2026-08-31):** P0–P2 verified. **P3 self-schema / DMN started** (helpers 0.3). See [docs/VERIFICATION.md](./docs/VERIFICATION.md) and [plan/README.md](./plan/README.md).

## What this is

- **Host:** Grok — decides Lisp forms, talks to the user in plain language.
- **Mind:** lisptc REPL state as transcript image (`mind/mind-image.ptc`).
- **Bridge:** `bridge/eval.ts` — validate → eval → optional save (never on failure).
- **Runtime:** `/tmp/mis` via `scripts/bootstrap.sh` (dep: `zod` only).

## Quick start

```bash
bash scripts/bootstrap.sh
cd /tmp/mis
node --experimental-transform-types --no-warnings bridge/eval.ts '(mis-state-summary)'
node --experimental-transform-types --no-warnings bridge/eval.ts \
  '(list (square 2) (triple 3) (double 4) (quadruple 5) (half 8))'
```

## Mind API (v0.3)

`(mis-version)` `(mis-ping)` `(mis-note msg)` `(mis-register 'sym)` `(mis-state-summary)`  
`(mis-schema)` `(mis-insights)` `(update-self-schema alist)`  
`(dmn-log-episode input result meta)` `(dmn-fetch-unreflected n)`  
Sample: `square` `triple` `double` `quadruple` `half`

## Safety / UX / Ops

P0: validate, save-on-success, no reset, checkpoint, failures log.  
P1: English-first; UPSTREAM pins.  
P2: summary/register; `--scratch`; push script.  
P3: self-schema + episodic buffer (in progress).

## Next

- Drive reflection turns that call `update-self-schema` + `--save`.
- Optional P5 vector cabinet.
