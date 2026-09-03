# 04 — Plan Execution Critique

The fork's `plan/` directory contains 13 files: `README.md`, `CREATIVE-MECHANISMS.md`, and `P00`–`P11` (no `P12+`). This document audits each phase against its checklist and the actual code/image state.

---

## 4.1 Plan structure

The phase numbering is non-linear:
- P00 — Cold start (permanent reference)
- P0 — Safety
- P1 — UX & upstream pins
- P2 — Helpers, scratch, push
- P3 — Self-schema & episodic buffer
- P4 — Reflection protocol
- P5 — Vector cabinet (optional)
- P6 — Evaluation & hardening
- P7 — Narrative self
- P8 — Replay & scenes
- P9 — Prospection
- P10 — Spontaneous wander
- P11 — OSS-DMN channel

The numbering gaps (no P12, P5/P6 are out of order) and the restart at P00 are slightly confusing. `plan/README.md` does not explain the numbering scheme. A new reader has to infer that P00 is "phase 0.0" (pre-game) and P0–P11 are the actual roadmap.

The status table in `plan/README.md` line 26–41:

| ID | Status | Claimed |
|----|--------|---------|
| P00 | permanent ref | OK |
| P0 | done | OK (verified) |
| P1 | done | OK |
| P2 | done | OK |
| P3 | mostly done | OK (primitives live) |
| P4 | done | **FALSE** — see 4.6 below |
| P5 | optional | OK |
| P6 | planned | OK |
| P7 | next | OK (one chapter closed) |
| P8 | planned | OK |
| P9 | planned | OK |
| P10 | planned | OK |
| P11 | new / parallel | Partial — protocol documented, no helper code |

---

## 4.2 P00 — Cold Start

**Status:** permanent reference
**Quality:** Good

The cold-start protocol is clear: clone, bootstrap, smoke test, read plan, continue. The prerequisites (Node ≥ 22.6, network, GitHub access) are documented. The "if bootstrap fails" section points to the right places.

**Issue:** Step 3 of `docs/session-handoff.md` line 21 says to verify with `(dmn-reflect-pack 5)`, which doesn't exist (F1). This will fail on every cold start.

**Fix:** Remove that line until F1 is fixed, or fix F1 first.

---

## 4.3 P0 — Safety

**Status:** done (verified 2026-08-31)
**Quality:** Good design, stale verification

The P0 design is sound: `prevalidate` (paren depth + prose heuristic), `eval` returns `{ok, output}`, save gated on `ok`, failures logged, `--checkpoint` support. Exit codes 0/1/2 are consistent.

**Issues:**
- F8 (non-atomic save) — P0 claims "save only on success" but the save itself is not crash-safe.
- F9 (image-load swallows errors) — P0 says "no brick on errors" but a poison form in the image silently drops subsequent forms.
- F11 (stale verification) — `VERIFICATION.md` reports results that cannot be reproduced against current code.
- F12 (prevalidate regex) — narrow but mostly harmless.

The 22-scenario verification is a good practice, but it was a one-time manual run. There is no automated regression test. If the bridge changes, the verification is not re-run.

**Recommendation:** Convert `VERIFICATION.md` into an executable script (`scripts/verify.sh` or a vitest spec) that runs the 22 scenarios and fails on any deviation. Add it to CI or pre-commit.

---

## 4.4 P1 — UX & Upstream Pins

**Status:** done
**Quality:** Mixed

P1's goals:
- English-first host interaction — **achieved** (`CUSTOM_INSTRUCTIONS.md` is clear)
- Pin upstream sources — **claimed but not really achieved** (F4: `src/lisp.ts` is not in the repo; the "pin" is just a hash written down in `docs/UPSTREAM.md`)
- Record dialect caveats — **achieved** (`docs/UPSTREAM.md` lists `string-trim`, division by zero, error recovery)

**Issue:** The "pin" is documentation, not enforcement. `bootstrap.sh` curls the upstream URL with no version parameter, no hash check, no signature. A compromised upstream would be silently accepted.

**Fix:** Vendor `src/lisp.ts` directly into the repo. Add a `scripts/verify-pin.sh` that computes `sha256sum src/lisp.ts src/arith.ts` and compares to the hashes in `docs/UPSTREAM.md`. Run it in CI.

---

## 4.5 P2 — Helpers, Scratch, Push

**Status:** done
**Quality:** Good

