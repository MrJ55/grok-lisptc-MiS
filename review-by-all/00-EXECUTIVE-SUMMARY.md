# GLM Independent Audit — grok-lisptc-MiS

**Reviewer:** GLM (Z.ai)
**Date:** 2026-09-04
**Scope:** Architecture, goals, decisions, execution of `MrJ55/grok-lisptc-MiS` as a fork of `1hachem/lisptc`
**Method:** Read every file under the fork's `adr/`, `docs/`, `plan/`, `bridge/`, `src/`, `mind/`, `skills/`, `scripts/`, plus the upstream `packages/interpreter/src/lisp.ts` and `packages/repl/src/repl.ts`. Did **not** read any other `review-by-*` folder, per request.
**Repo state audited:** fork HEAD `02c1e49` (single squashed commit); upstream HEAD `2c10ea8` per `docs/UPSTREAM.md`.

---

## TL;DR

The fork has a **genuinely interesting thesis**: keep the lisptc interpreter as a deterministic substrate, let Grok be the sole mutator, persist state as a transcript image, and add a five-subsystem "DMN" symbolic self plus a "pure-DMN" gpt-oss-20b channel that is forbidden from receiving system prompts. The conceptual layer (ADRs, plan, related-work) is more rigorous than most personal LLM-loop projects.

The **execution does not yet match the documentation**. Several "done" checklist items reference functions that do not exist in the canonical mind image. The vendored `arith.ts` has been silently rewritten in a way that introduced a bug the project then had to patch `lisp.ts` to work around. The `dmn-log-episode` helper in `mind-image.ptc` lost its buffer-trim logic that still exists in `helpers.ptc`. Dates are hardcoded into chapter helpers, so every future autobiography chapter will be stamped "2026-09-02". The cold-start verification command will fail on every fresh session because it calls an unbound function.

None of these are fatal. They are all fixable in a single short session. But they mean the project's current "P0–P4 done, P7 first chapter closed" status claim is **partially fictional**, and any reviewer who runs the documented cold-start protocol will hit errors immediately.

## Severity summary

| # | Finding | Severity | Type |
|---|---------|----------|------|
| F1 | `dmn-reflect-pack` and `dmn-apply-reflection` are documented as live (P4 done, mind-api, reflection-protocol, session-handoff, mis-reflect skill) but are **not defined** in `mind/mind-image.ptc` or anywhere in code. Cold-start verification command `(dmn-reflect-pack 5)` will throw `unbound variable`. | **Critical** | Doc/code drift |
| F2 | `dmn-log-episode` in `mind-image.ptc` lost the `*episodic-max*` trim logic that exists in `helpers.ptc`. Buffer grows without bound, contradicting P3 spec. | **High** | Regression |
| F3 | `dmn-narrate` and `dmn-chapter-close` hardcode `"2026-09-02"` as `:date-label` for every chapter. All future autobiography chapters will be misdated. | **High** | Data-integrity bug |
| F4 | Fork's `src/arith.ts` was silently rewritten to return `undefined` from `tryToParse` (upstream returns `null`). The "Reader fix" (`if (n !== undefined && n !== null)`) is patching a self-inflicted wound. Reverting to upstream `arith.ts` eliminates the need for the patch entirely. | **High** | Unnecessary divergence |
| F5 | `dmn-fetch-unreflected` returns the last N episodes regardless of reflection state. Name promises a filter that doesn't exist. | **Medium** | Contract violation |
| F6 | `dmn-autobiography(n)` ignores its argument `n` and returns the entire autobiography. Advertised API is a lie. | **Medium** | Contract violation |
| F7 | `update-self-schema` reverses the order of new entries during merge. `assoc` still works, but pretty-printed schema is non-deterministic across runs. | **Medium** | Subtle bug |
| F8 | `appendTranscript` uses non-atomic read-then-write. A crash mid-save corrupts the canonical mind image. No fsync, no temp-file-rename. | **Medium** | Crash safety |
| F9 | Image-load swallows errors and continues; a single poison form silently drops every subsequent form on every future reload. No quarantine, no per-form status report. | **Medium** | Fragility |
| F10 | Fork ignores upstream's `stripProse`, `AgentRepl`, `import`, `dump`, `doc`, `defineGlobal`, and `secretsExtension`. Reimplements or works around each. Some choices are reasonable (minimalism); others lose real features (conversation vars, atomic module loading, in-REPL documentation). | **Medium** | Missed opportunity |
| F11 | `VERIFICATION.md` reports `(half 8)` = `4.0` and `mis-version` = `"mis-helpers-0.2"`, but the current fork's `convertToString` renders `4` (no `.0` rule) and the image version is `0.3`. Verification is stale and cannot be reproduced against current code. | **Low** | Stale artifact |
| F12 | `prevalidate` regex falsely rejects valid atoms like `:keyword` and `string->symbol` (no whitespace, so they pass through to eval; no false negative, but the regex is misleadingly narrow). | **Low** | Code smell |
| F13 | Repo has a single squashed commit. No incremental history. Regressions like F1/F2 cannot be bisected or attributed. | **Low** | Process |
| F14 | `mind-failures.log` is generated at runtime under `mind/` but `.gitignore` status unclear; `push-mind-image.sh` does not push it. Past failure audit trail is lost on sandbox reset. | **Low** | Ops gap |

