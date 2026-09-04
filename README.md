# grok-lisptc-MiS

**Grok + sandbox lisptc Mind-in-Sandbox (MiS)** — a permanent neuro-symbolic Lisp REPL mind driven by Grok, extended with a pure-DMN channel via gpt-oss-20b.

Upstream engine: [1hachem/lisptc](https://github.com/1hachem/lisptc) (pinned at `2c10ea8` via `UPSTREAM.lock.json`)  
Sibling projects: [grok-zero-anneal](https://github.com/MrJ55/grok-zero-anneal) · [pi-zero-shot](https://github.com/MrJ55/pi-zero-shot)

**Start here:** [WIKI.md](./WIKI.md)  
**Plan & status:** [plan/README.md](./plan/README.md)  
**Audit (2026-09-04):** [review-by-all/](./review-by-all/) · revised contracts [revised-plan-GLM/](./revised-plan-GLM/)

## Status (2026-09-04)

P00 + P0 exit-complete; P0.1 + P1 substantially met (upstream `arith.ts`, pin lock, CI, safety tests).  
**Active focus:** P6 Evaluation, then P7–P11.

## Quick restore

```bash
git clone https://github.com/MrJ55/grok-lisptc-MiS.git /tmp/grok-lisptc-MiS
bash /tmp/grok-lisptc-MiS/scripts/bootstrap.sh
bash /tmp/grok-lisptc-MiS/scripts/verify-upstream.sh
bash /tmp/grok-lisptc-MiS/scripts/smoke-test.sh
cd /tmp/mis
node --experimental-transform-types --no-warnings bridge/eval.ts '(mis-state-summary)'
```

## License

MIT for original code in this repo. Upstream lisptc remains under its own MIT license.  
Portions of `src/lisp.ts` / `src/arith.ts` derive from Nukata Lisp / 1hachem/lisptc (verbatim pin at `2c10ea8`).
