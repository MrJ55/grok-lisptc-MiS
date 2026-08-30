# Architecture

## High-level

```text
User goal
   ↓
Grok (this chat agent)
   · plans next Lisp
   · orchestrates tools (files, GitHub, …)
   · reads REPL results
   ↓  pure Lisp string
bridge/eval.ts  (Node, --experimental-transform-types)
   · MemoryRepl (stripped: no MCP / secrets)
   · load mind-image.ptc
   · eval → stdout
   · optional --save append
   ↓
mind/mind-image.ptc   ← permanent symbolic state
```

## Components

| Path | Role |
|------|------|
| `src/lisp.ts` + `src/arith.ts` | Upstream lisptc interpreter core (vendored minimal) |
| `bridge/driver.ts` | Relative re-export for type-stripping |
| `bridge/eval.ts` | CLI: load image → eval → print → optional save |
| `mind/mind-image.ptc` | Reconstructible transcript of definitions |
| `mind/helpers.ptc` | `mis-version`, `mis-ping`, `mis-note` |
| `scripts/bootstrap.sh` | Assemble `/tmp/mis` + zod |
| `docs/*` | Handoff, custom instructions, learnings |

## Turn protocol

1. Grok proposes one or more Lisp forms (+ short intent in natural language for the user).
2. Sandbox runs `node … bridge/eval.ts [--save] '<forms>'`.
3. Result (stdout) is fed back into Grok context.
4. Repeat. Definitions that should survive use `--save`.

## Design constraints (learned)

- Sandbox ~1.2 GB RAM → avoid full `pnpm` monorepo install.
- Prefer request/response eval over a long-lived TTY.
- ESM + `--experimental-transform-types` requires relative imports and a local `node_modules/zod`.
- Transcript image is deliberately simple and debuggable.
