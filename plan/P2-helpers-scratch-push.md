# P2 — Helpers, Scratch, Push

**Status:** done

## Goal
Give Grok a small, stable Mind API and safe experimentation paths.

## Objective
- Core helpers: version, ping, note, register, state-summary.
- Isolated scratch image for experiments.
- Script or path to push the main image to GitHub.

## Implementation method
- Definitions live in `mind/mind-image.ptc` (and helpers.ptc).
- `--scratch` switches load/save target to `mind-scratch.ptc`.
- `scripts/push-mind-image.sh` + GitHub connector.

## Checklist (done)
- [x] mis-version / mis-ping / mis-note / mis-register / mis-state-summary
- [x] Sample arithmetic defs
- [x] --scratch isolation
- [x] Push path documented

## Exit criteria
`(mis-state-summary)` works after cold bootstrap; scratch does not pollute main image.
