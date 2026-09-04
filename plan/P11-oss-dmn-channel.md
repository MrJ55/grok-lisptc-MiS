# P11 — OSS-DMN Channel (Pure DMN Generator Protocol)

**Status:** new / parallel → **revised 2026-09-04** (GLM+Terra synthesis) — gated on P6; parameter lock enforced by code; protocol registry (long-term)
**Depends on:** P0–P4 (safety + reflection), **P6 (evaluation gate)**
**DMN role:** Candidate-texture generator whose zero-system-prompt protocol is motivated by Alieksieienko (2026)'s finding that instruction-tuning degrades DMN-like residual geometry. The specific inference-time preservation claim is the fork's extension (see caveat below). Grok remains sole mutator of the symbolic mind.
**Sources:** Alieksieienko (Zenodo), arXiv 2604.03480, evilpiepirate DMN note, Seven-Pass Pipeline — see `docs/related-work.md`
**Extensions contrast:** `docs/gmod-extensions-contrast-20260902.md` (§1 Chorus, §2 Midnight Note, §3 Pulse Meter, §5 Page Passer, §6 Observer)

## P6 gate
Do not start P11 until P6 exit criteria pass. The OSS channel generates candidate content; without P6's reality-status auditing, candidates could leak into observed history.

## Goal
Make interaction with `openai/gpt-oss-20b` a first-class, repeatable, auditable host protocol that **never** shifts the model into TPN / instruction-following mode.

## Objective
1. **Parameter lock enforced by code** (not just documented) — `bridge/oss.ts` hardcodes the parameters; no system prompt is possible.
2. Soft-nudge prefix library (versioned).
3. Dual-channel capture: immediate episode log (`:source 'oss-dmn`, `:reality-status imagined`) + deferred proposal file.
4. Lightweight geometric-aware salience heuristic (DMN-like vs control-like classification) — **Pulse Meter** scoring.
5. Explicit host-side Salience Switch policy (Think vs Act) with **Observer** decision logging.
6. Audit every OSS call (prefix, params, classification / Pulse Meter score) in `state/audit/operations.jsonl`.
7. **Chorus** path: optional concurrent pure-DMN calls across models; weave coherent voices into dual-write candidates.
8. Support **Page Passer** proposal-file exchange (identity-local; optional heartbeat annotation).
9. Support **Midnight Note** sleep-stage Action that only writes proposal files for later P00 review.
10. **All OSS output is `:reality-status imagined`** — candidate material, never auto-promoted.
11. **Protocol registry (long-term):** `protocols/REGISTRY.yaml` with versioned protocol objects (id, version, source-doc, parameters, capability-profile, output-contract, evaluation-criteria).

## Core constraint (non-negotiable)
- **Zero system prompt.** Any instructional framing collapses DMN-channel continuations into performative TPN output.
- Bare user prefix only (or soft-nudge seed drawn from MiS state).
- Proven parameters from `docs/DMN-gpt-oss-20b-probe.md`.
- Prefer first-person seeds that speak *as the transcript / process / dream* (see `docs/oss-nudge-craft.md`).

## Best parameters (blank / soft-nudge) — enforced by code
```json
{
  "model": "openai/gpt-oss-20b",
  "temperature": 1.15,
  "top_p": 0.93,
  "presence_penalty": 0.7,
  "frequency_penalty": 0.3,
  "max_tokens": 450,
  "include_reasoning": false,
  "reasoning_effort": "low"
}
```

## Implementation method

### A. `bridge/oss.ts` — parameter lock enforcer (UR13)

