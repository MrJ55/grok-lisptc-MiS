# P1 — UX & Upstream Pins

**Status:** done

## Goal
Keep the mind path English-first, predictable, and pinned to known upstream sources.

## Objective
- Document host language expectations.
- Pin or document upstream `lisp.ts` / `arith.ts` provenance.
- Record known dialect caveats (e.g. string-trim, &optional).

## Implementation method
- Docs: CUSTOM_INSTRUCTIONS, UPSTREAM, learnings-log.
- Bootstrap fetches from known URLs; prefers local `src/` when present.

## Checklist (done)
- [x] English-first host interaction
- [x] Upstream source documented
- [x] Caveats logged (multi-line docstrings, &optional arity)

## Exit criteria
A new session can restore without tribal knowledge beyond WIKI + plan.
