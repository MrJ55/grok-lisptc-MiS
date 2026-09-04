# ADR 0007 — Capability governance (deny-by-default)

**Status:** Accepted  
**Date:** 2026-09-04  
**Phase:** P0.1 State Governance

## Context

The MiS interpreter starts with an empty extension set (`extensions: []`). As optional subsystems (Vestige, git-governed write, external actions) are introduced, unbounded ambient capability would enlarge the attack surface and blur responsibility. Review-by-all (Terra + GLM) required an explicit, profile-based capability framework before any external effect surface is loaded.

## Decision

Adopt **deny-by-default** capability governance:

1. No capability is present unless explicitly loaded.
2. Each capability declares a descriptor: name, profile, effect (`read` / `write`), scope, input/output schemas, audit level, confirmation rule, revocability.
3. Profiles are documented in `docs/capability-governance.md` (`mind-read-v1`, `mind-memory-read-v1`, `mind-candidate-write-v1`, `reflection-v1`, `vestige-maintenance-v1`, `git-governed-write-v1`, `secrets-v1`, `external-action-v1`).
4. First real capability load (expected: Vestige in P5) must follow this framework and record operation events.
5. Capability helpers (`mind-load-capability`, `mind-unload-capability`, `mind-capabilities`, `mind-execute`) are deferred until the first load; the baseline is the empty set plus documentation.

## Consequences

- Bridge and mind image remain free of ambient side-effect surfaces.
- P5+ work has a clear admission checklist.
- Operation event log (`state/audit/operations.jsonl`) is defined as part of the same trust base but is populated only when capabilities exist.
- Threat model items that depend on capability boundaries remain mitigated by absence.

## Alternatives rejected

- Loading broad host APIs by default “for convenience”.
- Collapsing capability control into trust class alone (trust class answers content provenance; capability answers what the runtime may do).
- Implementing full load/unload helpers before any real capability exists.
