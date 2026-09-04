# 01 — Architecture Critique

## 1.1 The core thesis

The fork's central claim (README, WIKI, ADR 0001, ADR 0002) is:

> A persistent Lisp REPL transcript image, driven by a single LLM host (Grok), can serve as the symbolic substrate of a "mind" that survives session boundaries. Grok emits pure Lisp; the bridge validates and evaluates; state is reconstructed by replaying a transcript on every cold start. An external LLM (gpt-oss-20b) is used as a "pure-DMN generator" — zero system prompt, elevated temperature/presence — and its output is *never* allowed to mutate the durable mind directly.

This is a defensible and interesting design. The three strongest choices:

1. **Single-mutator discipline.** ADR 0001 makes Grok the sole host. This avoids the "multi-agent workers race on shared state" problem that plagues most agent-loop designs. Every state change has a single, attributable cause: a Grok-emitted Lisp form that passed validation and evaluated successfully.
2. **Transcript-as-image.** ADR 0002 acknowledges the tradeoff ("failed forms can pollute the image") but chooses inspectability and git-friendliness over opaque binary snapshots. For a project of this size, this is correct.
3. **Pure-DMN constraint on OSS.** ADR 0005 + `docs/DMN-gpt-oss-20b-probe.md` define a specific, falsifiable protocol (zero system prompt, locked parameters, dual-channel capture, no auto-promotion). The *operational* discipline of "never instruct the second model" is a meaningful constraint that prevents the second model from drifting into a regular instruction-following assistant, and is well-motivated by Alieksieienko (2026)'s finding that instruction-tuning degrades DMN-like residual geometry (see §1.2.2 for the calibrated assessment).

## 1.2 Where the architecture overclaims

### 1.2.1 "Five-subsystem DMN" is a relabeling, not an implementation

ADR 0005 maps five neuroscience concepts onto Lisp globals:

| Neuroscience concept | Lisp implementation |
|----------------------|---------------------|
| Narrative Self | `*autobiography*` (list of alists) + `*narrative-arc*` (alist) |
| Episodic / Hippocampal | `*episodic-buffer*` (list, capped at 40 in `helpers.ptc`, uncapped in `mind-image.ptc`) |
| Prospective / Simulation | planned P9 helper `dmn-simulate-pack` — **not implemented** |
| Spontaneous / Wander | planned P10 helpers `dmn-wander`, `dmn-monologue-*` — **not implemented** |
| Consolidation | `dmn-reflect-pack` + `dmn-apply-reflection` — **not in canonical image** (see F1) |

Of the five subsystems, only two (Narrative, Episodic) have any Lisp implementation, and one of those (Episodic) has a regression where the cap is missing. The "DMN architecture" is currently a set of names with two partial data structures and three unchecked plan items.

This is fine as a roadmap. It is not fine when `WIKI.md` says "P0–P4 done. P7 first chapter *Genesis of GMOD* closed. P11 pure-DMN channel live" — that phrasing implies the architecture is operational. It is not. It is a plan with two stubs and one chapter that contains a single sentence.

### 1.2.2 The "pure-DMN" claim — calibrated assessment

The fork's "pure-DMN" framing combines **four distinct claims** that need to be evaluated separately against the evidence:

