# Blackboard Schema (v0.1)

All objects are small, self-describing envelopes. Preferred on-disk format: JSON. Mind-facing payloads may embed S-expressions.

## Common fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | string | yes | unique |
| kind | string | yes | task, claim, result, receipt, injection-request, busy-lease, state |
| role | string | yes | target or author role |
| created | ISO-8601 | yes | |
| parent-ids | string[] | no | causal lineage |
| reality-status | string | no | candidate / observed / rejected |
| schema-version | string | yes | `"0.1"` |

## Task

```json
{
  "id": "T-20260914-001",
  "kind": "task",
  "role": "generator-a",
  "created": "2026-09-14T21:00:00Z",
  "schema-version": "0.1",
  "goal": "Produce three incomplete hypotheses for geometry-preservation",
  "target-role": "generator-a",
  "priority": "high",
  "status": "open",
  "parent-ids": []
}
```

## Claim

Atomic. Created by the agent that intends to work the task (`task-id`, `claimer`, `lease-until`).

## Result

Contains or references the output (hypothesis, refined form, evaluation, mutation). Optional `fitness-vector`.

## Receipt

Records that a particular id was seen or finished by a role. Used for high-water marks and Orchestrator progress.

## Injection-request (queue entry)

```json
{
  "id": "INJ-20260914-001",
  "kind": "injection-request",
  "role": "generator-a",
  "target": "generator-a",
  "payload-ref": "results/T-20260914-001.json",
  "created": "...",
  "attempts": 0,
  "schema-version": "0.1"
}
```

## Busy-lease

Short-lived marker that a role is currently processing. Bridge consults before requesting a new injection for that target.

## Related

- [docs/bridge-contract.md](bridge-contract.md)
- [plan/P13.1-blackboard-schema.md](../plan/P13.1-blackboard-schema.md)
