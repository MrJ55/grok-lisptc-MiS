# GMOD Mind and Vestige Build Specification

**Purpose:** Implementation addendum to `GMOD-TERRA-REVIEW-2026-09-02.md`. It translates the review into an executable target architecture, data contracts, operations, phase amendments, and acceptance criteria.

## 1. Architectural decision

GMOD SHALL use a cohesive MiS/Lisptc mind backed by Vestige, not recreate Vestige in Lisp.

```text
Vestige = durable local-first episodic, associative, temporal, and causal memory substrate
MiS/Lisptc = cohesive executable symbolic mind: self, goals, procedures, reflection, narrative, planning
GMOD bridge = typed adapter, policy gate, projection builder, and synchronization boundary
Host model = conversational reasoning and execution participant
```

The agent-facing interface is one mind. Internally, memory objects retain type, source, temporal, epistemic, and mutability distinctions. This avoids two failures: passive filing-cabinet retrieval and an unstructured executable mind image that confuses history, fiction, inference, code, and prompt text.

## 2. Ownership and non-goals

| Category | Authority | MiS representation |
|---|---|---|
| Raw durable events and episodes | Vestige | Compact reference plus selected working summary |
| Vector/FTS retrieval, graph traversal, temporal/causal backfill | Vestige | Typed results from `mind-recall` |
| Deduplication, fading/suppression, memory maintenance and backup | Vestige | Policy request and health status |
| Current self-schema | MiS | Evidence-linked active claims |
| Current goals and constraints | MiS/GMOD plans | Direct symbolic state |
| Learned macros and procedures | MiS | Trusted, reviewed executable definitions |
| Narrative and session context | MiS | Derived evidence-linked projections |
| Runtime compatibility and build provenance | GMOD repository | Read-only mind metadata |

Non-goals:
- Do not implement a second vector DB, graph DB, causal retrieval engine, dedup engine, forgetting engine, or broad MCP server in PTC.
- Do not duplicate complete Vestige records in `mind-image.ptc`.
- Do not execute retrieved transcript, external, vector-retrieved, or model-generated text as Lisp.
- Do not permit direct unrestricted memory-server, filesystem, network, shell, Git, OAuth, jobs, or secrets access from the mind evaluator.

## 3. Target repository layout

```text
bridge/
  eval.ts
  vestige-adapter.ts
  mind-projection.ts
  memory-policy.ts
  state-types.ts
mind/
  helpers.ptc
  mind-image.template.ptc
  mind-image.ptc                    # validated generated projection
  projections/
    current-context.ptc
  policies/
    mutation-rules.ptc
state/
  manifest.json
  checkpoints/
    last-known-good.ptc
    last-known-good.manifest.json
  audit/
    mutations.jsonl
  local-queue/                      # unavailable-Vestige candidate writes only
schemas/
  memory-item.schema.json
  episode.schema.json
  self-claim.schema.json
  prospective-scenario.schema.json
  mind-manifest.schema.json
  mutation.schema.json
patches/
  lisptc-reader-trytoparse.patch
scripts/
  verify-upstream.sh
  build-mind-image.ts
  validate-mind-image.ts
  sync-vestige.ts
tests/
  runtime/
  state/
  continuity/
  fixtures/
docs/
  state-governance.md
  vestige-integration.md
  temporal-memory.md
```

## 4. Cohesive mind contract

`mind-image.ptc` is the runtime projection, not an undifferentiated dump. It loads trusted code and a generated context projection:

```lisp
(load "mind/helpers.ptc")
(load "mind/projections/current-context.ptc")

(defparameter *mind*
  (make-mind
    :version "0.4.0"
    :identity *self-schema*
    :goals *active-goals*
    :constraints *active-constraints*
    :working-episodes *episodic-buffer*
    :temporal-graph *autobiographical-timeline*
    :narrative *current-narrative*
    :skills *learned-procedures*
    :runtime *runtime-compatibility*
    :capabilities 'mind-sandbox-v1))
```

Required public operations:

