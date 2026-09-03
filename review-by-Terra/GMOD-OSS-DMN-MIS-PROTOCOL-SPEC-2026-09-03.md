# GMOD OSS-DMN / MiS Protocol Architecture Specification

**Status:** Normative implementation addendum to the Terra review package. This document incorporates the preceding design discussion about cohesive Lisptc-native agency, Vestige-backed memory, temporal history, OSS/DMN experiments, and the current documentation corpus.

## 1. Decision summary

GMOD SHALL NOT move the entire `docs/` corpus into the executable mind. It SHALL use a dual/tri-layer representation with one lineage:

```text
Git Markdown = canonical full research record, rationale, prompts, citations, results, history
MiS/Lisptc   = active symbolic mind: approved protocols, procedures, policies, current hypotheses
Vestige      = durable temporal experiment memory: runs, outcomes, evidence, causal links
GMOD bridge  = synchronizer/compiler/auditor and Lisptc-native capability membrane
```

Operational OSS/DMN knowledge belongs in MiS, but as curated, versioned, typed protocol objects and executable procedures—not as a wholesale copy of research prose. Full Markdown remains authoritative for human-readable provenance and historical context.

The governing rule is:

> Docs preserve what was thought, tried, cited, and learned. MiS embodies what the mind can currently do. Vestige preserves when it was used, why it was used, what happened, and what later became relevant.

## 2. Why not move all docs into MiS?

The repository's `docs/` corpus includes custom instructions, a GPT-OSS probe, rollback notes, upstream and verification material, architecture, bootstrap, decisions, extension contrast, live-cycle records, learnings, API, operations, OSS experiments, permanence, reflection protocol, related work, previous synthesis, session handoff, status, and prompt reseed material. These artifacts are all valuable, but their roles differ.

A wholesale migration would:

- Inflate the runtime mind and context surface.
- Mix historical prose, hypotheses, citations, operating rules, and executable procedures.
- Make experimental prompt wording appear current and authoritative.
- Increase prompt-injection and code/data confusion risk.
- Create a second, difficult-to-review copy of Git history.
- Make prompt evolution and rollback ambiguous.

Keeping everything only in Markdown would also fail: the mind would repeatedly rediscover operational knowledge and tool workflows would remain host-level or ad hoc. The solution is typed extraction and compilation, not duplication.

## 3. Knowledge layers and authority

| Layer | Authoritative content | Runtime role |
|---|---|---|
| Git research corpus | Full documents, prompt variants, experiments, citations, rationale, historical snapshots | Human review, diffs, source lineage, release record |
| MiS active mind | Approved protocol registry, current prompt policies, learned macros, active hypotheses, goals, constraints | Lisptc-native cognitive and operational execution |
| Vestige | Protocol runs, operation traces, temporal relations, outcomes, evaluation evidence, causal backfill | Long-term episodic/associative memory and experiment history |
| Generated projections | Session reseed, compiled prompt envelope, active protocol projection, narrative summary | Disposable/derived runtime views |

No artifact may silently become authoritative in another layer. Every derived representation retains:

- Source document path.
- Source Git commit or immutable content hash.
- Protocol/claim/procedure version.
- Creation and recording time.
- Reality status.
- Evidence and predecessor references.
- Promotion or deprecation status.

## 4. Protocol object model

A prompt is a protocol, not merely text. Every operational OSS/DMN protocol SHALL define:

```text
identity, purpose, input schema, context policy, template, parameters,
output contract, safety constraints, capability profile, evaluator,
version, source lineage, lifecycle, promotion policy
```

Recommended repository layout:

