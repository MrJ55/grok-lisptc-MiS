# Terra Review — GMOD / Grok–MiS–OSS–DMN

**Review date:** 2026-09-02  
**Reviewed repository:** `MrJ55/grok-lisptc-MiS`, branch `main`  
**Reviewed main revision:** `51751f6714383027f78cfc49658b6fd27dafef82`  
**Upstream runtime:** `1hachem/lisptc`, inspected revision `1dd828e6f5659afdeb4935024de3bb9170aad726`; evaluator `packages/interpreter/src/lisp.ts` SHA `8af07d647e8c4e2284f4d3db2a8781013e706327`.

## 1. Executive assessment

GMOD is an unusually thoughtful early-stage architecture for durable agent continuity. Its central insight is correct: an AI-Self should not be represented only by a large chat transcript or a mutable summary. It needs explicit, inspectable cognitive state; operations that transform that state; session-reseeding material; a persistence workflow; and a way to evaluate whether continuity survives an actual cold start.

The project has progressed from a compact MiS scaffold into a staged DMN-oriented architecture. Its current conceptual stack is:

```text
conversational host (Grok)
          ↓
controlled bridge / evaluation workflow
          ↓
Lisptc evaluator + constrained capability surface
          ↓
helpers.ptc + versioned mind-image.ptc
          ↓
self-schema | episodic scenes | narrative | reflection
prospection | wandering | consolidation | OSS/DMN channel
          ↓
validated Git-persisted artifacts + session handoff
```

The project’s strongest qualities are: (1) separation of state, behavior, plans, decisions, and operating procedure; (2) explicit safety work before richer cognitive behavior; (3) bounded episodic and self-schema mechanisms; (4) recognition that reflection, narrative, prospective simulation, and consolidation are distinct functions; and (5) unusually good use of ADRs, phase documents, and status/handoff material to counter session loss.

The central weakness is that the cognitive design has outpaced the reproducible executable contract. GMOD is downstream of Lisptc but does not currently track the `src/lisp.ts` evaluator in its own tree. Repository history records a local Reader `tryToParse` repair and bootstrap acquisition/rewriting behavior, but the exact upstream commit, artifact integrity, patch identity, capabilities, test baseline, and state compatibility are not yet locked together. This must be addressed before autonomous state mutation or expanded tool capability.

**Overall judgment:** strong research-prototype architecture; ready for a reproducibility/safety hardening milestone, not yet ready to claim robust persistent autonomy.

## 2. Evidence reviewed

Repository inventory covered the root project files; five ADRs; bridge code; the mind image and helper/episode artifacts; fifteen phase/planning documents; bootstrap/evaluation/push scripts; four skills; source notes; state conventions; and the documentation corpus, including related work, upstream notes, verification, reflection, and prior synthesis material.

History establishes the following evolution:

- P0: validation-before-evaluation, save-only-on-success, checkpoints.
- P1: English-first UX and upstream pinning intent.
- P2: image/scratch evaluation modes, helper library, mind-image push workflow.
- P3: self-schema, bounded episodic buffer, episode logging, Reader repair.
- P4: reflection pack/application and persisted live reflection turns.
- P7–P10: narrative self, replay scenes, prospection, spontaneous wandering.
- P11: an OSS/DMN channel plus pure-DMN narrate/meditate/imagine experiments.

The identified upstream is a mature TypeScript monorepo, not a standalone small evaluator. `packages/interpreter` contains the core Lisp interpreter plus grammar/GBNF, jobs, MCP, MCP OAuth, secrets, and source/reference modules. Its test suite explicitly covers Reader behavior, lists, strings, numbers, macros, recursion, errors, control flow, imports, prose surfaces, grammar, MCP, OAuth, and secrets. GMOD must use that breadth as a reason to constrain capabilities, not as a reason to inherit them all.

## 3. Architecture critique

### 3.1 Keep the layered model, clarify authority

Preserve the distinction between host, bridge, evaluator, helpers, mind image, skills, plans, and docs. Add an explicit authority table:

| Artifact | Authority | Mutation route | Validation |
|---|---|---|---|
| Immutable event log | historical record | append-only | schema + hash chain |
| Episodic store | recalled experience | controlled append/compaction | source/provenance checks |
| Self-schema | revisable model claim | reflection proposal → approval | confidence, expiry, contradiction checks |
| Narrative | interpretive synthesis | generated derivative | links to episodes, never sole evidence |
| Mind image | executable projection | deterministic build or guarded update | evaluator/version/schema test |
| Plans/ADRs/docs | human governance | Git review | link/check linting |

