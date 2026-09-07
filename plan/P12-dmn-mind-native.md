# P12 — DMN Mind-Native (Internalize Chorus & Oracle Contract)

**Status:** **substantially complete (2026-09-06 → 2026-09-07)** — Phases A–C exit-met; first purposeful Chorus under oracle preflight dual-written; endpoints + request locks in mind; residual D/E polish optional  
**Depends on:** P7 (narrative arc + tension seeds), **P11** (thin path, roster, dual-write, Pulse Meter, Observer path)  
**DMN role:** Make pure-DMN / Chorus a permanent, gated, interpretable part of how the mind is run — queryable from the image, not a filing cabinet of markdown.  
**Motivation:** Chorus without a decision problem is waste. Pre-call gates, roster, craft, dual-write, interpret duty, and **live call endpoints/params** must live in MiS so blank sessions do not bypass the mind.

## Problem

- Roster, seed craft, dual-write rules, Observer, Page Passer, pre-call gates, and API endpoints lived primarily in `docs/*` / chat.
- Host increasingly read the repo instead of the mind → MiS bypassed; docs became a second filing cabinet.
- Pretty-prose Chorus without unfinished decision + sought guidance + success criterion produced texture, not guidance.

## Goal

Codify DMN/Chorus operations into the mind image so Grok can cold-start, preflight, run a purposeful 4-channel Chorus, dual-write, interpret sticky images as guidance, and log Observer — **from mind forms**, with docs as human archive and provenance only.

## Objective

1. **Oracle contract (mandatory preflight)** — before any Chorus call, host must state:
   1. What is unfinished on the arc? (one concrete tension or decision)
   2. What kind of guidance are we seeking? (protect X? try Y? refuse collapse Z?)
   3. How will we know the oracle helped? (sticky image maps to a next Act or a veto)
2. **Mind-native protocol** — roster, endpoints, params, zero-system invariant, nudge craft, dual-write contract, translate-ZH rule queryable via Lisp forms.
3. **Interpret duty** — Chorus is not complete until sticky images are mapped to proposed Act, veto, or explicit `no-clear-guidance`.
4. **Wire into mind-drive / reflect / handoff** — DMN is part of the run loop, not a side hobby.
5. **Anti-filing-cabinet** — runtime authority in mind modules; docs distilled, not duplicated as parallel procedure trees.

## Core constraints (non-negotiable)

- No auto-call of Chorus from tensions.
- Zero system prompt to pure-DMN models (P11 invariant).
- All Chorus/OSS output remains `:reality-status imagined` / `candidate` until host promote.
- HUMAN_TOOL still gates identity-level promotion.
- Thin modules (helpers/schema style), not full markdown essays stored as Lisp strings.
- Docs remain the human-readable archive; **executable / queryable authority is the mind**.

## Implementation method

### Phase A — Oracle contract into the mind — **COMPLETE**

| ID | Task | Deliverable | Status |
|----|------|-------------|--------|
| A1 | Schema / `*dmn-oracle*` keys | `:unfinished`, `:sought-guidance`, `:success-criterion` (clearable after job) | **done** — `mind/dmn-oracle.ptc` |
| A2 | `(dmn-oracle-preflight)` | Returns `ok` + packed triple, or `blocked` + missing gate. Host **must** call before Chorus. | **done** |
| A3 | `(dmn-oracle-set unfinished guidance criterion)` | Explicit set from arc / tension-seeds / user. | **done** |
| A4 | `(dmn-oracle-clear)` | After interpret + dual-write (or abort). | **done** |
| A5 | Extend tension map | `(dmn-oracle-candidates)` suggests unfinished+guidance templates (host still chooses). | **done** |
| A6 | Working-insight | Structured claim `chorus-requires-oracle-preflight` (+ `chorus-without-decision-is-waste`) with evidence; HUMAN_TOOL approved. | **done** |

**Exit A:** Cold start → preflight blocks when empty; after set returns ok. **Met** (smoke 2026-09-06).

### Phase B — Internalize Chorus protocol — **COMPLETE**

