# ADR 0004: Runtime under /tmp, durable assets in repo

## Status

Accepted

## Context

`node_modules` and repeated installs under the project artifacts volume are slow and sometimes fail with I/O errors. Durable state must survive sandbox resets.

## Decision

- Assemble the runnable tree under `/tmp/mis` (sources + zod + mind image copy).
- Keep canonical sources, image, docs, and scripts in this GitHub repository (and mirrored under `artifacts/mis/` when present).

## Consequences

- Every new session re-runs bootstrap (seconds).
- GitHub becomes the cross-session source of truth for the mind image and instructions.
