# Threat Model (P0.1)

**Status:** introduced 2026-09-04  
**Phase:** [plan/P0.1-state-governance.md](../plan/P0.1-state-governance.md)

## Scope

Threats that can brick, poison, or silently corrupt the durable mind image, or that can escalate from candidate texture into unauthorized identity or host-side actions.

## Attack surfaces & mitigations

### 1. Prompt injection via OSS output

**Risk:** OSS-generated text stored as Lisp string literals in `*episodic-buffer*` / `*autobiography*`. If that text contains unbalanced forms or reader-breaking sequences, a later load can fail or partially load.

**Mitigations:**
- Schema / shape validation before storing OSS text as data.
- Never store raw OSS output as executable Lisp without Grok mediation.
- Reality-status `imagined` + trust class `candidate` / `untrusted`.
- Prefer dual-write to proposal files; promote only after review.

### 2. Supply chain via npm

**Risk:** `zod` (and future deps) fetched from the public registry without integrity checks.

**Mitigations:**
- Pin versions in install scripts / package-lock where practical.
- Prefer `npm ci` with a lockfile for reproducible installs.
- Periodic `npm audit` in CI (when CI is added).

### 3. Supply chain via upstream lisptc

**Risk:** Fetching `src/lisp.ts` from a floating `main` without hash verification.

**Mitigations:**
- `UPSTREAM.lock.json` pins commit + content hashes.
- `scripts/verify-upstream.sh` fails closed on mismatch.
- Bootstrap prefers vendored sources; network fetch only to populate missing files at the pinned commit.

### 4. Grok's Git write access

**Risk:** Host instructions that commit/push can write buggy or malicious content to the durable repo.

**Mitigations:**
- Prefer human review of host-authored commits that change mind-image or governance docs.
- CI smoke test on every push (target).
- Governance docs (ADRs, plan/) treated as higher-trust than ephemeral learnings.

### 5. Attribution / fork drift

**Risk:** Local `arith.ts` or `lisp.ts` diverge silently from upstream (e.g. historical `undefined` vs `null` Reader bug).

**Mitigations:**
- Upstream lock + hash verification.
- Explicit reversion notes in lock `notes` field and learnings log.

### 6. Grok mutates governance docs to justify future mutations

**Risk:** Self-justifying edits to ADRs / plan / CUSTOM_INSTRUCTIONS.

**Mitigations:**
- Treat ADRs and plan phase contracts as human-reviewed artifacts.
- Learnings log is append-oriented operational memory, not a substitute for ADRs.
- Trust class `derived` for projections; immutable journals for audit trails.

## Residual risks

- Form-by-form load is still incomplete; a single broken form can affect subsequent load quality.
- No full capability sandbox yet; deny-by-default is documented but not fully enforced for external tools.
- Proposal-file format is not yet schema-validated end-to-end.

## Related

- [docs/trust-classes.md](./trust-classes.md)
- [docs/capability-governance.md](./capability-governance.md)
- [UPSTREAM.lock.json](../UPSTREAM.lock.json)
