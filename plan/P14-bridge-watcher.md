# P14 — Bridge watcher & queue manager

**Status:** planned  
**Depends on:** P13.0, P13.1

## Goal

Per-sandbox bridge that detects blackboard changes, maintains per-role queues, respects busy leases, and calls ngrok → comet-mcp. Contract: [docs/bridge-contract.md](../docs/bridge-contract.md).

## Tasks

- [ ] Watcher or periodic scan of `artifacts/blackboard/`.
- [ ] High-water-mark persistence.
- [ ] Enqueue logic into `queues/<target>/`.
- [ ] Busy-lease check before injection request.
- [ ] ngrok client (HTTP/MCP) with idempotent request IDs.
- [ ] Delivery receipt writing.
- [ ] Bootstrap integration so every participating sandbox starts the bridge.

## Exit criteria

A test write to `tasks/` by one sandbox results in an injection-request in the correct queue and a successful call reaching comet-mcp (or a clear logged failure).

## Related

- [adr/0011-per-sandbox-bridge.md](../adr/0011-per-sandbox-bridge.md)
- https://github.com/MrJ55/comet-mcp
