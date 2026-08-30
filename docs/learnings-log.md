# Learnings log

Append durable observations here. Newest first.

## 2026-08-30 — v0 mind loop

- **RAM**: Full lisptc monorepo install is heavy on ~1.2 GB sandboxes. Stripped MemoryRepl + only `zod` works.
- **I/O**: Heavy `node_modules` writes under `/home/workdir/artifacts` can be slow or hit EIO. Prefer assemble under `/tmp/mis`.
- **Node**: Requires ≥ 22.6 and `--experimental-transform-types` (no build step). ESM resolution ignores classic `NODE_PATH`; put `node_modules` next to the package or use a proper install.
- **Clone**: Shallow `git clone` of upstream can be slow; vendoring the two core `.ts` files is enough for the mind path.
- **State model**: Transcript append of evaluated forms is sufficient for permanence; full environment dump is not required for v0.
- **MCP / secrets**: Intentionally omitted from the bridge so the only external dep is `zod`. Can be re-added later when RAM allows.
- **GitHub**: This repo is the durable home for image + docs + custom instructions so a blank Grok session can reseed.
