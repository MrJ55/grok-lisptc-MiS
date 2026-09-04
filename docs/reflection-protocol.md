# Reflection protocol (P4)

Grok-driven DMN consolidation. No long-running daemon.

## When to reflect
- After a cluster of errors or surprising results
- After a meaningful stretch of work (idle-like gap in the conversation)
- Before a large goal shift
- Explicit user request to consolidate

## Standard turn

```bash
cd /tmp/mis   # or MIS_RUNTIME after: bash scripts/bootstrap.sh

# 1) Gather
node --experimental-transform-types --no-warnings bridge/eval.ts '(dmn-reflect-pack 10)'

# 2) Apply reflection (Grok chooses insights / summary / label)
node --experimental-transform-types --no-warnings bridge/eval.ts --save --checkpoint \
  '(dmn-apply-reflection
     (quote (insight-one insight-two))
     "One-line episodic summary of what changed."
     "2026-09-04-label")'
```

After a successful apply, optionally bake durable defaults into `mind/schema.ptc` / `mind/episodes.ptc` so the next bootstrap is not transcript-only.

## Forms
| Form | Role |
|------|------|
| `(dmn-reflect-pack n)` | `(list :schema … :episodes …)` via `dmn-fetch-unreflected` |
| `(dmn-apply-reflection insights summary label)` | merges insights into `:working-insights`, sets `:episodic-summary` + `:last-reflection`, logs a reflection episode with `:reality-status inferred`, returns `(mis-state-summary)` |
| `(promote-candidate id)` | Host-mediated reminder only — does **not** auto-mutate; use for OSS dual-write candidates |

`insights` should be a list of short symbols or strings. Prefer additive, specific insights over vague slogans.

## Rules
1. Prefer `--checkpoint` before large schema rewrites.
2. Only `--save` after a successful eval (bridge enforces).
3. Do not eval prose; emit pure Lisp.
4. After reflection, optionally push mind modules to GitHub.
5. Failed forms must not poison the image (P0).

## Optional OSS enrichment (pure-DMN only)
When the pack contains OSS-sourced episodes (`:source oss-dmn`, usually `:reality-status imagined`):

1. Grok may request a **blank-prompt** continuation from gpt-oss-20b (see [DMN-gpt-oss-20b-probe.md](./DMN-gpt-oss-20b-probe.md) and plan/P11).
2. **Never** send system prompts or TPN framing to OSS.
3. Treat the continuation as **candidate** texture: write to `mind/oss-proposals-*.ptc` or cite via `(promote-candidate '…)` — do not eval raw OSS prose into the image.
4. Only Grok-approved Lisp forms may update schema; promotion is explicit.

## Example insights style
Good: `(reader-fix avoid-undefined-fn-without-guard pack-works)`  
Weak: `(be-better think-harder)`

## Relation to full DMN
Reflection is **consolidation**. Narrative chapters (P7), scenes (P8), simulations (P9), and wander proposals (P10) feed into later reflection turns. Prefer promoting dual-write narrative candidates and counterfactual insights through `dmn-apply-reflection` or explicit chapter-close forms rather than free prose in the image.

## Verified (2026-09-04)
Two live sandbox turns (`2026-09-04-p4-turn-1`, `2026-09-04-p4-turn-2`): pack returned schema+episodes; apply updated insights/summary/label; reflection episodes tagged `:reality-status inferred`; state survived process restart.
