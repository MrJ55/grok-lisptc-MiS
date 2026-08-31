# Reflection protocol (P4)

Grok-driven DMN consolidation. No long-running daemon.

## When to reflect
- After a cluster of errors or surprising results
- After a meaningful stretch of work (idle-like gap in the conversation)
- Before a large goal shift
- Explicit user request to consolidate

## Standard turn

```bash
cd /tmp/mis

# 1) Gather (optional inspect)
node --experimental-transform-types --no-warnings bridge/eval.ts '(dmn-reflect-pack 10)'

# 2) Apply reflection (Grok chooses insights / summary / label)
node --experimental-transform-types --no-warnings bridge/eval.ts --save --checkpoint \
  '(dmn-apply-reflection
     (quote (insight-one insight-two))
     "One-line episodic summary of what changed."
     "2026-08-31-label")'
```

## Forms
| Form | Role |
|------|------|
| `(dmn-reflect-pack n)` | `(list :schema … :episodes …)` |
| `(dmn-apply-reflection insights summary label)` | updates schema, logs episode meta `"reflection"`, returns `mis-state-summary` |

`insights` should be a list of short symbols or strings. Prefer additive, specific insights over vague slogans.

## Rules
1. Always prefer `--checkpoint` before large schema rewrites.
2. Only `--save` after a successful eval (bridge enforces).
3. Do not eval prose; emit pure Lisp.
4. After reflection, optionally push `mind/mind-image.ptc` to GitHub.

## Example insights style
Good: `(reader-fix avoid-undefined-fn-without-guard pack-works)`  
Weak: `(be-better think-harder)`

## Relation to full DMN

Reflection is **consolidation**. Narrative chapters (P7), scenes (P8), simulations (P9), and wander proposals (P10) feed *into* later reflection turns. Prefer promoting dual-write narrative candidates and counterfactual insights through `dmn-apply-reflection` or explicit chapter-close forms rather than free prose in the image.
