# ADR 0003: Stripped MemoryRepl (no MCP in v0)

## Status

Accepted

## Context

Full `@repo/repl` pulls MCP SDK, secrets, jobs, and a heavier dependency graph. Sandbox RAM is limited (~1.2 GB).

## Decision

Ship a minimal `MemoryRepl` that uses `Interp({ extensions: [] })` and only the core `lisp.ts` + `arith.ts`. External runtime dependency: `zod` only.

## Consequences

- Fast bootstrap, reliable under tight resources.
- MCP tools and secret handling are deferred; can be reintroduced when resources allow or via a separate long-lived process.
