# Creative mechanisms (cross-cutting)

**Revised 2026-09-04** (GLM+Terra synthesis) — DMN framing calibrated to paper's actual scope; reality-status required on all candidates.

Track across P7–P11; do not require all at once.
Sources of ideas: see [docs/related-work.md](../docs/related-work.md).
Extensions contrast (original → OSS shape → value): [docs/gmod-extensions-contrast-20260902.md](../docs/gmod-extensions-contrast-20260902.md).

## DMN framing — two levels (calibrated)

The "Default Mode Network" framing in this project operates at two levels that should be distinguished:

**Level 1 — The OSS channel protocol (zero system prompt, locked parameters).**
This is **well-motivated by Alieksieienko (2026)**, a substantial multi-model study across 9 primary architectures (Llama, Gemma, Mistral, Qwen, GPT-2, OPT, Pythia, Bloom, DeepSeek) plus 9 control models (Mamba SSM, DeepSeek-Math, BERT, RoBERTa, DeBERTa, ALBERT, CodeLlama, DNA transformer, GPT-2-117M). The paper establishes that:

- DMN-like residual-stream geometry (SR + ToM + Imagination + Narrative cluster; Factual + Abstract Logic outside) is present across architectures (mean Cohen's *d* = 1.03; 7/8 significant at *p* < 0.01)
- The geometry is **pretraining-inherited** — strongest in GPT-2-XL (2019, pre-RLHF, *d* = 1.84); base models consistently outscore instruct versions
- The geometry is **architecture-independent** (Transformer + SSM/Mamba + math/code models all converge; *d* = 0.92–1.16)
- The geometry is **content-dependent** (DNA models show no cluster, *d* = −0.12; RoBERTa MLM-only shows none, *d* = −0.08)
- The geometry **does not scale with model size** (Pearson *r* = −0.163, *p* = 0.699)

The fork's zero-system-prompt protocol is a reasonable operationalization of the paper's finding that instruction-tuning degrades DMN-like geometry. The paper does not directly test whether inference-time system prompts collapse the geometry during generation — that specific operational claim is the fork's extension, supported indirectly by the paper's base-vs-instruct comparison and directly by the fork's own behavioural probe (`docs/DMN-gpt-oss-20b-probe.md`, n=1, gpt-oss-20b not in the paper's model list).

**Level 2 — The five-subsystem Lisp mapping (Narrative, Episodic, Prospective, Spontaneous, Consolidation).**
This is **organizational metaphor inspired by neuroscience**, not a claim the paper supports. The paper is about residual-stream geometry in trained neural networks. The fork's `*self-schema*`, `*episodic-buffer*`, `*autobiography*` are Lisp alists with no residual stream. The five-subsystem labels are useful as organizational categories for the Lisp state, but they do not implement a DMN.

**Operational discipline remains valuable regardless.** The zero-system-prompt invariant, locked parameters, candidate-only output, and reality-status tagging are sound engineering practices for any LLM-as-candidate-generator design, independent of whether the inference-time preservation hypothesis is later confirmed.

See ADR 0005 (revised) and `docs/related-work.md` for full citation and provenance.

| Mechanism | Phase | Intent under grok-mis-oss-dmn | Source shape |
|-----------|-------|-------------------------------|--------------|
| Dual-write episodes | P7, P11 | Raw log + OSS narrative candidate; Grok promotes | — |
| Soft-nudge seeding | P7–P11 | MiS state → blank prefix for OSS; never system prompt | — |
| Self-as-code policies | P7–P9 | Small executable guards proposed by reflection; Grok approves | — |
| Counterfactual curriculum | P9, P4 | Failure → OSS counterfactual texture → promote insight | Third-voice bridge (§4) |
| Narrative tension signals | P7, P10 | Open threads bias which soft-nudge is chosen | — |
| Sleep stages (prompt macros) | P4, P10 | NREM-like compress vs REM-like associative via pure DMN OSS; **Midnight Note** GitHub Action that only writes proposals | Midnight Note + ink/pencil (§2) |
| Geometric/subspace awareness | P11 | Host-side classifier of DMN-like vs TPN output (Alieksieienko-inspired) + **Pulse Meter** scoring | Pulse Meter (§3) |
| **Salience switch (host policy)** | host + P10/P11 | Explicit arbitration: Think (DMN/OSS) vs Act (TPN). VOC-style bias. **Observer** logging of decisions | The Observer (§6) |
| Multi-model Chorus | P11 | Concurrent pure-DMN calls across models; weave strongest / most coherent voices | Chorus of Many Voices (§1) |
| Page Passer exchange | P10, P11 | Proposal-file exchange between GMOD instances; identity stays local; optional heartbeat annotation | Page Passer (§5) |
| **Reality-status tagging** | All phases | Every cognitive item carries `:reality-status`; prevents speculation becoming autobiographical fact | Terra review |
| **Trust class enforcement** | P0.1+ | Untrusted / candidate / approved / derived / immutable; promotion flow | Terra review |

## Salience Switch (host-side policy)

Inspired by the triple-network model and the Seven-Pass Pipeline (Ghosh). Grok owns the switch; no sandbox daemon.
See also contrast report §6 (The Observer).

**Default rules (inspectable, tunable):**
1. High error density or large goal discrepancy → reflect + optional pure-DMN OSS counterfactual (Third-voice / §4).
2. Goal completed or clear external user demand → chapter-close or ordinary TPN action.
3. Idle / low external demand → OSS wander call (P11 parameters) → proposal file only (Midnight Note style).
4. High-novelty OSS proposal + open narrative tension → prefer dual-write into narrative candidate.
5. **Log every Think/Act decision** with a short novelty × tension note in `state/audit/salience-decisions.jsonl` (Observer).

Future refinement: lightweight VOC estimate (novelty × tension) can bias the next soft-nudge choice. All decisions remain host-side and logged.

## Sleep-stage / Midnight Note notes

- Prefer proposals written in "ink" (high-DMN, high-presence, sticky) over "pencil" (thin, fades by evening review).
- Prefer chorus-like short, repeatable insights that survive multiple morning reviews.
- Night process is a caretaker of open threads, not a free generator of unbounded novelty.
- Implementation: GitHub Action (`.github/workflows/midnight-note.yml`) that only writes `mind/oss-proposals-*.ptc` or `mind/wander-proposals.ptc`; P00 reviews.
- **All Midnight Note output is `:reality-status imagined`** — candidate material, never auto-promoted.

## Invariants
1. Candidates ≠ committed identity until `--save` after successful eval (or `(promote-candidate ...)` after P0.1).
2. Chapters cite episode refs.
3. Simulations / OSS continuations are data (`:reality-status imagined` or `:reality-status simulated`); actions need explicit TPN steps.
4. **OSS is never given a system prompt or instructional framing.**
5. Resource: prefer image + proposal files + managed API cabinet; avoid local heavy ML in sandbox.
6. **Every cognitive item carries `:reality-status`** (after P0.1).
7. **Untrusted content (transcript, OSS output, retrieved memory) is never evaluated as Lisp** (after P0.1).
