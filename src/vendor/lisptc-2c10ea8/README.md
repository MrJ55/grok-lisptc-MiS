# Vendored lisptc @ 2c10ea8

Binary-safe base64 parts of upstream `packages/interpreter/src/lisp.ts`.

| Item | Value |
|------|-------|
| Upstream | https://github.com/1hachem/lisptc |
| Commit | `2c10ea8ed6edb16e065b746a7f52080956b895de` |
| Assembled sha256 | `ad42e6bc123d05894c32783f32bbadf46a8660a9c44bdeb3527f9a8b772026e2` |

Parts: `lisp.b64.part0` … `lisp.b64.part3`.  
`scripts/verify-upstream.sh` and `scripts/bootstrap.sh` decode them into `src/lisp.ts` when missing or hash-mismatched. **No network required.**
