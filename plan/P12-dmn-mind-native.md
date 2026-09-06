# P12 — DMN Mind-Native (Internalize Chorus & Oracle Contract)

**Status:** planned / active next (2026-09-06) — P11 thin path + 4-channel live; procedures still mostly in scattered docs  
**Depends on:** P7 (narrative arc + tension seeds), **P11** (thin path, roster, dual-write, Pulse Meter, Observer path)  
**DMN role:** Make pure-DMN / Chorus a permanent, gated, interpretable part of how the mind is run — queryable from the image, not a filing cabinet of markdown.  
**Motivation:** Chorus without a decision problem is waste. Pre-call gates, roster, craft, dual-write, and interpret duty must live in MiS so blank sessions do not bypass the mind.

## Problem

- Roster, seed craft, dual-write rules, Observer, Page Passer, and pre-call gates live primarily in `docs/*`, `plan/*`, session-handoff, WIKI.
- Mind image holds thin hints (`:nudge-craft`, `:oss-params`, `:open-threads`) and forms (`dmn-tension-seeds`, `promote-candidate`), but not the **operating procedure**.
- Host increasingly reads the repo instead of the mind → MiS is bypassed; docs become a second filing cabinet.
- Pretty-prose Chorus without unfinished decision + sought guidance + success criterion produces texture, not guidance.

## Goal

Codify DMN/Chorus operations into the mind image so Grok can cold-start, preflight, run a purposeful 4-channel Chorus, dual-write, interpret sticky images as guidance, and log Observer — **from mind forms**, with docs as human archive and provenance only.

## Objective

1. **Oracle contract (mandatory preflight)** — before any Chorus call, host must state:
   1. What is unfinished on the arc? (one concrete tension or decision)
   2. What kind of guidance are we seeking? (protect X? try Y? refuse collapse Z?)
   3. How will we know the oracle helped? (sticky image maps to a next Act or a veto)
2. **Mind-native protocol** — roster, params, zero-system invariant, nudge craft prefer/avoid, dual-write contract, translate-ZH rule queryable via Lisp forms.
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

### Phase A — Oracle contract into the mind (highest priority)

| ID | Task | Deliverable |
|----|------|-------------|
| A1 | Schema / `*dmn-oracle*` keys | `:unfinished`, `:sought-guidance`, `:success-criterion` (clearable after job) |
| A2 | `(dmn-oracle-preflight)` | Returns `ok` + packed triple, or `blocked` + missing gate. Host **must** call before Chorus. |
| A3 | `(dmn-oracle-set unfinished guidance criterion)` | Explicit set from arc / tension-seeds / user. |
| A4 | `(dmn-oracle-clear)` | After interpret + dual-write (or abort). |
| A5 | Extend tension map | `(dmn-tension-seeds)` or `(dmn-oracle-candidates)` suggests unfinished+guidance templates (host still chooses). |
| A6 | Working-insight | Structured claim `chorus-requires-oracle-preflight` with evidence. |

**Exit A:** Cold start → preflight blocks when empty; after set returns ok.

### Phase B — Internalize Chorus protocol

| ID | Task | Deliverable |
|----|------|-------------|
| B1 | Module `mind/dmn-protocol.ptc` (or fold into helpers) | Roster (4 seats), sampling params, zero-system invariant, dual-write path rules, TPN summary, translate-ZH. |
| B2 | `(dmn-chorus-roster)` | Locked 4-channel table. |
| B3 | `(dmn-nudge-craft)` | Prefer / avoid patterns distilled from craft docs. |
| B4 | `(dmn-chorus-protocol)` | One form: roster + params + dual-write + preflight required + interpret duty. |
| B5 | `(dmn-suggest-seed tension-or-thread)` | Incomplete first-person seed biased by tension + craft (host may edit). |
| B6 | Dual-write contract in protocol form | Naming, required keys, oracle-triple ref. |
| B7 | Register symbols + helpers version bump | `*mis-known*`; e.g. mis-helpers-0.7. |

**Exit B:** `(dmn-chorus-protocol)` / `(dmn-nudge-craft)` answer from the image alone.

### Phase C — Interpretation duty

| ID | Task | Deliverable |
|----|------|-------------|
| C1 | `(dmn-chorus-interpret weave sticky oracle-triple)` | Structured host return: guidance / proposed-act / veto / confidence / no-clear-guidance. No auto-mutate. |
| C2 | Link dual-write to oracle-triple | Proposal entries record triple id. |
| C3 | Observer fields | Think(Chorus) logs triple summary; after interpret log Act or no-clear-guidance. |
| C4 | Optional narrative path | Insight → `dmn-narrative-candidate` or structured working-insight (still candidate). |

