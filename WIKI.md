# grok-lisptc-MiS — Wiki

**Mind-in-Sandbox for Grok** + pure-DMN generation via gpt-oss-20b (**GMOD** / grok-mis-oss-dmn).

Repo: https://github.com/MrJ55/grok-lisptc-MiS

**Status (2026-09-02):** P0–P4 done. P7 first chapter *Genesis of GMOD* closed. P11 pure-DMN channel live. Nudge-craft rules recorded. Six novel extensions (Chorus, Midnight Note, Pulse Meter, Third-voice, Page Passer, Observer) contrasted and **merged into phase task lists** with pointers to the report.

See [docs/status-20260902.md](docs/status-20260902.md) and especially [docs/gmod-extensions-contrast-20260902.md](docs/gmod-extensions-contrast-20260902.md).

**Do not retype — canonical docs:**

* [docs/gmod-extensions-contrast-20260902.md](docs/gmod-extensions-contrast-20260902.md) — original ideas vs OSS responses vs value (source of the six named shapes)
* [docs/oss-nudge-craft.md](docs/oss-nudge-craft.md) — how to seed OSS (prefer / avoid)
* [docs/oss-second-opinion-prompts.md](docs/oss-second-opinion-prompts.md) — multi-turn prompts + extension mapping
* [docs/related-work.md](docs/related-work.md) — sources
* [plan/P11-oss-dmn-channel.md](plan/P11-oss-dmn-channel.md) — protocol + integrated extension tasks
* [plan/CREATIVE-MECHANISMS.md](plan/CREATIVE-MECHANISMS.md) — salience, sleep-stage, Chorus, Observer, etc.
* [plan/README.md](plan/README.md) — phase table + extension map

## What this is

* **Host:** Grok — Lisp forms, salience switch, sole mutator, mediates OSS
* **Mind:** transcript image mind/mind-image.ptc
* **OSS:** pure DMN only (zero system prompt, temp 1.15, presence 0.7)
* **Hand-off:** dual-write episodes + proposal files; never auto-promote

## Quick start

bash scripts/bootstrap.sh
cd /tmp/mis
node --experimental-transform-types --no-warnings bridge/eval.ts '(mis-state-summary)'

Cold start: [plan/P00-cold-start.md](plan/P00-cold-start.md)

## Safety

Validate before eval; save only on success; **OSS never gets a system prompt.**
