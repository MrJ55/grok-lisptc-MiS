# 03 — GLM Extensions Terra Missed

These are critiques or recommendations GLM made that Terra did not. They are code-level findings grounded in specific file:line references. Terra's review was top-down (architecture, governance, process) and didn't descend to the level of individual functions in `mind-image.ptc` or individual lines in `bridge/eval.ts`. These findings complement Terra's framework.

---

## 3.1 `dmn-reflect-pack` and `dmn-apply-reflection` are undefined (GLM F1)

### Finding

`mind/mind-image.ptc` (83 lines) does not define `dmn-reflect-pack` or `dmn-apply-reflection`. Neither does `mind/helpers.ptc` (94 lines). Neither does any `.ts` file.

These functions are documented as "Live (P0–P4)" in:
- `docs/mind-api.md` line 17–18
- `docs/reflection-protocol.md` line 30–31
- `docs/session-handoff.md` line 21 (cold-start verification step!)
- `skills/mis-reflect/SKILL.md` line 11, 14
- `plan/P4-reflection-protocol.md` lines 47–48 (checklist `[x]` claiming done)
- `docs/learnings-log.md` line 16

### Why Terra missed this

Terra's review was at the architecture level. Terra read the ADRs, plans, and docs but did not cross-check whether the functions documented in `docs/mind-api.md` actually exist in `mind-image.ptc`. Terra's §2 says "Evidence covered... the mind image and helper/episode artifacts" but doesn't cite specific line numbers or function definitions.

### Impact

Any new session that follows `docs/session-handoff.md` step 3 will run `(dmn-reflect-pack 5)` and get `EvalException: void variable dmn-reflect-pack`. The cold-start verification step fails on every fresh session. P4's "done" status is false.

### Synthesis incorporation

This is the most critical finding in either review. It must be fixed before any other work. GLM R1 provides the patch:

```lisp
(defun dmn-reflect-pack (n)
  "Return (list :schema *self-schema* :episodes (dmn-fetch-unreflected n))."
  (list :schema *self-schema* :episodes (dmn-fetch-unreflected n)))

(defun dmn-apply-reflection (insights summary label)
  "Append INSIGHTS to :working-insights, set :episodic-summary and :last-reflection, log a reflection episode, return state summary."
  (let ((current (let ((pair (assoc :working-insights *self-schema*)))
                   (if pair (cdr pair) nil))))
    (update-self-schema
      (list (cons :working-insights (append current insights))
            (cons :episodic-summary summary)
            (cons :last-reflection label))))
  (dmn-log-episode "reflection" summary (list :source 'reflection :label label)))
```

Terra's framework adds: `dmn-apply-reflection` should create a *candidate* proposal, not directly mutate the schema. The promotion from candidate to approved should be a separate step. This is a good improvement but requires more infrastructure (candidate store, approval flow). For now, GLM's patch restores the documented behavior; Terra's candidate-approval semantics should be adopted in P0.1.

---

## 3.2 `dmn-log-episode` lost its buffer-trim logic (GLM F2)

### Finding

`mind/helpers.ptc` lines 66–77 (older version) has trim logic:
```lisp
(when (> (length *episodic-buffer*) *episodic-max*)
  ;; truncate to *episodic-max* entries
  ...)
```

`mind/mind-image.ptc` lines 46–49 (canonical version) drops this entirely:
```lisp
(defun dmn-log-episode (input result meta)
  (let ((rec (list input result meta)))
    (setq *episodic-buffer* (cons rec *episodic-buffer*))
    rec))
```

`*episodic-max*` is set to 40 (line 45) but never consulted.

### Why Terra missed this

Terra didn't compare `helpers.ptc` against `mind-image.ptc` line-by-line. The existence of two parallel files with divergent implementations is a repo-hygiene issue Terra didn't flag.

### Impact

Every `(dmn-log-episode ...)` with `--save` permanently grows the buffer. After 100 episodes, the image contains 100 `(dmn-log-episode ...)` forms plus the initial 6 hardcoded entries. Cold-start load time grows linearly. `(mis-state-summary)` eventually returns multi-KB output on every call.

