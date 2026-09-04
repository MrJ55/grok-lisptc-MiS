# P1 — UX & Upstream Pins

**Status:** done → **revised 2026-09-04** (GLM+Terra synthesis) — vendoring + lock file + arith.ts revert

## Goal
Keep the mind path English-first, predictable, and pinned to known upstream sources — with **enforced** pinning, not just documented.

## Objective
- Document host language expectations.
- **Vendor `src/lisp.ts` and `src/arith.ts` directly into the repo** (no runtime curl).
- **Revert `src/arith.ts` to upstream verbatim** (eliminate the Reader patch).
- Pin to a specific upstream commit SHA via `UPSTREAM.lock.json`.
- Record known dialect caveats (e.g. `string-trim`, `&optional`).

## Implementation method

### A. Vendor `src/lisp.ts` (UR5)

```bash
curl -fsSL -o src/lisp.ts \
  https://raw.githubusercontent.com/1hachem/lisptc/2c10ea8ed6edb16e065b746a7f52080956b895de/packages/interpreter/src/lisp.ts
sha256sum src/lisp.ts  # record in UPSTREAM.lock.json
git add src/lisp.ts
```

The file is ~73 KB — trivial for git. Pin to commit SHA `2c10ea8`, not `main`.

Update `scripts/bootstrap.sh`:
- Remove the curl fallback (lines 17–26) or gate behind `--allow-network` flag.
- Use the vendored copy directly.

Update `docs/UPSTREAM.md`:
- Note that `src/lisp.ts` is now vendored.
- Keep the SHA-256 hash table for verification.

### B. Revert `src/arith.ts` to upstream (UR4)

```bash
curl -fsSL -o src/arith.ts \
  https://raw.githubusercontent.com/1hachem/lisptc/2c10ea8ed6edb16e065b746a7f52080956b895de/packages/interpreter/src/arith.ts
sha256sum src/arith.ts  # record in UPSTREAM.lock.json
```

This restores:
- `tryToParse` returning `null` (not `undefined`) — **eliminates the Reader bug**
- The `BigInt === "undefined"` defensive guard
- The `123.0` → `"123.0"` `convertToString` rule (fixes `VERIFICATION.md` reproducibility)
- The Nukata Lisp attribution comment

### C. Delete the Reader patch infrastructure

- Delete `src/READER-FIX.md`.
- Delete lines 36–41 of `scripts/bootstrap.sh` (the `sed` patch).
- Update `docs/learnings-log.md` to note the patch is no longer needed.

### D. `UPSTREAM.lock.json` (UR6 — created in P0.1, referenced here)

The lock file is the enforcement layer. `scripts/verify-upstream.sh` (created in P0.1) compares vendored hashes against the lock file. CI runs it on every push.

### E. Re-run verification

After reverting `arith.ts`, re-run `docs/VERIFICATION.md` scenarios:
- `(half 8)` should now return `4.0` (not `4`) — update `VERIFICATION.md` with actual output.
- `(mis-version)` should return `"mis-helpers-0.3"` — update `VERIFICATION.md`.
- All 22 scenarios should pass; record actual output.

Convert `VERIFICATION.md` into an executable `scripts/smoke-test.sh` (see P6).

## Checklist

### Vendoring
- [x] English-first host interaction (done)
- [x] Upstream source documented (done)
- [x] Caveats logged (done)
- [ ] **Vendor `src/lisp.ts` into repo** (UR5) — ~73 KB, pin to `2c10ea8`
- [ ] **Revert `src/arith.ts` to upstream verbatim** (UR4) — restores `null` return, `.0` rule, BigInt guard
- [ ] **Delete `src/READER-FIX.md`** (UR4)
- [ ] **Delete `sed` patch in `scripts/bootstrap.sh`** lines 36–41 (UR4)
- [ ] **Remove or gate curl fallback** in `scripts/bootstrap.sh` (UR5)

### Lock file (coordination with P0.1)
- [ ] `UPSTREAM.lock.json` created with `lisptc_commit`, `lisp_source_sha256`, `arith_source_sha256` (UR6)
- [ ] `scripts/verify-upstream.sh` exits 0 on vendored sources (UR6)
- [ ] CI runs `verify-upstream.sh` on every push (UR8)

### Verification refresh
- [ ] Re-run `VERIFICATION.md` scenarios after `arith.ts` revert
- [ ] Update `VERIFICATION.md` with actual output (`4.0` not `4`, `0.3` not `0.2`)
- [ ] Convert `VERIFICATION.md` into `scripts/smoke-test.sh` (P6)

### Attribution restoration
- [ ] Restore Nukata Lisp attribution comment in `arith.ts` (was stripped in fork's rewrite)
- [ ] Update `README.md` line 71 — "Portions of `src/lisp.ts` / `src/arith.ts` derive from Nukata Lisp / 1hachem/lisptc" is now accurate (verbatim copy, not rewrite)

## Exit criteria
- `src/lisp.ts` and `src/arith.ts` are in the repo (not fetched at runtime).
- `sha256sum src/lisp.ts src/arith.ts` matches `UPSTREAM.lock.json`.
- `bash scripts/bootstrap.sh` works without network access (except for `zod` install on first run).
- `bash scripts/verify-upstream.sh` exits 0.
- The Reader `tryToParse` patch is gone; `(list 1 2 3)` evaluates to `(1 2 3)` not `undefined`.
- `VERIFICATION.md` scenarios are reproducible against current code.

## Non-goals
- Transactional persistence (P0.1)
- Trust classes (P0.1)
- Modularization of `mind-image.ptc` (P2)
