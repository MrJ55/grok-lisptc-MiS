# P11 — OSS-DMN Channel (Pure DMN Generator Protocol)

**Status:** thin path live + 4-channel Chorus locked (2026-09-06) — parameter lock enforced by code; dual-write + audit live; bilingual ds_go practice adopted  
**Depends on:** P0–P4 (safety + reflection), **P6 (evaluation gate — soft waiver accepted)**  
**Next:** [P12-dmn-mind-native.md](./P12-dmn-mind-native.md) — move runtime procedure into the mind (oracle preflight, protocol forms, interpret duty)  
**DMN role:** Candidate-texture generator whose zero-system-prompt protocol is motivated by Alieksieienko (2026)'s finding that instruction-tuning degrades DMN-like residual geometry. The specific inference-time preservation claim is the fork's extension (see caveat below). Grok remains sole mutator of the symbolic mind.  
**Sources:** Alieksieienko (Zenodo), arXiv 2604.03480, evilpiepirate DMN note, Seven-Pass Pipeline — see `docs/related-work.md`  
**Extensions contrast:** `docs/gmod-extensions-contrast-20260902.md` (§1 Chorus, §2 Midnight Note, §3 Pulse Meter, §5 Page Passer, §6 Observer)

## P6 gate
P6 substantially met; residuals parked under soft waiver (2026-09-06 confirmation). Reality-status auditing is live; candidates remain `:imagined`.

## Goal
Make interaction with pure-DMN models a first-class, repeatable, auditable host protocol that **never** shifts the model into TPN / instruction-following mode.

## Objective
1. **Parameter lock enforced by code** — `bridge/oss.ts` hardcodes the parameters; no system prompt is possible. **Done.**
2. Soft-nudge prefix library (versioned). **Done.**
3. Dual-channel capture: immediate episode log + deferred proposal file. **Done.**
4. Lightweight geometric-aware salience heuristic — **Pulse Meter** scoring (`scoreDmn` in `bridge/oss.ts`). **Done.**
5. Explicit host-side Salience Switch policy (Think vs Act) with **Observer** decision logging. **Documented; logging path ready; host practice ongoing.**
6. Audit every OSS call in `state/audit/operations.jsonl`. **Done.**
7. **Chorus** path: concurrent pure-DMN calls + weave. **Locked as 4-channel (oss20 EN + oss120 EN + ds_go EN + ds_go ZH).**
8. **Page Passer** proposal-file exchange. **Documented.**
9. **Midnight Note** sleep-stage Action (proposal files only). **Stub added.**
10. **All OSS output is `:reality-status imagined`**. **Enforced.**
11. **Protocol registry (long-term):** deferred until ≥5 variants needed; **runtime protocol internalization is P12.**

## Core constraint (non-negotiable)
- **Zero system prompt.** Any instructional framing collapses DMN-channel continuations into performative TPN output.
- Bare user prefix only (or soft-nudge seed drawn from MiS state).
- Proven parameters from `docs/DMN-gpt-oss-20b-probe.md`.
- Prefer first-person seeds that speak *as the transcript / process / dream* (see `docs/oss-nudge-craft.md`).
- **Translate all Chinese prompts and answers to English** (user preference 2026-09-06).
- **P12 oracle contract:** before any new Chorus, state unfinished / sought guidance / success criterion; after, interpret (do not collect pretty prose alone).

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
(OpenCode Go may clamp temperature ≤ 1.0; presence/frequency still applied where supported.)

## Implementation method

### A. `bridge/oss.ts` — parameter lock enforcer (UR13) — **LIVE**
See source. Key invariants:
- `OSS_LOCK` frozen constants
- `buildRequestBody` emits **only** `messages: [{ role: "user", content: seed }]`
- `assertNoSystemPrompt` throws if a system role or top-level `system` key appears
- `detectTpnFlip` + `scoreDmn` (Pulse Meter) attached to every call
- Dual-write to `mind/oss-proposals-YYYYMMDD.ptc` + `state/audit/operations.jsonl`

