# P9 — Prospection (Future, Counterfactual, Light ToM)

**Status:** planned  
**Depends on:** P8 scenes (soft); P4 reflection; P11 OSS channel useful  
**DMN subsystem:** Prospective / Simulation  
**Neuroscience note:** Imagination in DMN is fMRI-supported constructive simulation (past/future overlap); not mere next-token prediction.

## Goal
Share machinery between memory and **constructive simulation**: future scenarios, counterfactuals, and light other-mind models — structured data for Grok to narrate or act on. OSS may supply pure-DMN phenomenological texture.

## Objective
- Simulate turns return structured scenes + predicted schema/goal deltas.
- Modes: `:future` | `:counterfactual` | `:other-mind`.
- Ground in autobiography, arc tensions, or recent scenes.
- **Counterfactual curriculum:** after failures, simulate safer policy; promote consistent insights.
- After a failure, Grok may ask OSS (P11 pure-DMN mode) for a short counterfactual continuation seeded from the error episode; the result becomes a candidate for the curriculum.
- Simulation results remain structured data; OSS supplies only the free-form phenomenological layer that Grok may adopt or discard.

## Implementation method
- Lisp stores seeds/results as data; heavy reasoning stays with Grok.
- Optional `(dmn-simulate-pack mode seed-ref)`.
- Result shape: `(:mode . …) (:scene . …) (:predicted-outcomes . …) (:schema-delta . …) (:confidence . …)`
- Never execute predicted actions automatically.

## Checklist
- [ ] Spec result alist shape in docs
- [ ] Simulate-pack and/or host protocol for full simulate turns
- [ ] One future simulation from current `:active-goals`
- [ ] One counterfactual from the undefined-fn error episode
- [ ] One counterfactual simulation that includes an OSS-sourced continuation (P11)
- [ ] Optional: promote one counterfactual insight via reflection
- [ ] Document in mind-api + reflection docs + “OSS as texture provider only” rule

## Exit criteria
At least two saved simulation results that cite seeds; no auto-execution of simulated actions; at least one OSS-textured candidate reviewed.

## Non-goals
- Full multi-agent ToM engine
- Unconstrained story generation as identity
- System prompts to OSS
