# P00 — Cold Start & Orientation

**Status:** permanent reference (verified 2026-09-04 — full path green after P0.1 wave-3)
**Audience:** any new Grok session with a blank sandbox

## Goal

Restore a working MiS mind in under one minute, surface any pending OSS-DMN proposals, verify the runtime trust base, and know exactly where you are in the plan.

## Objective
- Clone or pull the durable repo.
- Bootstrap runtime under `/tmp/mis` (pinned upstream; hash-checked).
- Verify the upstream lock (`UPSTREAM.lock.json`) and content hashes.
- Confirm helpers, schema, reflection, and autobiography respond.
- Review `mind/oss-proposals-*.ptc` or `mind/wander-proposals.ptc` if present (do **not** auto-apply).
- Read the current phase status and continue without rediscovering architecture.

## Prerequisites
- Node ≥ 22.6
- Network (first bootstrap: `zod` install; `verify-upstream` may fetch pinned `lisp.ts` / `arith.ts` if incomplete)
- GitHub access to `MrJ55/grok-lisptc-MiS`

## Implementation method
1. Clone/pull repo to a writable path (prefer `/tmp/grok-lisptc-MiS`).
2. Run `bash scripts/verify-upstream.sh` (auto-heals incomplete vendor stubs, then sha256-checks against lock).
3. Run `bash scripts/bootstrap.sh` (assembles `/tmp/mis`; **no Reader patch** — upstream `arith.ts` verbatim).
4. Run smoke test: `bash scripts/smoke-test.sh` (documented helpers + prose / OSS-shaped rejection).
5. Eval `(mis-state-summary)`, `(mis-schema)`, `(dmn-reflect-pack 5)`, `(dmn-autobiography 4)`, `(dmn-arc)`, `(audit-reality-status)`.
6. If proposal files exist, list candidates; leave them for explicit Grok decision via `(promote-candidate …)`.
7. Open `plan/README.md` + the active phase file (see status table).

## Checklist

### Restore (this session 2026-09-04)
- [x] `git clone https://github.com/MrJ55/grok-lisptc-MiS.git /tmp/grok-lisptc-MiS` (or `git pull`)
- [x] `bash scripts/verify-upstream.sh` exits 0 (hash check passes; auto-heal if needed)
- [x] `bash scripts/bootstrap.sh` exits 0
- [x] `bash scripts/smoke-test.sh` exits 0 (all documented helpers respond)
- [x] `(mis-state-summary)` prints version/ping/known/schema/arc/manifest
- [x] `(dmn-reflect-pack 5)` returns schema + episodes (no unbound variable)
- [x] Active sequence (2026-09-05): P0–P4 exit; P6 substantially met (residuals parked); **P7 exit**; next = open threads or P11 (P5 Vestige optional). See plan/README.md.
