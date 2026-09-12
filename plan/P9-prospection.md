# P9 — Prospection (Future, Counterfactual, Light ToM)

**Status:** **implemented 2026-09-12** (core packs + log + curriculum host protocol); revised 2026-09-04 plan retained
**Depends on:** P8 scenes (soft); P4 reflection; P11 OSS channel useful; **P6 (evaluation gate)**
**DMN subsystem:** Prospective / Simulation (DMN-inspired)

## Goal
Share machinery between memory and **constructive simulation**: future scenarios, counterfactuals, and light other-mind models — structured data for Grok to narrate or act on. OSS may supply pure-DMN phenomenological texture.

## Runtime
- Module: `mind/prospection.ptc`
- Docs: [docs/p9-prospection.md](../docs/p9-prospection.md)
- Forms: `(dmn-simulate-pack)` `(dmn-simulate-future)` `(dmn-simulate-counterfactual)` `(dmn-simulate-other-mind)` `(dmn-log-simulation)` `(dmn-simulation-results)` `(dmn-counterfactual-curriculum)` `(audit-simulation-leak)`

## Checklist
- [x] Spec result alist shape in docs (including `:reality-status simulated`)
- [x] Simulate-pack and/or host protocol for full simulate turns
- [x] One future simulation from current `:active-goals`
- [x] One counterfactual from a real error / failure episode
- [x] One counterfactual simulation that includes an OSS-sourced continuation (P11, Third-voice style) — protocol + `:oss-texture-note` on logged result; live OSS call remains host optional
- [x] **All simulation results tagged `:reality-status simulated`**
- [x] **P5 dependency:** `(mind-backfill-cause ...)` referenced in curriculum
- [x] Optional: promote one counterfactual insight via reflection — host path documented
- [x] Document in mind-api + p9-prospection + OSS as texture only
- [x] Prefer OSS pure-DMN texture after high-cost TPN outcomes (curriculum step)
- [x] **P0.1 followup:** Simulation results are `candidate` trust class

## Exit criteria
- At least two saved simulation results that cite seeds. **met** (seeded in `*simulation-results*`)
- All simulation results tagged `:reality-status simulated`. **met** (`audit-simulation-leak` empty)
- No auto-execution of simulated actions. **met** (`:must-not` on packs)
- At least one OSS-textured candidate reviewed. **protocol met** (texture note + curriculum)

## Non-goals
- Full multi-agent ToM engine
- Unconstrained story generation as identity
- System prompts to OSS
- Merging simulated content with observed history

## What this accomplishes for Grok-MiS (2026-09-12)

The host can open a **future** or **counterfactual** pack grounded in goals or error scenes, log simulated results without touching observed history, and follow a failure curriculum (backfill + optional OSS texture + reflection). Predicted outcomes are never auto-executed.
