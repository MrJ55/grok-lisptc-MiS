# Upstream pins — lisptc

**Policy:** Pin what we vendor. Prefer exact content hashes for `lisp.ts` / `arith.ts`. Record git SHA when known.

| Item | Value |
|------|--------|
| Upstream repo | https://github.com/1hachem/lisptc |
| Upstream HEAD at pin time (2026-08-31) | `2c10ea8ed6edb16e065b746a7f52080956b895de` |
| Paths vendored | `packages/interpreter/src/lisp.ts`, `arith.ts` |
| Local copies | `src/lisp.ts`, `src/arith.ts` in this repo; also `/home/workdir/artifacts/mis/src/` |

## Content hashes (SHA-256 of files in this repo)

| File | sha256 |
|------|--------|
| `src/lisp.ts` | `ad42e6bc123d05894c32783f32bbadf46a8660a9c44bdeb3527f9a8b772026e2` |
| `src/arith.ts` | `aa0e58ca95731c99f3df0acbacba0d5406b8dbc3975b68a2f228f2914f3a50a2` |

Verify:

```bash
sha256sum src/lisp.ts src/arith.ts
```

Bootstrap (`scripts/bootstrap.sh`) will copy from `/home/workdir/artifacts/mis/src/lisp.ts` if present, else curl upstream raw files.

When re-vendoring after an upstream change, update this table and re-run smoke tests.

## Known upstream issues affecting MiS

### `string-trim` / `_whitespace?` (R10)

In the vendored prelude, `_whitespace?` compares to two-character strings `"\\t"` etc., not real tab/newline/return. Only space is trimmed correctly.

**Mitigation:** do not rely on `string-trim` for tab- or newline-heavy strings; trim in the host (TypeScript) or use space-only data.

### Division by zero

`(/ 1 0)` evaluates to `Infinity` and is treated as success by the bridge.

### Error recovery

Upstream Pi may `repl.reset()` on errors. Our bridge does **not**; definitions survive `EvalException`.