| ID | Task | Deliverable | Status |
|----|------|-------------|--------|
| B1 | Module `mind/dmn-protocol.ptc` | Roster (4 seats), sampling params, zero-system, dual-write path rules, endpoints, request templates. | **done** |
| B2 | `(dmn-chorus-roster)` | Locked 4-channel table. | **done** |
| B3 | `(dmn-nudge-craft)` | Prefer / avoid patterns distilled from craft docs. | **done** |
| B4 | `(dmn-chorus-protocol)` | One form: roster + endpoints + params + dual-write + preflight + interpret duty. | **done** |
| B5 | `(dmn-suggest-seed tension-or-thread)` | Incomplete first-person seed biased by tension + craft (host may edit). | **done** |
| B6 | Dual-write contract in protocol form | Naming, required keys (incl. oracle triple), interpret. | **done** |
| B7 | Register symbols + helpers version bump | `*mis-known*`; helpers **0.7**. | **done** |

**Also in mind (B follow-ons from live ops):**
- `(dmn-endpoints)` — Groq + **OpenCode Go `https://opencode.ai/zen/go/v1`** (never bare `/zen/v1`)
- `(dmn-request-groq)` — temp 1.15, presence 0.7, frequency 0.3, top_p 0.93, `include_reasoning: false`, `reasoning_effort: low`
- `(dmn-request-opencode-go)` — temp **1.0** (clamp only), **same** presence/frequency/top_p as Groq (records-aligned)
- `bridge/oss.ts` emits `include_reasoning: false` in `OSS_LOCK` / `buildRequestBody`

**Exit B:** `(dmn-chorus-protocol)` / `(dmn-nudge-craft)` / `(dmn-endpoints)` answer from the image alone. **Met**.

### Phase C — Interpretation duty — **COMPLETE** (shapes + proof)

| ID | Task | Deliverable | Status |
|----|------|-------------|--------|
| C1 | `(dmn-chorus-interpret weave sticky oracle-triple)` | Host-mediated structured reminder (guidance / proposed-act / veto / no-clear-guidance). No auto-mutate. | **done** (stub form live) |
| C2 | Link dual-write to oracle-triple | Proposal required-keys include oracle triple + sticky/seed/voices/weave/interpret. | **done** |
| C3 | Observer fields | Think/Act field shapes on protocol; live lines in `state/audit/salience-decisions.jsonl`. | **done** |
| C4 | Optional narrative path | Insight → candidate path available; not required every job. | **available** |

**Proof jobs (2026-09-06):**
- `mind/oss-proposals-20260906-geometry-oracle-chorus.ptc` (first purposeful; endpoint lesson)
- `mind/oss-proposals-20260906-geometry-oracle-chorus-rerun.ptc` (**corrected Go params**; supersedes for param-correctness)
- Docs: `docs/chorus-geometry-20260906.md`
- Observer: think + act lines for both jobs

**Exit C:** Chorus end state = dual-write **plus** interpret record. **Met** on geometry-preservation under preflight.

### Phase D — Wire into mind-drive / reflect / handoff — **substantially met**

| ID | Task | Status |
|----|------|--------|
| D1 | Reflect-pack surface oracle-relevant tensions | **partial** — tension-seeds + oracle-candidates live; reflect-pack not extended |
| D2 | Mind-drive optional Think(Chorus) step | **practice** — used in mind-drive wave; not a separate Lisp form |
| D3 | Session-handoff points at forms | **done** — oracle contract + roster in `docs/session-handoff.md` |
| D4 | Host rule: never Chorus without preflight; always interpret | **done** — protocol instruction + handoff Do-not list |
| D5 | WIKI / plan status | **done** |

### Phase E — Cleanup / anti-filing-cabinet — **substantially met**

| ID | Task | Status |
|----|------|--------|
| E1 | Inventory DMN docs runtime vs archive | **partial** — endpoints/params moved to mind; case studies stay in docs |
| E2 | Distill craft into mind | **done** — prefer/avoid lists in protocol |
| E3 | Distill geometry / bilingual learnings | **done** — best-practice in protocol + geometry doc |
| E4 | Proposal files side-channel | **done** |
| E5 | New operational rule → mind first | **done** (endpoint + request locks after live failure) |