Contradicts `plan/P3-self-schema.md` line 19: "Bounded `*episodic-buffer*` with log/fetch helpers" and "max `*episodic-max*` (40)".

### Synthesis incorporation

GLM R2 provides the fix (restore the trim from `helpers.ptc`). Terra's framework adds: the buffer should eventually be backed by Vestige (which has its own FSRS-6 fading + dedup), so the in-image buffer is just a working set, not the full history. The trim logic is the right v0 behavior; Vestige integration is the long-term solution.

---

## 3.3 `dmn-narrate` / `dmn-chapter-close` hardcode the date (GLM F3)

### Finding

`mind/mind-image.ptc` lines 69–76:
```lisp
(defun dmn-narrate (summary title)
  (let ((ch (list (cons :title title) (cons :summary summary) (cons :date-label "2026-09-02"))))
    ...))
```

The string `"2026-09-02"` is a literal. No `*today*` global is injected by the bridge. Every future autobiography chapter added via the helper will be stamped `2026-09-02`.

### Why Terra missed this

Terra didn't read the helper function definitions in `mind-image.ptc`. Terra's §5 recommends "grounded, time-aware synthesis linked to evidence IDs" but didn't notice that the existing time-awareness is broken.

### Impact

All future autobiography chapters via the helper will be misdated. The autobiography becomes useless as a chronological record. The first chapter (*Genesis of GMOD*) was correctly dated because it was hand-written directly into `*autobiography*`, not via the helper. All subsequent chapters via the helper will be wrong.

### Synthesis incorporation

GLM R3 provides the fix (inject `*today*` from the bridge via `interp.defineGlobal`). Terra's framework adds: the reality-status field (§2.2) should include temporal validity (`valid_from`, `valid_until`), and the manifest (§2.3) should record `created_at`. The `*today*` global is the minimal v0 fix; Terra's temporal model is the comprehensive target.

---

## 3.4 `dmn-fetch-unreflected` doesn't filter by reflection state (GLM F5)

### Finding

`mind/mind-image.ptc` lines 50–58 returns the most recent N episodes regardless of whether they've been reflected on. The name promises a filter that doesn't exist.

### Why Terra missed this

Terra didn't audit individual function contracts against their names.

### Impact

A reflection turn that calls `(dmn-fetch-unreflected 10)` re-processes the same 10 episodes every time. Reflection is not idempotent and produces ever-growing insight lists.

### Synthesis incorporation

GLM R6 provides two options (rename or implement filter). Terra's framework adds: the filter should use the reality-status field and the operation-event log (§2.7) to track which episodes have been consumed by a reflection turn. This is more robust than a `:reflected` tag on the episode itself (which is mutable and can drift).

---

## 3.5 `dmn-autobiography(n)` ignores its argument (GLM F6)

### Finding

`mind/mind-image.ptc` line 78:
```lisp
(defun dmn-autobiography (n) *autobiography*)
```

`n` is bound but never used. The function always returns the entire autobiography.

### Why Terra missed this

Terra didn't audit individual function contracts.

### Impact

The advertised "fetch last N chapters" API does not exist. As the autobiography grows, this function returns unbounded data.

### Synthesis incorporation

GLM R7 provides the fix. Trivial.

---

## 3.6 `update-self-schema` reverses new entries (GLM F7)

### Finding

`mind/mind-image.ptc` lines 21–29: the merge logic conses old-not-in-new entries onto `acc` (which starts as `new-map`), then `nreverse`s. This reverses the order of new-map entries.

Trace with `*self-schema* = ((:a . 1) (:b . 2))`, `new-map = ((:c . 3) (:d . 4))`:
1. `acc = ((:c . 3) (:d . 4))`
2. After iterating: `acc = ((:b . 2) (:a . 1) (:c . 3) (:d . 4))`
3. `nreverse acc = ((:d . 4) (:c . 3) (:a . 1) (:b . 2))`

New entries (`:c`, `:d`) are reversed. `assoc` still works, but pretty-printed schema is non-deterministic across runs.

### Why Terra missed this

Terra didn't trace the algorithm. This is a subtle bug that only manifests when you trace the cons/reverse sequence.

### Impact

Functional correctness preserved (alist lookups work). But git diffs on `mind-image.ptc` are noisy, and visual scanning is harder.

