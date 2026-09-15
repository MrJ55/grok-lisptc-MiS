# P15 — Injection path alignment

**Status:** planned  
**Depends on:** P13.1, P14

## Goal

Ambient context and task notices reach Comet-hosted Grok tabs **only** through the approved pipeline.

## Pipeline (normative)

1. Mind produces slice/proposal content via pure forms (or host duty summary).
2. Sandbox bridge materializes envelope on `artifacts/blackboard/queues/<target>/`.
3. Bridge HTTP POSTs to ngrok URL exposing comet-mcp.
4. comet-mcp CDP types into target tab composer (heartbeat or on-request).
5. Receipt written (artifacts and/or comet event store).

## Thread constraints (normative)

1. Transactions through MiS/host framework path to CDP.
2. Blackboard ops aligned with bridge framework.
3. comet-mcp on PC — **no** artifacts filesystem access.
4. Sandbox detects changes; per-instance queues; busy check; race-safe re-entrant stages.
5. Bridge present in **all** sandboxes.

## Tasks

- [ ] Document ngrok exposure (URL/secret in env, never committed).
- [ ] Inject payload templates: `[MiS context]`, `[MiS task]`, `[MiS proposal]`.
- [ ] Heartbeat interval + content-hash dedup.
- [ ] Busy skip semantics.
- [ ] Verify: artifacts write → queue → inject request payload for comet-mcp.

## Exit criteria

Documented path matches running stub; no alternate inject APIs; queues survive bridge restart.

## Related

- [adr/0009-injection-pipeline.md](../adr/0009-injection-pipeline.md)
- https://github.com/MrJ55/comet-mcp