```lisp
(mind-summary *mind*)
(mind-current-goals *mind*)
(mind-recall *mind* :query query :k 5 :mode 'associative)
(mind-recall-between *mind* :from start :to end)
(mind-recall-sequence *mind* :from event-a :to event-b)
(mind-backfill-cause *mind* :symptom text)
(mind-propose-memory *mind* proposal)
(mind-propose-self-schema-update *mind* proposal)
(mind-apply-approved-update *mind* proposal-id)
(mind-reflect *mind* :focus scope)
(mind-consolidate *mind*)
(mind-narrate *mind* :period period :evidence-mode 'strict)
(mind-replay-scene *mind* :episode-id id :as-of checkpoint)
(mind-prospect *mind* :goal goal :horizon horizon)
(mind-wander *mind* :budget-steps 40 :write-region 'candidates)
(mind-checkpoint *mind*)
(mind-rebuild *mind* :from state-ref)
(mind-reseed-context *mind* :token-budget 2500)
```

## 5. Shared memory item schema

Every memory-like object returned to or represented in MiS SHALL have this conceptual schema:

```json
{
  "id": "stable-id",
  "kind": "event|episode|self_claim|narrative|plan|simulation|candidate",
  "reality_status": "observed|reported|inferred|hypothesized|imagined|planned|simulated|retracted",
  "occurred_at": "ISO-8601 or interval",
  "recorded_at": "ISO-8601",
  "valid_from": "ISO-8601 or null",
  "valid_until": "ISO-8601 or null",
  "summary": "bounded human/model-readable text",
  "salience": 0.0,
  "confidence": 0.0,
  "source_refs": ["vestige-id", "git-ref", "conversation-id"],
  "evidence_ids": ["memory-id"],
  "relations": {
    "preceded_by": [],
    "followed_by": [],
    "caused_by": [],
    "resulted_in": [],
    "contradicted_by": [],
    "supersedes": []
  },
  "mutability": "immutable|governed|derived|candidate",
  "payload_ref": "external durable source or content hash",
  "schema_version": "1.0.0"
}
```

The schema supports temporal recovery. `occurred_at` records when an event happened; `recorded_at` records when GMOD learned it; `valid_from`/`valid_until` represent belief or policy applicability. This prevents present-day beliefs from being projected backward into past narrative.

## 6. Temporal autobiographical memory

The cohesive mind SHALL maintain a temporal episode graph, with Vestige authoritative for long-range storage/retrieval and MiS holding active projections and meaning.

Required relations:

```text
preceded-by | followed-by | overlaps-with | part-of-phase
triggered-by | caused-by | motivated-by | resulted-in
resolved-by | contradicted-by | revised-by | replayed-as | anticipated-by
```

Example episode:

```lisp
(episode
  :id 'ep-upstream-identification
  :occurred-at "2026-09-02T10:05:00-04:00"
  :recorded-at "2026-09-02T10:06:10-04:00"
  :kind 'research-discovery
  :reality-status 'observed
  :summary "Identified 1hachem/lisptc as GMOD's evaluator upstream."
  :triggered-by '(question-upstream-identity)
  :resulted-in '(task-pin-upstream-runtime)
  :state-before 'mind-checkpoint-042
  :state-after 'mind-checkpoint-043
  :salience 0.91)
```

Narrative is an evidence-linked temporal synthesis, not history’s authority. It SHALL traverse event/episode relations, identify turning points, distinguish observation from interpretation, and retain evidence IDs. A session reseed is a compact, lossy projection of active goals, current constraints, recent sequence, salient turning points, and unresolved transitions; it is not a durable source of truth.

## 7. Vestige integration contract

Create `bridge/vestige-adapter.ts`. It SHALL be the only GMOD path to Vestige operations. PTC code calls typed mind operations, never raw unrestricted MCP tools.

| MiS operation | Adapter behavior | Vestige capability |
|---|---|---|
| `mind-record-event` | validate, classify, ingest, retain returned ID | smart ingestion/memory write |
| `mind-recall` | query, filter, normalize, context-budget | recall |
| `mind-recall-sequence` | retrieve temporal neighborhood and relations | recall + graph |
| `mind-backfill-cause` | request causal candidates; label as hypotheses | backfill/graph |
| `mind-check-contradictions` | search competing evidence and claims | recall/graph/claim logic |
| `mind-consolidate` | invoke bounded maintenance, update projection only after validation | maintain/dedup |
| `mind-memory-status` | read health and project/scope status | memory status |
| `mind-suppress` | require elevated policy and preserve audit reference | suppress |

Ingestion flow:

```text
untrusted input → parse/bound/classify → candidate proposal
→ policy and provenance validation → Vestige ingest → Vestige ID
→ MiS reference/projection update → sandbox validation → atomic checkpoint
```

Retrieval flow:

