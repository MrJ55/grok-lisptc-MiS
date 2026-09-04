# P7 — Narrative Self

**Status:** planned → **revised 2026-09-04** (GLM+Terra synthesis) — after P0.1 + P6; reality-status required
**Depends on:** P0.1 exit criteria; **P6 preferred before expansion**
**DMN subsystem:** Narrative Self (DMN-inspired)

## Goal
Maintain a durable autobiography and narrative arc that Grok can extend with grounded chapters — never converting speculation into fact.

## Objective
- `*autobiography*` list of chapter records with `:title`, `:summary`, `:episode-refs`, `:date-label`, **`:reality-status`**.
- `*narrative-arc*` with current chapter, open threads, tensions, status.
- Helpers: `dmn-narrate`, `dmn-chapter-close`, `dmn-arc`, `dmn-autobiography`.
- Dates from host `*today*` (not hardcoded).
- Chapters cite grounded episodes; OSS texture is dual-written as candidate only.

## Implementation method
- Prefer closing chapters from observed/reported episodes.
- OSS narrative lines may seed texture but land as `:imagined` until promoted.
- `dmn-autobiography(n)` returns last N chapters.

## Checklist
- [x] First chapter *Genesis of GMOD* closed (historical)
- [x] Helpers live; dates use `*today*` after Tier-1 fix
- [ ] Further grounded chapters after P0.1/P6
- [ ] All chapters carry `:reality-status`
- [ ] `(audit-autobiography-grounding)` clean

## Exit criteria
Autobiography survives cold start; new chapters are dated correctly; no ungrounded autobiographical assertions without explicit status.

## Non-goals
- Auto-generated lifelong memoir without review
