# src/

Minimal lisptc core required by the stripped MemoryRepl.

- `arith.ts` — numeric helpers (vendored; hash-locked).
- `lisp.ts` — full interpreter (~73 KB), pinned to upstream commit in `UPSTREAM.lock.json`.

## Pin / verify

```bash
bash scripts/verify-upstream.sh   # fetches if incomplete, then sha256-checks
bash scripts/bootstrap.sh         # builds /tmp/mis and smoke-tests
```

If `src/lisp.ts` is missing, empty, marked `VENDOR_STUB`, or hash-mismatched, both scripts re-fetch from:

`https://raw.githubusercontent.com/1hachem/lisptc/<pin>/packages/interpreter/src/lisp.ts`

Expected hashes live in `UPSTREAM.lock.json`.
