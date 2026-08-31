# P3 — Self-Schema & Episodic Buffer (DMN foundation)

**Status:** in progress → nearly complete (primitives live; reflection protocol is P4)

## Goal
Give the mind an evolving, inspectable self-model and a bounded episodic buffer so Grok can perform deliberate consolidation.

## Objective
- Persistent `*self-schema*` alist in the transcript image.
- Merge primitive `update-self-schema`.
- Bounded `*episodic-buffer*` with log/fetch helpers.
- Readers integrated into `mis-state-summary`.

## Implementation method
- All state is ordinary Lisp in `mind-image.ptc` (no separate DB yet).
- Schema keys (convention): `:core-values`, `:active-goals`, `:working-insights`, `:episodic-summary`, `:last-reflection`.
- Episodes: newest-first list of `(input result meta)`, max `*episodic-max*` (40).
- Fixed arity for `dmn-log-episode` (pass `nil` for unused meta).
- Single-line docstrings only.

## Checklist
- [x] `*self-schema*` default in image
- [x] `(mis-schema)` `(mis-insights)` `(update-self-schema alist)`
- [x] `*episodic-buffer*` + `(dmn-log-episode input result meta)` `(dmn-fetch-unreflected n)`
- [x] Extended `(mis-state-summary)` includes schema
- [x] Reader tryToParse fix + bootstrap auto-apply
- [x] Verified save/reload of schema + episodes in sandbox
- [ ] Optional: tighten schema shape validators (pure Lisp predicates)
- [ ] Optional: auto-log every successful TPN eval from a thin wrapper (defer if noisy)

## Exit criteria
Cold bootstrap → schema present → update + log episode + `--save` → new process sees both.

## Notes for next session
P3 primitives are sufficient for P4. Do not re-implement schema; only extend keys if needed.
