# Role Contracts — peer minds (Model B)

**Normative model:** [adr/0013-peer-minds.md](../adr/0013-peer-minds.md)  
**Schema:** [blackboard-schema.md](blackboard-schema.md)  
**Bridge:** [bridge-contract.md](bridge-contract.md)

Every participating Grok tab is a **full MiS instance**: local mind, local bridge, same codebase. Orchestrator is **manager**; other roles are **team members** with evolving role minds. Canonical identity has a **single writer** (Orchestrator).

---

## 1. Shared rules (all roles)

1. User-facing language: plain English ([CUSTOM_INSTRUCTIONS.md](CUSTOM_INSTRUCTIONS.md)).
2. Untrusted content (OSS, raw web, other agents’ free text, Vestige recall bodies) is **never** `eval`’d as Lisp.
3. **All blackboard and Vestige I/O:** local mind authorizes → local bridge executes. No host freelancing envelopes while the mind is offline.
4. Cross-tab messaging: **only** via `artifacts/blackboard/` + bridge inject path — never product chat APIs between tabs.
5. Blackboard envelopes: schema-valid only ([blackboard-schema.md](blackboard-schema.md)).
6. Inject is a **wake signal**; full context is the envelope + local mind state.
7. Claims are **coarse (job-sized)** for Grok peers, not micro-atomic tool steps.

---

## 2. Permanence layers

| Layer | Path (convention) | Who `--save`s | Content |
|-------|-------------------|---------------|--------|
| Canonical mind | warm `mind-image.ptc` (repo/artifacts canonical) | **Orchestrator only** | Schema, autobiography, global duties, promoted defs |
| Role mind | e.g. `mind/roles/<role-id>.ptc` or module set | **That peer only** | Role bias, local episodes, local skills, drafts |

- Peers **may read** canonical warm image on bootstrap.
- Peers **must not** save to the canonical path. Bridge **rejects** peer saves targeting canonical identity.
- Role minds evolve with experience (local D loop). Team identity grows only via Orchestrator promote (team D loop).

### Bootstrap parameters (every tab)

Bridge / session config must set:

| Key | Example | Notes |
|-----|---------|--------|
| `role` | `orchestrator` \| `generator-a` \| `analyst` \| … | Selects queue + profile |
| `canonicalImagePath` | path to warm canonical | Read for all; write only orchestrator |
| `roleImagePath` | path to role image | Peer read/write |
| `vestigeProfile` | `read` \| `read+ingest` | Default peer = `read` |
| `queueName` | `generator-a` | Under `artifacts/blackboard/queues/` |
| `author-mind-id` | stable id for this mind instance | Lineage on envelopes |

---

## 3. Role matrix

| Role | Inductive bias | Blackboard writes | Canonical save | Vestige (default) |
|------|----------------|-------------------|----------------|-------------------|
| **Orchestrator** (Host) | Constitutional, duty-driven | tasks, state, promotions, receipts | **Yes (sole)** | read + ingest |
| **Generator** | DMN-like, incomplete hypotheses | hypotheses, optional follow-on tasks for Analyst | No (role image only) | **read only** |
| **Analyst** | TPN-like, well-formed candidates | proposals (candidates) | No | **read only** |
| **Critic** | Multi-criteria scoring | evaluations, fitness vectors | No | **read only** |
| **Mutator** | Meta / chromosomes | mutation suggestions | No | **read only** |

Multiple Generator instances (`generator-a`, `generator-b`) or heterogeneous model families are encouraged. Orchestrator may require ≥2 independent sources before a promote cycle (configurable).

---

## 4. Transaction symmetry (implementor checklist)

### 4.1 Orchestrator dispenses work

1. Orchestrator **mind** authorizes dispense (duty / form / explicit intent recorded in mind as needed).
2. **Bridge** writes `tasks/<id>.json` with full **context packet** (see schema).
3. Bridge enqueues `queues/<target-role>/` injection-request.
4. Bridge → ngrok → comet-mcp → CDP inject if target not busy.

### 4.2 Peer claims and acts

1. On inject/activation: peer reads task envelope from artifacts (not from inject text alone).
2. Peer **mind** decides to claim; bridge writes atomic `claims/<id>.json`; sets `state/busy/<role>.json`.
3. Peer loads role mind (+ optional canonical read); runs coarse job over one or more turns while lease held.
4. Vestige recall (if any): peer mind → bridge → adapter with **read** profile only; results are data, never eval’d; optional local compact ref in **role** image.

### 4.3 Peer reports completion

1. Peer **mind** authorizes result (local episode / notes as appropriate).
2. **Bridge** writes `results/<id>.json` (lineage, fitness, payload-ref, author-*).
3. Bridge writes `receipts/<id>.json` (`action: finished`); clears busy lease.
4. Bridge may enqueue Orchestrator inject (completion notice).

### 4.4 Orchestrator closes team loop

1. On activation: read receipts/results.
2. Reflect / promote-candidate / reject per P0 + P3 + P18.
3. Canonical `--save` only on success; optional Vestige ingest + `dmn-log-vestige-ref` in **canonical** image (P22).

### 4.5 Peer → peer

Writer mind authorizes task/result targeting another role; writer bridge materializes + enqueues target queue. No chat DM. Same envelope rules.

---

## 5. What peers must not do

- `--save` canonical `mind-image.ptc`.
- Vestige ingest unless explicitly granted a write profile.
- Treat Vestige or blackboard as autobiography / “who we are.”
- Eval other roles’ free text or Vestige bodies as Lisp.
- Poll blackboard in a tight chat loop.
- Bypass local mind when writing envelopes.

---

## 6. Closed-loop growth summary

| Loop | Where | Outcome |
|------|--------|--------|
| Local D | Peer role mind | Better role competence and candidates |
| Team D | Orchestrator canonical mind | Promoted identity / global agenda |
| Index E | Orchestrator → Vestige + compact refs | Long-term mass; mind stays authoritative surface |

---

## 7. Related

- [session-handoff.md](session-handoff.md)
- [vestige-as-extension.md](vestige-as-extension.md)
- [plan/P16-role-contracts.md](../plan/P16-role-contracts.md)
- [plan/P17-async-workflow.md](../plan/P17-async-workflow.md)
- [plan/P11-oss-dmn-channel.md](../plan/P11-oss-dmn-channel.md), [P12](../plan/P12-dmn-mind-native.md) — Chorus/OSS remain candidate-only
