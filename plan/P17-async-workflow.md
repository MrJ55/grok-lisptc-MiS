# P17 — Async workflow (dispense → claim → result → receipt)

**Status:** planned  
**Depends on:** P13–P16

## Goal

End-to-end coordination **without chat polling**; parallel tabs; bridge-mediated wake-ups.

## Normative sequence

1. **Dispense** — Orchestrator writes `tasks/<id>.json`.
2. **Wake** — Bridge detects; enqueues; ngrok → comet-mcp; CDP inject if not busy.
3. **Claim** — Atomic `claims/<id>`; set busy lease.
4. **Act** — Own hot `/tmp/mis`; no identity-save unless Orchestrator.
5. **Result** — `results/<id>.json`.
6. **Receipt** — `receipts/<id>.json`; clear busy.
7. **Orchestrator observe** — Next activation or completion inject; optional promote-candidate.

## Subagent → subagent

Writer posts task/result for target role; bridge wakes target. No inter-tab chat API.

## Exit criteria

Dual-role handoff dry-run or live test: exclusive claim, ordered queue, detection from writer sandbox.

## Related

- [adr/0010-async-no-poll.md](../adr/0010-async-no-poll.md)
