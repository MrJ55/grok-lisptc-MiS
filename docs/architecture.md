# Architecture

```
User (English) → Grok host → bridge/eval.ts → lisptc MemoryRepl + mind-image.ptc
```

Validate → eval → save only on success. No reset on EvalException. Scratch image optional.

## DMN-enhanced mind (symbolic)

```
*self-schema*     traits, values, goals, insights     (P3)
*episodic-buffer* recent episodes (+ tags/scenes)   (P3/P8)
*autobiography*   narrativized chapters + refs        (P7)
*narrative-arc*   open threads, tensions, chapter     (P7)
*monologue*       candidate spontaneous thoughts      (P10)
simulate results  future / counterfactual data        (P9)
```

**Host owns:** when to reflect, narrate, simulate, wander; what to `--save`.  
**Image owns:** durable symbolic state.  
**Optional API cabinet (P5):** searchable vestiges; never sole identity.

## Session survival

Process RAM dies with the tool call. Durability = `mind-image.ptc` in git, optional `wander-proposals` files, external APIs.

## Safety

P0 invariants unchanged. Wander and simulate produce **candidates/data**, not automatic commits.
