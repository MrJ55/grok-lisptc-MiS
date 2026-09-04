# src/

Pinned lisptc core (commit `2c10ea8`).

- `arith.ts` — vendored upstream verbatim (hash-locked).
- `lisp.ts` — assembled from `vendor/lisptc-2c10ea8/lisp.b64.part{0-3}` by `scripts/verify-upstream.sh` / `scripts/bootstrap.sh` (offline).

```bash
bash scripts/verify-upstream.sh
bash scripts/bootstrap.sh
```

Network fetch of interpreter sources is off by default. Set `MIS_ALLOW_NETWORK_VENDOR=1` only as emergency fallback.