**Claim A — DMN-like geometry exists in LLM residual streams.**
*Well-supported.* Alieksieienko (2026) tests 9 primary architectures (Llama-3.1-8B, Gemma-2-9B, Mistral-7B, Qwen2.5-7B, GPT-2-XL, OPT-1.3B, Pythia-1.4B, Bloom-1.7B, DeepSeek-1.5B) plus 9 control models (Mamba-2.8B SSM, DeepSeek-Math, BERT, RoBERTa, DeBERTa, ALBERT, CodeLlama, DNA transformer, GPT-2-117M). The SR/ToM/Imagination/Narrative cluster is significant in 7/8 models (mean Cohen's *d* = 1.03), with three convergent metrics (Verification Horizon 97.2%, ToM→SR dominance 93.5%, confound closed 8/8). Controls rule out "any high-dim space has clusters" (DNA model *d* = −0.12), "any transformer has clusters" (RoBERTa MLM-only *d* = −0.08), and "clusters require scale" (Pearson *r* = −0.163, n.s.). This is a substantial empirical study, not a single observation.

**Claim B — The geometry is pretraining-inherited, not eliminated by post-training.**
*Well-supported.* GPT-2-XL (2019, pre-RLHF) shows the strongest cluster (*d* = 1.84); base models consistently outscore instruct versions. The paper's §5.4 explicitly states "post-training alignment cannot eliminate it."

**Claim C — Inference-time system prompts collapse the geometry during generation.**
*Not directly tested by the paper.* The paper compares base vs. instruct *models* (a training-time comparison), not inference-time system-prompt effects on a fixed model. The fork's actual evidence for Claim C is its own probe (`docs/DMN-gpt-oss-20b-probe.md`), which is genuinely n=1 — one model (gpt-oss-20b, not in the paper's model list), one prompt set, behavioural observation only (no residual-stream extraction). The paper's base-vs-instruct finding is *indirectly consistent* with Claim C but does not validate it.

**Claim D — The fork's Lisp data structures implement a DMN.**
*Not supported by the paper.* The paper is about residual-stream geometry in trained neural networks. The fork's `*self-schema*`, `*episodic-buffer*`, `*autobiography*` are Lisp alists with no residual stream. The "five-subsystem DMN" mapping in ADR 0005 is organizational metaphor, not a claim the paper supports.

**Net assessment:** The fork's framing is **better-grounded than my earlier review indicated**. Claims A and B are well-supported by a substantial multi-model study. Claim C is the fork's own extension — indirectly motivated by the paper but not directly tested. Claim D is metaphor.

The appropriate correction is not to "soften all DMN language to metaphor" but to:
1. Cite the paper accurately (9+ architectures, rigorous controls — not "one preprint")
2. Distinguish Claim C (inference-time preservation, untested) from Claims A and B (geometry exists and is pretraining-inherited, well-tested)
3. Retain the metaphor caveat only for Claim D (Lisp data structures)
4. Frame the zero-system-prompt protocol as *motivated by* the paper's base-vs-instruct finding, not as *validated by* the paper

The overclaim to flag is narrower than I initially indicated: it's specifically ADR 0005's "geometry-preserving proposal engine" language, which implies the paper validates the fork's inference-time protocol. It doesn't. But the protocol is a reasonable operationalization of the paper's findings, not speculation.

### 1.2.3 The six "novel extensions" are unimplemented

`docs/gmod-extensions-contrast-20260902.md` describes six named shapes (Chorus, Midnight Note, Pulse Meter, Third-voice bridge, Page Passer, Observer) that emerged from a four-turn soft-nudge conversation with gpt-oss-20b. The contrast report itself is good work — it takes an OSS-generated metaphor and asks "what is the engineering value?". 

But `plan/README.md` then claims "All six novel extensions merged into phase/task lists (P7, P9, P10, P11, CREATIVE-MECHANISMS, ADR 0005, plan/README, WIKI) with pointers to report sections". "Merged into task lists" here means: the names are mentioned in checklist items. None are implemented. None have a design beyond the metaphor. The Midnight Note has the strongest sketch (a GitHub Action that writes only proposal files), but there is no `.github/workflows/` directory in the repo.

The risk: the project's surface area (named shapes, contrast reports, extension maps) is expanding faster than its implemented surface area (two stub data structures and one chapter). This is a common failure mode for solo LLM-driven projects — the LLM is good at generating named concepts and bad at stopping itself from generating more.

## 1.3 Where the architecture under-builds

### 1.3.1 The bridge throws away most of upstream's REPL layer

Upstream `packages/repl/src/repl.ts` provides:

