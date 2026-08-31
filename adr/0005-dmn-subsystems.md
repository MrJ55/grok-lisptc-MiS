# ADR 0005 — DMN subsystems on MiS

**Status:** Accepted  
**Date:** 2026-08-31

## Context

Reflection (P4) is only one Default Mode Network function. Neuroscience associates the DMN with self-reference, autobiographical memory, constructive simulation (imagination / future / counterfactual), mind-wandering, and an integrating internal narrative. The project needs a path beyond consolidation without violating sandbox ephemerality or P0 safety.

## Decision

Implement a **five-subsystem symbolic DMN** on the transcript image, with Grok as host:

1. **Narrative Self** — `*autobiography*`, `*narrative-arc*` (P7)
2. **Episodic** — tagged buffer, replay, scenes (P3/P8)
3. **Prospective** — structured simulate results (P9); imagination = constructive simulation (fMRI-backed)
4. **Spontaneous** — wander + monologue + **proposal files** only (P10); no always-on sandbox daemon
5. **Consolidation** — reflection protocol (P4)

Optional **vector cabinet** (P5) is searchable history, not identity. Prefer managed free-tier APIs over local sqlite-vec in this sandbox.

Creative mechanisms are tracked in `plan/CREATIVE-MECHANISMS.md`.

## Consequences

- Plan gains P7–P10; P5 updated toward managed search.
- Session boundaries: only git, proposal artifacts, and external APIs survive.
- Identity remains inspectable Lisp; heavy reasoning stays with Grok.

## Alternatives rejected

- Always-on Node DMN daemon in sandbox.
- Full local SQLite+RRF as first search implementation.
- Replacing symbolic schema with vectors alone.
