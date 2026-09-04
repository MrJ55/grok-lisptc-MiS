# P0 — Safety

**Status:** done (verified 2026-08-31); **revised 2026-09-04** (GLM+Terra synthesis) — atomic save + form-by-form load added

## Goal
Make it impossible for ordinary mistakes to brick or silently corrupt the durable mind image.

## Objective
- Prevalidate input before eval (reject prose / unbalanced forms).
- Eval failures never write to the image.
- Save is explicit (`--save` / `MIS_SAVE=1`) and **atomic** (temp file + rename).
- Optional `--checkpoint` copies current image to `*.prev.ptc` before append.
- Form-by-form load reports per-form failures instead of swallowing the rest of the image.
- Failures are logged to `mind/mind-failures.log`.

## Checklist
- [x] `bridge/eval.ts` prevalidate → eval → save-on-success
- [x] Exit codes 0 / 1 / 2 documented and used
- [x] Atomic `appendTranscript` (temp + rename) — applied 2026-09-04
- [ ] Form-by-form `loadImage` with per-form status (UR10)
- [x] Failure log path under `mind/`
- [ ] Persist failure log across sandbox resets (or document ephemerality)

## Method notes
See `review-by-all/05-UNIFIED-RECOMMENDATIONS.md` UR9 (atomic save) and UR10 (form-by-form load).

Minimal atomic pattern (already in bridge):
```typescript
const tmp = `${path}.tmp.${process.pid}`;
writeFileSync(tmp, prev + block);
renameSync(tmp, path);
```

Form-by-form load remains a P0 hardening item before heavy image growth.

## Exit criteria
Ordinary eval mistakes cannot overwrite or partially poison the durable image; load is recoverable.
