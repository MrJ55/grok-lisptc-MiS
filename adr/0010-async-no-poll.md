# ADR 0010: Asynchronous coordination without chat polling

- **Status:** Accepted
- **Date:** 2026-09-14

## Context

Orchestrator–subagent workflows only pay off with parallelism. Chat UIs provide no agent-side poll loop. Completion must be visible without busy-wait.

## Decisions

1. **Blackboard is the bus** — agents do not DM each other inside product chat APIs.
2. **Stigmergy** — task/claim/result/receipt files are the messages.
3. **Wake-up** — Comet heartbeat injects compact notices; host/role acts on next turn.
4. **Completion** — Orchestrator reads receipts/results on activation or via inject of completion notice; not continuous poll in chat.
5. **Subagent→subagent** — writer posts task/result for target role; bridge enqueues inject for target.
6. **Parallelism** — separate tabs = separate sandboxes = concurrent hot evals; durable serialization via claims on artifacts.

## Anti-patterns rejected

- Synchronous tool-call chains through one chat as the only orchestrator loop.
- Assuming comet-mcp can list artifacts.
- Single global queue without per-target ordering.

## Related

- [docs/session-handoff.md](../docs/session-handoff.md)
- [plan/P17-async-workflow.md](../plan/P17-async-workflow.md)
- https://github.com/MrJ55/comet-mcp
