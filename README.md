# grok-lisptc-MiS

**Grok + sandbox lisptc Mind-in-Sandbox (MiS)** — a permanent neuro-symbolic Lisp REPL mind driven by Grok, extended with a pure-DMN channel via gpt-oss-20b.

Upstream engine: [1hachem/lisptc](https://github.com/1hachem/lisptc)  
Sibling projects: [grok-zero-anneal](https://github.com/MrJ55/grok-zero-anneal) · [pi-zero-shot](https://github.com/MrJ55/pi-zero-shot)

**Start here:** [WIKI.md](./WIKI.md)  
**Plan & status:** [plan/README.md](./plan/README.md)  
**Sources of ideas:** [docs/related-work.md](./docs/related-work.md)

## What this is

```text
User goal
   ↓
Grok (host “Pi”)
   · decides next Lisp forms
   · owns salience switch (Think vs Act)
   · mediates pure-DMN calls to gpt-oss-20b (zero system prompt)
   · reads REPL print / errors / state summaries
   · may also use normal Grok tools (GitHub, files) when needed
   ↓  string of Lisp
Sandbox
   · persistent @repo/repl + interpreter (MemoryRepl)
   · eval → stdout / structured result
   · state lives across turns (mind-image.ptc + process or session)
```

No external codegen workers required for the **mind** path. Grok emits Lisp; the sandbox evaluates it; state is reconstructed from a transcript-style image on every new session. OSS 20B supplies candidate texture only; it never mutates the durable mind.

## Quick restore (new Grok session / blank sandbox)

```bash
# 1. Clone this repo (or pull) into the sandbox artifacts or /tmp
git clone https://github.com/MrJ55/grok-lisptc-MiS.git /tmp/grok-lisptc-MiS
# or: rsync from /home/workdir/artifacts if already present

# 2. Bootstrap runtime (zod only external dep)
bash /tmp/grok-lisptc-MiS/scripts/bootstrap.sh

# 3. Eval
cd /tmp/mis
node --experimental-transform-types --no-warnings bridge/eval.ts '(mis-ping)'
node --experimental-transform-types --no-warnings bridge/eval.ts --save '(defun hello () "mind restored")'
```

Full protocol, custom instructions, and handoff: see [docs/](./docs/).  
Cold-start orientation: [plan/P00-cold-start.md](./plan/P00-cold-start.md).

## Layout

```text
WIKI.md                 Session entry point
README.md
adr/                    Architecture Decision Records
docs/                   Playbooks, handoff, learnings, related-work, custom instructions
bridge/                 eval.ts + driver.ts (string-in/string-out MemoryRepl)
mind/                   mind-image.ptc (permanent state) + helpers.ptc
src/                    Minimal lisptc core (lisp.ts, arith.ts)
scripts/                bootstrap.sh, mis-eval.sh
skills/                 Optional Grok skills (mis-bootstrap, mis-eval, mis-save, mis-reflect)
plan/                   Roadmap (P00–P11)
state/                  Session snapshots / vestige notes
package.json
```

## License

MIT for original code in this repo. Upstream lisptc remains under its own MIT license.  
Portions of `src/lisp.ts` / `src/arith.ts` derive from Nukata Lisp / 1hachem/lisptc.
