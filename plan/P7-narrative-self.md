# P7 — Narrative Self (Autobiography & Arc)

**Status:** planned / next (primary focus, parallel with P11)  
**Depends on:** P3–P4  
**DMN subsystem:** Cortex / Narrative Self  
**Related extensions:** dual-write + soft-nudge from [contrast report](../docs/gmod-extensions-contrast-20260902.md); tension signals feed Midnight Note / wander seeds

## Goal
Turn flat insights and raw episodes into a **continuous internal narrative** — the story of “me” that survives sessions and grounds identity — while allowing pure-DMN OSS continuations to supply textured candidates that Grok grounds and promotes.

## Objective
- Introduce `*autobiography*` (ordered, narrativized self-defining episodes).
- Introduce `*narrative-arc*` (current chapter, open threads, tensions).
- Provide primitives to graduate episodes into narrative and close chapters.
- Keep every chapter grounded in logged episode evidence (anti-confabulation).
- **Dual-write channel:** important TPN outcomes and selected OSS continuations leave a narrative *candidate*; reflection or explicit chapter-close promotes it.
- Soft-nudge: when seeding a chapter summary, Grok may call OSS (P11 protocol) with a blank + grounded prefix derived from episode refs.
- Open threads / tensions become natural seeds for Midnight Note sleep-stage proposals and for Observer salience decisions.

## Implementation method
- All state remains ordinary Lisp in `mind-image.ptc`.
- Convention:
  - `*autobiography*` = list of chapters; each chapter is an alist  
    `(:title . …) (:summary . …) (:episode-refs . (…)) (:date-label . …)`
  - `*narrative-arc*` = alist  
    `(:current-chapter . …) (:open-threads . (…)) (:tensions . (…)) (:status . active|paused)`
- Primitives (single-line docs only):
  - `(dmn-narrate episode-or-summary title)` → append chapter candidate
  - `(dmn-chapter-close title summary refs)` → commit chapter; advance arc
  - `(dmn-arc)` / `(dmn-autobiography n)` → readers
- Reflection (P4) may propose narrative updates; Grok approves with `--save`.
- Creative mechanism: **dual-write** — important TPN outcomes and OSS-DMN continuations leave a narrative candidate that reflection promotes.

## Checklist
- [x] First grounded chapter *Genesis of GMOD* closed (2026-09-02) with OSS-sourced episode refs
- [ ] Define / stabilise default `*autobiography*` and `*narrative-arc*` in image
- [ ] Implement `(dmn-narrate …)` `(dmn-chapter-close …)` `(dmn-arc)` `(dmn-autobiography n)` if not already present
- [ ] `mis-register` new symbols; extend state summary or add narrative summary
- [ ] Further chapters closed from existing episodes / second-opinion shapes
- [ ] Dual-write helper that can accept an OSS continuation string and store it as a candidate (not yet committed)
- [ ] Document forms + “OSS candidate → Grok promote” rule in `docs/mind-api.md`
- [ ] Verify persistence across cold bootstrap
- [ ] Tension signals influence later wander/reflect bias and Midnight Note seeds (host-side)

## Exit criteria
Cold start → autobiography non-empty → new chapter closed with episode refs → survives process restart.  
At least one chapter candidate that originated from an OSS-DMN continuation has been reviewed and either promoted or discarded by Grok. (Met for Genesis of GMOD; continue for subsequent chapters.)

## Non-goals
- Auto-fiction without episode refs
- Multi-MB life history in-image
- Feeding system prompts or TPN framing to OSS
