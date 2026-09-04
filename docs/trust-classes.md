# Trust Classes (P0.1)

**Status:** introduced 2026-09-04  
**ADR:** [adr/0006-trust-classes.md](../adr/0006-trust-classes.md)  
**Phase:** [plan/P0.1-state-governance.md](../plan/P0.1-state-governance.md)

## Taxonomy

| Class | Examples | Mutation route | Validation |
|-------|----------|----------------|------------|
| **untrusted** | transcript text, OSS output, retrieved memory content | never evaluated as Lisp | schema / shape check on ingest only |
| **candidate** | parsed proposal awaiting validation | stored in `mind/oss-proposals-*.ptc` (not `mind-image.ptc`) | schema + provenance + optional contradiction check |
| **approved** | Grok-authored Lisp that passed `prevalidate` + `eval` | `--save` to `mind-image.ptc` | eval success |
| **derived** | narrative projection, session prompt, summaries | generated from approved state | rebuild from source |
| **immutable** | append-only event / mutation journal, released checkpoint provenance | append-only journal | hash chain (when implemented) |

## Promotion flow

```
reflection / wander / OSS / transcript
  → candidate event, episode, claim, procedure, or narrative fragment
  → schema + size + provenance + contradiction + capability checks
  → approval / rejection / defer (Grok-mediated)
  → approved state mutation or trusted MiS code change
  → projection rebuild and reload verification
```

## Rules

1. **Untrusted content is never evaluated as Lisp.** OSS text, raw transcript snippets, and retrieved memory are data only.
2. **Candidates are not identity.** Proposal files under `mind/oss-proposals-*.ptc` (and future candidate stores) hold candidates; only Grok promotion + successful `--save` moves material into the durable image.
3. **Reality-status is orthogonal but complementary.** Every cognitive item should carry `:reality-status` (`observed | reported | inferred | hypothesized | imagined | planned | simulated | retracted`). Trust class answers "may this be executed / promoted?"; reality-status answers "what kind of claim is this?".
4. **Default for OSS-sourced material:** trust class `candidate` (or `untrusted` until parsed), reality-status `imagined`.
5. **Default for host-authored successful forms:** trust class `approved`, reality-status usually `observed` or `inferred`.

## Implementation status

- [x] Taxonomy documented (this file)
- [x] ADR 0006 recorded
- [x] `(promote-candidate candidate-id)` helper (host-mediated reminder; does not auto-elevate)
- [x] `prevalidate` heuristic rejection of raw OSS-shaped prose (bridge)
- [x] Explicit tagging of proposal-file entries (file headers declare candidate class)

## Related

- Reality-status field and `(audit-reality-status)` — mind image / P0.1
- Capability profiles — [docs/capability-governance.md](./capability-governance.md)
- Threat model — [docs/threat-model.md](./threat-model.md)
