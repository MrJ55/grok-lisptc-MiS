# P9 — Prospection (Future, Counterfactual, Light ToM)

**Status:** planned → **revised 2026-09-04** (GLM+Terra synthesis) — gated on P6; requires reality-status; Vestige causal backfill
**Depends on:** P8 scenes (soft); P4 reflection; P11 OSS channel useful; **P6 (evaluation gate)**
**DMN subsystem:** Prospective / Simulation (DMN-inspired)
**Neuroscience note:** Imagination in DMN is fMRI-supported constructive simulation (past/future overlap); not mere next-token prediction. **Caveat:** This is metaphor, not a claim that the Lisp code implements a DMN.
**Related extension:** Counterfactual curriculum / offline RL — Third-voice bridge

## Goal
Share machinery between memory and **constructive simulation**: future scenarios, counterfactuals, and light other-mind models — structured data for Grok to narrate or act on. OSS may supply pure-DMN phenomenological texture.

## P6 gate
Do not start P9 until P6 exit criteria pass.

## Objective
- Simulate turns return structured scenes + predicted schema/goal deltas.
- Modes: `:future` | `:counterfactual` | `:other-mind`.
- Ground in autobiography, arc tensions, or recent scenes.
- **All simulation results tagged `:reality-status simulated`** — never merged with observed history.
- **Counterfactual curriculum:** after failures, simulate safer policy; promote consistent insights. Prefer an OSS-sourced pure-DMN continuation (Third-voice style) before writing the reflection insight.
- **Vestige causal backfill (P5):** when a failure occurs, `(mind-backfill-cause failure-id)` traces backward to the root cause that doesn't resemble the symptom. This is the "Third-voice bridge" made operational.
- After a failure, Grok may ask OSS (P11 pure-DMN mode) for a short counterfactual continuation seeded from the error episode; the result becomes a candidate for the curriculum.
- Simulation results remain structured data; OSS supplies only the free-form phenomenological layer that Grok may adopt or discard.

## Implementation method
- Lisp stores seeds/results as data; heavy reasoning stays with Grok.
- Optional `(dmn-simulate-pack mode seed-ref)`.
- Result shape:
  ```
  (:mode . …) (:scene . …) (:predicted-outcomes . …) (:schema-delta . …) (:confidence . …) (:reality-status . simulated)
  ```
- **Never execute predicted actions automatically.** The host MUST NOT pass `(:predicted-outcomes . …)` directly to `eval`; it must emit a separate, validated TPN form.
- **After P0.1:** Simulation results are `candidate` trust class; promotion via `(promote-candidate ...)`.

### Counterfactual curriculum flow

```
1. Failure occurs (error episode logged with :reality-status observed, :error? t)
2. (optional) Vestige backfill: (mind-backfill-cause failure-id) → root cause candidate
3. (optional) OSS pure-DMN continuation seeded from error episode → candidate texture (:reality-status imagined)
4. Reflection (P4): synthesize insight from failure + backfill + OSS texture
5. Insight is a candidate (:reality-status inferred) until Grok promotes via (dmn-apply-reflection ...)
6. Promoted insight becomes :reality-status inferred in *self-schema*
```

## Checklist
- [ ] Spec result alist shape in docs (including `:reality-status simulated`)
- [ ] Simulate-pack and/or host protocol for full simulate turns
- [ ] One future simulation from current `:active-goals`
- [ ] One counterfactual from a real error / failure episode
- [ ] One counterfactual simulation that includes an OSS-sourced continuation (P11, Third-voice style)
- [ ] **All simulation results tagged `:reality-status simulated`**
- [ ] **P5 dependency:** `(mind-backfill-cause ...)` backed by Vestige (if P5 done)
- [ ] Optional: promote one counterfactual insight via reflection
- [ ] Document in mind-api + reflection docs + "OSS as texture provider only" rule
- [ ] Prefer OSS pure-DMN texture after high-cost TPN outcomes before finalising the insight
- [ ] **P0.1 followup:** Simulation results are candidate trust class; promotion via `(promote-candidate ...)`

## Exit criteria
- At least two saved simulation results that cite seeds.
- All simulation results tagged `:reality-status simulated`.
- No auto-execution of simulated actions (verified by test).
- At least one OSS-textured candidate reviewed.
- `(audit-reality-status)` confirms no simulated content leaked into observed history.

## Non-goals
- Full multi-agent ToM engine
- Unconstrained story generation as identity
- System prompts to OSS
- Merging simulated content with observed history

## DMN framing caveat
"Prospective / Simulation" is DMN-inspired metaphor. The Lisp data structures do not implement constructive simulation; they store structured results that Grok (the actual simulator) produces. See ADR 0005 (revised).