```text
protocols/
  REGISTRY.yaml
  dmn/
    narrate/
      dmn-narrate-v1.yaml
      dmn-narrate-v1.prompt.md
      dmn-narrate-v1.tests.json
    reflect/
      dmn-reflect-v1.yaml
      dmn-reflect-v1.prompt.md
      dmn-reflect-v1.tests.json
    meditate/
      dmn-meditate-v1.yaml
      dmn-meditate-v1.prompt.md
      dmn-meditate-v1.tests.json
    imagine/
      dmn-imagine-v1.yaml
      dmn-imagine-v1.prompt.md
      dmn-imagine-v1.tests.json
  oss/
    second-opinion/
      oss-second-opinion-v1.yaml
      oss-second-opinion-v1.prompt.md
      oss-second-opinion-v1.tests.json
```

Example YAML:

```yaml
id: dmn-narrate-v1
version: 1.0.0
status: approved
kind: narrative-protocol
source_docs:
  - docs/oss-second-opinion-prompts.md
  - docs/gmod-live-cycle-20260902.md
  - docs/related-work.md
purpose: Produce a bounded, evidence-linked narrative candidate.
inputs:
  required: [active_goals, salient_episodes, self_schema_projection]
  optional: [narrative_period, style, token_budget]
context_policy:
  max_episode_count: 8
  include_reality_status: true
  include_evidence_ids: true
  exclude_untrusted_raw_text: true
  exclude_secrets: true
  exclude_simulated_as_observed: true
capability_profile: model-inference-v1
output_contract:
  kind: candidate_narrative
  must_include: [time_bounds, evidence_ids, certainty_markers]
  forbidden: [direct_self_schema_mutation, ungrounded_autobiography, hidden_tool_instruction]
evaluation:
  grounding_minimum: 0.75
  unsupported_autobiography_maximum: 0.05
  human_review_required: true
promotion:
  candidate_to_approved: human_or_policy_review
  approved_to_active: mind_projection_rebuild
```

The `.prompt.md` is human-readable but is always resolved through the versioned protocol metadata. It SHALL contain explicit placeholders and must not be treated as Lisp source merely because a placeholder or generated result resembles code.

## 5. MiS representation

MiS stores handles and active procedure definitions, not the full historical document corpus:

```lisp
(defparameter *dmn-protocol-registry*
  '((:id 'dmn-narrate-v1
     :kind 'prompt-protocol
     :status 'approved
     :source-doc "docs/oss-second-opinion-prompts.md"
     :source-ref "git:main:docs/oss-second-opinion-prompts.md#dmn-narrate-v1"
     :purpose "Generate bounded first-person narrative candidates."
     :input-schema 'dmn-narrate-input-v1
     :output-schema 'dmn-narrate-output-v1
     :capability-profile 'model-inference-v1
     :version "1.0.0"
     :review-after "2026-10-01")
    (:id 'dmn-reflect-v1
     :kind 'reflection-protocol
     :status 'approved
     :source-doc "docs/reflection-protocol.md"
     :capability-profile 'reflection-v1
     :version "1.0.0")))
```

Required MiS operations:

```lisp
(dmn-list-protocols *mind*)
(dmn-get-protocol *mind* protocol-id)
(dmn-select-protocol *mind* :goal goal)
(dmn-compile-protocol *mind* protocol-id context)
(dmn-run-protocol *mind* :protocol protocol-id :input input)
(dmn-evaluate-run *mind* run-id)
(dmn-propose-protocol-revision *mind* proposal)
(dmn-promote-protocol *mind* candidate-id)
```

Protocol handles in the mind SHALL resolve to immutable Git revisions and validated source hashes. The active registry is a projection and must be rebuildable.

## 6. Lisptc-native execution contract

Lisptc is GMOD's preferred cognitive and operational execution plane. The protocol runner SHALL be called through Lisptc-native functions, not a host-only prompt loop:

```text
agent-authored Lisptc program
  → protocol selection
  → MiS context selection
  → Vestige recall/graph/backfill through typed bindings
  → protocol compilation
  → model/API capability invocation
  → typed result parsing
  → evaluation/proposal generation
  → operation and Vestige episode recording
```

The bridge remains a capability membrane, not a replacement for programmatic tool use. Tool/API bindings are explicit, typed, scoped, auditable, revocable, and effect-classified.

