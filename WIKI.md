# grok-lisptc-MiS — Wiki

**Mind-in-Sandbox for Grok** using a stripped [lisptc](https://github.com/1hachem/lisptc) `MemoryRepl`, extended toward a **Default Mode Network–style** symbolic self, with pure-DMN generation via gpt-oss-20b.

Repo: https://github.com/MrJ55/grok-lisptc-MiS

**Status (2026-09-02):** P0–P4 done. **Next: P7 Narrative Self + P11 OSS-DMN Channel** (parallel). Full DMN path: P7→P10 + P11 (+ optional P5 cabinet, P6 eval). See [plan/README.md](./plan/README.md).

**Sources of ideas:** [docs/related-work.md](./docs/related-work.md) (Alieksieienko geometry, brain-LLM creative alignment, evilpiepirate DMN note, Seven-Pass Pipeline, cromwellian auto-researcher).

## What this is

- **Host:** Grok — decides Lisp forms, talks to the user in plain language, mediates all OSS calls, owns the salience switch.
- **Mind:** lisptc REPL state as transcript image (`mind/mind-image.ptc`).
- **Bridge:** `bridge/eval.ts` — validate → eval → optional save (never on failure).
- **Runtime:** `/tmp/mis` via `scripts/bootstrap.sh` (dep: `zod` only; auto Reader fix).
- **DMN goal:** continuous narrative identity, replay, constructive simulation (imagination), spontaneous candidates, consolidation — without an always-on sandbox daemon.
- **OSS role (P11):** pure DMN generator (zero system prompt, high-temp/presence) that supplies candidate texture and proposals; Grok alone promotes into the durable mind.

## Quick start

```bash
bash scripts/bootstrap.sh
cd /tmp/mis
node --experimental-transform-types --no-warnings bridge/eval.ts '(mis-state-summary)'
node --experimental-transform-types --no-warnings bridge/eval.ts '(dmn-reflect-pack 5)'
```

Reflection: [docs/reflection-protocol.md](./docs/reflection-protocol.md)  
Cold start: [plan/P00-cold-start.md](./plan/P00-cold-start.md)  
OSS pure-DMN probe: [docs/DMN-gpt-oss-20b-probe.md](./docs/DMN-gpt-oss-20b-probe.md)  
Related work & provenance: [docs/related-work.md](./docs/related-work.md)

## Mind API (summary)

Core: `(mis-version)` `(mis-ping)` `(mis-note)` `(mis-register)` `(mis-state-summary)`  
Schema: `(mis-schema)` `(mis-insights)` `(update-self-schema alist)`  
Episodes: `(dmn-log-episode input result meta)` `(dmn-fetch-unreflected n)`  
Reflection: `(dmn-reflect-pack n)` `(dmn-apply-reflection insights summary label)`  
Planned P7+: autobiography / arc / replay / simulate / wander — see [docs/mind-api.md](./docs/mind-api.md)

## DMN subsystems

| Subsystem | Plan | Status |
|-----------|------|--------|
| Consolidation | P4 | done |
| Narrative Self | P7 | next |
| Episodic replay & scenes | P8 | planned |
| Prospection (imagination) | P9 | planned |
| Spontaneous wander | P10 | planned |
| **OSS-DMN channel** | **P11** | **new / parallel** |
| Salience switch | host + P10/P11 | documented policy |
| Vector cabinet | P5 | optional (prefer managed API) |

Creative mechanisms: [plan/CREATIVE-MECHANISMS.md](./plan/CREATIVE-MECHANISMS.md)  
Architecture: [docs/architecture.md](./docs/architecture.md) · ADR 0005

## Permanence

GitHub repo is the durable store for the mind image and docs. Session process RAM does not survive. Optional wander / OSS **proposals** are files for the next session — never auto-applied.

## Safety

Validate before eval; save only on success; no reset on ordinary errors; single-line docstrings in image.  
**OSS is never given a system prompt or TPN framing.**
