# P8 — Structured replay and scenes

**Status:** implemented 2026-09-12  
**Runtime:** `mind/scenes.ptc`  
**Plan:** [plan/P8-replay-scenes.md](../plan/P8-replay-scenes.md)

## Forms

| Form | Role |
|------|------|
| `(dmn-tag-episode index tag-plist)` | Merge tags into episode at index (0=newest) |
| `(dmn-replay query n)` | Filter working-set buffer; pack tagged **`:reality-status simulated`** + **`:as-of`** |
| `(dmn-replay-errors n)` | Shorthand for `(dmn-replay 'error n)` |
| `(dmn-scene-from ep)` | Scene pack: actors, setting, actions, outcome, affect, ... |
| `(dmn-scene-from-index i)` | Scene from buffer index |
| `(mind-recall-sequence from to)` | Host-mediated Vestige temporal neighborhood (data only) |

## Tag vocabulary

`:valence` `:error?` `:goal-relevance` `:novelty` `:social?` `:reality-status` `:source` `:vestige-id` `:label` `:id` `:actors` `:setting`

Query symbols: `error`, `reflection`, reality-status symbols, `oss`/`oss-dmn`, `vestige-ref`, valence, `high`/`medium`/`low` (goal or novelty), or label/id equality.

## Invariants

- Replay/scenes are **data-only** — never executed as actions.
- Replay pack `:reality-status` is **simulated**; source episodes keep original status.
- `:as-of` + `:checkpoint-ref` freeze the reconstruction moment (working-set ref).
- Long-range sequence is host-mediated via Vestige; in-image buffer is the working set.

## Example

```text
(dmn-replay 'error 5)
(dmn-scene-from-index 0)
(dmn-tag-episode 0 '(:error? t :valence negative :goal-relevance high))
```
