# ADR 0006 — Trust classes for mind content

**Status:** Accepted  
**Date:** 2026-09-04  
**Phase:** P0.1 State Governance

## Context

The MiS mind accepts content from multiple sources: Grok-authored Lisp forms, pure-DMN OSS continuations, user messages, and (later) retrieved memory. Without a clear separation of trust, speculative or adversarial text can be treated as executable identity. The review-by-all synthesis (Terra + GLM) recommended a five-class taxonomy and an explicit promotion path.

## Decision

Adopt five trust classes — **untrusted**, **candidate**, **approved**, **derived**, **immutable** — with the rules documented in `docs/trust-classes.md`.

- Only **approved** content may be appended to `mind/mind-image.ptc` via successful eval + `--save`.
- **Untrusted** content is never passed to the Lisp evaluator as code.
- **Candidate** material lives outside the durable image until Grok promotes it.
- **Derived** and **immutable** cover projections and append-only journals.

Reality-status (`:reality-status` on episodes/chapters/claims) is required alongside trust class; the two dimensions are complementary.

## Consequences

- Bridge and host protocol must refuse to eval untrusted strings.
- Proposal files (`mind/oss-proposals-*.ptc`) are the primary candidate store for now.
- Future helpers such as `(promote-candidate …)` become the explicit promotion API.
- P7–P11 expansion is gated on this trust base (and P6 evaluation).

## Alternatives rejected

- Treating all transcript content as equally trusted.
- Auto-promoting high-scoring OSS output into the mind image.
- Collapsing trust class into reality-status alone (they answer different questions).