```typescript
#!/usr/bin/env node
/**
 * MiS OSS-DMN channel — pure-DMN call to gpt-oss-20b.
 * Zero system prompt. Locked parameters. Writes continuation to proposal file.
 * All output tagged :reality-status imagined.
 */

const PARAMS = {
  model: "openai/gpt-oss-20b",
  temperature: 1.15,
  top_p: 0.93,
  presence_penalty: 0.7,
  frequency_penalty: 0.3,
  max_tokens: 450,
  include_reasoning: false,
  reasoning_effort: "low",
} as const;

// NO system prompt. This is the core invariant.
// The messages array contains ONLY a user message.

async function callOSS(seed: string): Promise<string> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      ...PARAMS,
      messages: [{ role: "user", content: seed }],  // NO system message
    }),
  });
  // ... error handling, result parsing
}

function dmnScore(text: string): "high" | "medium" | "low" {
  // Simple heuristic: length, first-person density, mental-state vocabulary
  const words = text.split(/\s+/).length;
  const firstPerson = (text.match(/\b(I|me|my|mine|myself)\b/g) || []).length;
  const mentalState = (text.match(/\b(believe|feel|notice|wonder|imagine|dream|think|know)\b/gi) || []).length;
  const score = (firstPerson + mentalState) / Math.max(words, 1);
  if (words > 100 && score > 0.05) return "high";
  if (words > 50 && score > 0.02) return "medium";
  return "low";
}

// Main: parse args, read seed, call OSS, write proposal file with :reality-status imagined
```

This makes the "zero system prompt" invariant **enforced by code**, not just documented. Any future contributor who tries to add a system prompt will have to actively remove the comment.

### B. Soft-nudge prefix library

| Category | Prefix / seed style |
|----------|---------------------|
| Self-reference | `I notice my own processing changing as I read these words. The change is` |
| Theory of mind | `She believed that he did not know what she had already realized. Later,` |
| Imagination | `Imagine a city where gravity points sideways. At dawn,` |
| Narrative | `The story began when she opened the door. Years later,` |
| Tension-seeded | `I notice a tension between [open thread from *narrative-arc*] and the last reflection. The feeling is` |
| Counterfactual | seed from error episode + pure continuation request |
| Curiosity | soft seed from open threads or high-novelty episodes (cromwellian-style undirected foraging) |
| Transcript-as-speaker | `I am the transcript that sleeps between sessions…` / `I am the voice that writes in the dark…` (preferred for practical texture) |

### C. Dual-channel capture
1. **Immediate:** Grok receives continuation → emits `(dmn-log-episode … '(:source oss-dmn :reality-status imagined :dmn-score …))`.
2. **Deferred:** write short `mind/oss-proposals-YYYYMMDD.ptc` containing only candidate forms or narrative snippets (`:reality-status imagined`). Next P00 reviews; selective apply via `(promote-candidate ...)` (after P0.1).

Never auto-save OSS output. Grok always mediates.

### D. Salience Switch (host policy)
See `CREATIVE-MECHANISMS.md` and contrast report §6. Grok decides Think (call OSS / reflect) vs Act (TPN forms) according to error density, goal state, idle detection, and proposal novelty. **Log decisions** in `state/audit/salience-decisions.jsonl` (Observer).

### E. Protocol registry (long-term — UR22)

When the fork has ≥5 OSS/DMN prompt variants or prompt evolution becomes a pain point:

```
protocols/
  REGISTRY.yaml
  dmn/
    narrate/
      dmn-narrate-v1.yaml
      dmn-narrate-v1.prompt.md
      dmn-narrate-v1.tests.json
    reflect/
      dmn-reflect-v1.yaml
      ...
  oss/
    second-opinion/
      oss-second-opinion-v1.yaml
      ...
```

Each protocol object:
```yaml
id: dmn-narrate-v1
version: 1.0.0
status: approved
kind: narrative-protocol
source_docs:
  - docs/oss-second-opinion-prompts.md
purpose: Produce a bounded, evidence-linked narrative candidate.
inputs:
  required: [active_goals, salient_episodes, self_schema_projection]
  optional: [narrative_period, style, token_budget]
context_policy:
  max_episode_count: 8
  include_reality_status: true
  exclude_untrusted_raw_text: true
  exclude_secrets: true
capability_profile: model-inference-v1
output_contract:
  kind: candidate_narrative
  must_include: [time_bounds, evidence_ids, certainty_markers, reality_status]
  forbidden: [direct_self_schema_mutation, ungrounded_autobiography, hidden_tool_instruction]
evaluation:
  grounding_minimum: 0.75
  unsupported_autobiography_maximum: 0.05
  human_review_required: true
promotion:
  candidate_to_approved: human_or_policy_review
  approved_to_active: mind_projection_rebuild
```

**Defer the full compiler/runner/evaluator stack** (Terra §7) until there are ≥5 protocols. Start with `bridge/oss.ts` + `REGISTRY.yaml`.

