# P9 — Prospection (Future, Counterfactual, Light ToM)

**Status:** planned  
**Depends on:** P8 scenes (soft); P4 reflection  
**DMN subsystem:** Prospective / Simulation  
**Neuroscience note:** Imagination in DMN is fMRI-supported constructive simulation (past/future overlap); not mere next-token prediction.

## Goal
Share machinery between memory and **constructive simulation**: future scenarios, counterfactuals, and light other-mind models — structured data for Grok to narrate or act on.

## Objective
- Simulate turns return structured scenes + predicted schema/goal deltas.
- Modes: `:future` | `:counterfactual` | `:other-mind`.
- Ground in autobiography, arc tensions, or recent scenes.
- **Counterfactual curriculum:** after failures, simulate safer policy; promote consistent insights.

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
- [ ] Optional: promote one counterfactual insight via reflection
- [ ] Document in mind-api + reflection docs

## Exit criteria
At least two saved simulation results that cite seeds; no auto-execution of simulated actions.

## Non-goals
- Full multi-agent ToM engine
- Unconstrained story generation as identity
