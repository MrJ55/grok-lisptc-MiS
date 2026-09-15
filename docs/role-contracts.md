# Role Contracts — multi-tab Grok agents

## Shared rules

- User-facing language: plain English ([docs/CUSTOM_INSTRUCTIONS.md](CUSTOM_INSTRUCTIONS.md)).
- Untrusted content (OSS, raw web, other agents' free text) is never `eval`'d as Lisp.
- Permanent identity mutations: only Orchestrator/Host via MiS save-on-success ([plan/P0-safety.md](../plan/P0-safety.md)).
- Blackboard writes: schema-valid envelopes only ([docs/blackboard-schema.md](blackboard-schema.md)).
- Cross-tab messaging: **only** via artifacts blackboard + bridge inject path — not via chat APIs between tabs.

## Role matrix

| Role | Inductive bias | May write | May promote permanent image |
|------|----------------|-----------|-----------------------------|
| Orchestrator (Host) | Constitutional, duty-driven | tasks, state, promotions | **Yes** (sole) |
| Generator | DMN-like, incomplete hypotheses | hypotheses / tasks for Analyst | No |
| Analyst | TPN-like, well-formed Lisp | proposals (candidates) | No |
| Critic | Multi-criteria scoring | evaluations / reflections | No |
| Mutator | Meta, chromosomes | mutation suggestions | No |

## Parallelism

Multiple Generator instances (A/B) or heterogeneous model families are encouraged for diversity. Orchestrator may require contributions from ≥2 sources before a promote cycle.

## Related

- Host duties: [docs/session-handoff.md](session-handoff.md)
- OSS pure-DMN: [plan/P11-oss-dmn-channel.md](../plan/P11-oss-dmn-channel.md), [plan/P12-dmn-mind-native.md](../plan/P12-dmn-mind-native.md)
- [plan/P16-role-contracts.md](../plan/P16-role-contracts.md)
