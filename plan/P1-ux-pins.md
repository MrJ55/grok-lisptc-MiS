# P1 — UX & Upstream Pins

**Status:** exit substantially met (2026-09-04) — upstream arith restored; lock+CI; lisp via pin (assemble from vendor parts when complete, else network fetch at pin)

## Goal
Keep the mind path English-first, predictable, and pinned to known upstream sources — with **enforced** pinning, not just documented.

## Objective
- Document host language expectations.
- **Vendor `src/lisp.ts` and `src/arith.ts`** pinned to upstream commit.
- **Revert `src/arith.ts` to upstream verbatim** (eliminate the Reader patch).
- Pin via `UPSTREAM.lock.json` + `scripts/verify-upstream.sh` + CI.
- Record known dialect caveats.

## Checklist

### Vendoring
- [x] English-first host interaction
- [x] Upstream source documented
- [x] Caveats logged
- [x] **`src/arith.ts` upstream verbatim** at `2c10ea8` (sha256 matches lock)
- [x] **`src/lisp.ts` pin enforced** — hash-checked; assembled from `src/vendor/lisptc-2c10ea8/lisp.b64.part*` when parts are real, else fetch at pin (`MIS_ALLOW_NETWORK_VENDOR`, default 1 until all parts filled)
- [x] **No Reader `sed` patch** in bootstrap
- [x] **`src/READER-FIX.md` retained as historical note only** (patch not applied)

### Lock file
- [x] `UPSTREAM.lock.json` with commit + content hashes
- [x] `scripts/verify-upstream.sh` exits 0
- [x] CI runs `verify-upstream.sh` on every push

### Verification
- [x] `(half 8)` → `4.0` (upstream `.0` rule)
- [x] `(mis-version)` → `"mis-helpers-0.4"`
- [x] `scripts/smoke-test.sh` covers helpers + safety

### Attribution
- [x] Nukata / lisptc attribution present in `arith.ts` header and README license section

## Exit criteria
- [x] `sha256sum src/arith.ts` matches lock
- [x] `sha256sum src/lisp.ts` matches lock after verify/bootstrap
- [x] Bootstrap works (zod may need network once; interpreter sources pin-enforced)
- [x] Reader patch not applied; `tryToParse` returns `null`
- [ ] All four `lisp.b64.part*` filled (part3 done; 0–2 may still be PLACEHOLDER pending bulk upload) — network pin remains available

## Non-goals
- Transactional persistence (P0.1)
- Trust classes (P0.1)
- Modularization of `mind-image.ptc` (P2)
