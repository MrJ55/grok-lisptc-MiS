# P10 — Spontaneous Thought & Wander Loop

**Status:** **implemented 2026-09-13** (in-session wander/monologue; Midnight Note + Page Passer **skipped**)
**Depends on:** P7–P9 useful enough to sample from; P11 OSS channel; **P6 (evaluation gate)**
**DMN subsystem:** Spontaneous / Mind-wandering + Salience (host-side) (DMN-inspired)

## Goal
Approximate DMN default activity: generate **candidate** thoughts when demand is low **in session**, without a long-lived sandbox process.

## Runtime
- Module: `mind/wander.ptc`
- Docs: [docs/p10-wander.md](../docs/p10-wander.md)
- Example batch: `mind/wander-proposals-20260913.ptc` (do not import into image)

## Checklist
- [x] Spec proposal file format (`mind/wander-proposals-YYYYMMDD.ptc`); Page Passer heartbeat **skipped**
- [x] Implement wander + monologue helpers (all output tagged `:reality-status imagined`)
- [x] Manual in-session wander + proposal file example; OSS via `(dmn-wander-oss)` host-mediated
- [x] Document "no auto-save from wander / OSS" invariant
- [x] Handoff/docs: review proposals; promote-candidate or discard
- [x] Midnight Note GitHub Action **skipped** (in-session only)
- [x] Midnight Note **skipped**
- [x] Page Passer **skipped**
- [x] Promote path includes `mind-record-event` after review
- [x] Wander output is `candidate` trust class; promotion via `(promote-candidate ...)`

## Exit criteria
- Wander candidates reviewable later via proposal files / `*wander-candidates*`. **met**
- All wander output tagged `:reality-status imagined`. **met**
- P0 holds (no auto-save from wander). **met**
- Unattended Midnight Note. **skipped by design**

## Non-goals (enforced skip)
- Midnight Note GitHub Action
- Page Passer cross-agent exchange
- Always-on Node heartbeat
- Auto-promotion of wander content into identity

## What this accomplishes for Grok-MiS (2026-09-13)

In-session wander produces **imagined candidates** from arc/tensions/goals/errors without unattended cron. Host may soft-nudge OSS, record fragments, and review later via proposal files. Identity stays gated.