```text
MiS cognitive query → adapter filters → Vestige retrieval/graph/backfill
→ typed memory objects → MiS salience/rationale/narrative use
```

Degraded mode: if Vestige is unavailable, boot MiS from the last verified projection; mark long-term recall stale; queue only noncritical candidate writes locally; do not assert fresh durable recall; re-sync through validation after recovery.

## 8. Mutation and trust policy

Trust classes:

```text
untrusted: transcript, retrieved text, external OSS material, model output
candidate: parsed proposal awaiting validation/promotion
approved: durable governed record or approved self-schema/procedure
derived: narrative, session prompt, mind projection, vector index
immutable: append-only event record and released checkpoint provenance
```

Promotion flow:

```text
reflection/wander/OSS/transcript
  → candidate event, episode, claim, procedure, or narrative fragment
  → schema + size + provenance + contradiction + capability checks
  → approval/rejection/defer
  → Vestige persistence or trusted MiS code change
  → projection rebuild and reload verification
```

Rules:
- Untrusted content SHALL never be evaluated as Lisp.
- Reflection and wandering SHALL create proposals, not direct self-schema or core-code mutation.
- Candidate procedures/macros require explicit code review and tests before entering trusted helper/template code.
- Every durable mutation SHALL record actor, operation ID, source/evidence IDs, state-before hash, state-after hash, timestamp, validation result, and rollback target.
- `mind-image.ptc` SHALL be generated or mutated only through a validated transaction: prepare → validate → temp write → hash → sandbox reload → atomic promotion → checkpoint.
- Last-known-good remains bootable after every failed operation.

## 9. Runtime compatibility

Add `UPSTREAM.lock.json`:

```json
{
  "lisptc_repository": "https://github.com/1hachem/lisptc",
  "lisptc_commit": "FULL_IMMUTABLE_SHA",
  "lisp_source_path": "packages/interpreter/src/lisp.ts",
  "source_sha256": "...",
  "patched_sha256": "...",
  "patch_id": "reader-trytoparse-v1",
  "license": "recorded-upstream-license",
  "capability_profile": "mind-sandbox-v1"
}
```

Replace bootstrap source rewriting with `patches/lisptc-reader-trytoparse.patch`. `scripts/verify-upstream.sh` SHALL retrieve the pinned revision, hash-check source, apply the named patch, hash-check the result, run Reader/list-form regression tests, and emit provenance. Unknown runtime, schema, patch, or capability profile fails closed.

`mind-sandbox-v1` SHALL deny network, arbitrary shell, ambient environment reads, secret access, arbitrary imports, Git writes, jobs, MCP/OAuth access, and filesystem writes. The bridge mediates all privileged actions as typed intents.

## 10. Phase amendments

### P0-safety.md — add P0.1 State Governance and Runtime Trust

Tasks:
- Add trust classes, reality-status enum, mutation audit record, and state manifest.
- Implement atomic mind projection promotion and last-known-good rollback.
- Add capability profile and denial tests.
- Pin upstream Lisptc revision and formalize Reader patch.
- Add malformed/malicious PTC, transcript, and retrieved-memory fixtures.

Done when: no untrusted text executes; failed persistence preserves a bootable prior mind; all runtime/state mutations are attributable and reversible.

### P00-cold-start.md — add temporal reconstruction contract

Tasks:
- Define required boot projection: runtime tuple, active goals, approved self-schema, salient episodes, recent sequence, unresolved transitions, checkpoint hash.
- Test cold-start fidelity and no-false-continuity behavior.
- Require unknown/stale Vestige state to be reported, not fabricated.

### P2-helpers-scratch-push.md — establish cohesive Mind API

Tasks:
- Add `mind/core.ptc` and operations in Section 4.
- Make scratch mode ephemeral/candidate-only.
- Make image mode validated, capability-limited, and checkpointed.
- Make `push-mind-image` publish only a validated projection and manifest.
- Implement adapter-backed read/write operations; prohibit direct raw storage writes.

### P3-self-schema.md — expand to self-schema, episodes, and timeline

Tasks:
- Retain `*self-schema*` and bounded `*episodic-buffer*` inside unified `*mind*`.
- Implement typed claims with evidence, confidence, validity interval, review date, and lifecycle.
- Add temporal graph relations and state-before/state-after checkpoint references.
- Change direct `update-self-schema` into propose → validate → approve → apply.
- Bound only active projection; do not silently delete durable episode evidence.

