# ADR 0013: Peer minds (Model B)

- **Status:** Accepted
- **Date:** 2026-09-15
- **Extends:** [0008](0008-artifacts-blackboard.md), [0009](0009-injection-pipeline.md), [0010](0010-async-no-poll.md), [0011](0011-per-sandbox-bridge.md), [0012](0012-vestige-true-extension.md)

## Context

Multi-tab Grok coordination needs a permanence model. Two options were considered:

- **A Satellite workers** — ephemeral hot eval; only Orchestrator mind is durable.
- **B Peer minds** — every Grok instance runs full MiS; minds evolve with experience; Orchestrator is manager.

Atomic micro-tasks suit cheap tool agents. Grok-class peers waste capability if treated as amnesiac lambdas. Symmetry with Vestige/comet-mcp (mind authorizes, bridge does I/O) requires that peers also never bypass their local mind when talking to the blackboard.

## Decision

**Adopt Model B — Peer minds.**

1. **Uniform stack** — Same MiS codebase, same bridge, same blackboard client, same Vestige adapter path for every participating tab. Role differences are image modules + custom instructions + capability profile, not forked runtimes.

2. **Two permanence layers**

   | Layer | Who may `--save` | Content |
   |-------|------------------|--------|
   | **Canonical mind** | Orchestrator / Host only | Schema, autobiography, global duties, promoted definitions |
   | **Role mind** | That peer only | Role bias, local episodes, local skills, candidate drafts |

   Peers may **read** the warm canonical image. Peers must **not** write the canonical identity path. Bridge enforces save target by role profile.

3. **All transactions through the local mind**

   - Dispense, claim intent, result, receipt, Vestige recall: **local mind authorizes → local bridge performs I/O**.
   - No host freelancing JSON onto the blackboard while the mind is offline.
   - Same purity as Vestige: no sockets inside lisptc eval.

4. **Vestige access (default)**

   | Actor | Vestige |
   |-------|--------|
   | Orchestrator | Read + candidate ingest (P5 profiles) |
   | Peer | **Read only**, always via local mind → bridge → adapter |
   | Peer write/ingest | Only if Orchestrator grants time-bounded write profile, or peer proposes on blackboard and Orchestrator ingests |

5. **Manager / team semantics**

   - Orchestrator assigns work, observes results, sole-mutates canonical identity.
   - Peers execute coarse-grained jobs, evolve role minds, emit candidates via blackboard.
   - Blackboard = shared candidate/work bus, not identity.

6. **Closed-loop growth**

   - **Local D:** peer reflects on role image → better candidates next time.
   - **Team D:** blackboard results → Orchestrator reflect/promote → canonical save-on-success.
   - **Index E:** Orchestrator (default) indexes mass into Vestige; peers read through mind (P22).

## Consequences

### Positive

- One codebase; fewer special cases.
- Peers accumulate experience; multi-Grok is worth the orchestration cost.
- Symmetric protocol (mind → bridge) for all instances.
- Canonical identity remains single-writer.

### Negative / costs

- N bridges, N queues, N busy leases, role-image versioning.
- Bootstrap must select role + image path + Vestige profile + queue name.
- Implementors must never allow peer `--save` onto canonical path.

### Rejected alternatives

- Model A (satellites only): simpler, but discards peer growth.
- Shared single image with concurrent `--save`: identity races; second-cabinet failure mode.
- Peer direct Vestige write without mind: breaks P22 extension discipline.

## Implementor invariants (must hold)

1. Bridge config: `role`, `canonicalImagePath` (read), `roleImagePath` (read/write for peer), `vestigeProfile` (`read` | `read+ingest`), `queueName`.
2. Save gate: if `role != orchestrator` and save path is canonical → reject.
3. Every blackboard write carries `author-role`, `author-mind-id` (or equivalent), `schema-version`, context packet where kind requires it.
4. Inject is wake-only; context lives in the envelope + local mind state.
5. Claims are **job-sized** (coarse), not micro-step, when the actor is a Grok peer.

## Related

- [docs/role-contracts.md](../docs/role-contracts.md)
- [docs/blackboard-schema.md](../docs/blackboard-schema.md)
- [docs/blackboard-architecture.md](../docs/blackboard-architecture.md)
- [docs/bridge-contract.md](../docs/bridge-contract.md)
- [plan/P17-async-workflow.md](../plan/P17-async-workflow.md)
- [plan/P22-vestige-true-extension.md](../plan/P22-vestige-true-extension.md)
