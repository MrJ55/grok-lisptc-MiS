# Learnings log

Newest first.

## 2026-08-31 — P3 self-schema started + Reader fix

- **Critical bug**: vendored/upstream `lisp.ts` Reader treated `tryToParse` returning `undefined` as a successful number (`if (n !== null)`). Fixed to `if (n !== undefined && n !== null)`. Without this, all list forms evaluated to undefined.
- Multi-line docstrings break the Reader (bad string at line N). Keep docstrings single-line in the image.
- `&optional` in defun can produce arity surprises with the current lambda/closure representation; prefer fixed arity + explicit `nil` for optional meta.
- Phase 3 primitives land cleanly in the transcript image: `*self-schema*`, `update-self-schema`, `dmn-log-episode`, `dmn-fetch-unreflected`, `mis-schema`, `mis-insights`.
- Schema and episodes persist across process death via `--save` + image reload.

## 2026-08-31 — full P0–P2 verification

- 22 scenarios in /tmp/mis; report in docs/VERIFICATION.md.
- All helpers and defs OK; errors never bricked the mind.
- Image grew only on successful saves; failures → mind-failures.log.