P2's goals:
- Core helpers (version, ping, note, register, state-summary) — **achieved**
- Isolated scratch image — **achieved** (`--scratch` flag works)
- Push script — **achieved** (`scripts/push-mind-image.sh` works, modulo F14)

The helpers are minimal but functional. The scratch isolation is correct (separate file, no cross-contamination). The push script is simple and correct.

**Issue:** `*mis-known*` is manually maintained and has drifted — it lists `dmn-narrate`, `dmn-chapter-close`, `dmn-arc`, `dmn-autobiography` (all of which exist) but if any are removed in the future, `*mis-known*` won't auto-update. Should use upstream's `(dump)` instead.

---

## 4.6 P3 — Self-Schema & Episodic Buffer

**Status:** mostly done
**Quality:** Good design, one regression (F2)

P3's goals:
- Persistent `*self-schema*` alist — **achieved**
- `update-self-schema` primitive — **achieved** (with F7: subtle order bug)
- Bounded `*episodic-buffer*` with log/fetch helpers — **claimed but broken** (F2: trim logic missing in canonical image)
- Readers integrated into `mis-state-summary` — **achieved**
- Optional `:source 'oss-dmn` meta tag — **achieved** (used in hardcoded episodes)

Checklist items:
- [x] `*self-schema*` default in image — yes
- [x] `(mis-schema)` `(mis-insights)` `(update-self-schema alist)` — yes
- [x] `*episodic-buffer*` + `(dmn-log-episode ...)` `(dmn-fetch-unreflected n)` — **partially**: the functions exist but `dmn-log-episode` doesn't trim (F2), and `dmn-fetch-unreflected` doesn't filter (F5)
- [x] Extended `(mis-state-summary)` includes schema — yes (and also arc + autobiography length, which is more than P3 asked)
- [x] Reader tryToParse fix + bootstrap auto-apply — **claimed but unnecessary** (F4)
- [x] Verified save/reload of schema + episodes in sandbox — likely verified against the older `helpers.ptc` version that had the trim; current `mind-image.ptc` is broken
- [ ] Optional: tighten schema shape validators — not done (acceptable)
- [ ] Optional: auto-log every successful TPN eval from a thin wrapper — not done (acceptable)
- [ ] Optional: document `:source 'oss-dmn` convention — partially done (mentioned in mind-api.md)

**Net assessment:** P3 is "mostly done" as claimed, but the regression in F2 means the bounded-buffer promise is not honored. Fix F2 and P3 is genuinely complete.

---

## 4.7 P4 — Reflection Protocol

**Status:** done (claimed)
**Quality:** **Not done — see F1**

P4's checklist (from `plan/P4-reflection-protocol.md`):
- [x] Add `(dmn-reflect-pack n)` to image — **FALSE**: not in `mind-image.ptc` or `helpers.ptc`
- [x] Add `(dmn-apply-reflection insights summary label)` — **FALSE**: same
- [x] Write `docs/reflection-protocol.md` — yes
- [x] Run ≥2 full reflection turns in sandbox; confirm schema + image growth — **unverifiable**: if the functions never existed, the turns could not have run; possibly they ran against an older image that has since been overwritten
- [x] Register new symbols via `mis-register` — **FALSE**: `*mis-known*` in `mind-image.ptc` line 4 does not list `dmn-reflect-pack` or `dmn-apply-reflection`
- [x] Update `docs/mind-api.md` and `plan/README.md` status → P4 done — yes, the docs claim it's done
- [x] Optional: `skills/mis-reflect/SKILL.md` — yes
- [ ] Optional: auto-push note after reflection — not done
- [ ] Document "OSS enrichment optional step" — not done
- [ ] One reflection turn that dual-writes an OSS continuation — not done

**Net assessment:** P4 is **not done**. The checklist items claiming the functions were added are false. The cold-start verification step that calls `(dmn-reflect-pack 5)` will fail. Either the functions existed once and were lost in a rewrite of `mind-image.ptc`, or they were never implemented and the checklist was prematurely marked.

This is the most serious plan-vs-reality gap in the project.

**Fix:** Either implement the functions (see F1 fix) or downgrade P4 to "in progress" and remove the false checklist items.

---

## 4.8 P5 — Vector Cabinet

**Status:** optional / later
**Quality:** Reasonable deferral

P5 is honestly marked optional. The decision to prefer managed free-tier APIs (Pinecone Starter) over local sqlite-vec is correct for the sandbox constraint. The non-goals (no replacing schema with vectors, no full local RAG) are clearly stated.

No issues. P5 can stay deferred.

---

