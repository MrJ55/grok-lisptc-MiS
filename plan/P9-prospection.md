# P9 — Prospection & Simulation

**Status:** planned → **revised 2026-09-04** (GLM+Terra synthesis) — gated on P6; requires reality-status; counterfactual curriculum
**Depends on:** P7 (or sufficient arc/episodes), P8 helpful; **P6 (evaluation gate)**
**DMN subsystem:** Prospective / Simulation (DMN-inspired)
**Related extensions:** Third-voice bridge / counterfactual curriculum

## Goal
Support future-oriented simulation: counterfactuals, plan sketches, light theory-of-mind — always as **candidate** material (`:reality-status planned` or `:simulated`), never auto-promoted into identity.

## P6 gate
Do not start P9 until P6 exit criteria pass.

## Objective
- `(dmn-simulate-pack goal-or-question)` assembles context for host or OSS-assisted simulation.
- Simulations are tagged `:reality-status simulated` (or `:planned` for intentions).
- Optional OSS texture under pure-DMN protocol for counterfactual richness.
- Feed outcomes into reflection (P4) and narrative (P7) only via explicit Grok promotion.
- **Third-voice bridge:** offline RL / counterfactual curriculum as design target (see contrast report §4).

## Implementation method
- Pack recent episodes, open threads, and relevant autobiography chapters.
- Host emits simulation results as Lisp data (not free prose into the image).
- Dual-write optional: episode log + proposal file for large simulations.
- All simulation outputs carry `:reality-status simulated` unless explicitly reconstructing recorded history.

## Checklist
- [ ] Spec simulate-pack shape and reality-status rules
- [ ] Implement `(dmn-simulate-pack …)` helper
- [ ] Document promotion path into P4/P7
- [ ] One end-to-end simulation that is reviewed and selectively applied
- [ ] No auto-save of raw OSS simulation text

## Exit criteria
Simulation packs are data-only; promoted insights update schema/narrative only via explicit Grok forms; `(audit-reality-status)` clean.

## Non-goals
- Full agentic planning stack
- Unbounded future branching without review
