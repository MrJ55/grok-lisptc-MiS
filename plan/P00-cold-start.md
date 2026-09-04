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
5. Eval `(mis-state-summary)`, `(mis-schema)`, `(dmn-reflect-pack 5)`, `(audit-reality-status)`.
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
- [x] `(audit-reality-status)` → `nil` (clean)
- [x] `(promote-candidate '…)` returns host-mediated reminder

### Orient
- [x] Read `plan/README.md` status table
- [x] Proposal files present (candidates only — do not auto-apply):
  - `mind/oss-proposals-20260902.ptc`
  - `mind/oss-proposals-20260902-nudge-craft.ptc`
  - `mind/oss-proposals-20260902-second-opinion.ptc`
  - no `mind/wander-proposals.ptc`
- [x] Active sequence after P00: **P0** (close remaining safety checklist) → P0.1 already met → **P6 Evaluation** before P7–P11
- [x] Prefer `--save` only after successful eval; LKG is automatic on `--save` (P0.1)

## Key paths
| Path | Role |
|------|------|
| `mind/mind-image.ptc` | Durable symbolic mind — first form is `*mind-manifest*` |
| `bridge/eval.ts` | prevalidate → form-by-form load → eval → atomic save-on-success |
| `scripts/bootstrap.sh` | One-command restore |
| `scripts/verify-upstream.sh` | Hash-verify (auto-heal incomplete vendor) against `UPSTREAM.lock.json` |
| `scripts/smoke-test.sh` | Regression for documented helpers + safety rejects |
| `scripts/test-crash-recovery.sh` | LKG boot after corrupt image |
| `scripts/test-malicious-ptc.sh` | Form-by-form resilience + `--strict-load` |
| `UPSTREAM.lock.json` | Pinned upstream commit + content hashes + capability profile |
| `state/manifest.json` | Written on `--save` (schema, hashes, last mutation) |
| `state/checkpoints/last-known-good.ptc` | Bootable fallback |
| `docs/mind-api.md` | Form reference |
| `docs/DMN-gpt-oss-20b-probe.md` | OSS pure-DMN probe + parameters |
| `docs/trust-classes.md` / `adr/0006-trust-classes.md` | Trust taxonomy |
| `docs/capability-governance.md` / `adr/0007-capability-governance.md` | Capability profiles |
| `plan/P0N-*.md` | Phase contracts |

## Invariants (never violate)
1. Never save on failed eval (bridge enforces).
2. Never reset the REPL on ordinary errors.
3. Docstrings in the image must be single-line.
4. Multi-line prose must not reach `eval` (prevalidate rejects).
5. GitHub repo is the secondary durable store for the image + docs.
6. **OSS is never given a system prompt or TPN framing.** All OSS output is candidate material only.
7. **Untrusted content (transcript, OSS output, retrieved memory) is never evaluated as Lisp.**
8. **Every cognitive item carries `:reality-status`.**
9. **Every durable mutation is transactional and recorded.**

## If bootstrap fails
- Check Node version and network (for `zod` install only).
- Run `bash scripts/verify-upstream.sh` to check for source corruption / re-fetch pin.
- Check `UPSTREAM.lock.json` — if hashes still mismatch after auto-heal, inspect network / upstream URL.
- See `docs/learnings-log.md` for RAM/I/O constraints.
- The Reader `tryToParse` fix (`src/READER-FIX.md`) is **no longer needed** (upstream `arith.ts`).

## Last verified cold-start
- **When:** 2026-09-04
- **Node:** v24.15.0
- **Lock commit:** `2c10ea8ed6edb16e065b746a7f52080956b895de`
- **Helpers:** `mis-helpers-0.4` / `:p0.1-status` `wave-3`
- **Result:** verify + bootstrap + smoke + orient evals all green; three candidate proposal files left unapplied