### B. Soft-nudge prefix library
See `docs/oss-nudge-craft.md`. Preferred: transcript-as-speaker. **Runtime craft moves into mind under P12.**

### C. Dual-channel capture
1. Immediate: host may emit `(dmn-log-episode … '(:source oss-dmn :reality-status imagined :dmn-score …))`.
2. Deferred: append-only proposal files. Next P00 reviews; selective promote via `(promote-candidate ...)`.

### D. Salience Switch + Observer
See `docs/observer-salience.md`. Host decides Think (call OSS / reflect) vs Act. One-line decisions append to `state/audit/salience-decisions.jsonl`.

### E. Chorus (4-channel locked)
| Seat | Model | Host | Lang |
|------|--------|------|------|
| 1 | openai/gpt-oss-20b | Groq | EN |
| 2 | openai/gpt-oss-120b | Groq | EN |
| 3 | deepseek-v4-flash | OpenCode Go | EN |
| 4 | deepseek-v4-flash | OpenCode Go | ZH (host translates) |

Protocol: soft seed → 4 voices → keep DMN / drop TPN → host weave sticky lines → dual-write `:imagined` only.  
**P12 adds:** mandatory oracle preflight + interpret duty.

### F. Page Passer
See `docs/page-passer.md`.

### G. Midnight Note
Stub: `.github/workflows/midnight-note.yml` (proposal-file only; no eval). Review at next P00. P12 may require explicit oracle-triple for caretaker notes.

### H. Protocol registry (long-term)
Defer full stack until ≥5 prompt variants become painful. **P12 mind-native protocol forms are the near-term runtime authority.**

## Checklist (2026-09-06)
- [x] Soft-nudge library + parameter lock documented
- [x] Dual-channel demonstrated in live cycle 2026-09-02
- [x] **`bridge/oss.ts` implemented** — parameter lock, zero system prompt structurally impossible
- [x] **All OSS output tagged `:reality-status imagined`** in proposal files
- [x] OSS calls audited in `state/audit/operations.jsonl`
- [x] Formalize Pulse Meter scoring (`scoreDmn`) and attach to every audited call
- [x] Chorus path: 4-channel demonstrated (geometry + bilingual + live dmn-tpn)
- [x] Page Passer: documented
- [x] Midnight Note: workflow stub added
- [x] Document full protocol in this file and keep `docs/oss-nudge-craft.md` current
- [x] Update `docs/mind-api.md` notes for P11 thin path
- [x] Verify that a system-prompted call is rejected by `assertNoSystemPrompt`
- [x] **P0.1 followup:** OSS output is `candidate` trust class; promotion via `(promote-candidate ...)`
- [ ] Observer-style logging in host practice (ongoing; path documented)
- [ ] Protocol registry (long-term) — deferred
- [ ] **Hand off residual procedure internalization to P12**

## Exit criteria
- Any Grok session can invoke pure-DMN via `bridge/oss.ts`, classify (Pulse Meter), dual-write `:imagined` without system prompt. **Met.**
- All OSS output tagged `:reality-status imagined`. **Met.**
- `(audit-reality-status)` shows no leakage. **Operational.**
- Chorus, Observer path, Midnight Note stub available. **Met (Observer practice ongoing).**
- `bridge/oss.ts` structurally prevents system prompts. **Met.**

**Clean P11 exit** treats remaining host-practice Observer logging as ongoing and moves mind-native protocol / oracle contract work to **P12**.

## Non-goals
- Giving OSS any system or instructional prompt
- Auto-promotion of OSS text into the mind image
- Local hosting of the 20B model inside the sandbox
- Direct code linking to Vestige (P5 uses MCP subprocess)

## DMN framing caveat
(Unchanged — see prior revision / `docs/related-work.md`.)
