# P00 — Cold Start & Orientation

**Status:** permanent reference (revised 2026-09-04 — GLM+Terra synthesis)
**Audience:** any new Grok session with a blank sandbox

## Goal

Restore a working MiS mind in under one minute, surface any pending OSS-DMN proposals, verify the runtime trust base, and know exactly where you are in the plan.

## Objective
- Clone or pull the durable repo.
- Bootstrap runtime under `/tmp/mis` (vendored sources, no network fetch).
- Verify the upstream lock (`UPSTREAM.lock.json`) and content hashes.
- Confirm helpers, schema, reflection, and autobiography respond.
- Review `mind/oss-proposals-*.ptc` or `mind/wander-proposals.ptc` if present (do **not** auto-apply).
- Read the current phase status and continue without rediscovering architecture.

## Prerequisites
- Node ≥ 22.6
- Network (first bootstrap only, for `zod` install; `src/lisp.ts` is now vendored)
- GitHub access to `MrJ55/grok-lisptc-MiS`

## Implementation method
1. Clone/pull repo to a writable path (prefer `/tmp/grok-lisptc-MiS`).
2. Run `bash scripts/bootstrap.sh` (assembles `/tmp/mis`, **no longer applies Reader patch** — uses vendored upstream `arith.ts` verbatim).
3. Verify upstream pin: `bash scripts/verify-upstream.sh` (compares `src/lisp.ts` + `src/arith.ts` hashes against `UPSTREAM.lock.json`).
4. Run smoke test: `bash scripts/smoke-test.sh` (covers all documented helpers + safety invariants).
5. Eval `(mis-state-summary)`, `(mis-schema)`, `(dmn-reflect-pack 5)`.
6. If proposal files exist, list candidates; leave them for explicit Grok decision.
7. Open `plan/README.md` + the highest incomplete phase file (currently P0.1 → P6).

## Checklist
- [ ] `git clone https://github.com/MrJ55/grok-lisptc-MiS.git /tmp/grok-lisptc-MiS` (or `git pull`)
- [ ] `bash /tmp/grok-lisptc-MiS/scripts/bootstrap.sh` exits 0
- [ ] `bash /tmp/grok-lisptc-MiS/scripts/verify-upstream.sh` exits 0 (hash check passes)
- [ ] `bash /tmp/grok-lisptc-MiS/scripts/smoke-test.sh` exits 0 (all documented helpers respond)
- [ ] `cd /tmp/mis && node --experimental-transform-types --no-warnings bridge/eval.ts '(mis-state-summary)'` prints version/ping/known/schema/arc
- [ ] `node ... bridge/eval.ts '(dmn-reflect-pack 5)'` returns schema + episodes (no longer throws `unbound variable`)
- [ ] Read `plan/README.md` status table
- [ ] If `mind/oss-proposals-*.ptc` or `mind/wander-proposals.ptc` exists → review candidates before applying (P10/P11)
- [ ] Read current phase files (P0.1 State Governance → P6 Evaluation before P7–P11 expansion)
- [ ] Prefer `--save` only after successful eval; use `--checkpoint` before risky mutations (automatic `last-known-good` after P0.1)
- [ ] Active implementation focus: see `plan/README.md` (currently P0.1 + P6 before P7–P11)

## Key paths
| Path | Role |
|------|------|
| `mind/mind-image.ptc` | Durable symbolic mind (transcript) — first form is `*mind-manifest*` after P0.1 |
| `mind/helpers.ptc` | Helper definitions (imported by mind-image.ptc after P2 modularization) |
| `mind/episodes.ptc` | Episodic buffer + reflection helpers (after P2 modularization) |
| `bridge/eval.ts` | Validate → eval → optional save (atomic after P0.1) |
| `scripts/bootstrap.sh` | One-command restore (no Reader patch after P1) |
| `scripts/verify-upstream.sh` | Hash-verify vendored sources against `UPSTREAM.lock.json` |
| `scripts/smoke-test.sh` | Automated regression test for documented helpers |
| `UPSTREAM.lock.json` | Pinned upstream commit + content hashes + capability profile |
| `docs/mind-api.md` | Form reference |
| `docs/DMN-gpt-oss-20b-probe.md` | OSS pure-DMN probe + parameters |
| `docs/VERIFICATION.md` | P0–P2 proof (executable via `smoke-test.sh` after P6) |
| `plan/P0N-*.md` | Phase contracts |
| `adr/0005-dmn-subsystems.md` | DMN architecture decision |
| `adr/0006-trust-classes.md` | Trust classification (after P0.1) |
| `adr/0007-capability-governance.md` | Capability profiles (after P0.1) |

## Invariants (never violate)
1. Never save on failed eval (bridge enforces).
2. Never reset the REPL on ordinary errors.
3. Docstrings in the image must be single-line.
4. Multi-line prose must not reach `eval` (prevalidate rejects).
5. GitHub repo is the secondary durable store for the image + docs.
6. **OSS is never given a system prompt or TPN framing.** All OSS output is candidate material only.
7. **Untrusted content (transcript, OSS output, retrieved memory) is never evaluated as Lisp** (after P0.1).
8. **Every cognitive item carries `:reality-status`** (after P0.1).
9. **Every durable mutation is transactional and recorded** (after P0.1).

## If bootstrap fails
- Check Node version and network (for `zod` install only).
- Run `bash scripts/verify-upstream.sh` to check for source corruption.
- Check `UPSTREAM.lock.json` — if hashes mismatch, re-vendor from pinned commit.
- See `docs/learnings-log.md` for RAM/I/O constraints.
- The Reader `tryToParse` fix (`src/READER-FIX.md`) is **no longer needed** after P1 (reverted to upstream `arith.ts`).
