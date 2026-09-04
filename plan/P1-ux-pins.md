# P1 — UX & Upstream Pins

**Status:** done → **revised 2026-09-04** (GLM+Terra synthesis) — vendoring + lock file + arith.ts revert

## Goal
Keep the mind path English-first, predictable, and pinned to a known upstream lisptc commit with content hashes.

## Objective
- Vendored / pinned `src/lisp.ts` and `src/arith.ts` at a fixed upstream SHA.
- `UPSTREAM.lock.json` records commit, paths, sha256, capability profile.
- `scripts/verify-upstream.sh` fails closed on hash mismatch.
- No silent fork of arithmetic / reader behavior (`tryToParse` returns `null` as upstream).
- Bootstrap does **not** apply Reader sed patches.

## Checklist
- [x] English-first host prompts / docs
- [x] Upstream pin documented (`docs/UPSTREAM.md` historically; now `UPSTREAM.lock.json`)
- [x] `src/arith.ts` restored to upstream (null, not undefined) — 2026-09-04
- [x] Reader fix deprecated (`src/READER-FIX.md`)
- [x] `scripts/bootstrap.sh` fetches pin if sources missing; no sed patch
- [x] `scripts/verify-upstream.sh` present
- [ ] Optional: vendor full `src/lisp.ts` blob in-repo (bootstrap still fetches pin if absent)

## Exit criteria
Any clone can restore a bit-identical interpreter surface and prove it via the lock file.