### Synthesis incorporation

GLM R7 provides the fix. Terra's framework adds: `update-self-schema` should eventually be replaced by a propose-approve-apply flow (§2.1 trust classes) where the candidate update is validated before being applied. The order-reversal bug is moot if updates are atomic and reviewed.

---

## 3.7 Image-load swallows errors and silently drops subsequent forms (GLM F9)

### Finding

`bridge/eval.ts` lines 124–137: `loadImage` calls `repl.eval(src)` with the entire image as one program string. Upstream `run()` evaluates top-level forms sequentially; if one throws `EvalException`, the rest are skipped. A single broken form at line 20 of 83 silently drops forms at lines 21–83.

### Why Terra missed this

Terra didn't audit the bridge's load path at this level of detail.

### Impact

A single broken form (e.g., a multi-line docstring, which the learnings log says breaks the Reader) in the middle of the image silently drops everything after it. The mind appears to load (most helpers work) but specific later definitions are missing. This is exactly how U1 could have happened: if `dmn-reflect-pack` was ever in the image but a form before it broke, it would be silently dropped.

### Synthesis incorporation

GLM R10 provides the fix (form-by-form load with per-form error reporting). Terra's framework adds: the load should also validate the manifest (§2.3) before evaluating any forms, and should verify the post-load state against a hash (§1.3 — transactional persistence). GLM's form-by-form load is the minimal fix; Terra's hash-verified load is the target.

---

## 3.8 The fork rewrote `arith.ts` unnecessarily (GLM F4 — deeper analysis)

### Finding

GLM F4 identified that the fork's `arith.ts` returns `undefined` while upstream returns `null`, causing the Reader bug. But GLM also noted additional divergences:

- Fork drops the `BigInt === "undefined"` defensive guard (upstream lines 11–12)
- Fork drops the `123.0` → `"123.0"` rule in `convertToString` (upstream lines 100–106)
- Fork uses parameter names `(a, b)` instead of `(x, y)`
- Fork removes comments

None of these are improvements. The missing `.0` rule is why `VERIFICATION.md`'s recorded result `(half 8)` = `4.0` cannot be reproduced — the fork would print `4`.

### Why Terra missed this

Terra treated the Reader patch as a thing to formalize, not as a thing to eliminate. Terra didn't compare the fork's `arith.ts` against upstream line-by-line.

### Impact

Beyond the Reader bug, the missing `.0` rule causes silent numeric-display drift. Integer-valued floats print without a decimal point, making it impossible to distinguish `4` (int) from `4.0` (float) in output.

### Synthesis incorporation

GLM R4 provides the fix (revert to upstream `arith.ts` verbatim). This is the single highest-leverage action — it eliminates the Reader patch, restores numeric display correctness, and removes a class of subtle bugs. Terra's `UPSTREAM.lock.json` (§1.2) ensures the reverted file stays pinned.

---

## 3.9 Ignored upstream features (GLM F10)

### Finding

The fork vendors `lisp.ts` and `arith.ts` but does not use:

| Upstream feature | What it does | Fork status |
|---|---|---|
| `stripProse(text)` | Blanks non-form text so prose mixed with Lisp is ignored | Not used; fork's `prevalidate` rejects prose |
| `AgentRepl` class | Adds `setConversationVars()` (inject chat as Lisp globals) and `takeFinished()` | Not used |
| `import` form | `(import "path")` reads & evaluates a Lisp file with cycle detection | Not used; mind-image.ptc is monolithic |
| `dump` form | `(dump)` returns list of all global symbols | Not used; fork maintains `*mis-known*` manually |
| `doc` form | `(doc 'name)` prints signature + docstring | Not used |
| `defineGlobal(sym, value, doc?)` | API to inject host-side state with documentation | Not used |
| `checkSyntax(text)` | Static syntax check | Not used; fork's `prevalidate` is weaker |
| 17 vitest spec files | Comprehensive upstream tests | Not vendored |

### Why Terra missed this