## 4.9 P6 — Evaluation & Hardening

**Status:** planned
**Quality:** Underdeveloped

P6's checklist is empty:
- [ ] Define 2–3 multi-turn scenarios
- [ ] Measure recovery after reflection
- [ ] Check autobiography chapters cite episode refs
- [ ] Document quantitative exit criteria

The exit criteria ("at least one scenario shows fewer repeated failures after a full cycle") is vague. What counts as a "scenario"? What metrics define "fewer repeated failures"?

This phase is critical because it's the only one that would test whether the DMN loop actually improves agent behavior (the project's core claim). Without it, the project is a sophisticated self-description with no evidence of functional benefit.

**Recommendation:** P6 should be elevated in priority. Even a minimal version (one scenario, one metric — e.g. "after a reflection turn, does the agent repeat the same error within the next 5 turns?") would be more valuable than P7–P11 combined. The current roadmap defers P6 until after P7–P9, which means the project will have built five subsystems before testing whether any of them work.

---

## 4.10 P7 — Narrative Self

**Status:** next (primary focus)
**Quality:** Good design, partially started

P7's goals:
- `*autobiography*` and `*narrative-arc*` — **achieved** (both exist as globals)
- Primitives `dmn-narrate`, `dmn-chapter-close`, `dmn-arc`, `dmn-autobiography` — **achieved** (with F3: hardcoded date; F6: ignored argument)
- Episode-grounded chapters — **achieved** for the one existing chapter (Genesis of GMOD)
- Dual-write channel — **not implemented** (no helper exists)
- Soft-nudge seeding — **documented only** (no helper)

Checklist:
- [x] First grounded chapter *Genesis of GMOD* closed — yes (lines 59–63 of mind-image.ptc)
- [ ] Define / stabilise default `*autobiography*` and `*narrative-arc*` in image — **partially**: they're defined but `*narrative-arc*` has only one entry; the shape is not stabilised
- [ ] Implement `(dmn-narrate …)` etc. — **partially**: they exist but have bugs (F3, F6)
- [ ] `mis-register` new symbols — done (line 4 of mind-image.ptc lists them)
- [ ] Further chapters closed from existing episodes — not done
- [ ] Dual-write helper — not done
- [ ] Document forms + rule in `docs/mind-api.md` — partially (listed as "planned")
- [ ] Verify persistence across cold bootstrap — not verifiable with current bugs
- [ ] Tension signals influence later wander/reflect bias — not done

**Net assessment:** P7 is at "first stub" stage, not "next phase" stage. The primitives exist but have bugs. The dual-write helper (a core P7 feature) is not started. The phase should not be marked "next" until F3 and F6 are fixed and the dual-write helper is implemented.

---

## 4.11 P8 — Replay & Scenes

**Status:** planned
**Quality:** Reasonable plan

P8 is well-scoped: extend episodes with tags (valence, error?, goal-relevance, novelty, social?), implement tag-weighted replay, extract scene structures. The non-goals (no full temporal knowledge graph, no local embedding search) are clear.

No issues with the plan. Not yet implemented, which is consistent with "planned" status.

---

## 4.12 P9 — Prospection

**Status:** planned
**Quality:** Good design

P9 frames imagination as "constructive simulation" (fMRI-backed) rather than next-token prediction. The result shape is well-specified:

```
(:mode . …) (:scene . …) (:predicted-outcomes . …) (:schema-delta . …) (:confidence . …)
```

The "counterfactual curriculum" idea (after failures, simulate safer policy; promote consistent insights) is interesting and ties back to the offline-RL framing in `docs/related-work.md`.

**Issue:** The plan says "Never execute predicted actions automatically" — good — but doesn't specify how a simulated action would be prevented from being executed. Since the host (Grok) reads simulation results as data and decides what to do, the prevention is at the host-policy level, not the Lisp level. This is fine but should be explicit: "the host MUST NOT pass `(:predicted-outcomes . …)` directly to `eval`; it must emit a separate, validated TPN form."

---

## 4.13 P10 — Spontaneous Wander

**Status:** planned
**Quality:** Good design, ambitious

P10's key constraint: "Scheduled wander = external or next-session proposal file only (never auto-save mutations). Realised as Midnight Note GitHub Action (or equivalent) that soft-nudges with tension seeds and only writes proposal files."

This is the right design — no always-on daemon, no auto-mutation. The Midnight Note as a GitHub Action is clever: it leverages GitHub's cron scheduler without running anything in the sandbox.