Required profiles:

```text
mind-memory-read-v1
model-inference-v1
reflection-v1
mind-candidate-write-v1
vestige-maintenance-v1
git-governed-write-v1
secrets-v1
external-action-v1
```

A protocol may not silently acquire a stronger profile than declared in its spec. Prompt text is data/template content; it never grants tools.

## 7. Compiler, runner, evaluator

Add:

```text
bridge/
  protocol-registry.ts
  protocol-compiler.ts
  protocol-runner.ts
  protocol-evaluator.ts
  prompt-provenance.ts
```

### Compiler

`protocol-compiler.ts` SHALL:

1. Resolve protocol ID and immutable version.
2. Verify source Git reference/content hash.
3. Validate input and placeholder schemas.
4. Select context only through MiS/Vestige policy functions.
5. Preserve memory IDs, time bounds, reality status, confidence, and source refs.
6. Exclude secrets and forbidden raw content.
7. Enforce token/size budgets.
8. Hash the compiled prompt envelope.
9. Emit a human-reviewable envelope and typed runner input.
10. Never evaluate prompt text as Lisp.

### Runner

`protocol-runner.ts` SHALL:

1. Load only declared capability profiles.
2. Record capability load, intent, protocol ID/version, input hash, and mind checkpoint.
3. Invoke the model/API through the Lisptc-native wrapped capability.
4. Record result hash, bounded summary, provider/model metadata, and status.
5. Parse output against the protocol output schema.
6. Prevent direct self-schema, code, Git, or memory promotion.
7. Persist a protocol-run episode in Vestige.
8. Return a typed candidate result to MiS.

### Evaluator

`protocol-evaluator.ts` SHALL support grounding, temporal consistency, unsupported-autobiography rate, novelty, coherence, goal contribution, context efficiency, policy compliance, and parent-version regression comparisons.

## 8. Prompt/protocol lifecycle

```text
approved protocol
  → Lisptc execution
  → operation trace and Vestige experiment episode
  → reflection over runs/outcomes
  → candidate protocol revision
  → static/adversarial tests
  → sandbox and A/B evaluation
  → human/policy approval
  → Git commit of new immutable version
  → MiS active-registry projection rebuild
```

Candidate revision example:

```lisp
(candidate-protocol-revision
  :id 'dmn-narrate-v2-candidate
  :parent 'dmn-narrate-v1
  :change-summary "Require temporal anchor before first-person claims."
  :hypothesis "Temporal anchors reduce unsupported autobiography."
  :evidence '(vestige:run-021 vestige:run-037)
  :required-tests '(grounding temporal-status injection)
  :status 'candidate)
```

The active protocol cannot be silently rewritten during a session. Every version has lineage, tests, approval, source commit, and deprecation/supersession metadata.

## 9. Vestige experiment schema

Every protocol run SHOULD be stored as an experiment episode:

```json
{
  "kind": "dmn_protocol_run",
  "protocol_id": "dmn-narrate-v1",
  "protocol_version": "1.0.0",
  "source_ref": "git:commit:path#section",
  "occurred_at": "ISO-8601",
  "recorded_at": "ISO-8601",
  "mind_checkpoint_before": "checkpoint-id",
  "model_ref": "provider/model/version",
  "input_hash": "sha256:...",
  "compiled_prompt_hash": "sha256:...",
  "parameter_hash": "sha256:...",
  "output_hash": "sha256:...",
  "outcome_summary": "bounded summary",
  "evaluation": {
    "grounding": 0.79,
    "novelty": 0.61,
    "coherence": 0.84,
    "unsupported_autobiography": 0.08
  },
  "reality_status": "generated",
  "result_status": "candidate",
  "related_episode_ids": []
}
```

Vestige supplies long-term retrieval, temporal sequence, causal backfill, deduplication, and history of protocol outcomes. MiS interprets those outcomes and decides whether to propose a procedure or protocol revision.

