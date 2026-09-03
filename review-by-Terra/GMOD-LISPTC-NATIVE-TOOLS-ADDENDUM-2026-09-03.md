# GMOD Addendum — Lisptc-Native Tool Use and Recorded Agency

**Status:** Normative for the Terra review package. This document supersedes conflicting tool-use and capability restrictions in `GMOD-MIND-VESTIGE-BUILD-SPEC-2026-09-02.md`.

## Decision

GMOD SHALL use Lisptc as its preferred cognitive and operational language. Agent-authored Lisptc programs SHOULD conduct normal memory and tool workflows through explicitly loaded, typed, capability-scoped bindings. This preserves Lisptc's key value: tool calls compose in a persistent REPL, intermediate values stay in runtime state, host-level call loops are minimized, and validated procedures become reusable operational memory.

GMOD SHALL NOT grant ambient, unrestricted, unrecorded, or unreviewable authority merely because a program runs in Lisptc. The policy is **capability governance, not tool prohibition**.

## Superseded language

Replace:

> Do not permit direct unrestricted memory-server, filesystem, network, shell, Git, OAuth, jobs, or secrets access from the mind evaluator.

With:

> Do not permit ambient or unrestricted authority in the mind evaluator. Capabilities are absent by default and may be explicitly loaded as typed Lisp bindings with declared scope, effect class, audit level, policy checks, revocation, and appropriate authorization. Lisptc is the normal execution plane for authorized tools.

Retain and clarify:

> Do not execute retrieved transcript, external, vector-retrieved, or model-generated text as Lisp.

Untrusted material is data. It can be queried, transformed, summarized, cited, stored as a candidate, and used as evidence. It cannot implicitly become executable code or capability-bearing authority. A candidate procedure follows candidate → parse/static check → sandbox trial → tests → review → approved versioned procedural memory.

## Capability membrane

```text
agent-authored Lisptc program
        ↓
explicit capability binding
        ↓
GMOD policy wrapper: validate → authorize → audit → execute → record
        ↓
Vestige / GitHub / filesystem / MCP / network service
        ↓
typed result remains in Lisp runtime
        ↓
selected summaries, evidence, and state transitions enter the mind
```

The GMOD bridge is not a host-level replacement for Lisptc-native tools. It is the safe implementation of them.

## Descriptors and profiles

Every loaded binding SHALL declare name, profile, effect, scope, input/output schemas, audit level, confirmation rule, and revocability.

```json
{
  "name": "vestige/recall",
  "profile": "mind-memory-read-v1",
  "effect": "read",
  "scope": {"project": "grok-lisptc-MiS", "namespace": "gmod"},
  "input_schema": "schemas/vestige-recall.schema.json",
  "output_schema": "schemas/memory-result.schema.json",
  "audit_level": "full",
  "requires_user_confirmation": false,
  "revocable": true
}
```

| Profile | Permitted purpose | Authorization |
|---|---|---|
| `mind-read-v1` | Safe project inspection | Automatic |
| `mind-memory-read-v1` | Vestige recall, graph, causal backfill | Automatic |
| `mind-candidate-write-v1` | Bounded candidate creation | Policy-gated |
| `reflection-v1` | Read, compute, candidate claims/procedures | No direct promotion |
| `vestige-maintenance-v1` | Consolidation, dedup, suppression | Explicit policy |
| `git-governed-write-v1` | Approved repository writes | User confirmation |
| `secrets-v1` | Sensitive credential resolution | Explicit elevated grant |
| `external-action-v1` | Remote side effects | User confirmation |

## Recorded agency

Every capability load and invocation SHALL create an operation event and, when meaningful, a Vestige-linked autobiographical episode.

