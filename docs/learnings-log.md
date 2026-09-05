# Learnings log

Newest first.

## 2026-09-05 — OSS geometry/salience nudge trial

- Pure-DMN seeds aimed at open-threads `geometry-preservation` and `salience-voc-dashboard`.
- Riddle-shaped endings collapse to TPN; C3-style “dream begins with” stays DMN.
- Dual-write: `mind/oss-proposals-20260905-geometry-salience.ptc` (candidate/imagined only).
- Doc: `docs/oss-nudge-exercise-20260905.md`.

## 2026-08-31 — DMN roadmap P7–P10 synced

- Five subsystems mapped: Narrative (P7), Episodic/scenes (P8), Prospection/imagination (P9), Wander (P10), Consolidation (P4 done).
- Imagination treated as constructive simulation (fMRI-backed DMN literature), not mere next-token prediction.
- Session survival: git image + proposal files + APIs; no sandbox daemon.
- P5 prefers managed vector API (e.g. Pinecone Starter) over local sqlite-vec in this environment.
- ADR 0005 accepted; creative mechanisms documented in plan/CREATIVE-MECHANISMS.md.

## 2026-08-31 — P4 reflection protocol

- Added `dmn-reflect-pack` and `dmn-apply-reflection`; two live turns persisted.
- Insights after turn2: reader-fix phase3-verified reflection-helpers-live avoid-undefined-fn-without-guard.
- Plan folder segmented into phase files for blank-session continuity.

## 2026-08-31 — P3 self-schema started + Reader fix

- **Critical bug**: Reader treated `tryToParse` returning `undefined` as a successful number (`if (n !== null)`). Fixed to `if (n !== undefined && n !== null)`. Without this, all list forms evaluated to undefined.
- Multi-line docstrings break the Reader. Keep docstrings single-line in the image.
- Prefer fixed arity + explicit `nil` for optional meta.
- Phase 3 primitives: `*self-schema*`, `update-self-schema`, `dmn-log-episode`, `dmn-fetch-unreflected`, `mis-schema`, `mis-insights`.

## 2026-08-31 — full P0–P2 verification

- 22 scenarios; report in docs/VERIFICATION.md.
- Errors never bricked the mind; image grew only on successful saves.