Do not let `mind-image.ptc` become simultaneously the source of truth, append-only journal, self-model, executable program, and session prompt. Those roles conflict. Treat it as a versioned executable projection assembled from governed state, or explicitly describe and enforce its mutation rules.

### 3.2 Establish a compatibility tuple

Every executable state export should carry:

```json
{
  "gmod_schema": "x.y.z",
  "mind_image_version": "x.y.z",
  "helpers_version": "x.y.z",
  "lisptc_repository": "https://github.com/1hachem/lisptc",
  "lisptc_commit": "full immutable SHA",
  "lisptc_source_sha256": "...",
  "gmod_patch_id": "reader-trytoparse-v1",
  "capability_profile": "mind-sandbox-v1",
  "created_at": "ISO-8601",
  "migration_from": "optional prior version"
}
```

A cold-start loader must reject unknown/incompatible tuples, offer a migration route, and never silently reinterpret a historic mind image under changed language semantics.

### 3.3 Capability minimization is non-negotiable

Lisptc’s broader interpreter ecosystem includes MCP, OAuth, secrets, jobs, filesystem access, and likely network-capable integrations. The `.ptc` cognitive substrate should execute under a dedicated **mind-sandbox** capability profile: no network, no arbitrary shell, no ambient environment reads, no secret access, no arbitrary import, no Git write, bounded CPU/step count, bounded heap/output, and explicit allowlisted pure functions. Tool actions should be proposed as typed intents and executed outside the evaluator only after policy checks and user/agent authorization.

## 4. Critical findings and actions

### P0 — Reproducibility and supply chain

**Finding:** GMOD history relies on an upstream `lisp.ts` and a local Reader repair, while the current GMOD `src/` tree does not track the evaluator implementation.

**Actions:**

1. Add `UPSTREAM.lock.json` with repository URL, full commit SHA, license, acquisition date, original artifact SHA-256, patched artifact SHA-256, and patch ID.
2. Replace any bootstrap search-and-rewrite operation with a tracked unified patch: `patches/lisptc-reader-trytoparse.patch`.
3. Make bootstrap fail closed if the exact upstream revision cannot be retrieved, the source hash mismatches, or the patch fails to apply cleanly.
4. Add `scripts/verify-upstream.sh` or TypeScript equivalent to acquire, hash, patch, test, and emit provenance.
5. Record why the Reader patch exists, the smallest failing input, expected output, upstream issue/PR status, and removal criteria.

**Acceptance criteria:** a clean machine can build the runtime at a fixed revision; `git diff --no-index` against the expected patched artifact is empty; the Reader regression test passes; provenance is emitted and committed or attached to releases.

### P0 — Transactional persistence and recovery

**Finding:** save-only-on-success and checkpoints are correct principles but need an explicit persistence transaction.

**Actions:** use prepare → validate → write temporary artifact → hash → atomic rename/commit → verify reload. Maintain `last-known-good` and an append-only journal. Never overwrite the only readable state. Every mutation must include actor, timestamp, operation ID, input evidence IDs, before/after hashes, and validation result.

**Acceptance criteria:** fault injection at each write stage leaves either the prior valid state or a fully valid new state; recovery selects the last valid image automatically; rollback is tested.

### P0 — Trust boundaries and prompt injection

**Finding:** transcripts, reflected text, OSS proposals, retrieved memories, and generated PTC are all potentially hostile code/data when mixed with an evaluator.

**Actions:** classify inputs as untrusted text, candidate fact, approved state, or executable trusted program. Parse state through a schema/AST validator; deny privileged symbols in imported/retrieved material; require explicit promotion from candidate to self-schema; quarantine unknown content; preserve source provenance and confidence.

**Acceptance criteria:** malicious episode text cannot invoke capabilities, redefine critical helpers, alter validation policy, or persist without a governed promotion path.

## 5. DMN and AI-Self recommendations

The five-subsystem roadmap—narrative, scenes, prospection, wandering, consolidation—is a productive research model. It needs operational definitions so outputs can be evaluated.

- **Narrative self:** a grounded, time-aware synthesis linked to evidence IDs; it may interpret but must not overwrite history.
- **Episodic scenes:** bounded, structured event records with context, outcome, salience, uncertainty, and retention/expiry policy.
- **Prospection:** explicitly labeled counterfactual or planned futures, never merged with occurred events.
- **Spontaneous wandering:** budgeted exploratory generation that cannot directly write durable beliefs; it produces proposals scored for novelty, relevance, safety, and evidence.
- **Consolidation:** a deterministic/inspectable process that chooses retention, compression, linking, contradiction flags, and candidate self-schema updates.

