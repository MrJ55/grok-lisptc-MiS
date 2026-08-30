# ADR 0002: Permanence via transcript-style Lisp image

## Status

Accepted

## Context

The interpreter state is in-memory. Sandbox processes die between turns. lisptc does not yet expose a full image dump.

## Decision

Persist a **transcript** of evaluated forms in `mind/mind-image.ptc`. On every start, a fresh MemoryRepl evaluates the entire file. Optional `--save` appends new forms after success.

## Consequences

- Simple, inspectable, git-friendly.
- Failed forms can pollute the image if carelessly saved — use judgment and edit the file when needed.
- Sufficient for v0; richer reflection can be added later.