## 10. Documentation migration strategy

Do not perform a big-bang move or delete current docs.

### Phase A: classify

Add a document index/front matter classification:

```text
research-record | protocol-source | operational-playbook | architecture-decision
experiment-result | historical-artifact | active-spec | deprecated
```

Map current docs:

- `DMN-gpt-oss-20b-probe.md`: research protocol/result.
- `oss-second-opinion-prompts.md`: protocol source and variants.
- `oss-nudge-craft.md`: experiment and rationale.
- `gmod-live-cycle-20260902.md`: chronological run record.
- `gmod-extensions-contrast-20260902.md`: comparative synthesis.
- `related-work.md`: source/citation registry.
- `reflection-protocol.md`: active protocol source.
- `learnings-log.md`: distilled learning history.
- `session-handoff.md`, `user-prompt-reseed.md`: generated/operational projections.
- `mind-api.md`, `architecture.md`: active specifications.

### Phase B: registry

Add `protocols/REGISTRY.yaml` with stable IDs, status, source paths, sections, phase, capability profile, input/output schemas, version, and lineage.

### Phase C: first migration

Migrate only:

1. `dmn-reflect-v1` from `docs/reflection-protocol.md`.
2. `dmn-narrate-v1` from `docs/oss-second-opinion-prompts.md` and live-cycle evidence.
3. `oss-second-opinion-v1` from `docs/oss-second-opinion-prompts.md`.

Keep the docs as canonical sources and retain exact source refs in protocol metadata.

### Phase D: compile and observe

Build registry/compile/run/evaluate infrastructure and record every run before permitting protocol evolution.

### Phase E: evolve

Allow candidate revisions only after parent comparison, adversarial tests, and approval. Commit the new version before updating the active MiS projection.

## 11. Phase amendments

### P0.1 State Governance and Runtime Trust

Add protocol safety and provenance:

- Protocol/source/version/content-hash manifest.
- Capability profile enforcement for model/API calls.
- Prompt envelope hashing and redaction.
- No secret leakage into prompts, Vestige, projections, Git, or audit prose.
- Operation IDs linking protocol, compiled prompt, capability invocations, outputs, checkpoints, and commits.
- Failure-safe handling of partial model/tool workflows.

### P00 Cold Start

The boot projection SHALL include:

- Current active protocol IDs and versions.
- Current protocol policy and prohibited effects.
- Recent protocol-run turning points.
- Unresolved protocol regressions or candidate revisions.
- Runtime compatibility tuple.
- Vestige health/staleness status.

### P2 Helpers/Scratch/Push

Add the MiS protocol API, scratch-only compilation/trials, image-mode active registry loading, projection validation, and protocol provenance operations.

### P3 Self-Schema/Episodes/Timeline

Record protocol use as temporal experience. Link active self-schema claims about capabilities or preferences to protocol-run evidence. Retain three clocks and reality status.

### P4 Reflection

Add reflection over protocol outcomes, recurrent failures, grounding regressions, temporal inconsistencies, successful procedures, and candidate prompt changes. Reflection proposes; it does not activate.

### P5 Vestige

Use Vestige for protocol-run episodes, version comparisons, causal backfill, prompt-context relationships, outcome retrieval, deduplication, and maintenance. MiS holds active handles and interpretations, not a duplicate experiment database.

### P6 Evaluation

Treat protocols as software. Required tests:

- deterministic/snapshot compilation;
- input/output schema validation;
- evidence grounding;
- temporal-status correctness;
- retrieval/prompt injection resistance;
- parent-version regression;
- context/token budget;
- capability compliance;
- frozen-run replay;
- promotion/deprecation lineage.

### P7 Narrative

`dmn-narrate-vN` returns evidence-linked candidate chapters with explicit time bounds and certainty markers. It cannot directly alter history or self-schema.

### P8 Replay

`dmn-replay-vN` uses frozen `as-of` episode/checkpoint references and marks outputs `simulated` unless explicitly reconstructing recorded history.

