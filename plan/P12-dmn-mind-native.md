# P12 — DMN Mind-Native (Internalize Chorus & Oracle Contract)

**Status:** **in progress (2026-09-06 mind-drive wave)** — Phase A + B live in image; C1 interpret stub; A5/A6/C2–E remaining  
**Depends on:** P7 (narrative arc + tension seeds), **P11** (thin path, roster, dual-write, Pulse Meter, Observer path)  
**DMN role:** Make pure-DMN / Chorus a permanent, gated, interpretable part of how the mind is run — queryable from the image, not a filing cabinet of markdown.  
**Motivation:** Chorus without a decision problem is waste. Pre-call gates, roster, craft, dual-write, and interpret duty must live in MiS so blank sessions do not bypass the mind.

## Problem

- Roster, seed craft, dual-write rules, Observer, Page Passer, and pre-call gates lived primarily in `docs/*` (being internalized).
- Pretty-prose Chorus without unfinished decision + sought guidance + success criterion produces texture, not guidance.

## Goal

Codify DMN/Chorus operations into the mind image so Grok can cold-start, preflight, run a purposeful 4-channel Chorus, dual-write, interpret sticky images as guidance, and log Observer — **from mind forms**, with docs as human archive and provenance only.

## Objective

1. **Oracle contract (mandatory preflight)** — three gates before any Chorus.  
2. **Mind-native protocol** — roster, params, craft, dual-write, translate-ZH queryable via Lisp.  
3. **Interpret duty** — sticky → Act / veto / no-clear-guidance.  
4. **Wire into mind-drive / reflect / handoff.**  
5. **Anti-filing-cabinet.**

## Core constraints (non-negotiable)

- No auto-call of Chorus from tensions.
- Zero system prompt (P11).
- All Chorus/OSS output `:reality-status imagined` until host promote.
- HUMAN_TOOL gates identity-level promotion.
- Thin modules; docs = archive; **mind = runtime authority**.

## Implementation progress

### Phase A — Oracle contract — **mostly done**

| ID | Status |
|----|--------|
| A1 `*dmn-oracle*` keys | **done** — `mind/dmn-oracle.ptc` |
| A2 `(dmn-oracle-preflight)` | **done** — blocked / ok |
| A3 `(dmn-oracle-set …)` | **done** |
| A4 `(dmn-oracle-clear)` | **done** |
| A5 tension → oracle templates | **open** |
| A6 working-insight claim | **open** — needs HUMAN_TOOL (identity schema) |

Smoke: empty → blocked; set → ok; clear → blocked (single progn).

### Phase B — Protocol module — **done**

| ID | Status |
|----|--------|
| B1 `mind/dmn-protocol.ptc` | **done** |
| B2 `(dmn-chorus-roster)` | **done** |
| B3 `(dmn-nudge-craft)` | **done** |
| B4 `(dmn-chorus-protocol)` | **done** |
| B5 `(dmn-suggest-seed …)` | **done** |
| B6 dual-write contract in protocol | **done** (keys in protocol form) |
| B7 helpers 0.7 + register | **done** |

### Phase C — Interpret — **stub**

| ID | Status |
|----|--------|
| C1 `(dmn-chorus-interpret …)` | **stub** — host-mediated reminder (like promote-candidate) |
| C2 dual-write link to oracle-triple | **open** |
| C3 Observer fields | **open** (path exists; practice) |
| C4 optional narrative path | **open** |

### Phase D–F — open

Handoff shrink, reflect surface, inventory distill, optional bridge/chorus.ts.

## Checklist

- [x] A1–A4 oracle triple + preflight/set/clear forms in image; smoke
- [ ] A5 tension → suggested oracle templates
- [ ] A6 working-insight `chorus-requires-oracle-preflight` (HUMAN_TOOL)
- [x] B1–B4, B7 dmn-protocol module + roster/craft/protocol forms + register
- [x] B5 suggest-seed helper
- [x] B6 dual-write contract in protocol form
- [x] C1 interpret form stub
- [ ] C2–C3 Observer fields + dual-write link
- [ ] D1–D4 reflect / mind-drive / handoff / host rule
- [ ] E1–E3 inventory + distill
- [ ] First live Chorus under P12 preflight + interpret (not prose-only)
- [ ] Update `docs/mind-api.md` with live P12 forms
- [x] plan/README + WIKI status (ongoing sync)

## Exit criteria

- Cold start → `(dmn-oracle-preflight)` / `(dmn-chorus-protocol)` / `(dmn-nudge-craft)` from image. **Met for forms.**
- Host cannot honestly run Chorus without the three gates set. **Operational once host practice follows.**
- After Chorus: dual-write **and** interpret record. **Stub interpret present; full practice open.**
- Session-handoff points at mind forms. **Partial — D3 open.**
- At least one purposeful Chorus under oracle contract. **Open.**

## Non-goals

- Auto-firing Chorus from tensions
- Full markdown essays as Lisp strings
- Weakening `:imagined` / promote-candidate
- Replacing host judgment with model votes

## Related

- Modules: `mind/dmn-oracle.ptc`, `mind/dmn-protocol.ptc`, helpers 0.7
- [P11-oss-dmn-channel.md](./P11-oss-dmn-channel.md)
- [P7-narrative-self.md](./P7-narrative-self.md)
- [docs/oss-nudge-craft.md](../docs/oss-nudge-craft.md) — archive; prefer/avoid distilled into mind
