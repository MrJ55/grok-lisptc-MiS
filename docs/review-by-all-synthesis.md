# Synthesis: Pi-Lisptc review-by-all → grok-lisptc-MiS

**Source:** https://github.com/MrJ55/Pi-Lisptc/tree/main/review-by-all  
**Date ingested:** 2026-08-31  
**Scope filter:** Only findings that apply to **Grok host + sandbox MemoryRepl** (not Pi extension, Fireworks grammar, or Pi TUI).

Five independent reviews (GLM5p3, Luna, Sonnet, Terra, Gemini) were consolidated. Fact-check scorecard: 22 verified / 4 partial / 10 refuted claims against source. Below is the delta that matters for MiS.

---

## Unanimous themes that transfer to MiS

| Theme | Review consensus | MiS implication |
|-------|------------------|-----------------|
| **Validate before eval** | A4 — malformed output must never reach REPL | Bridge must parse/strip before `eval`; on failure: report, no save, no reset |
| **Cabinet vs cortex** | A5 — Vestige/durable vs REPL working state | Transcript image = cortex snapshot; optional vector store = cabinet later |
| **Replace-not-accumulate for turn recall** | A6 | When we add vestiges: replace turn list each turn, do not append forever |
| **No reset on ordinary errors** | B1 (4/5) — `repl.reset()` lobotomizes the mind | Our bridge already preserves on `EvalException`; lock this as invariant |
| **Exit criteria / tests** | B7, B10 | Every phase needs a smoke test and a "definitions survive error" test |
| **Autolith patterns only** | A8 | No SBCL image dump, no self-mutation platform; optional soft checkpoint only |

## Findings that do *not* apply (or apply weakly)

| Finding | Why weaker for MiS |
|---------|-------------------|
| SYSTEM_PROMPT missing INTERPRETER_SOURCE (C1/R02) | Grok is not forced into a Lisp-only system prompt; we emit Lisp deliberately. Still useful as optional local docs for Grok, not a ship-blocker. |
| Fireworks grammar / provider lock-in | No Pi provider hook; Grok chooses forms. |
| Prompt-cache Layer 0/2 in Pi system prompt | No long cached system prompt for the mind path; Grok chat context is different. |
| Pi extension composition / `before_provider_request` | N/A |
| Dual authority (Pi vs lisptc for model choice) | Grok is sole host. |

## Critical risks for *our* stack (mapped)

| ID | Risk | Status in MiS today | Required mitigation |
|----|------|---------------------|---------------------|
| **R01** | Reset / loss of definitions on error | Soft errors already preserved in bridge | Codify: never reset on `EvalException`; only on explicit command or proven corruption |
| **R05** | Unvalidated code reaches eval | **Open** | Parse/strip fences → on fail: no eval, no `--save` |
| **Image poison** | Failed form still appended with `--save` | **Open** | Save only after clean eval; optional checkpoint file |
| **Missing lisp.ts on GitHub** | Fresh clone cannot run | **Open** | Bootstrap always fetches/copies `lisp.ts` |
| **R10** | `string-trim` whitespace bug | In vendored upstream prelude if used | Patch or avoid relying on `string-trim` for tabs |
| **R11** | Memory injection if vestiges are eval'd as code | N/A until Vestige/Pinecone | Data-only literals; never `eval(record.text)` |

## State classes (Luna) adapted to MiS

| Class | Where in MiS |
|-------|----------------|
| Conversation transcript | Grok chat history |
| Working mind (bindings) | In-process MemoryRepl |
| Durable symbolic mind | `mind/mind-image.ptc` (transcript) |
| Turn evidence / vestiges | Future: vector store + injected list (replace each turn) |
| User prefs / notes | Image helpers + optional disk/GitHub |
| Inference / audit | stderr + optional `mind-failures.log` |

## Release blockers (Luna) adapted

1. Generated Lisp cannot run without host validation.  
2. Definitions survive ordinary eval errors.  
3. Failed forms never enter the permanent image.  
4. Single authority: Grok is host; bridge only evaluates.  
5. Bootstrap is one command and ends green.

---

## What we keep from the synthesis Top 10 (filtered)

| # | Recommendation | MiS action |
|---|----------------|------------|
| 2 | Fix error recovery (no reset on runtime error) | **Done in spirit** — document + test |
| 3 | Pin upstream | Pin lisptc SHA used for `lisp.ts` / `arith.ts` |
| 5 | Host/runtime boundary as typed contracts | Bridge CLI + docs = the boundary |
| 9 | Test strategy | Smoke + persistence + "survive error" |
| 10 | Quantitative exit criteria | See revised plan |

Deferred for MiS: prompt-cache architecture, tool-call provider mode, Vestige adapter, INTERPRETER_SOURCE_LLM in a system prompt, Pi scaffolding.