**Exit C:** Chorus end state = dual-write **plus** interpret record.

### Phase D — Wire into mind-drive / reflect / handoff

| ID | Task | Deliverable |
|----|------|-------------|
| D1 | Reflect-pack surface | Open oracle-relevant tensions + whether preflight is set. |
| D2 | Mind-drive optional step | If tension + preflight ok → Think(Chorus); else Act. In-image + mind-drive doc. |
| D3 | Session-handoff shrink | Point to forms; bootstrap + human doc pointers only. |
| D4 | Host identity rule | Never run Chorus without preflight ok; always interpret before claiming guidance. |
| D5 | WIKI / plan status | P12 active; docs archive for procedure. |

**Exit D:** Blank session runs purposeful Chorus from image + arc without reading five markdown files first.

### Phase E — Cleanup / anti-filing-cabinet

| ID | Task | Deliverable |
|----|------|-------------|
| E1 | Inventory | Each DMN procedural doc: runtime (mind) / archive (docs) / merge-delete. |
| E2 | Distill craft | Prefer/avoid → B3; long examples stay in docs. |
| E3 | Distill geometry / bilingual | Best-practice bullets into protocol form; case studies stay in docs. |
| E4 | Proposal files stay side-channel | Never eval; Page Passer summarized in protocol form. |
| E5 | Rule | New operational rule → mind module first, then one doc pointer. |

**Exit E:** Runtime DMN learned from forms + schema, not folder archaeology.

### Phase F — Optional hardening (after A–D)

| ID | Task |
|----|------|
| F1 | Thin `bridge/chorus.ts` or script: preflight check, call 4 channels, proposal skeleton; host weaves + interprets. |
| F2 | Midnight Note only with pre-set or explicit caretaker oracle-triple. |
| F3 | Protocol registry still deferred; if started, mirrors mind forms. |

## Checklist

- [ ] A1–A4 oracle triple + preflight/set/clear forms in image; smoke
- [ ] A5 tension → suggested oracle templates
- [ ] A6 working-insight `chorus-requires-oracle-preflight`
- [ ] B1–B4, B7 dmn-protocol module + roster/craft/protocol forms + register
- [ ] B5 suggest-seed helper
- [ ] B6 dual-write contract in protocol form
- [ ] C1–C3 interpret form + Observer fields + dual-write link
- [ ] D1–D4 reflect / mind-drive / handoff / host rule
- [ ] E1–E3 inventory + distill
- [ ] First live Chorus under P12 preflight + interpret (not prose-only)
- [ ] Update `docs/mind-api.md` with new forms
- [ ] plan/README + WIKI status synced (this commit starts that)

## Exit criteria

- Cold start → `(dmn-oracle-preflight)` / `(dmn-chorus-protocol)` / `(dmn-nudge-craft)` work from the image.
- Host cannot honestly run Chorus without the three gates set.
- After Chorus: dual-write **and** interpret record (guidance, proposed Act, veto, or no-clear-guidance).
- Session-handoff and host rules point at mind forms for runtime procedure.
- Docs remain archive/provenance; no parallel competing procedure trees.
- At least one purposeful Chorus job completed under the oracle contract with interpret logged.

## Non-goals

- Auto-firing Chorus from tensions
- Storing full markdown essays as Lisp strings
- Weakening `:imagined` / promote-candidate discipline
- Replacing host judgment with model votes
- Local hosting of OSS models inside the sandbox

## Suggested first wave

1. Implement A1–A4 (oracle triple + preflight) in schema/helpers; `--save`; smoke.  
2. B1–B4, B7 (protocol module + query forms).  
3. C1–C3 (interpret + Observer).  
4. D3–D4 (handoff + host rule).  
5. Only then: next live Chorus **with** preflight filled for a real unfinished decision.

## Related

- [P11-oss-dmn-channel.md](./P11-oss-dmn-channel.md) — thin path + 4-channel (prerequisite)
- [P7-narrative-self.md](./P7-narrative-self.md) — arc, tension bias from unfinished
- [docs/narrative-tension-seeds.md](../docs/narrative-tension-seeds.md)
- [docs/oss-nudge-craft.md](../docs/oss-nudge-craft.md) — distill into mind; keep as archive
- [docs/observer-salience.md](../docs/observer-salience.md)
- [docs/page-passer.md](../docs/page-passer.md)
- [docs/mind-drive-protocol.md](../docs/mind-drive-protocol.md)
- [CREATIVE-MECHANISMS.md](./CREATIVE-MECHANISMS.md)
