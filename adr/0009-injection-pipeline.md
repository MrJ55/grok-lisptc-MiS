# ADR 0009: Injection pipeline and pure mind

- **Status:** Accepted
- **Date:** 2026-09-14

## Context

Ambient context (weakness 2) needs delivery into the host window. Sandbox cannot inject into arbitrary non-Comet composers. Mind must stay free of sockets (same purity as Vestige: host/bridge owns HTTP). Upstream lisptc MCP was removed from MiS for P0 safety.

## Decisions

1. **Relocate primary driver session** into a Comet-controlled Grok tab when ambient injection is required.
2. **Keep mind pure** — no fetch/MCP inside lisptc eval; TypeScript bridge owns network (same as Vestige / `bridge/vestige-adapter.ts`).
3. **Heartbeat in comet-mcp** injects compact slices during active sessions.
4. **Sandbox bridge** materializes context slices / proposals onto artifacts queues; notifies comet-mcp over ngrok.
5. **Detection lives in sandbox**, not in comet-mcp, because only the sandbox sees artifacts.

## Consequences

- Closes delivery half of weakness 2 when session is in Comet.
- Weakness 1 still needs host protocol: high-duty inject ⇒ discharge or explicit defer.
- Multi-tab: per-target queues avoid race when multiple stages target same role.

## Related

- [docs/bridge-contract.md](../docs/bridge-contract.md)
- [plan/P15-injection-path.md](../plan/P15-injection-path.md)
- [bridge/](../bridge/) — existing eval, oss, vestige adapters
- https://github.com/MrJ55/comet-mcp