- `MemoryRepl` — embeddable string-in/string-out REPL
- `AgentRepl` — adds two features an LLM host needs:
  - `setConversationVars()` — inject the recent chat transcript as read-only Lisp globals (`conversation`, `user-messages`, `assistant-messages`) refreshed before every eval
  - `takeFinished()` — flag raised when a program was pure prose, so the host knows the loop is done
- `stripProse` — blanks out non-form text, keeping line numbers stable, so the LLM can write prose + Lisp mixed

The fork's `bridge/eval.ts` `MemoryRepl` (lines 79–118):

- Reimplements `MemoryRepl` from scratch with `Interp({ extensions: [] })`
- Returns `{ ok, output }` instead of just `string` (a small improvement — distinguishes eval failure from success)
- Has its own `prevalidate` that **rejects** prose-containing input rather than stripping it
- Has no conversation vars
- Has no finished signal

The choice to avoid `mcpExtension` and `secretsExtension` is reasonable for a minimal sandbox (ADR 0003). But the choice to also drop `AgentRepl`'s conversation-vars feature is a missed opportunity: the mind could read the recent chat context directly as Lisp data, instead of Grok having to manually translate user messages into Lisp forms to log them as episodes. The current `dmn-log-episode` requires Grok to manually serialize the user input as a Lisp string; with `setConversationVars`, the mind could see `conversation` directly.

The choice to reject prose rather than strip it is also defensible (it forces Grok to be explicit about what it evaluates), but it goes against the upstream dialect's design philosophy. The upstream reader treats free text as comments — a deliberate choice to make the LLM↔REPL loop smoother. The fork's `prevalidate` is a strict-subset behavior that throws away this affordance.

### 1.3.2 The mind image does not use upstream `import`

Upstream `lisp.ts` defines `(import "path")` (around line 1100+) with cycle detection and relative-path resolution. The fork could split `mind-image.ptc` into:

```
mind/
  mind-image.ptc          ;; thin loader: (import "helpers.ptc") (import "schema.ptc") (import "episodes.ptc") (import "autobiography.ptc")
  helpers.ptc             ;; mis-version, mis-ping, mis-state-summary, ...
  schema.ptc              ;; *self-schema*, update-self-schema, mis-schema, mis-insights
  episodes.ptc            ;; *episodic-buffer*, dmn-log-episode, dmn-fetch-unreflected
  autobiography.ptc       ;; *autobiography*, *narrative-arc*, dmn-narrate, dmn-chapter-close
```

Benefits:
- Easier to edit one section without touching others
- Per-section git history (currently the whole image is one file)
- The current `helpers.ptc` exists but is *not* imported by `mind-image.ptc` — it's a parallel/older version. This is confusing.
- Cycle detection is free.

The fork doesn't do this. The single `mind-image.ptc` file is 83 lines now; it will become harder to manage as P7–P11 add more state.

### 1.3.3 No use of upstream `dump` or `doc`

Upstream provides:
- `(dump)` — return all global symbols as a list
- `(doc name)` — print signature + docstring for a binding; `(doc)` alone lists all documented bindings

