# src/

Minimal lisptc core required by the stripped MemoryRepl.

- `arith.ts` — numeric helpers (included).
- `lisp.ts` — full interpreter (~73 KB).

**Obtain `lisp.ts` if missing:**

```bash
# From upstream
curl -fsSL -o src/lisp.ts \
  https://raw.githubusercontent.com/1hachem/lisptc/main/packages/interpreter/src/lisp.ts

# Or from the original sandbox artifacts
cp /home/workdir/artifacts/mis/src/lisp.ts src/
```

Bootstrap expects `src/lisp.ts` present. The file is pure TypeScript and runs under Node `--experimental-transform-types`.
