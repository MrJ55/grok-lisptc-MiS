# Blackboard Schema (v0.2)

**Status:** normative for implementors  
**Related:** [adr/0013-peer-minds.md](../adr/0013-peer-minds.md), [role-contracts.md](role-contracts.md), [bridge-contract.md](bridge-contract.md)

All objects are small, self-describing envelopes on disk under `artifacts/blackboard/`. Preferred format: **JSON**. Mind-facing payloads may embed S-expressions as strings or structured fields. Bridge validates required fields before write when possible; consumers must tolerate unknown fields (forward compatible).

`schema-version`: **`"0.2"`** for new writes. Readers accept `0.1` and treat missing context packet as incomplete (Orchestrator may re-task).

---

## Common fields (all kinds)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | yes | Unique; prefer `T-YYYYMMDD-HHMMSS-<role>-<seq>` or UUID |
| `kind` | string | yes | See kinds below |
| `schema-version` | string | yes | `"0.2"` |
| `created` | string | yes | ISO-8601 |
| `author-role` | string | yes | Role that authorized the write (orchestrator, generator-a, …) |
| `author-mind-id` | string | yes | Stable id of the local mind instance that authorized |
| `role` | string | yes* | Target or subject role (* for kinds where applicable; mirror `target-role` on tasks) |
| `parent-ids` | string[] | no | Causal lineage (task ids, result ids, …) |
| `reality-status` | string | no | `candidate` \| `observed` \| `rejected` \| `n/a` |

**Rule:** Every write is authorized by a local mind; `author-role` + `author-mind-id` record that. Bridge refuses writes missing these on v0.2 paths.

---

## Context packet (required on tasks; recommended on results)

Peers are full minds. A bare goal string is insufficient.

| Field | Type | Required on task | Notes |
|-------|------|------------------|-------|
| `goal` | string | yes | What to do |
| `context-slice` | string or object | strongly recommended | Compact schema/arc/duty/prior summary |
| `context-refs` | string[] | no | Paths or Vestige ids (`vestige:<uuid>`, `results/…`) |
| `payload-ref` | string | no | Larger blob path under blackboard or external |
| `mind-hint` | string | no | Role image or module hint for bootstrap |
| `priority` | string | no | `low` \| `normal` \| `high` |
| `constraints` | string or object | no | Explicit non-goals, format requirements |

Inject text must **not** be the sole carrier of context. Inject = wake; envelope = truth.

---

## Kinds

### Task

```json
{
  "id": "T-20260915-143000-generator-a-001",
  "kind": "task",
  "schema-version": "0.2",
  "created": "2026-09-15T14:30:00Z",
  "author-role": "orchestrator",
  "author-mind-id": "orch-canonical-1",
  "role": "generator-a",
  "target-role": "generator-a",
  "goal": "Produce three incomplete hypotheses for geometry-preservation",
  "context-slice": "Arc: geometry-preservation. High duties: reflect after candidate pack. Prior: none.",
  "context-refs": [],
  "priority": "high",
  "status": "open",
  "parent-ids": [],
  "reality-status": "n/a"
}
```

Additional: `target-role` (yes), `status` (`open` \| `claimed` \| `done` \| `cancelled`).

### Claim

Atomic create-or-fail semantics (implementor: write only if no active claim for `task-id`, or use exclusive create).

| Field | Required | Notes |
|-------|----------|-------|
| `task-id` | yes | |
| `claimer` | yes | role id |
| `lease-until` | yes | ISO-8601; peer may renew while working |
| `author-role` / `author-mind-id` | yes | Peer that claimed |

### Result

| Field | Required | Notes |
|-------|----------|-------|
| `task-id` | yes | |
| `payload` or `payload-ref` | one required | Inline summary and/or path |
| `fitness-vector` | no | Object or array of scores |
| `context-slice` | recommended | What the peer believed the job was |
| `vestige-ids` | no | Any ids touched (read or proposed) |
| `reality-status` | recommended | Usually `candidate` |

### Receipt

| Field | Required | Notes |
|-------|----------|-------|
| `ref-id` | yes | task/result/inj id |
| `action` | yes | `seen` \| `finished` \| `rejected` \| `failed` |
| `by` | yes | role |

### Injection-request (queue entry)

Under `queues/<target>/`.

```json
{
  "id": "INJ-20260915-001",
  "kind": "injection-request",
  "schema-version": "0.2",
  "created": "…",
  "author-role": "orchestrator",
  "author-mind-id": "orch-canonical-1",
  "role": "generator-a",
  "target": "generator-a",
  "payload-ref": "tasks/T-20260915-143000-generator-a-001.json",
  "notice": "[MiS task] T-20260915-143000-generator-a-001",
  "attempts": 0
}
```

`notice` is the short composer text; full context remains in `payload-ref`.

### Busy-lease

Path convention: `state/busy/<role>.json`.

| Field | Required |
|-------|----------|
| `role` | yes |
| `until` | yes |
| `holder` | yes (mind id or claim id) |
| `task-id` | recommended |

### State / high-water

Opaque to roles except Orchestrator; bridge maintains marks for scan cursors. Optional `metrics.json` for P21.

---

## File naming

- Prefer sortable ids: `T-YYYYMMDD-HHMMSS-<role>-<seq>.json`
- One envelope per file; no multi-object JSON arrays as the primary unit
- Archive: move under `archive/YYYY/MM/` on compaction (P20)

---

## Validation rules (bridge / host)

1. Reject write missing `schema-version`, `author-role`, `author-mind-id`, `id`, `kind`, `created`.
2. Task without `goal` → reject.
3. Task without `context-slice` and without `context-refs` → warn; Orchestrator may still write but peers may re-request context.
4. Peer save to canonical image path → reject (role-contracts).
5. Unknown `kind` → store but do not auto-inject.

---

## Related

- [plan/P13.1-blackboard-schema.md](../plan/P13.1-blackboard-schema.md)
- [plan/P17-async-workflow.md](../plan/P17-async-workflow.md)
