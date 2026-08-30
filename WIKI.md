# grok-lisptc-MiS — Session Wiki (start here)

Live system: **Grok drives a permanent lisptc Mind-in-Sandbox (MiS)**.

## Status (2026-08-30)

- **v0 mind loop working**: MemoryRepl (no MCP), transcript image, save/load across process death.
- Upstream: [1hachem/lisptc](https://github.com/1hachem/lisptc) (`@repo/interpreter` + `@repo/repl`).
- Runtime dep: only `zod`. Full monorepo install avoided (RAM ~1.2 GB sandbox).

## Read order (new / blank session)

1. **This file**
2. [docs/CUSTOM_INSTRUCTIONS.md](./docs/CUSTOM_INSTRUCTIONS.md) — paste into Grok project
3. [docs/session-handoff.md](./docs/session-handoff.md) — cold-start checklist
4. [docs/bootstrap.md](./docs/bootstrap.md) — exact install & restore steps
5. [docs/permanence.md](./docs/permanence.md) — how state survives
6. [docs/learnings-log.md](./docs/learnings-log.md)
7. [docs/architecture.md](./docs/architecture.md)

## Index

| Doc | Purpose |
|-----|---------|
| [docs/CUSTOM_INSTRUCTIONS.md](./docs/CUSTOM_INSTRUCTIONS.md) | Paste into Grok custom instructions |
| [docs/session-handoff.md](./docs/session-handoff.md) | What the next Grok instance must do first |
| [docs/bootstrap.md](./docs/bootstrap.md) | Clone → zod → assemble /tmp/mis → eval |
| [docs/permanence.md](./docs/permanence.md) | mind-image.ptc, GitHub mirror, vestiges |
| [docs/architecture.md](./docs/architecture.md) | Components & turn protocol |
| [docs/learnings-log.md](./docs/learnings-log.md) | Hard-won constraints (RAM, I/O, Node) |
| [docs/decisions-index.md](./docs/decisions-index.md) | ADR index |
| [docs/ops-playbook.md](./docs/ops-playbook.md) | Daily ops checklist |
| [docs/user-prompt-reseed.md](./docs/user-prompt-reseed.md) | One-shot user message to reseed a blank chat |
| [adr/](./adr/) | Individual ADRs |
| [mind/mind-image.ptc](./mind/mind-image.ptc) | Current permanent Lisp image |
| [skills/](./skills/) | Optional Grok skills |

## Sibling projects

- [grok-zero-anneal](https://github.com/MrJ55/grok-zero-anneal) — Grok-as-manager + pure workers (orthogonal; no workers needed for MiS mind path)
- [pi-zero-shot](https://github.com/MrJ55/pi-zero-shot) — Pi adaptation layer (this repo replaces Pi with Grok as host)

## One-line restore

```bash
bash scripts/bootstrap.sh && cd /tmp/mis && node --experimental-transform-types --no-warnings bridge/eval.ts '(list (mis-version) (mis-ping))'
```
