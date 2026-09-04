# Reader fix — DEPRECATED (2026-09-04)

**Status:** no longer required.

The fork previously rewrote `src/arith.ts` so `tryToParse` returned `undefined` on failure (upstream returns `null`). That forced a sed patch in `scripts/bootstrap.sh`:

```
if (n !== null) this.token = n;
→ if (n !== undefined && n !== null) this.token = n;
```

## Resolution (review-by-all UR4)

- `src/arith.ts` restored to upstream at commit `2c10ea8ed6edb16e065b746a7f52080956b895de` (`tryToParse` → `null`).
- Bootstrap no longer applies the sed patch.
- `UPSTREAM.lock.json` pins both `lisp.ts` and `arith.ts` content hashes.
- Run `bash scripts/verify-upstream.sh` after any source change.

If `src/lisp.ts` is missing, bootstrap fetches the pinned upstream commit automatically.
