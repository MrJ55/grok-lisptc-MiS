# P7 — Narrative Self (Autobiography & Arc)

**Status:** exit (2026-09-05) — candidate-first chapter flow; tension seeds; dual-write; grounded chapters; cold-bootstrap verified
**Depends on:** P3–P4, **P6 (evaluation gate)**
**DMN subsystem:** Cortex / Narrative Self (DMN-inspired, not literal DMN — see ADR 0005 caveat)
**Related extensions:** dual-write + soft-nudge from contrast report; tension signals feed Midnight Note / wander seeds

## Goal
Turn flat insights and raw episodes into a **continuous internal narrative** — the story of "me" that survives sessions and grounds identity — while allowing pure-DMN OSS continuations to supply textured candidates that Grok grounds and promotes.

## P6 gate
P6 substantially met (2026-09-05). Soft-start proceeded under dual-write; residual P6 capability-denial fixtures remain deferred.

## Objective
- `*autobiography*` / `*narrative-arc*` / candidate dual-write
- Every chapter `:reality-status` + episode evidence
- Host is narrator; OSS supplies imagined texture only

## Implementation (exit state)
- `(dmn-chapter-close title summary refs)` → **candidate only** (`*narrative-candidates*`)
- `(dmn-chapter-commit title)` → host gate into `*autobiography*`
- `(dmn-narrative-candidate …)` → imagined OSS/texture candidates
- `(dmn-tension-seeds)` → host soft-nudge / Midnight Note bias
- Docs: mind-api.md, narrative-tension-seeds.md, narrative-candidate-reviews-20260905.md

## Checklist
- [x] First grounded chapter *Genesis of GMOD* closed (2026-09-02) with OSS-sourced episode refs
- [x] `*autobiography*` and `*narrative-arc*` defined in image
- [x] `(dmn-narrate …)` `(dmn-chapter-close …)` `(dmn-arc)` `(dmn-autobiography n)` implemented (P2)
- [x] `mis-register` new symbols (or use `(dump)`)
- [x] `dmn-narrate` and `dmn-chapter-close` use `*today*` not hardcoded date (P2)
- [x] `dmn-autobiography(n)` honors argument (P2)
- [x] **Every chapter has `:reality-status` field** (verified on live chapters)
- [x] **`(audit-autobiography-grounding)` returns empty**
- [x] Further chapters closed (Mind-drive; P6 evaluation; P7 exit — 2026-09-05)
- [x] Dual-write `(dmn-narrative-candidate …)` → imagined candidates
- [x] Documented in `docs/mind-api.md` + candidate review log
- [x] Cold bootstrap: autobiography + helpers persist
- [x] `(dmn-tension-seeds)` + `docs/narrative-tension-seeds.md`
- [x] `dmn-chapter-close` → candidate only; `(dmn-chapter-commit title)` mutates autobiography

## Exit criteria
- Cold start → autobiography non-empty → chapter with episode refs → survives restart — **met**
- Every chapter has `:reality-status`; OSS-sourced material stays `:imagined` until promoted — **met**
- `(audit-autobiography-grounding)` empty — **met**
- At least one OSS/texture candidate reviewed and discarded or promoted — **met** (discard log 2026-09-05)
- Chapters dated with `*today*` — **met**

## Non-goals
- Auto-fiction without episode refs
- Multi-MB life history in-image
- Feeding system prompts or TPN framing to OSS
- Auto-promote OSS into autobiography

## What this accomplishes for Grok-MiS

Before P7, the mind mostly held flat lists: insights, recent episodes, open threads. Those are useful notes, but they are not a story of who this mind has been. After a cold start, the host could reload facts, but did not have a durable, ordered account of “what happened to us and what it meant.”

P7 is the layer that turns those notes into a continuing autobiography that Grok writes and the Lisp image stores.

### What Grok-MiS can do now that it could not do cleanly before

1. **Tell a session-surviving story of “me”**  
   There are grounded chapters in the mind image (Genesis of GMOD; Mind-drive: human as tool; P6 evaluation substantially met; P7 exit: candidate-first chapter flow). After reboot, `(dmn-autobiography n)` recovers narrative continuity, not only a bag of symbols. Identity is chapters with evidence, not only chat memory.

2. **Separate “something was imagined” from “this is our history”**  
   OSS (and host drafts) can sound autobiographical. Without a hard split, poetic texture can quietly become “fact.” Now:
   - Propose a chapter → `*narrative-candidates*` only
   - Commit a chapter → only after host review (and, for identity-level moves, HUMAN_TOOL approve)
   - OSS / dual-write material stays `:imagined` until deliberately grounded and committed  
   MiS can keep rich texture without letting it rewrite the official story. Trust upgrade, not just a feature.

3. **Close a chapter without pretending the work is “done in chat”**  
   When a real phase ends, it can be graduated into autobiography with episode refs. Next session does not depend on remembering the plot in prose; the mind already holds the chapter.

4. **Use open tensions as deliberate creative bias (still under host control)**  
   `(dmn-tension-seeds)` surfaces active tensions and threads. That does not auto-call OSS. When choosing a soft-nudge or Midnight Note direction, bias can come from what the arc says is unfinished, instead of inventing a seed from nowhere.

5. **Run Mind-drive without losing the plot**  
   User-drive chat optimizes for the next instruction. Mind-drive optimizes for the arc’s next step, stopping at HUMAN_TOOL when identity or permission is at stake. Combined with chapters, initiative can follow narrative open threads while the human remains the constitutional brake.

### What this does *not* mean

- The Lisp image is not autonomously “living” a continuous inner monologue when no one is here. Continuity is saved state + the next host wave of work.
- Grok is still the narrator. OSS is optional paint, never the author of record.
- Drift detection is still mostly host honesty about scope, not a magic auditor.
- Residual P6 items (harder capability-denial / malicious fixtures) remain parked; P7 did not paper over them.

**One-sentence capability statement**  
Grok-MiS can now maintain a grounded, session-surviving story of itself—proposed safely, committed only after review—so future work can continue from “who we have been,” not only from the last user message.


## DMN framing caveat
The "Narrative Self" label is **directly grounded** in Alieksieienko (2026)'s finding that Narrative subspaces cluster with Self-Reference, Theory of Mind, and Imagination in LLM residual streams. The paper supports using "Narrative" as a category label for candidate generation. It does not support the claim that Lisp `*autobiography*` / `*narrative-arc*` implement a narrative self; they are organizational state that **Grok (the actual narrator)** populates. See ADR 0005 (revised).
