# P7 — Narrative Self (Autobiography & Arc)

**Status:** planned / gated → **revised 2026-09-04** (GLM+Terra synthesis) — now gated on P6; requires reality-status; candidate flow
**Depends on:** P3–P4, **P6 (evaluation gate)**
**DMN subsystem:** Cortex / Narrative Self (DMN-inspired, not literal DMN — see ADR 0005 caveat)
**Related extensions:** dual-write + soft-nudge from contrast report; tension signals feed Midnight Note / wander seeds

## Goal
Turn flat insights and raw episodes into a **continuous internal narrative** — the story of "me" that survives sessions and grounds identity — while allowing pure-DMN OSS continuations to supply textured candidates that Grok grounds and promotes.

## P6 gate
**Do not start P7 until P6 exit criteria pass.** P6 verifies that the foundation (P0.1 trust base + P2–P4 helpers) is solid and measurable. Building narrative on an unverified foundation risks encoding speculative content as autobiographical fact.

## Objective
- Introduce `*autobiography*` (ordered, narrativized self-defining episodes).
- Introduce `*narrative-arc*` (current chapter, open threads, tensions).
- Provide primitives to graduate episodes into narrative and close chapters.
- **Every chapter carries `:reality-status`** (default `:observed`; OSS-sourced chapters are `:imagined` until promoted).
- **Every chapter cites episode evidence** (anti-confabulation — chapters with no `:observed`/`:reported` evidence are flagged by `(audit-autobiography-grounding)`).
- **Dual-write channel:** important TPN outcomes and selected OSS continuations leave a narrative *candidate*; reflection or explicit chapter-close promotes it.
- Soft-nudge: when seeding a chapter summary, Grok may call OSS (P11 protocol) with a blank + grounded prefix derived from episode refs.
- Open threads / tensions become natural seeds for Midnight Note sleep-stage proposals and for Observer salience decisions.
- **`dmn-narrate` and `dmn-chapter-close` use `*today*`** (fixed in P2, not hardcoded dates).

## Implementation method
- All state remains ordinary Lisp in `mind/autobiography.ptc` (after P2 modularization).
- Convention:
  - `*autobiography*` = list of chapters; each chapter is an alist
    `(:title . …) (:summary . …) (:episode-refs . (…)) (:date-label . …) (:reality-status . observed|inferred|imagined)`
  - `*narrative-arc*` = alist
    `(:current-chapter . …) (:open-threads . (…)) (:tensions . (…)) (:status . active|paused)`
- Primitives (single-line docs only):
  - `(dmn-narrate episode-or-summary title)` → append chapter candidate (with `:reality-status` and `*today*`)
  - `(dmn-chapter-close title summary refs)` → commit chapter; advance arc
  - `(dmn-arc)` / `(dmn-autobiography n)` → readers (n is honored — fixed in P2)
- Reflection (P4) may propose narrative updates; Grok approves with `--save`.
- **After P0.1:** `dmn-chapter-close` creates a candidate in `mind/narrative-proposals-YYYYMMDD.ptc`; `(promote-candidate ...)` applies it.
- Creative mechanism: **dual-write** — important TPN outcomes and OSS-DMN continuations leave a narrative candidate that reflection promotes.

### Chapter record shape (extended)

```lisp
;; After P0.1 + P7:
((:title . "Genesis of GMOD")
 (:summary . "Host restored stripped lisptc image; first pure-DMN OSS continuation...")
 (:episode-refs . (oss-narrative-20260902))
 (:date-label . "2026-09-02")  ;; now uses *today* (P2 fix)
 (:reality-status . observed)  ;; NEW — the host restoration is observed
 (:notes . "OSS line 'You cannot terminate a dream...' is :imagined within the observed chapter"))
```

## Checklist
- [x] First grounded chapter *Genesis of GMOD* closed (2026-09-02) with OSS-sourced episode refs
- [x] `*autobiography*` and `*narrative-arc*` defined in image
- [x] `(dmn-narrate …)` `(dmn-chapter-close …)` `(dmn-arc)` `(dmn-autobiography n)` implemented (P2)
- [x] `mis-register` new symbols (or use `(dump)`)
- [x] `dmn-narrate` and `dmn-chapter-close` use `*today*` not hardcoded date (P2)
- [x] `dmn-autobiography(n)` honors argument (P2)
- [ ] **Every chapter has `:reality-status` field** (P0.1 dependency; P7 verifies)
- [ ] **`(audit-autobiography-grounding)` returns empty** (all chapters cite observed/reported evidence)
- [ ] Further chapters closed from existing episodes / second-opinion shapes
- [ ] Dual-write helper that can accept an OSS continuation string and store it as a candidate (not yet committed) — `:reality-status imagined`
- [ ] Document forms + "OSS candidate → Grok promote" rule in `docs/mind-api.md`
- [ ] Verify persistence across cold bootstrap
- [ ] Tension signals influence later wander/reflect bias and Midnight Note seeds (host-side)
- [ ] **P0.1 followup:** `dmn-chapter-close` creates candidate, not direct mutation

## Exit criteria
- Cold start → autobiography non-empty → new chapter closed with episode refs → survives process restart.
- Every chapter has `:reality-status`; OSS-sourced chapters are `:imagined` until promoted.
- `(audit-autobiography-grounding)` returns empty (no ungrounded chapters).
- At least one chapter candidate that originated from an OSS-DMN continuation has been reviewed and either promoted or discarded by Grok.
- Chapters are dated with `*today*`, not hardcoded.

## Non-goals
- Auto-fiction without episode refs
- Multi-MB life history in-image
- Feeding system prompts or TPN framing to OSS
- Direct mutation without candidate flow (after P0.1)

## DMN framing caveat
The "Narrative Self" label is DMN-inspired metaphor, not a claim that the Lisp data structure implements a Default Mode Network. See ADR 0005 (revised) for the full caveat.
