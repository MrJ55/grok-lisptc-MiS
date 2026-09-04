# P10 — Spontaneous Thought & Wander Loop

**Status:** planned → **revised 2026-09-04** (GLM+Terra synthesis) — gated on P6; requires reality-status; candidate-only; Vestige ingest
**Depends on:** P7–P9 useful enough to sample from; P11 OSS channel; **P6 (evaluation gate)**
**DMN subsystem:** Spontaneous / Mind-wandering + Salience (host-side) (DMN-inspired)
**Related extensions:** Midnight Note sleep-stage, Page Passer cross-agent exchange

## Goal
Approximate DMN "default" activity: generate **candidate** thoughts when external demand is low, without a long-lived sandbox process. Primary generator for free-form candidates is OSS 20B under the P11 pure-DMN protocol.

## P6 gate
Do not start P10 until P6 exit criteria pass.

## Objective
- `(dmn-wander budget)` samples autobiography, tensions, errors → candidates.
- Append-only truncated `*monologue*`.
- **All wander output is `:reality-status imagined`** — candidate material, never auto-promoted.
- **Scheduled wander = external or next-session proposal file only** (never auto-save mutations). Realised as **Midnight Note** GitHub Action (or equivalent) that soft-nudges with tension seeds and only writes proposal files.
- Primary generator for wander candidates is OSS 20B (P11 parameter lock, zero system prompt).
- Salience (host): errors → reflect + optional OSS counterfactual; goal done → chapter close; idle → OSS wander call → proposal file.
- Support **Page Passer** style proposal-file exchange with other GMOD instances (identity stays local; optional heartbeat annotation).
- **Vestige ingest (P5):** wander candidates that survive review are ingested via `(mind-record-event ...)` → Vestige `smart_ingest` (prediction-error gating + dedup).

## Implementation method

### Survival across sessions
Process RAM does **not** survive Grok session boundaries. Durable channels:
- `mind-image.ptc` (git) — approved state only
- `mind/oss-proposals-YYYYMMDD.ptc` / `mind/wander-proposals.ptc` — candidates only (`:reality-status imagined`)
- `state/audit/operations.jsonl` — operation log (after P0.1)
- External cron/GitHub Action that only writes proposals
- Vestige (after P5) — long-term episodic store

Next P00: review proposals; selective apply via P4/P7. Prefer "ink" (high-stickiness) proposals over "pencil" at review time.

### Primitives
- `(dmn-wander n)` → candidates (all tagged `:reality-status imagined`)
- `(dmn-monologue-push thought)` / `(dmn-monologue n)` — monologue is `:reality-status imagined`

### Midnight Note (GitHub Action)
- `.github/workflows/midnight-note.yml` — cron schedule (e.g., 02:00 UTC)
- Action runs a soft-nudge OSS call (P11 parameters, zero system prompt)
- Writes only to `mind/wander-proposals-YYYYMMDD.ptc`
- Does NOT mutate `mind-image.ptc`
- P00 reviews proposals; applies via `(promote-candidate ...)` (after P0.1) or `--save` (pre-P0.1)

### Page Passer (cross-agent exchange)
- Proposal file format: Lisp list of candidates with metadata (origin, dmn-score, heartbeat, reality-status)
- Receiving Grok reviews and decides promotion — identity stays local
- No identity merge; no shared transcript

## Checklist
- [ ] Spec proposal file format and path (`mind/oss-proposals-YYYYMMDD.ptc` or `mind/wander-proposals.ptc`) including optional heartbeat metadata for Page Passer
- [ ] Implement wander + monologue helpers (all output tagged `:reality-status imagined`)
- [ ] One manual wander turn that calls OSS (blank prefix + soft seed from arc) and writes a proposal file
- [ ] Document "no auto-save from wander / OSS" invariant
- [ ] P00 mentions reviewing proposals (apply ink/pencil + stickiness filter)
- [ ] `.github/workflows/midnight-note.yml` GitHub Action stub for Midnight Note proposals only
- [ ] Midnight Note Action tested: writes proposal file, does NOT mutate image
- [ ] Document Page Passer exchange convention (proposal file only; no identity merge)
- [ ] **P5 dependency:** Wander candidates that survive review ingested via `(mind-record-event ...)` → Vestige (if P5 done)
- [ ] **P0.1 followup:** Wander output is `candidate` trust class; promotion via `(promote-candidate ...)`

## Exit criteria
- Wander candidates (including OSS-sourced) are reviewable in a later session without any process staying alive.
- All wander output tagged `:reality-status imagined`.
- P0 holds (no auto-save from wander).
- Midnight Note Action (or manual equivalent) can leave a proposal for morning review.
- `(audit-reality-status)` confirms no wander content leaked into observed history.

## Non-goals
- Always-on Node heartbeat in the Grok sandbox
- Unbounded monologue growth
- System prompts or TPN framing to OSS
- Auto-promotion of wander content into identity

## DMN framing caveat
"Spontaneous / Mind-wandering" is DMN-inspired metaphor. The Lisp wander helpers do not implement mind-wandering; they generate candidate text via OSS and store it as data. See ADR 0005 (revised).
