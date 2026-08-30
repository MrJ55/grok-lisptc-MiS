# Permanence model

## Problem

Grok sessions and sandbox tool-call processes are turn-based and ephemeral. The lisptc interpreter holds definitions in memory; when the process dies the image is gone unless reconstructed.

## Solution (v0)

**Primary store — transcript-style Lisp image**

- File: `mind/mind-image.ptc`
- After successful eval with `--save`, the evaluated forms are appended (timestamped).
- On every start the bridge does: fresh `MemoryRepl` → `eval(entire image)` → ready.
- Inspectable, versionable, pushable to GitHub.

**Secondary — this GitHub repository**

- Commit / push updated `mind/mind-image.ptc` (and helpers) so any new sandbox can `git pull` and restore.
- Docs, ADRs, custom instructions, and bootstrap scripts travel with the image.

**Tertiary (planned) — vestige / vector memory**

- Pinecone free Starter (or Qdrant / Weaviate free tier) for episodic notes, goals, and summaries.
- On restore: query top-k vestiges → inject as Lisp data or prompt context.
- Orthogonal to the symbolic image.

## What is *not* persisted yet

- Full environment dump / core image (lisptc has no reflection dump yet).
- Open file handles, MCP server connections, or worker threads.
- Long-lived process across Grok tool-call boundaries (prefer request/response eval).

## Restore checklist

1. Clone or pull this repo.
2. `bash scripts/bootstrap.sh`
3. Eval any form; image is auto-loaded unless `--reset`.
4. Confirm `(mis-ping)` → `pong` and any user-defined functions.

## Future upgrades

- Richer `(save-mind)` that walks globals once lisptc exposes them.
- Optional long-lived eval server (HTTP or Unix socket) if the sandbox allows background processes.
- Automatic GitHub push of the image after each `--save`.