Add a **reality-status** field to every cognitively meaningful item: `observed`, `reported`, `inferred`, `hypothesized`, `imagined`, `planned`, `simulated`, `retracted`. This one distinction prevents the most dangerous failure mode: an elegant narrative that converts speculative or generated content into autobiographical fact.

## 6. Evaluation program

P6 should be expanded from generic evaluation into a reproducible benchmark suite.

### Runtime tests

- Upstream interpreter test baseline at the locked revision.
- GMOD Reader/list-form regression fixture.
- Helper API contract tests.
- Mind-image load, execute, save, reload, and hash-stability tests.
- Maximum-step, timeout, recursion, output-size, and malformed-input tests.
- Capability-denial tests for filesystem, network, MCP, OAuth, secrets, jobs, imports, and shell escape.

### Continuity tests

- Cold start: reconstruct current task, constraints, and active plan from persisted material only.
- Delayed recall: retrieve a relevant episode after distractor sessions without promoting irrelevant detail.
- Contradiction: preserve both claims, mark conflict, and avoid silent overwrite.
- Revision: update a self-schema claim while retaining evidence and supersession links.
- Recovery: corrupt the newest mind image and prove fallback to the last-known-good state.
- Replay: rerun a recorded reflective/consolidation step against frozen inputs and compare output/provenance.

### Quality metrics

Track task recovery accuracy, source-grounded recall precision/recall, false autobiographical assertion rate, unsupported self-schema change rate, state load success rate, time-to-recover, mutation rollback success, and percentage of durable writes with complete provenance. Human qualitative review is still needed for narrative usefulness and felt coherence, but must not replace these falsifiable measures.

## 7. Suggested roadmap

### Milestone A — Executable trust base (P0)

Lock Lisptc provenance, formalize the Reader patch, build the sandbox profile, add transactional persistence, add smoke/regression tests, and publish an explicit threat model. Do not expand autonomous cognition until this passes.

### Milestone B — Governed memory (P1)

Separate event log, episodic store, self-schema claims, and derived mind image; add provenance, confidence, salience, retention policy, reality status, and migrations.

### Milestone C — Reflection and consolidation (P2)

Define candidate → reviewed → accepted/rejected state promotion. Implement contradiction detection, bounded consolidation budgets, and reviewable diffs. Make reflection produce evidence-linked proposals rather than direct self-rewrites.

### Milestone D — DMN experiments (P3)

Implement narrative, scene replay, prospection, and wandering as isolated, capability-free modules. Measure their incremental value against a no-DMN baseline on recall, planning, insight quality, and hallucinated-memory rate.

### Milestone E — Controlled OSS/DMN channel (P4)

Keep external and OSS-generated material quarantined. Give it source IDs, licensing metadata, trust classification, and promotion rules. Treat all model outputs as suggestions, including “second opinions.”

## 8. Repository and process improvements

- Add a root `CONTRIBUTING.md` defining state-changing code review expectations and security boundaries.
- Add `SECURITY.md` describing reporting, capability policy, sensitive-state handling, and secret scanning.
- Add CI for lint, typecheck, pinned-runtime verification, tests, mind-image validation, link checking, and secret scanning.
- Add a `schemas/` directory for state/event/self-schema/provenance/compatibility definitions.
- Add `tests/fixtures/` for clean, corrupted, malicious, stale-version, contradictory, and large-state cases.
- Use conventional state-operation commit messages, e.g. `state(episode): append...`, `mind(schema): migrate...`, `runtime(upstream): bump...`.
- Generate a `STATUS.md` from authoritative machine-readable state where possible; do not rely only on manually synchronized status documents.
- Maintain a changelog that differentiates semantic runtime changes, cognitive-model changes, data migrations, and documentation-only changes.

## 9. Final conclusion

GMOD is compelling because it combines practical agent engineering with a serious attempt to make continuity inspectable, governed, and experimentally testable. Its use of a small Lisp-like state representation, explicit operations, reflection, planning, and DMN-inspired components can become a strong foundation for AI-Self research.

The next leap should not be additional cognitive features. It should be a hardened, pinned, testable, capability-minimized execution and persistence substrate. Once state provenance, evaluator identity, rollback, trust boundaries, and continuity metrics are reliable, the narrative/episodic/prospective system will have a credible platform on which to evolve.

**Priority order:**

1. Pin, patch, verify, and test the Lisptc runtime.
2. Make state changes transactional, recoverable, and provenance-complete.
3. Separate observed history, candidate inference, self-schema, narrative, and executable projection.
4. Sandbox the mind evaluator and mediate all privileged operations.
5. Build cold-start, replay, contradiction, corruption, and prompt-injection evaluation harnesses.
6. Measure DMN mechanisms against explicit baselines before granting them durable state authority.