```json
{
  "operation_id": "op-stable-id",
  "parent_operation_id": "optional-parent-id",
  "session_id": "session-id",
  "mind_checkpoint_before": "checkpoint-id",
  "started_at": "ISO-8601",
  "capability": "vestige/backfill",
  "effect_class": "read",
  "intent": "Trace causal predecessors of state regression.",
  "arguments_hash": "sha256:...",
  "arguments_redacted": {},
  "result_hash": "sha256:...",
  "result_summary": "bounded non-sensitive summary",
  "status": "success|failure|denied",
  "finished_at": "ISO-8601",
  "mind_checkpoint_after": "checkpoint-id",
  "source_refs": [],
  "reality_status": "observed"
}
```

Consequential writes additionally record approved target, exact payload/diff hash, confirmation reference, external result ID, and rollback reference. Secrets are redacted or hashed and never enter prompts, Vestige, PTC projections, Git, or audit prose.

## Safe code/data boundary

Safe:

```lisp
(let ((memories (mind-recall *mind* :query "runtime provenance" :k 8)))
  (mind-propose-update *mind* :kind 'narrative-fragment :evidence memories))
```

Forbidden:

```lisp
(eval retrieved-memory-content)
```

The active agent program, reviewed helpers/macros, validated template code, and schema-checked data projections may execute under their declared profile. Retrieved content remains quoted/typed data. Candidate macros require static validation, sandbox execution, tests, review, and versioned installation.

## Vestige contract

Vestige remains the durable episodic, associative, temporal, and causal substrate. It is normally accessed from Lisptc through `bridge/vestige-adapter.ts`, which normalizes results into typed memory objects, preserves source IDs/provenance, applies trust/context filters, and records operations.

```lisp
(mind-recall *mind* :query query :mode 'associative :k 5)
(mind-recall-sequence *mind* :from event-a :to event-b)
(mind-backfill-cause *mind* :symptom text)
(mind-record-event *mind* event)
```

Expose effect-scoped bindings, not a universal Vestige authority: `vestige/recall-read`, `vestige/graph-read`, `vestige/backfill-read`, `vestige/ingest-candidate`, `vestige/maintain-governed`, and `vestige/suppress-governed`.

## Required phase amendments

### P0.1 State Governance and Runtime Trust

- Add `CapabilityDescriptor` and operation-event schemas.
- Enforce deny-by-default environments, explicit loading, and revocation.
- Use correlation IDs linking program, tool invocation, Vestige record, checkpoint, and Git commit.
- Sanitize tool output and redact secrets.
- Require confirmation for consequential external action, even from Lisptc.
- Test prompt injection through Lisp-shaped retrieval, malicious tool output, hidden macro effects, policy self-modification, sensitive output, and partial multi-tool failures.

Done when unloaded calls fail, loaded calls cannot exceed scope, all invocations are recorded, untrusted text cannot execute, revocation works, and writes retain authorization/diff references.

### P2 Helpers, Scratch, Push

Add `mind-load-capability`, `mind-unload-capability`, `mind-capabilities`, `mind-execute`, `mind-record-operation`, `mind-operation-history`, `mind-propose-procedure`, `mind-test-procedure`, and `mind-promote-procedure`. Scratch permits computation/read/candidate output only. Image mode loads a validated projection and explicit capability set.

### P4 Reflection

Reflection may use memory-read and safe-compute capabilities and may create candidate claims, narratives, plans, and procedures. It may not directly promote self-schema, install trusted macros, suppress history, commit Git changes, access secrets, or mutate remote systems.

### P5 Vestige Integration

P5 MUST make tool traces and returned evidence part of temporal memory. Vestige reads, candidate ingest, maintenance, and suppression use different effect-scoped bindings. No duplicate all-powerful memory layer is created in MiS.

### P6 Evaluation

Add recorded-operation coverage, durable-change-to-operation linkage, replay rate for tool workflows, context-token savings versus host loops, unauthorized-call denial, scope-violation denial, and useful-procedure promotion rate. Benchmark the full recorded Lisptc workflow, not only retrieval quality.

## Operational rule

**Lisptc is where GMOD thinks and normally acts. Vestige is where GMOD retains and retrieves long-term episodic/causal experience. The bridge makes every authorized action typed, scoped, safe, auditable, and recoverable.**