### P9 Prospection

`dmn-prospect-vN` produces planned/hypothesized scenario objects with assumptions, horizon, success criteria, and later outcome evaluation.

### P10 Wander

`dmn-wander-vN` creates bounded candidate prompts, insights, questions, and procedures with no direct durable authority or privileged capability.

### P11 OSS/DMN Channel

Rename/redefine P11 as the protocol registry and experimental learning channel. Inventory all OSS/DMN artifacts; extract stable protocols; build registry/compiler/runner/evaluator; record runs in Vestige; support candidate revisions and controlled promotion. External material remains source-linked, licensed, untrusted candidate input.

## 12. Implementation sprints

### Sprint 1 — classification and registry

- Add document classification index.
- Inventory OSS/DMN prompts and experiments.
- Create initial `REGISTRY.yaml`.
- Assign stable protocol IDs and source refs.

### Sprint 2 — protocol contracts

- Add protocol, input, output, evaluation, capability, and promotion schemas.
- Extract the first three protocols.
- Add fixtures for valid, malformed, stale, secret-containing, and injection-containing inputs.

### Sprint 3 — Lisptc compiler/runner

- Implement registry resolution and immutable source verification.
- Implement context selection and prompt envelope hashing.
- Implement Lisptc-native runner with declared model/API capability.
- Implement typed result parsing and candidate-only output.

### Sprint 4 — Vestige observation

- Record protocol-run episodes, operation traces, input/context/protocol/output hashes.
- Add temporal and causal links.
- Add degraded mode and replayable frozen-run references.

### Sprint 5 — evaluation and evolution

- Implement grounding, temporal, safety, efficiency, novelty, and regression evaluators.
- Run parent-versus-candidate A/B tests.
- Build candidate revision proposals.
- Require approval and Git commit before registry activation.

### Sprint 6 — DMN expansion

- Migrate meditate, imagine, replay, prospect, wander, nudge-craft, and OSS probe protocols.
- Keep each protocol bounded and independently evaluated.
- Add protocol selection based on active goals, phase, evidence, and capability profile.

## 13. Required tests and acceptance criteria

### Repository/provenance

- Every active protocol resolves to an existing Git path, commit, section, and content hash.
- Registry drift is detected in CI.
- A protocol cannot be activated if its source or schema is missing.
- Historical protocol versions remain reconstructible.

### Runtime/security

- Prompt text never becomes Lisp automatically.
- Retrieved content cannot inject a new tool/capability binding.
- Protocols cannot exceed declared capability profiles.
- Secrets are absent from compiled envelopes, Vestige, projections, Git, and logs.
- Partial tool/model failure leaves truthful recoverable operation records.

### Cognitive quality

- Narrative claims resolve to evidence IDs and time bounds.
- Simulated/prospective output cannot become observed history.
- Active self-schema claims cite protocol/episode evidence where relevant.
- Repeated useful procedures can be proposed and tested without automatic promotion.
- Protocol selection improves task continuity rather than merely increasing prompt complexity.

### Performance and efficiency

- Compare host-level prompt loops with Lisptc-native composed workflows.
- Measure context-token reduction from keeping intermediate results in the REPL.
- Measure protocol-run latency, memory overhead, and context selection efficiency.
- Measure recall utility per token and outcome improvement per protocol version.

## 14. Definition of success

This integration succeeds when GMOD can retain the full OSS/DMN research history in Git, expose approved operational knowledge through a cohesive MiS/Lisptc protocol registry, execute those protocols through recorded Lisptc-native tool/API workflows, store temporal outcomes and causal relationships in Vestige, reflect on its own protocol performance, propose tested revisions, and activate only versioned, reviewed, evidence-supported improvements.

The resulting system remembers not only project facts, but:

```text
which cognitive procedure was used,
when it was used,
with what context and capability,
what it produced,
what succeeded or failed,
what later evidence changed its interpretation,
and which procedure replaced it.
```
