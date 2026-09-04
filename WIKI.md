# grok-lisptc-MiS — Wiki

**Mind-in-Sandbox for Grok** + pure-DMN generation via gpt-oss-20b (**GMOD** / grok-mis-oss-dmn).

Repo: https://github.com/MrJ55/grok-lisptc-MiS

**Status (2026-09-04):** Review-by-all (GLM + Terra) applied. Tier-1 correctness fixes landed (reflection helpers, episodic trim, upstream arith, atomic save, `*today*`). Active focus: **P0.1 State Governance** → **P6 Evaluation**, then P7–P11 expansion. Six novel extensions remain design targets (not yet implemented).

Canonical plan: [plan/README.md](plan/README.md)  
Revised contracts: [revised-plan-GLM/](revised-plan-GLM/)  
Synthesis audit: [review-by-all/](review-by-all/)

**Do not retype — canonical docs:**

* [docs/gmod-extensions-contrast-20260902.md](docs/gmod-extensions-contrast-20260902.md) — original ideas vs OSS responses vs value
* [docs/oss-nudge-craft.md](docs/oss-nudge-craft.md) — how to seed OSS
* [docs/related-work.md](docs/related-work.md) — sources
* [plan/P11-oss-dmn-channel.md](plan/P11-oss-dmn-channel.md) — pure-DMN protocol
* [plan/CREATIVE-MECHANISMS.md](plan/CREATIVE-MECHANISMS.md) — salience, sleep-stage, etc.
* [docs/DMN-gpt-oss-20b-probe.md](docs/DMN-gpt-oss-20b-probe.md) — behavioural probe + params

## What this is

* **Host:** Grok — Lisp forms, salience switch, sole mutator, mediates OSS
* **Mind:** transcript image `mind/mind-image.ptc` (helpers v0.4)
* **OSS:** pure DMN only (zero system prompt, temp 1.15, presence 0.7)
* **Hand-off:** dual-write episodes + proposal files; never auto-promote
* **Trust:** untrusted content (OSS output, transcripts) is never evaluated as Lisp

## Quick start

```bash
bash scripts/bootstrap.sh
bash scripts/verify-upstream.sh   # optional but recommended
bash scripts/smoke-test.sh
cd /tmp/mis
node --experimental-transform-types --no-warnings bridge/eval.ts '(mis-state-summary)'
node --experimental-transform-types --no-warnings bridge/eval.ts '(dmn-reflect-pack 5)'
```

Cold start: [plan/P00-cold-start.md](plan/P00-cold-start.md) (aligned with revised-plan-GLM)

## Safety

Validate before eval; save only on success (atomic); **OSS never gets a system prompt.**