The fork maintains `*mis-known*` as a manually-curated list updated via `(mis-register 'sym)`. This is exactly what `(dump)` already does, except `*mis-known*` can drift (and does — see F1: it lists `dmn-narrate` etc. which exist, but a previous version also listed `dmn-reflect-pack` which doesn't).

The fork also doesn't expose `(doc 'fn)` to the user. A user who wants to know what `(dmn-log-episode input result meta)` does has to read `docs/mind-api.md` instead of asking the runtime.

### 1.3.4 No use of upstream `defineGlobal` for typed host-side injection

`Interp.defineGlobal(sym, value, doc?)` is the API the upstream REPL uses to inject host-side state (e.g. conversation vars) into the interpreter with documentation. The fork could use this to:

- Inject a `*session-id*` global
- Inject a `*host-time*` global (fixing F3 — the hardcoded date)
- Inject a `*host-model*` global identifying the driving LLM
- Inject the latest user message as `*last-user-input*`

None of this is done. The bridge only calls `run(interp, prelude)` and then `repl.eval(src)`. The host has no presence in the Lisp world except via the forms Grok chooses to emit.

## 1.4 Architectural decisions worth keeping

These should not be changed even if the project pivots:

1. **ADR 0003 — stripped MemoryRepl, no MCP in v0.** Correct call. The upstream `@repo/repl` pulls `@repo/interpreter` (which pulls `mcp.ts` → `@modelcontextprotocol/sdk` → a substantial dependency tree). The fork's `zod`-only runtime is the right starting point. If MCP is needed later, it can be added as an `InterpExtension` without re-architecting the bridge.

2. **ADR 0004 — runtime under `/tmp`, durable assets in repo.** Correct for the sandbox constraint. The bootstrap script is small and reproducible.

3. **P0 invariants — validate before eval, save only on success, no reset on EvalException.** These are sound. The implementation has bugs (F8, F9) but the invariants themselves are right.

4. **Grok-sole-mutator + OSS-never-gets-system-prompt.** The dual-channel capture (episode log + proposal file) and the "no auto-promotion" rule are the project's most distinctive contribution. The zero-system-prompt protocol is **well-motivated** by Alieksieienko (2026)'s finding that instruction-tuning degrades DMN-like residual geometry (base > instruct across 8 architectures; GPT-2-XL pre-RLHF shows strongest cluster *d* = 1.84). The specific inference-time preservation claim (system prompts collapse geometry during generation) is the fork's extension and is not directly tested by the paper, but the operational discipline is sound regardless.

## 1.5 Architectural decisions to revisit

1. **The transcript-image pattern's deletion problem.** ADR 0002 admits "failed forms can pollute the image if carelessly saved — use judgment and edit the file when needed." But there is no Lisp-level "delete an episode" or "rewrite the schema" primitive. Corrections require manually editing `mind-image.ptc`, which violates the "Grok sole mutator" rule (the human is now a mutator). Consider: a `(dmn-forget predicate)` form that removes episodes matching a predicate, gated behind `--save`.

2. **The `--save` semantics.** Currently `--save` appends the *input forms* to the file. This means:
   - Non-idempotent forms (e.g. `(dmn-log-episode ...)` that pushes to `*episodic-buffer*`) are recorded as the call, not the resulting state. Replay works.
   - But if Grok calls the same form twice with `--save`, it's saved twice. No dedup.
   - If Grok calls a form WITHOUT `--save`, the in-memory state mutates but is lost on process exit. The next session sees the original state.
   - There's no "checkpoint and compact" operation that snapshots the current in-memory state into a fresh `setq` form, replacing the accumulated history. Over months, the transcript will grow unboundedly with replayable-but-redundant forms.
   
   Consider: a `--compact` flag that, after a successful eval, dumps the current values of all `*`-prefixed globals as fresh `setq` forms into a new file, replacing the old one. This would let the transcript stay small.

3. **The hard dependency on Grok-specific behavior.** `docs/CUSTOM_INSTRUCTIONS.md` and `docs/session-handoff.md` are written assuming Grok is the host. But the architecture is host-agnostic — any LLM that can emit Lisp and call a subprocess could drive it. The custom instructions should be parameterized over the host (a `docs/host/grok.md`, `docs/host/claude.md`, etc.), with the core protocol in `docs/host/_protocol.md`. This would make the project reusable outside Grok.

4. **No formal model of the salience switch.** `plan/CREATIVE-MECHANISMS.md` describes a host-side "Salience Switch" with five default rules ("High error density → reflect", "Goal completed → chapter-close", etc.). But these rules live only in prose. There is no executable artifact — no Lisp predicate, no JSON config, no log format. The "Observer" extension (§6 of the contrast report) is supposed to log Think/Act decisions, but there is no log file or schema. Either implement a minimal version (a `mind/salience-log.jsonl` that the host appends to) or remove the claims from the plan.
