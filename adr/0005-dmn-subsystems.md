# ADR 0005 — DMN subsystems on MiS

**Status:** Accepted (extended 2026-09-02)  
**Date:** 2026-08-31 (OSS channel + related-work provenance added 2026-09-02)

## Context

Reflection (P4) is only one Default Mode Network function. Neuroscience associates the DMN with self-reference, autobiographical memory, constructive simulation (imagination / future / counterfactual), mind-wandering, and an integrating internal narrative. The project needs a path beyond consolidation without violating sandbox ephemerality or P0 safety.

Behavioural probes (see `docs/DMN-gpt-oss-20b-probe.md`) and residual-stream geometry work (Alieksieienko 2026, Zenodo) show that gpt-oss-20b can produce strong DMN-style continuations when kept free of system prompts and TPN framing. This geometry is a valuable source of candidate texture and spontaneous thought, but must never be allowed to mutate the durable symbolic mind directly.

Additional sources that shaped the design (salience switching, offline RL framing, undirected foraging) are recorded in `docs/related-work.md`.

## Decision

Implement a **five-subsystem symbolic DMN** on the transcript image, with Grok as host, plus an explicit **OSS-DMN channel** and a documented **host-side Salience Switch**:

1. **Narrative Self** — `*autobiography*`, `*narrative-arc*` (P7)
2. **Episodic** — tagged buffer, replay, scenes (P3/P8)
3. **Prospective** — structured simulate results (P9); imagination = constructive simulation (fMRI-backed)
4. **Spontaneous** — wander + monologue + **proposal files** only (P10); no always-on sandbox daemon
5. **Consolidation** — reflection protocol (P4)
6. **OSS-DMN channel** (P11) — pure DMN generator (zero system prompt, locked parameters) that supplies candidates and phenomenological texture; Grok alone promotes into Lisp forms
7. **Salience Switch** (host policy) — arbitrates Think (DMN/OSS) vs Act (TPN) using simple, inspectable rules inspired by the triple-network model and the Seven-Pass Pipeline

Optional **vector cabinet** (P5) is searchable history, not identity. Prefer managed free-tier APIs over local sqlite-vec in this sandbox.

Creative mechanisms are tracked in `plan/CREATIVE-MECHANISMS.md`. Provenance of ideas: `docs/related-work.md`.

## Consequences

- Plan gains P7–P11; P5 updated toward managed search.
- Session boundaries: only git, proposal artifacts, and external APIs survive.
- Identity remains inspectable Lisp; heavy reasoning stays with Grok.
- OSS is treated strictly as a geometry-preserving proposal engine; any system/TPN prompt is a protocol violation.
- Salience decisions are host-side, explicit, and tunable.

## Alternatives rejected

- Always-on Node DMN daemon in sandbox.
- Full local SQLite+RRF as first search implementation.
- Replacing symbolic schema with vectors alone.
- Letting OSS write directly to the mind image or receive instructional framing.
