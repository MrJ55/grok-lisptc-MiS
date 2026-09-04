# P2 — Helpers, Scratch, Push

**Status:** exit-complete (2026-09-04 — modular mind + host globals + push script)
**Revised:** 2026-09-04 (GLM+Terra synthesis)

## Goal
Give Grok a small, stable Mind API, safe experimentation paths, and a modular mind image that scales.

## Checklist

### Host globals
- [x] `injectHostGlobals(interp)` in `bridge/eval.ts`
- [x] `*today*`, `*now*`, `*session-id*` available in Lisp
- [x] `dmn-narrate` / `dmn-chapter-close` use `*today*`

### Critical fixes
- [x] `dmn-reflect-pack` implemented
- [x] `dmn-apply-reflection` implemented
- [x] Both registered in `*mis-known*`
- [x] `dmn-log-episode` buffer trim restored
- [x] `dmn-fetch-unreflected` retained (compat name; recent-N semantics)
- [x] `dmn-autobiography(n)` honors argument
- [x] `update-self-schema` order fixed (new-map first, then old keys)

### Modularization
- [x] Split into `helpers.ptc`, `schema.ptc`, `episodes.ptc`, `autobiography.ptc`, `arithmetic.ptc`
- [x] Loader uses `(import "...")` (bridge chdirs to image dir during load)
- [x] Old monolithic body replaced by thin loader
- [x] `*mis-known*` retained (dump optional later)

### Scratch + push
- [x] `--scratch` isolation
- [x] `scripts/push-mind-image.sh` stages all mind modules; failures log ephemeral

## Exit criteria
- [x] `(mis-state-summary)` after cold bootstrap
- [x] `(dmn-reflect-pack 5)` returns schema + episodes
- [x] Scratch does not pollute main image
- [x] `mind-image.ptc` is a thin loader
- [x] Host date globals injected

## Layout
```
mind/mind-image.ptc       ;; manifest + imports
mind/helpers.ptc          ;; core API + promote-candidate
mind/schema.ptc           ;; *self-schema* + update
mind/episodes.ptc         ;; buffer + reflection
mind/autobiography.ptc    ;; chapters + arc
mind/arithmetic.ptc       ;; sample arithmetic
```