Terra mentioned the upstream test suite (§2: "Its test suite explicitly covers Reader behavior, lists, strings, numbers, macros, recursion, errors, control flow, imports, prose surfaces, grammar, MCP, OAuth, and secrets") but didn't catalog the specific upstream features the fork ignores. Terra's focus was on capability governance, not feature adoption.

### Impact

Each missed feature is a small loss, but together they mean the fork is reimplementing or working around the upstream layer rather than building on it. The most consequential:
1. No conversation vars — Grok must manually serialize user input into Lisp strings
2. No `import` — mind image is one file, hard to manage
3. No `dump` — `*mis-known*` is manually maintained and has drifted
4. No tests — regressions go undetected

### Synthesis incorporation

GLM R11, R12 address the `AgentRepl` and `import` adoptions. Terra's capability framework (§2.7) provides the governance for when features are adopted. The 17 vitest specs should be adapted into a fork-specific test suite (GLM R8 + Terra §6).

---

## 3.10 `prevalidate` regex is narrow (GLM F12)

### Finding

`bridge/eval.ts` line 51: the symbol regex `/^[a-zA-Z_*?!+\-*/<>=][\w\-?!*]*$/` doesn't allow `+`, `/`, `<`, `>`, `=`, `:` in non-initial position. Valid lisptc atoms like `string->symbol`, `:keyword`, `<=`, `>=` fail this regex. No false negative (they pass through to eval because they have no whitespace), but the regex is misleadingly narrow.

### Why Terra missed this

Terra didn't audit the `prevalidate` regex.

### Impact

Low. No functional impact currently, but a future maintainer might "fix" the regex to be stricter and accidentally reject valid atoms.

### Synthesis incorporation

GLM R12 recommends using upstream's `tokenPattern()` for consistency. Minor fix.

---

## 3.11 Single squashed commit; no bisect capability (GLM F13)

### Finding

The fork has one commit (`5bff12d` at latest, `02c1e49` at original audit). No incremental history. Regressions like U1, U2, U3 cannot be bisected or attributed.

### Why Terra missed this

Terra cited a fork revision (`51751f6`) that doesn't exist in the fork's history. Terra may have been working from a different state of the repo (if the fork was force-pushed before Terra's review), or the SHA may be incorrect. Either way, Terra didn't flag the single-commit history as a process issue.

### Impact

Low for now, but any regression investigation in the future will be impossible without incremental commits.

### Synthesis incorporation

GLM R13 recommends committing incrementally going forward. Terra's `CONTRIBUTING.md` recommendation (§8) should include a commit-message convention (Terra suggests `state(episode): append...`, `mind(schema): migrate...`, `runtime(upstream): bump...`).

---

## 3.12 `mind-failures.log` is ephemeral (GLM F14)

### Finding

`bridge/eval.ts` line 39: `mind-failures.log` is generated at runtime under `mind/`. `scripts/push-mind-image.sh` line 11 does not add it. On sandbox reset, the audit trail of past failures is lost.

### Why Terra missed this

Terra didn't audit the push script's staging logic.

### Impact

Low. Past failure audit trail is lost on sandbox reset. Makes debugging intermittent issues harder.

### Synthesis incorporation

GLM R15 recommends either committing the log or documenting its ephemerality. Terra's operation-event log (§2.7) supersedes this — when the full operation log is implemented, `mind-failures.log` becomes a subset of it and should be persisted as part of the audit trail.

---

## 3.13 `VERIFICATION.md` is stale (GLM F11)

### Finding

`docs/VERIFICATION.md` reports:
- `(mis-version)` = `"mis-helpers-0.2"` (current is `0.3`)
- `(half 8)` = `4.0` (current fork's `arith.ts` would print `4`)

The verification was run with older code. Current code cannot reproduce the recorded results.

### Why Terra missed this

Terra didn't attempt to reproduce `VERIFICATION.md`'s results against current code.

### Impact

Low. The verification is a historical artifact, not a living test. But it gives false confidence that the system has been verified.

### Synthesis incorporation

GLM R8 (smoke test) + R4 (revert arith.ts) together fix this: after reverting `arith.ts`, re-run the verification and record actual output. Then convert `VERIFICATION.md` into an executable `scripts/smoke-test.sh` that fails on drift. Terra's CI recommendation (§8) ensures the smoke test runs on every push.
