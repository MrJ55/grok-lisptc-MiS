# ADR 0008: Shared artifacts folder as the multi-agent blackboard

- **Status:** Accepted
- **Date:** 2026-09-14
- **Supersedes:** none (extends ADR 0004 tmp-runtime and tiered storage)

## Context

Multiple Grok instances in the same project need asynchronous, loosely-coupled coordination. Direct chat-to-chat messaging is unavailable; polling inside a chat window is undesirable; [comet-mcp](https://github.com/MrJ55/comet-mcp) cannot see the Grok cloud `artifacts` folder.

## Decision

Use `/home/workdir/artifacts/blackboard/` as the shared blackboard (tasks, claims, results, receipts, per-role queues, state). Every live sandbox runs a bridge that detects changes and requests injections through the existing MiS → ngrok → comet-mcp → CDP path.

## Consequences

- Positive: zero new infrastructure for the bus itself; durable; inspectable; aligns with existing tiered storage.
- Negative: concurrent writers require claim/lease discipline; wake-up depends on the bridge + heartbeat path.
- Follow-on: schema (`docs/blackboard-schema.md`), bridge contract (`docs/bridge-contract.md`), and per-role queues are mandatory.

## Related

- [docs/architecture.md](../docs/architecture.md) (blackboard section)
- [plan/P13-blackboard-overview.md](../plan/P13-blackboard-overview.md)
- External injector: https://github.com/MrJ55/comet-mcp
