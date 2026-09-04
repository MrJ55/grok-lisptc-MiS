# mis-reflect

Run a Grok-driven DMN reflection turn against the MiS mind.

## When
After errors, after a work stretch, or on user request to consolidate.

## Steps
1. Ensure runtime: `bash scripts/bootstrap.sh` if needed (`MIS_RUNTIME=/tmp/mis`).
2. Gather:  
   `node --experimental-transform-types --no-warnings bridge/eval.ts '(dmn-reflect-pack 10)'`
3. Decide insights (short symbols/strings) + one-line summary + label.
4. Apply with save+checkpoint:  
   `node --experimental-transform-types --no-warnings bridge/eval.ts --save --checkpoint '(dmn-apply-reflection (quote (insight-a insight-b)) "summary" "label")'`
5. Confirm: `(mis-insights)`, `:last-reflection`, and newest episode meta includes `:reality-status inferred`.
6. Optional OSS texture: pure-DMN continuation only; store as candidate; never eval raw OSS prose. Use `(promote-candidate 'id)` as host-mediated gate.
7. Optionally bake defaults into `mind/schema.ptc` / episodes and push modules.

## Verify
```bash
node --experimental-transform-types --no-warnings bridge/eval.ts '(dmn-reflect-pack 5)'
node --experimental-transform-types --no-warnings bridge/eval.ts '(audit-reality-status)'
```

See `docs/reflection-protocol.md` and `plan/P4-reflection-protocol.md`.
