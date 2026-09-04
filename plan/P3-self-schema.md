# P3 — Self-Schema & Episodic Buffer (DMN foundation)

**Status:** mostly done → **revised 2026-09-04** (GLM+Terra synthesis) — buffer trim fix, reality-status, audit helper

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

## Implementation method
- All state is ordinary Lisp in `mind/episodes.ptc` and `mind/schema.ptc` (after P2 modularization).
- Schema keys (convention): `:core-values`, `:active-goals`, `:working-insights`, `:episodic-summary`, `:last-reflection`.
- Episodes: newest-first list of `(input result meta)`, max `*episodic-max*` (40) — **trim is now restored** (P2 UR2).
- Fixed arity for `dmn-log-episode` (pass `nil` for unused meta).
- Single-line docstrings.
- **Episode meta includes `:reality-status`** (default `:observed` for Grok-authored, `:imagined` for OSS-sourced).
- **Self-schema claims can carry evidence refs and reality-status** — `:working-insights` entries may be `(insight-name :reality-status inferred :evidence (ep-id-1 ep-id-2))`.

### Episode record shape (extended)

```lisp
;; Before P0.1 (current):
(input result (:source oss-dmn :experiment nudge-craft :id I :dmn-score medium-practical))

;; After P0.1 + P3:
(input result (:source oss-dmn
              :experiment nudge-craft
              :id I
              :dmn-score medium-practical
              :reality-status imagined      ;; NEW
              :recorded-at "2026-09-02T..."  ;; NEW (uses *now*)
              :evidence-refs nil))           ;; NEW (links to grounding episodes)
```

### Self-schema claim shape (extended)

```lisp
;; Before P0.1 (current):
(:working-insights . (oss-must-stay-pure-dmn grok-sole-mutator ...))

;; After P0.1 + P3:
(:working-insights . (
  (oss-must-stay-pure-dmn    :reality-status inferred  :evidence (ep-1 ep-2))
  (grok-sole-mutator         :reality-status observed  :evidence nil)
  (dual-write-candidates     :reality-status inferred  :evidence (ep-3))))
```

### Migration

Tag existing episodes retroactively (in P0.1, but P3 verifies):
- OSS-sourced entries (`:source oss-dmn`) → `:reality-status imagined`
- Hardcoded `*self-schema*` defaults → `:reality-status observed` (for `:core-values`, `:active-goals`) or `:reality-status inferred` (for `:working-insights`)
- *Genesis of GMOD* chapter → `:reality-status observed` (the host restoration) with a note that the OSS line within is `:imagined`

## Checklist
- [x] `*self-schema*` default in image
- [x] `(mis-schema)` `(mis-insights)` `(update-self-schema alist)` — order bug fixed in P2
- [x] `*episodic-buffer*` + `(dmn-log-episode ...)` `(dmn-fetch-recent n)` — trim restored in P2, renamed in P2
- [x] Extended `(mis-state-summary)` includes schema
- [x] Reader tryToParse fix — **no longer needed** after P1 (reverted to upstream `arith.ts`)
- [ ] **All episodes have `:reality-status` field** (P0.1 dependency; P3 verifies)
- [ ] **All self-schema claims have `:reality-status` field** (P0.1 dependency; P3 verifies)
- [ ] `(audit-reality-status)` helper implemented — returns items missing reality-status
- [ ] `(audit-autobiography-grounding)` helper implemented — returns chapters citing no observed/reported episodes
- [ ] Existing episodes retroactively tagged (OSS → `:imagined`, etc.)
- [ ] `dmn-log-episode` extended to accept `:reality-status` in meta (default `:observed`)
- [ ] Optional: tighten schema shape validators (pure Lisp predicates)
- [ ] Optional: document `:source 'oss-dmn` + `:reality-status imagined` convention for P11 dual-write

## Exit criteria
- Cold bootstrap → schema present → update + log episode + `--save` → new process sees both.
- `(audit-reality-status)` returns empty list (all items tagged).
- `(audit-autobiography-grounding)` returns empty list (all chapters cite grounded evidence).
- Buffer never exceeds `*episodic-max*` (40) — verified by logging 50 episodes and checking length.

## Notes for next session
P3 primitives are sufficient for P4 and for P11 dual-write. Do not re-implement schema; only extend keys if needed. The `:reality-status` field is the key P3 addition — it prevents the "narrative converts speculation into autobiographical fact" failure mode identified in the Terra review.