## What is genuinely good

- **ADR discipline.** Five short, well-scoped ADRs with explicit "Context / Decision / Consequences / Alternatives rejected" structure. ADR 0005 in particular is a serious attempt to map a neuroscience concept (DMN subsystems) onto a sandbox-safe symbolic implementation without overclaiming.
- **P0 safety bridge.** `bridge/eval.ts` prevalidate → eval → save-on-success is a sound pattern. Exit codes 0/1/2 are documented and used consistently. Failures log is a good idea (just needs to be persisted).
- **Pure-DMN OSS discipline.** The `docs/DMN-gpt-oss-20b-probe.md` is a real behavioural probe with controls, parameter sweeps, and an interpretation tied to a specific paper (Alieksieienko 2026). The "zero system prompt" invariant is repeated everywhere and is operationally meaningful.
- **Transcript image model.** ADR 0002 is honest about its tradeoffs ("failed forms can pollute the image if carelessly saved"). The choice to make state inspectable Lisp rather than opaque binary is correct for this kind of project.
- **Provenance hygiene.** `docs/related-work.md` records every external source with synopsis and "use in MiS". `docs/UPSTREAM.md` pins upstream SHA and content hashes. This is better than most academic-adjacent hobby projects.
- **Cold-start documentation.** `P00-cold-start.md` + `session-handoff.md` + `user-prompt-reseed.md` form a coherent "any new Grok session can resume" protocol. The intent is right even though the current verification step is broken (F1).

## What is questionable

- **The DMN framing risks overclaiming neuroscience.** ADR 0005 maps five "subsystems" (narrative, episodic, prospective, spontaneous, consolidation) onto Lisp alists. These are useful organizational labels, but the document sometimes writes as if the Lisp code *is* a DMN rather than a symbolic scaffold inspired by DMN literature. The probe doc is more careful; the plan docs are less careful.
- **The "pure-DMN" gpt-oss-20b channel rests on a single Zenodo preprint and one behavioural probe.** The probe is well-designed, but the claim that zero-system-prompt continuations preserve "residual-stream DMN geometry" is treated as established fact across nine plan documents. It is a hypothesis with one supporting observation. The architecture should be robust to that hypothesis being weakened.
- **Six "novel extensions" (Chorus, Midnight Note, Pulse Meter, Third-voice, Page Passer, Observer) are recorded as integrated but are nowhere implemented.** They exist only as prose in `docs/gmod-extensions-contrast-20260902.md` and as unchecked checklist items in `plan/P11-oss-dmn-channel.md`. The WIKI claims they are "merged into phase task lists" — they are mentioned, not merged.
- **No automated tests.** The upstream lisptc has 17 vitest spec files (`packages/interpreter/test/*.test.ts`). The fork has zero. `VERIFICATION.md` is a manual run sheet. Given the regressions already present (F1, F2, F3), this is the single highest-leverage process improvement available.

## Recommendation priorities

1. **Fix F1, F2, F3 immediately.** These are correctness defects in the canonical mind image that contradict the project's own "done" claims. (Detailed patches in `05-RECOMMENDATIONS.md`.)
2. **Revert `src/arith.ts` to upstream (F4).** Delete `src/READER-FIX.md` and the sed-patch in `bootstrap.sh`. Removes a class of subtle bugs.
3. **Add a smoke test that actually exercises the documented cold-start protocol.** One file, ~50 lines, runs `(mis-state-summary)`, `(dmn-reflect-pack 5)`, `(dmn-autobiography 1)`. CI or pre-commit. This would have caught F1, F2, F3, F6 instantly.
4. **Decide whether the DMN/OSS thesis is research or architecture.** If research, the probe needs replication across more models and a written falsification path. If architecture, the neuroscience language should be dialed back to metaphor.
5. **Use upstream `import` to modularize the mind image.** Split `mind-image.ptc` into `helpers.ptc`, `schema.ptc`, `episodes.ptc`, `autobiography.ptc`. Make `mind-image.ptc` a thin loader. Eases editing, enables per-section rollback.

See the rest of this folder for detailed evidence and recommendations.

---

*Independent audit. Did not consult any other `review-by-*` folder.*
