# P4 — Reflection Protocol (Grok-driven DMN cycle)

**Status:** done (claimed) → **revised 2026-09-04** (GLM+Terra synthesis) — was never actually done; now implementing for real

## Goal
Make background-style consolidation an **explicit, repeatable, Grok-owned turn** that updates the self-schema from recent episodes without a long-running Node daemon. Optional pure-DMN OSS enrichment is allowed for phenomenological texture only.

## Objective
1. Define a standard reflection turn Grok can issue any time (especially after idle or after errors).
2. **Actually implement `dmn-reflect-pack` and `dmn-apply-reflection`** (were documented as live but missing — GLM F1).
3. Provide helper forms that package "fetch episodes + current schema → produce update".
4. Persist successful reflections with `--save` (optional `--checkpoint` — automatic after P0.1).
5. Document ops so a blank session can run a reflection without inventing protocol.
6. When reflection pack contains OSS-sourced episodes, Grok may request a pure-DMN continuation from OSS (P11 protocol) to enrich texture before writing insights.
7. Reflection never feeds system prompts or TPN framing to OSS.
8. **Reflection produces candidate proposals, not direct mutations** (after P0.1). Promotion is a separate `(promote-candidate ...)` step.

## Why not a Node heartbeat?
Sandbox tool-call processes are ephemeral. A Grok-driven turn is reliable, inspectable, and matches ADR 0001 (Grok is host).

## Implementation method

### A. Implement missing functions (UR1 — CRITICAL)

In `mind/episodes.ptc` (after P2 modularization):

```lisp
(defun dmn-reflect-pack (n)
  "Return (list :schema *self-schema* :episodes (dmn-fetch-recent n))."
  (list :schema *self-schema* :episodes (dmn-fetch-recent n)))

(defun dmn-apply-reflection (insights summary label)
  "Append INSIGHTS to :working-insights, set :episodic-summary and :last-reflection, log a reflection episode, return state summary."
  (let ((current (let ((pair (assoc :working-insights *self-schema*)))
                   (if pair (cdr pair) nil))))
    (update-self-schema
      (list (cons :working-insights (append current insights))
            (cons :episodic-summary summary)
            (cons :last-reflection label))))
  (dmn-log-episode "reflection" summary
    (list :source 'reflection :label label :reality-status 'inferred)))
```

**Note:** `dmn-fetch-unreflected` was renamed to `dmn-fetch-recent` in P2 (it doesn't actually filter by reflection state — that filter is deferred to P0.1 when reality-status + operation events are available).

### B. Protocol (host side)

```
1. (automatic checkpoint) — after P0.1, --save always checkpoints to last-known-good.ptc
2. Gather: (dmn-reflect-pack 10)
3. Reason in natural language (Grok): failures, patterns, goal drift
4. (optional) pure-DMN OSS call for texture (P11) — never system prompt
5. Emit ONE form:
     (progn
       (dmn-apply-reflection
         '(insight-one insight-two)
         "One-line episodic summary of what changed."
         "2026-09-04-label")
       (mis-state-summary))
6. Eval with --save
7. Optionally push image to GitHub
```

### C. Lisp helpers (mind side)
- `(dmn-reflect-pack n)` → `(list :schema <schema> :episodes <last-n>)`
- `(dmn-apply-reflection insights summary label)` → updates schema + logs reflection episode (with `:reality-status inferred`)

### D. Candidate flow (after P0.1)

After P0.1 trust classes are implemented:
- `dmn-apply-reflection` creates a **candidate** proposal in `mind/reflection-proposals-YYYYMMDD.ptc`, not a direct mutation.
- `(promote-candidate candidate-id)` validates the proposal (schema + provenance + contradiction check) and applies it.
- Grok reviews the candidate and explicitly promotes.

For now (pre-P0.1), `dmn-apply-reflection` directly mutates, but the `:reality-status inferred` tag marks the result as inferred (not observed), so future audits can distinguish direct mutations from reviewed promotions.

### E. Ops artifacts
- `docs/reflection-protocol.md` (update to reflect actual function signatures)
- `skills/mis-reflect/SKILL.md` (update — currently references functions that didn't exist; now they will)

## Checklist
- [ ] **`(dmn-reflect-pack n)` implemented** in `mind/episodes.ptc` (UR1)
- [ ] **`(dmn-apply-reflection insights summary label)` implemented** in `mind/episodes.ptc` (UR1)
- [ ] Both registered in `*mis-known*` or accessible via `(dump)`
- [ ] `docs/mind-api.md` updated with actual signatures (was already correct; now matches reality)
- [ ] `docs/reflection-protocol.md` updated with working examples
- [ ] `skills/mis-reflect/SKILL.md` updated — verification step `(dmn-reflect-pack 5)` now works
- [ ] `docs/session-handoff.md` cold-start step 3 `(dmn-reflect-pack 5)` works
- [ ] Run ≥2 full reflection turns in sandbox; confirm schema + image growth
- [ ] Reflection episode logged with `:reality-status inferred`
- [ ] Optional: `skills/mis-reflect/SKILL.md` tested end-to-end
- [ ] Optional: auto-push note after reflection
- [ ] Document "OSS enrichment optional step" in `docs/reflection-protocol.md`
- [ ] One reflection turn that dual-writes an OSS continuation as candidate insight (still Grok-approved)
- [ ] **P0.1 followup:** Change `dmn-apply-reflection` to create candidate, not direct mutation

## Exit criteria
- From cold start, Grok can run a reflection using only plan + mind-api + reflection-protocol docs.
- `(dmn-reflect-pack 5)` returns `(list :schema ... :episodes ...)` — no `unbound variable` error.
- After `(dmn-apply-reflection ...)` with `--save`, `(mis-insights)` and `:last-reflection` change and survive process restart.
- Failed reflection forms still do not poison the image (P0 holds).
- Any OSS enrichment remains candidate material until Grok promotes it.
- Reflection episodes are tagged `:reality-status inferred`.

## Non-goals (this phase)
- SQLite / vector search (P5)
- Automatic idle timers inside Node
- Unconstrained self-modifying code beyond schema keys
- System prompts or TPN framing to OSS
- Candidate → promotion flow (P0.1)

## Historical note
The original P4 checklist claimed `[x] Add (dmn-reflect-pack n) to image` and `[x] Add (dmn-apply-reflection ...)`. These were false — the functions did not exist in `mind-image.ptc` or `mind/helpers.ptc` (verified by GLM via `grep -rn "dmn-reflect-pack\|dmn-apply-reflection" mind/ bridge/ src/` returning no matches in code files). This revision implements them for real.
