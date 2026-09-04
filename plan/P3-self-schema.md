# P3 — Self-Schema & Episodic Buffer (DMN foundation)

**Status:** exit-complete (2026-09-04 — reality-status audits + buffer trim verified)
**Revised:** 2026-09-04 (GLM+Terra synthesis)

## Goal
Give the mind an evolving, inspectable self-model and a bounded episodic buffer so Grok can perform deliberate consolidation.

## Objective
- Persistent `*self-schema*` alist in the transcript image.
- Merge primitive `update-self-schema` (order bug fixed in P2).
- Bounded `*episodic-buffer*` with log/fetch helpers (trim restored in P2).
- Readers integrated into `mis-state-summary`.
- **`:reality-status` field on every episode** (added in P0.1; P3 ensures episodes use it).
- Optional meta tag `:source 'oss-dmn` on episodes that originate from pure-DMN OSS continuations (P11).
- **Audit helper** `(audit-reality-status)` that flags items missing reality-status.
- **Audit helper** `(audit-autobiography-grounding)` for chapters without grounded evidence.

## Implementation method
- All state is ordinary Lisp in `mind/episodes.ptc` and `mind/schema.ptc` (after P2 modularization).
- Schema keys (convention): `:core-values`, `:active-goals`, `:working-insights`, `:episodic-summary`, `:last-reflection`.
- Episodes: newest-first list of `(input result meta)`, max `*episodic-max*` (40).
- Episode meta includes `:reality-status` (default `observed`; OSS-sourced tagged `imagined`) and `:recorded-at` from `*now*`.
- Self-schema claim convention: bare symbols in `:working-insights` imply `inferred`; structured claims may be `(name :reality-status STATUS :evidence (id...))`.
- `:core-values` / `:active-goals` treated as host-authored `observed` defaults.

## Checklist
- [x] `*self-schema*` default in image
- [x] `(mis-schema)` `(mis-insights)` `(update-self-schema alist)` — order bug fixed in P2
- [x] `*episodic-buffer*` + `(dmn-log-episode ...)` `(dmn-fetch-unreflected n)` — trim restored
- [x] Extended `(mis-state-summary)` includes schema + buffer-len
- [x] Reader tryToParse fix — no longer needed after P1
- [x] **All episodes have `:reality-status` field**
- [x] **Self-schema claim convention documented** (implicit status by key; optional structured claims)
- [x] `(audit-reality-status)` — episodes + autobiography chapters missing reality-status
- [x] `(audit-autobiography-grounding)` — chapters missing refs or ungrounded (host `:observed` with refs accepted)
- [x] Existing episodes retroactively tagged (OSS → `imagined`, host → `observed`)
- [x] `dmn-log-episode` accepts / defaults `:reality-status`; stamps `:recorded-at`
- [x] Buffer never exceeds `*episodic-max*` (40) — verified by logging 50 episodes
- [x] Helpers version 0.5; manifest `:p3-status . "exit"`

## Exit criteria
- [x] Cold bootstrap → schema present → update + log episode path available
- [x] `(audit-reality-status)` returns empty list
- [x] `(audit-autobiography-grounding)` returns empty list
- [x] Buffer never exceeds `*episodic-max*` (40)

## Notes
P3 primitives are sufficient for P4 and for P11 dual-write. Do not re-implement schema; only extend keys if needed. The `:reality-status` field prevents the "narrative converts speculation into autobiographical fact" failure mode from the Terra review.
