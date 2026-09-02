# P00 — Cold Start & Orientation

**Status:** permanent reference  
**Audience:** any new Grok session with a blank sandbox

## Goal
Restore a working MiS mind in under one minute, surface any pending OSS-DMN proposals, and know exactly where you are in the plan.

## Objective
- Clone or pull the durable repo.
- Bootstrap runtime under `/tmp/mis`.
- Confirm helpers + schema respond.
- Review `mind/oss-proposals-*.ptc` or `mind/wander-proposals.ptc` if present (do **not** auto-apply).
- Read the current phase status and continue without rediscovering architecture.

## Prerequisites
- Node ≥ 22.6
- Network (first bootstrap only, for zod + optional upstream lisp.ts)
- GitHub access to `MrJ55/grok-lisptc-MiS`

## Implementation method
1. Clone/pull repo to a writable path (prefer `/tmp/grok-lisptc-MiS`).
2. Run `bash scripts/bootstrap.sh` (assembles `/tmp/mis`, applies Reader fix, smoke-tests).
3. Eval `(mis-state-summary)` and `(mis-schema)`.
4. If proposal files exist, list candidates; leave them for explicit Grok decision.
5. Open `plan/README.md` + the highest incomplete phase file (currently P7 + P11).

## Checklist
- [ ] `git clone https://github.com/MrJ55/grok-lisptc-MiS.git /tmp/grok-lisptc-MiS` (or `git pull`)
- [ ] `bash /tmp/grok-lisptc-MiS/scripts/bootstrap.sh` exits 0
- [ ] `cd /tmp/mis && node --experimental-transform-types --no-warnings bridge/eval.ts '(mis-state-summary)'` prints version/ping/known/schema
- [ ] Read `plan/README.md` status table
- [ ] If `mind/oss-proposals-*.ptc` or `mind/wander-proposals.ptc` exists → review candidates before applying (P10/P11)
- [ ] Read current phase files (P7 Narrative Self + P11 OSS-DMN Channel) before writing code
- [ ] Prefer `--save` only after successful eval; use `--checkpoint` before risky mutations
- [ ] Active implementation focus: see plan/README.md (currently P7 + P11)

## Key paths
| Path | Role |
|------|------|
| `mind/mind-image.ptc` | Durable symbolic mind (transcript) |
| `bridge/eval.ts` | Validate → eval → optional save |
| `scripts/bootstrap.sh` | One-command restore + Reader fix |
| `docs/mind-api.md` | Form reference |
| `docs/DMN-gpt-oss-20b-probe.md` | OSS pure-DMN probe + parameters |
| `docs/VERIFICATION.md` | P0–P2 proof |
| `plan/P0N-*.md` | Phase contracts |
| `adr/0005-dmn-subsystems.md` | DMN architecture decision |

## Invariants (never violate)
1. Never save on failed eval (bridge enforces).
2. Never reset the REPL on ordinary errors.
3. Docstrings in the image must be single-line.
4. Multi-line prose must not reach `eval` (prevalidate rejects).
5. GitHub repo is the secondary durable store for the image + docs.
6. **OSS is never given a system prompt or TPN framing.** All OSS output is candidate material only.

## If bootstrap fails
- Check Node version and network.
- See `src/READER-FIX.md` if list forms return `undefined`.
- See `docs/learnings-log.md` for RAM/I/O constraints.