**Issue:** There is no `.github/workflows/` directory in the repo. The Midnight Note is described in 4+ docs but has no implementation, not even a stub workflow file. Either commit a stub workflow (even if it just echoes "midnight note placeholder") or remove the implementation claims from the docs.

---

## 4.14 P11 — OSS-DMN Channel

**Status:** new / parallel
**Quality:** Strong protocol design, weak implementation

P11's protocol is the most rigorous part of the project:
- Parameter lock (temp 1.15, presence 0.7, freq 0.3, top_p 0.93, max_tokens 450, reasoning low)
- Zero system prompt (non-negotiable)
- Dual-channel capture (episode log + proposal file)
- Soft-nudge prefix library (8 categories)
- Salience switch (host policy)
- Pulse Meter scoring (planned)
- Observer logging (planned)
- Chorus multi-model (planned)
- Midnight Note Action (planned, no workflow file)
- Page Passer exchange (planned)

The protocol design is excellent. The implementation is essentially zero:
- The parameter lock is documented but no helper enforces it. Grok is trusted to use the right parameters when calling gpt-oss-20b. There is no `scripts/oss-call.sh` that locks the parameters.
- The dual-channel capture is described but no helper writes the proposal file format. The existing `mind/oss-proposals-*.ptc` files were hand-written, not generated by a helper.
- The Pulse Meter, Observer, Chorus, Midnight Note, Page Passer are all unchecked.

**Net assessment:** P11 is at "protocol spec" stage, not "live" stage. The WIKI claim "P11 pure-DMN channel live" is overstated. One live cycle was run manually (per `docs/gmod-live-cycle-20260902.md`), but there is no reusable helper, no enforced parameter lock, no automated proposal-file writer.

**Recommendation:** Implement a minimal `scripts/oss-call.sh` (or `bridge/oss.ts`) that:
1. Reads a seed from stdin or `--seed`
2. Calls gpt-oss-20b with the locked parameters (no system prompt)
3. Writes the continuation to `mind/oss-proposals-YYYYMMDD.ptc` with metadata
4. Optionally logs an episode via `bridge/eval.ts`

This would make P11 actually "live" rather than "documented".

---

## 4.15 CREATIVE-MECHANISMS.md

**Quality:** Good cross-cutting reference

This file tracks 10 creative mechanisms (dual-write, soft-nudge, self-as-code, counterfactual curriculum, narrative tension, sleep stages, geometric awareness, salience switch, multi-model chorus, page passer) with phase mapping and source-shape pointers. It's a useful index.

The "Salience Switch default rules" section is the clearest statement of host policy in the project:

1. High error density → reflect + optional OSS counterfactual
2. Goal completed → chapter-close or ordinary TPN action
3. Idle / low external demand → OSS wander call → proposal file only
4. High-novelty OSS proposal + open tension → prefer dual-write
5. Log every Think/Act decision

**Issue:** Rule 5 says "log every Think/Act decision" but there is no log file, no log format, no helper. The Observer extension is supposed to be this log, but it's unchecked in P11. Either implement a minimal `mind/observer.log` (JSONL with `{ts, decision, novelty, tension, reason}`) or remove rule 5.

---

## 4.16 Overall plan execution assessment

**Strengths:**
- The plan is comprehensive (12 phases + cross-cutting mechanisms)
- Each phase has explicit exit criteria and non-goals
- Provenance is recorded (`docs/related-work.md`)
- The cold-start protocol (P00) is well-designed
- ADRs are well-structured

**Weaknesses:**
- **Status claims drift from reality.** P4 is marked done but isn't. P11 is marked "live" but has no helper code. The WIKI claims "six novel extensions merged" but they're only mentioned.
- **No automated verification.** The 22-scenario verification was a one-time manual run. Regressions like F1, F2, F3 were not caught.
- **P6 (evaluation) is under-prioritized.** It's the only phase that would test whether the DMN loop actually works, but it's deferred until after P7–P9.
- **Implementation surface is smaller than documentation surface.** 33+ doc files, ~13 plan files, 5 ADRs — but only ~83 lines of mind image, ~220 lines of bridge code, ~64 lines of arith. The ratio is off.
- **No CI, no tests, no pre-commit hooks.** Everything depends on the human (or Grok) remembering to run `VERIFICATION.md` manually.

**Recommendation:** Pause new phase work (P7–P11). Spend one session fixing F1–F4, adding a smoke test, and re-running verification. Then resume P7 with confidence that the foundation is solid.
