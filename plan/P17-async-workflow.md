# P17 — Async workflow (peer minds)

**Status:** planned  
**Depends on:** P13–P16, [adr/0013-peer-minds.md](../adr/0013-peer-minds.md)  
**Schema:** [docs/blackboard-schema.md](../docs/blackboard-schema.md) v0.2  
**Roles:** [docs/role-contracts.md](../docs/role-contracts.md)

## Goal

End-to-end multi-Grok coordination **without chat polling**, with **symmetric mind → bridge** I/O for every instance, coarse job claims, and context carried in envelopes.

---

## Normative sequence (revised)

### 1. Authorize (Orchestrator mind)

Orchestrator mind decides to dispense (duty, form, or explicit managerial intent). Intent may be recorded in canonical mind (episode / duty log). **No** direct host write that skips this authorization.

### 2. Materialize (Orchestrator bridge)

Bridge writes `tasks/<id>.json` with **context packet** (`goal`, `context-slice` and/or `context-refs`, `author-role`, `author-mind-id`, `schema-version: "0.2"`).  
Bridge enqueues `queues/<target-role>/` injection-request (`notice` short; `payload-ref` → task file).

### 3. Wake

Any live bridge (typically writer) detects write; respects busy lease; POST ngrok → comet-mcp → CDP inject into target tab if not busy. Inject text is wake-only (`[MiS task] <id>`).

### 4. Claim (peer mind → peer bridge)

Target tab activates. Peer **reads full task envelope from artifacts**. Peer mind decides to accept. Bridge creates atomic `claims/<id>.json`, sets `state/busy/<role>.json` with `lease-until`. Coarse claim: one job, possibly multi-turn.

### 5. Act (peer)

- Hot: `/tmp/mis` with **role image** (+ optional read-only canonical).  
- Vestige: **read only** via local mind → bridge → adapter (default profile).  
- No canonical `--save`. Role-image save allowed for local learning.  
- Do not eval untrusted text as Lisp.

### 6. Result + receipt (peer mind → peer bridge)

Peer mind authorizes completion. Bridge writes `results/<id>.json` (lineage, fitness, payload/payload-ref, author-*). Bridge writes `receipts/<id>.json` (`finished`); clears busy. Optional enqueue to `queues/orchestrator/`.

### 7. Observe + team loop (Orchestrator)

Orchestrator on next activation (or completion inject): read receipts/results. Reflect / promote-candidate / reject. Canonical save-only-on-success. Optional Vestige ingest + compact ref in canonical image ([P22](P22-vestige-true-extension.md)).

---

## Subagent → subagent

Same path: writer **mind** authorizes → writer **bridge** writes task/result for `target-role` → target queue → inject. No inter-tab chat API.

---

## Race and lease controls

| Mechanism | Purpose |
|-----------|--------|
| Unique task ids | No silent overwrite |
| Atomic claim | Exclusive ownership |
| Per-role FIFO queues | Ordered wakes |
| Busy lease | Skip inject while working; stack later jobs |
| Idempotent inj ids | Safe retries |

---

## Context transfer (non-negotiable)

1. Envelope holds context packet.  
2. Inject does not replace envelope.  
3. Peer with permanence also uses **role mind** history.  
4. Missing context → peer may write result `failed` / request re-task rather than invent scope.

---

## Implementor checklist

- [ ] Dispense path refuses write without `author-role` + `author-mind-id` + context fields policy.  
- [ ] Peer bridge save gate blocks canonical image path.  
- [ ] Claim is create-or-fail for active `task-id`.  
- [ ] Busy cleared only on receipt `finished`/`failed`/`rejected` or lease expiry handler.  
- [ ] Dual-tab dry-run: exclusive claim, ordered queue, detection from writer sandbox, completion visible to Orchestrator without polling in chat.  
- [ ] Document role image paths and bootstrap env for each tab.

---

## Exit criteria

Documented dry-run or live test with **two peer minds** + Orchestrator: context packet present, mind-authorized writes only, canonical save only from Orchestrator, Vestige peer path read-only if exercised.

## Related

- [adr/0010-async-no-poll.md](../adr/0010-async-no-poll.md)  
- [adr/0013-peer-minds.md](../adr/0013-peer-minds.md)  
- [docs/bridge-contract.md](../docs/bridge-contract.md)  