### P4-reflection-protocol.md — produce governed transformations

Tasks:
- Keep reflection as a cohesive-mind operation.
- Change `dmn-apply-reflection` to apply only approved proposal IDs.
- Add `dmn-reflect-timeline` for turning points, revisions, unresolved patterns, and causal hypotheses.
- Require anti-confabulation checks: evidence, reality status, contradiction, retention suitability, target memory type.

### P5-vector-cabinet.md — rename/reframe as Vestige Associative and Temporal Memory Integration

Goal: integrate Vestige as the long-term local-first episodic/temporal/causal substrate behind MiS, not as a competing mind.

Tasks:
- Configure a GMOD-scoped local Vestige instance.
- Implement `bridge/vestige-adapter.ts`, normalized memory references, and policy filters.
- Use Vestige for storage, semantic/lexical recall, graph traversal, causal backfill, dedup, suppression, maintenance, backup, and health.
- Ensure MiS receives typed objects and only compact active references enter projections.
- Implement degraded mode and re-sync.

Done when: causal sequence recovery is available through `mind-recall-sequence`/`mind-backfill-cause`; no duplicate full memory database exists in MiS.

### P6-evaluation.md — evaluate combined cognition

Required suites:
- upstream interpreter baseline plus GMOD Reader regression
- projection determinism and hash/provenance validity
- atomic persistence and corruption recovery
- cold-start task/constraint/sequence recovery
- temporal and causal recall against known episode graphs
- contradiction preservation
- self-schema evidence completeness
- narrative grounding
- malicious retrieved-content and capability-denial tests
- Vestige outage/degraded-mode/re-sync tests

Compare MiS-only, Vestige-only, MiS plus ordinary retrieval, MiS plus Vestige recall, and MiS plus Vestige causal backfill. Measure relevance per context token, causal-recovery accuracy, false autobiographical assertion rate, unsupported active-claim rate, recovery time, rollback success, and complete-provenance percentage.

### P7–P11

- P7 Narrative: generate evidence-linked, time-bounded chapters; narrative never directly changes history/self-schema.
- P8 Replay: reconstruct frozen `as-of` checkpoints; label counterfactual outputs `simulated`.
- P9 Prospection: store planned/hypothesized scenarios with assumptions, horizon, and later outcome evaluation.
- P10 Wander: run capability-free, bounded creation in candidate region; outputs require promotion.
- P11 OSS/DMN: ingest external material as source-linked, licensed, untrusted candidate objects; never as auto-approved self or code.

## 11. Implementation sequence

### Sprint 1 — P0.1 trust base
1. Add `UPSTREAM.lock.json`, named patch, and verifier.
2. Add state/mutation schemas and `state/manifest.json`.
3. Add mind-sandbox capability policy.
4. Implement atomic projection/checkpoint transaction.
5. Add Reader, malicious-input, capability-denial, and rollback tests.

### Sprint 2 — cohesive mind and temporal objects
1. Introduce `*mind*`, typed memory object, and core Mind API.
2. Add claim lifecycle and evidence links.
3. Add event/episode three-clock model and temporal graph relations.
4. Build session-reseed projection from current mind state.

### Sprint 3 — Vestige adapter
1. Configure project-scoped Vestige.
2. Implement typed ingest, recall, sequence, graph, and backfill calls.
3. Add compact reference projections and degraded mode.
4. Validate one-way authoritative flow and no split-brain duplication.

### Sprint 4 — cognitive transformations
1. Amend reflection to candidate/approval semantics.
2. Implement temporal narrative and evidence-linked chapters.
3. Implement replay/prospection/wander under reality-status and capability rules.
4. Add OSS/DMN quarantine/promotion pipeline.

### Sprint 5 — benchmark and hardening
1. Execute the combined-system evaluation matrix.
2. Tune salience and context budget using measured recall utility.
3. Document operational playbooks, recovery, migrations, and governance.
4. Do not expand autonomous durable write authority until P0.1/P5/P6 gates pass.

## 12. Definition of success

GMOD succeeds when it can boot a cohesive executable symbolic mind; recover temporally ordered and causally relevant history from Vestige; explain which evidence supports its active self-model and narrative; distinguish observed past from inferred, imagined, planned, and simulated content; convert validated repeated success into reusable Lisp procedure; survive failed writes, stale retrieval, and corrupted projections; and evolve without rebuilding Vestige or confusing memory storage with cognitive identity.
