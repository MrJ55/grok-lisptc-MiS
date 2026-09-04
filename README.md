# grok-lisptc-MiS

**Grok + sandbox lisptc Mind-in-Sandbox (MiS)** — a permanent neuro-symbolic Lisp REPL mind driven by Grok, extended with a pure-DMN channel via gpt-oss-20b.

Upstream engine: [1hachem/lisptc](https://github.com/1hachem/lisptc) (pinned at `2c10ea8` via `UPSTREAM.lock.json`)  
Sibling projects: [grok-zero-anneal](https://github.com/MrJ55/grok-zero-anneal) · [pi-zero-shot](https://github.com/MrJ55/pi-zero-shot)

**Start here:** [WIKI.md](./WIKI.md)  
**Plan & status:** [plan/README.md](./plan/README.md)  
**Audit (2026-09-04):** [review-by-all/](./review-by-all/) · revised contracts [revised-plan-GLM/](./revised-plan-GLM/)  
**Sources of ideas:** [docs/related-work.md](./docs/related-work.md)

## Status (2026-09-04)

Tier-1 fixes from the multi-model review are applied: reflection helpers live, episodic buffer trims, upstream `arith.ts` restored (no Reader patch), atomic save, host `*today*`/`*now*`.  
**Active focus:** P0.1 State Governance → P6 Evaluation, then P7–P11. Six named OSS extensions remain design targets.

## What this is

```text
User goal
   ↓
Grok (host)
   · decides next Lisp forms
   · owns salience switch (Think vs Act)
   · mediates pure-DMN calls to gpt-oss-20b (zero system prompt)
   · reads REPL print / errors / state summaries
   · may also use normal Grok tools (GitHub, files) when needed
   ↓  string of Lisp
Sandbox
   · persistent MemoryRepl + interpreter
   · validate → eval → atomic save on success only
   · state lives across turns (mind-image.ptc + git)
```

No external codegen workers required for the **mind** path. Grok emits Lisp; the sandbox evaluates it; state is reconstructed from a transcript-style image on every new session. OSS 20B supplies candidate texture only; it never mutates the durable mind.

## Quick restore (new Grok session / blank sandbox)

```bash
git clone https://github.com/MrJ55/grok-lisptc-MiS.git /tmp/grok-lisptc-MiS
bash /tmp/grok-lisptc-MiS/scripts/bootstrap.sh
bash /tmp/grok-lisptc-MiS/scripts/verify-upstream.sh   # optional
bash /tmp/grok-lisptc-MiS/scripts/smoke-test.sh
cd /tmp/mis
node --experimental-transform-types --no-warnings bridge/eval.ts '(mis-state-summary)'
node --experimental-transform-types --no-warnings bridge/eval.ts '(dmn-reflect-pack 5)'
```

Full protocol: [docs/](./docs/). Cold-start: [plan/P00-cold-start.md](./plan/P00-cold-start.md).

## Layout

```text
WIKI.md                 Session entry point
README.md
UPSTREAM.lock.json      Pinned lisptc commit + content hashes
adr/                    Architecture Decision Records
docs/                   Playbooks, handoff, learnings, related-work
bridge/                 eval.ts + driver.ts (string-in/string-out MemoryRepl)
mind/                   mind-image.ptc (permanent state, helpers v0.4)
src/                    Vendored/pinned lisptc core (lisp.ts, arith.ts)
scripts/                bootstrap.sh, verify-upstream.sh, smoke-test.sh
skills/                 Optional Grok skills
plan/                   Roadmap (P00–P11; P0.1 active)
review-by-all/          Integrated GLM + Terra audit
revised-plan-GLM/       Revised phase contracts
state/                  Session snapshots / vestige notes
package.json
```

## License

MIT for original code in this repo. Upstream lisptc remains under its own MIT license.  
Portions of `src/lisp.ts` / `src/arith.ts` derive from Nukata Lisp / 1hachem/lisptc.