### Phase F — Optional hardening — **deferred**

| ID | Task | Status |
|----|------|--------|
| F1 | Thin `bridge/chorus.ts` multi-model helper | deferred |
| F2 | Midnight Note requires oracle-triple | deferred |
| F3 | Protocol registry | deferred (P11 long-term) |

## Checklist

- [x] A1–A4 oracle triple + preflight/set/clear forms in image; smoke
- [x] A5 `(dmn-oracle-candidates)`
- [x] A6 working-insight `chorus-requires-oracle-preflight` (HUMAN_TOOL)
- [x] B1–B4, B7 dmn-protocol module + roster/craft/protocol forms + register (helpers 0.7)
- [x] B5 suggest-seed helper
- [x] B6 dual-write contract in protocol form
- [x] `(dmn-endpoints)` + OpenCode Go `/zen/go/v1` note in mind
- [x] `(dmn-request-groq)` / `(dmn-request-opencode-go)` records-aligned params in mind
- [x] `bridge/oss.ts` `include_reasoning: false` locked
- [x] C1 interpret form stub
- [x] C2 dual-write oracle keys in protocol
- [x] C3 Observer field shapes + live salience log lines
- [x] **First live Chorus under P12 preflight + interpret + dual-write with keys** (geometry-preservation; rerun with corrected Go params)
- [x] D3–D4 handoff + host rule
- [x] E2–E3 distill craft + geometry into mind/docs
- [ ] D1 reflect-pack extension (optional residual)
- [ ] E1 full doc inventory table (optional residual)
- [ ] F1–F3 optional hardening
- [x] plan/README + WIKI status synced

## Exit criteria

- Cold start → `(dmn-oracle-preflight)` / `(dmn-chorus-protocol)` / `(dmn-nudge-craft)` / `(dmn-endpoints)` / `(dmn-request-groq)` work from the image. **Met.**
- Host cannot honestly run Chorus without the three gates set. **Operational** (forms + handoff rule).
- After Chorus: dual-write **and** interpret record. **Met** (geometry jobs).
- Session-handoff and host rules point at mind forms for runtime procedure. **Met.**
- Docs remain archive/provenance; no parallel competing procedure trees for endpoints/params. **Met** for call path.
- At least one purposeful Chorus job completed under the oracle contract with interpret logged. **Met.**

## Non-goals

- Auto-firing Chorus from tensions
- Storing full markdown essays as Lisp strings
- Weakening `:imagined` / promote-candidate discipline
- Replacing host judgment with model votes
- Local hosting of OSS models inside the sandbox

## Modules (runtime)

| Path | Role |
|------|------|
| `mind/dmn-oracle.ptc` | `*dmn-oracle*`, preflight/set/clear/get/slot/candidates |
| `mind/dmn-protocol.ptc` | roster, endpoints, request-groq/go, craft, protocol, suggest-seed, interpret |
| `mind/helpers.ptc` | **0.7** — registers P12 forms; state-summary includes oracle |
| `mind/schema.ptc` | A6 insights; open-threads include `p12-dmn-mind-native` |
| `bridge/oss.ts` | Groq lock incl. `include_reasoning: false` |

## Related

- [P11-oss-dmn-channel.md](./P11-oss-dmn-channel.md) — thin path + 4-channel (prerequisite)
- [P7-narrative-self.md](./P7-narrative-self.md) — arc, tension bias from unfinished
- [docs/narrative-tension-seeds.md](../docs/narrative-tension-seeds.md)
- [docs/oss-nudge-craft.md](../docs/oss-nudge-craft.md) — archive; prefer/avoid distilled into mind
- [docs/chorus-geometry-20260906.md](../docs/chorus-geometry-20260906.md) — geometry job + rerun
- [docs/observer-salience.md](../docs/observer-salience.md)
- [docs/page-passer.md](../docs/page-passer.md)
- [docs/mind-drive-protocol.md](../docs/mind-drive-protocol.md)
- [CREATIVE-MECHANISMS.md](./CREATIVE-MECHANISMS.md)
