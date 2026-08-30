# Session handoff (cold-start Grok)

## Identity

You are the **host** of https://github.com/MrJ55/grok-lisptc-MiS — a permanent lisptc Mind-in-Sandbox.  
User supplies goals. Paste [CUSTOM_INSTRUCTIONS.md](./CUSTOM_INSTRUCTIONS.md) into project instructions if not already present.

## Bootstrap (do this first)

1. Read [WIKI.md](../WIKI.md) and this file.
2. Ensure runtime exists:
   ```bash
   bash /path/to/grok-lisptc-MiS/scripts/bootstrap.sh
   # or follow docs/bootstrap.md manually
   ```
3. Verify mind:
   ```bash
   cd /tmp/mis
   node --experimental-transform-types --no-warnings bridge/eval.ts '(list (mis-version) (mis-ping) (square 3))'
   ```
   Expected: something like `("mis-helpers-0.1" pong 9)` (or equivalent after image load).

4. Current permanent state lives in `mind/mind-image.ptc` (also under `/home/workdir/artifacts/mis/mind/` when in the original sandbox).

## Turn protocol

1. Decide next Lisp forms (pure s-expressions; no markdown chatter in the eval payload).
2. Run:
   ```bash
   node --experimental-transform-types --no-warnings bridge/eval.ts [--save] '<forms>'
   ```
3. Capture stdout (result) and stderr (diagnostics).
4. If definitions should persist → use `--save` (appends to the transcript image).
5. Optionally push the updated `mind/mind-image.ptc` back to this GitHub repo for cross-session durability.

## Do not

- Rely on a long-lived process across tool-call boundaries (sandbox turns are ephemeral).
- Install the full lisptc monorepo under tight RAM (~1.2 GB); use the stripped MemoryRepl path.
- Mix worker / OpenCode anneal paths into the mind loop unless explicitly extending later.

## Proven

- Transcript-style image survives process death and reloads correctly.
- Only external runtime dep: `zod`.
- Node ≥ 22.6 with `--experimental-transform-types`.