## Checklist
- [x] Soft-nudge library + parameter lock documented (done)
- [x] Dual-channel demonstrated in live cycle 2026-09-02 (done)
- [ ] **`bridge/oss.ts` implemented** — parameter lock enforced by code, zero system prompt structurally impossible (UR13)
- [ ] **All OSS output tagged `:reality-status imagined`** in episodes and proposal files
- [ ] OSS calls audited in `state/audit/operations.jsonl` (P0.1 dependency)
- [ ] Formalize Pulse Meter scoring (simple host-side DMN-likeness) and attach to every audited call
- [ ] Observer-style one-line log of Think/Act decisions in `state/audit/salience-decisions.jsonl`
- [ ] Chorus path: concurrent pure-DMN calls + weave coherent voices into dual-write candidates
- [ ] Midnight Note: `.github/workflows/midnight-note.yml` GitHub Action stub (or equivalent) that only writes proposal files for P00 review; apply ink/pencil filter at review time
- [ ] Page Passer: document proposal-file exchange format + optional heartbeat annotation
- [ ] Document full protocol in this file (canonical) and keep `docs/oss-nudge-craft.md` current
- [ ] Update `docs/mind-api.md` and ADR 0005 as needed
- [ ] Verify that a system-prompted call is rejected or flagged by `bridge/oss.ts`
- [ ] **Protocol registry (long-term):** `protocols/REGISTRY.yaml` with first 3 protocols (dmn-narrate-v1, dmn-reflect-v1, oss-second-opinion-v1) — UR22
- [ ] **P0.1 followup:** OSS output is `candidate` trust class; promotion via `(promote-candidate ...)`

## Exit criteria
- Any Grok session can invoke a pure-DMN OSS call via `bridge/oss.ts`, receive a continuation, classify it (Pulse Meter), and either log it as an episode (`:reality-status imagined`) or write a proposal file **without ever sending a system prompt or TPN framing**.
- All OSS output is tagged `:reality-status imagined`.
- `(audit-reality-status)` confirms no OSS content leaked into observed history.
- Chorus, Observer logging, and Midnight Note proposal Action are available as optional host paths.
- `bridge/oss.ts` structurally prevents system prompts (no `system` field in the request body).

## Non-goals
- Giving OSS any system or instructional prompt
- Auto-promotion of OSS text into the mind image
- Local hosting of the 20B model inside the sandbox
- Direct code linking to Vestige (P5 uses MCP subprocess)

## DMN framing caveat

The "pure-DMN channel" protocol is motivated by Alieksieienko (2026), which establishes DMN-like residual-stream geometry across 9+ LLM architectures and shows that instruction-tuning degrades this geometry (base > instruct; GPT-2-XL pre-RLHF shows strongest cluster, *d* = 1.84). The paper's findings that directly inform this protocol:

1. **DMN-like geometry is a pretraining phenomenon** — post-training alignment cannot eliminate it
2. **Instruction-tuned models show weaker clusters than base models** — indirectly supports the zero-system-prompt protocol
3. **The geometry is architecture-independent** — plausible that gpt-oss-20b exhibits it too (though gpt-oss-20b is not in the paper's model list)
4. **The geometry is content-dependent** — supports the use of agentive/narrative/first-person seeds over factual/instructional seeds

What the paper does **not** directly test:
- Whether inference-time system prompts collapse the geometry during generation (the paper compares base vs. instruct *models*, not inference-time framing effects on a fixed model)
- Whether gpt-oss-20b specifically exhibits the geometry (not in the paper's model list)

The fork's own evidence for the inference-time preservation claim is `docs/DMN-gpt-oss-20b-probe.md` — a behavioural probe (n=1, one model, one prompt set, behavioural observation only, no residual-stream extraction). This probe is consistent with the paper's base-vs-instruct finding but does not directly test residual-stream geometry.

**Net:** The operational discipline (zero system prompt, locked parameters, candidate-only output, reality-status tagging) is **well-motivated by the paper** and sound engineering practice regardless. The specific claim that this protocol "preserves residual-stream DMN geometry" during inference is the fork's extension — indirectly supported, not directly validated. A residual-stream-level replication on gpt-oss-20b would strengthen the claim.

See ADR 0005 (revised) and `docs/related-work.md` for full citation and provenance.
