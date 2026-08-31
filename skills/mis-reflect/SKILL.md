# mis-reflect

Run a Grok-driven DMN reflection turn against the MiS mind.

## When
After errors, after a work stretch, or on user request to consolidate.

## Steps
1. Ensure runtime: `bash scripts/bootstrap.sh` if needed.
2. Gather:  
   `node --experimental-transform-types --no-warnings bridge/eval.ts '(dmn-reflect-pack 10)'`
3. Decide insights (short symbols/strings) + one-line summary + label.
4. Apply with save+checkpoint:  
   `node … bridge/eval.ts --save --checkpoint '(dmn-apply-reflection (quote (...)) "summary" "label")'`
5. Optionally push `mind/mind-image.ptc`.

See `docs/reflection-protocol.md` and `plan/P4-reflection-protocol.md`.
