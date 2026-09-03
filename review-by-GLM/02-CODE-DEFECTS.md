# 02 — Code Defects (with file:line evidence)

Every claim below is grounded in a specific file and line range in the audited repo state (fork HEAD `02c1e49`). Line numbers refer to the file as it exists at that commit.

---

## F1 — `dmn-reflect-pack` and `dmn-apply-reflection` documented as live but undefined

**Severity:** Critical
**Type:** Documentation / code drift

### Evidence

`mind/mind-image.ptc` (the canonical durable mind, 83 lines) defines these functions:
- `mis-version`, `mis-ping`, `mis-note`, `mis-register`, `mis-state-summary` (lines 1–6)
- `mis-schema`, `mis-insights`, `update-self-schema` (lines 19–29)
- `dmn-log-episode`, `dmn-fetch-unreflected` (lines 46–58)
- `dmn-narrate`, `dmn-chapter-close`, `dmn-arc`, `dmn-autobiography` (lines 69–78)
- `square`, `triple`, `double`, `quadruple`, `half` (lines 79–83)

It does **not** define `dmn-reflect-pack` or `dmn-apply-reflection`.

`mind/helpers.ptc` (the older parallel copy, 94 lines) also does not define them. Confirmed via:

```
$ grep -rn "dmn-reflect-pack\|dmn-apply-reflection" mind/ bridge/ src/
(no matches)
```

The functions appear ONLY in documentation and skill files:
- `docs/mind-api.md` line 17–18: lists them as "Live (P0–P4)"
- `docs/reflection-protocol.md` line 30–31: documents their signatures
- `docs/session-handoff.md` line 21: tells every new session to verify the mind by running `(dmn-reflect-pack 5)`
- `skills/mis-reflect/SKILL.md` line 11, 14: instructs the host to call them
- `plan/P4-reflection-protocol.md` lines 39–40, 47–48: checklist items marked `[x]` claiming they were added to the image
- `docs/learnings-log.md` line 16: "Added `dmn-reflect-pack` and `dmn-apply-reflection`; two live turns persisted"

### Impact

Any new Grok session that follows `docs/session-handoff.md` step 3 will run:

```bash
node --experimental-transform-types --no-warnings bridge/eval.ts '(dmn-reflect-pack 5)'
```

The bridge loads `mind-image.ptc` (succeeds), then evaluates `(dmn-reflect-pack 5)`. The reader parses `dmn-reflect-pack` as a symbol; the evaluator looks it up in `interp.globals`; it is not there; the evaluator throws `EvalException: void variable dmn-reflect-pack`. The bridge catches it, returns exit 2, logs the failure to `mind/mind-failures.log`, and prints the error.

The cold-start verification step therefore fails on every fresh session. The P4 "done" status is false.

### Fix

Either:

**(a)** Add the missing functions to `mind/mind-image.ptc`. Suggested implementations:

```lisp
(defun dmn-reflect-pack (n)
  "Return (list :schema *self-schema* :episodes (dmn-fetch-unreflected n))."
  (list :schema *self-schema* :episodes (dmn-fetch-unreflected n)))

(defun dmn-apply-reflection (insights summary label)
  "Merge INSIGHTS into :working-insights, set :episodic-summary and :last-reflection, log a reflection episode, return state summary."
  (let ((current (let ((pair (assoc :working-insights *self-schema*)))
                   (if pair (cdr pair) nil))))
    (update-self-schema
      (list (cons :working-insights (append current insights))
            (cons :episodic-summary summary)
            (cons :last-reflection label))))
  (dmn-log-episode "reflection" summary (list :source 'reflection :label label)))
```

**(b)** If P4 is not actually done, change the status to "in progress", remove the `[x]` checks from `plan/P4-reflection-protocol.md`, and remove the cold-start verification step from `docs/session-handoff.md` until the functions exist.

---

## F2 — `dmn-log-episode` lost its buffer-trim logic

**Severity:** High
**Type:** Regression

### Evidence

`mind/helpers.ptc` lines 66–77 (older version):

```lisp
(defun dmn-log-episode (input result meta)
  "Push episode (input result meta) newest-first; trim to max; return record. Pass nil for meta if unused."
  (let ((rec (list input result meta)))
    (setq *episodic-buffer* (cons rec *episodic-buffer*))
    (when (> (length *episodic-buffer*) *episodic-max*)
      (let ((acc nil) (i 0) (xs *episodic-buffer*))
        (while (and xs (< i *episodic-max*))
          (setq acc (cons (car xs) acc))
          (setq xs (cdr xs))
          (setq i (+ i 1)))
        (setq *episodic-buffer* (nreverse acc))))
    rec))
```

`mind/mind-image.ptc` lines 46–49 (canonical version):

```lisp
(defun dmn-log-episode (input result meta)
  (let ((rec (list input result meta)))
    (setq *episodic-buffer* (cons rec *episodic-buffer*))
    rec))
```

The canonical version drops the `when (> (length ...) *episodic-max*)` trim entirely. `*episodic-max*` is set to 40 (line 45) but never consulted.

### Impact

Every call to `(dmn-log-episode ...)` with `--save` permanently grows the buffer. After 100 episodes, the image contains 100 `(dmn-log-episode ...)` forms plus the initial hardcoded `*episodic-buffer*` setq with 6 entries. Cold-start load time grows linearly. `(mis-state-summary)` eventually returns a multi-KB schema dump on every call.

This directly contradicts:
- `plan/P3-self-schema.md` line 19: "Bounded `*episodic-buffer*` with log/fetch helpers" and "max `*episodic-max*` (40)"
- `mind/helpers.ptc` docstring: "trim to max"

### Fix

Restore the trim logic from `helpers.ptc` into `mind-image.ptc`. Or, better, lift the helper into a single source file and `import` it from both (see recommendation R5 in `05-RECOMMENDATIONS.md`).

---

## F3 — Chapter helpers hardcode the date

**Severity:** High
**Type:** Data-integrity bug

### Evidence

`mind/mind-image.ptc` lines 69–76:

```lisp
(defun dmn-narrate (summary title)
  (let ((ch (list (cons :title title) (cons :summary summary) (cons :date-label "2026-09-02"))))
    (setq *autobiography* (append *autobiography* (list ch)))
    ch))

(defun dmn-chapter-close (title summary refs)
  (let ((ch (list (cons :title title) (cons :summary summary) (cons :episode-refs refs) (cons :date-label "2026-09-02"))))
    (setq *autobiography* (append *autobiography* (list ch)))
    ch))
```

`:date-label` is the literal string `"2026-09-02"`. There is no `(current-time)` or `(today)` call. The lisptc prelude does not appear to expose a date function, but the bridge could inject one via `interp.defineGlobal(newSym("*today*"), new Date().toISOString().slice(0,10))` before evaluating user code.

### Impact

Every future autobiography chapter added via `dmn-narrate` or `dmn-chapter-close` will be stamped `2026-09-02`, regardless of when it was actually added. The autobiography becomes useless as a chronological record.

The first chapter *Genesis of GMOD* (line 60–63) was correctly dated because it was hand-written directly into `*autobiography*` rather than via the helper. All subsequent chapters via the helper will be misdated.

### Fix

Either:

**(a)** Add a host-injected `*today*` global in `bridge/eval.ts`:

```typescript
import { newSym } from "./driver.ts";
// ... after creating the interp ...
interp.defineGlobal(newSym("*today*"), new Date().toISOString().slice(0, 10));
```

Then update the helpers:

```lisp
(defun dmn-chapter-close (title summary refs)
  (let ((ch (list (cons :title title) (cons :summary summary) (cons :episode-refs refs) (cons :date-label *today*))))
    ...))
```

**(b)** Add a `current-time-string` primitive to the bridge via `interp.def(...)`. More invasive but cleaner.

---

## F4 — Self-inflicted Reader bug

**Severity:** High
**Type:** Unnecessary divergence from upstream

### Evidence

Upstream `packages/interpreter/src/arith.ts` lines 89–97:

```typescript
export function tryToParse(token: string): Numeric | null {
        try {
                return BigInt(token);
        } catch (_ex) {
                const n = Number(token);
                if (Number.isNaN(n)) return null;
                return n;
        }
}
```

Returns `null` on failure.

Fork `src/arith.ts` lines 17–22:

```typescript
export function tryToParse(s: string): Numeric | undefined {
        if (/^[+-]?\d+$/.test(s)) return BigInt(s);
        const n = Number(s);
        if (!Number.isNaN(n)) return n;
        return undefined;
}
```

Returns `undefined` on failure.

Upstream `packages/interpreter/src/lisp.ts` line 1830–1831:

```typescript
const n = tryToParse(t);
if (n !== null) this.token = n;
```

The reader checks `n !== null`. With upstream `arith.ts` this is correct. With the fork's `arith.ts` (returns `undefined`), `undefined !== null` is `true`, so the reader sets `this.token = undefined`, breaking all list parsing.

`src/READER-FIX.md` documents the workaround: change the reader to `if (n !== undefined && n !== null)`. `scripts/bootstrap.sh` lines 36–41 auto-applies this `sed` patch on every bootstrap.

`docs/learnings-log.md` line 21 describes this as a "critical bug" in the reader.

### Impact

The "Reader fix" is treated as a necessary patch, but the bug only exists because the fork rewrote `arith.ts`. If the fork had used upstream `arith.ts` verbatim, the reader would work correctly without any patch.

The fork's `arith.ts` is also missing the `BigInt === "undefined"` defensive guard (lines 11–12 of upstream), the `.0`-suffix rule in `convertToString` (upstream lines 100–106), and uses different parameter names (`(a, b)` vs `(x, y)`) — none of these are improvements, and the missing `.0` rule means `VERIFICATION.md`'s recorded result `(half 8)` = `4.0` cannot be reproduced (the fork would print `4`).

### Fix

1. Delete `src/arith.ts`.
2. Replace `scripts/bootstrap.sh` lines 27–34 with a curl of upstream `arith.ts` (already there as a fallback).
3. Delete `src/READER-FIX.md`.
4. Delete the sed patch in `scripts/bootstrap.sh` lines 36–41.
5. Re-run `VERIFICATION.md` and record the actual output.

The fork's `convertToString` is also missing upstream's `123.0` → `"123.0"` rule, which means integer-valued floats print without a decimal point. This will cause confusion (`(half 8)` prints `4` whether `8` is an int or a float). Reverting to upstream `arith.ts` restores the distinction.

---

## F5 — `dmn-fetch-unreflected` does not filter by reflection state

**Severity:** Medium
**Type:** Contract violation

### Evidence

`mind/mind-image.ptc` lines 50–58:

```lisp
(defun dmn-fetch-unreflected (n)
  (if (or (null n) (<= n 0))
      *episodic-buffer*
    (let ((acc nil) (i 0) (xs *episodic-buffer*))
      (while (and xs (< i n))
        (setq acc (cons (car xs) acc))
        (setq xs (cdr xs))
        (setq i (+ i 1)))
      (nreverse acc))))
```

This returns the most recent N episodes. There is no marking of which episodes have been "reflected on" and no filter for unreflected ones.

`docs/mind-api.md` line 16: "`(dmn-fetch-unreflected n)` — up to N recent episodes"
`mind/helpers.ptc` line 79–80 docstring: "Return up to N most recent episodes (newest first). Nil/<=0 => all."

Both docstrings quietly drop the "unreflected" qualifier from the function name. The function name promises a filter that does not exist.

### Impact

A reflection turn that calls `(dmn-fetch-unreflected 10)` will re-process the same 10 episodes every time, including ones already reflected on. There is no way to mark an episode as "done". This means reflection is not idempotent and will produce ever-growing insight lists as the same episodes are re-processed.

### Fix

Either:

**(a)** Rename to `dmn-fetch-recent` and update docs to match. Simplest.

**(b)** Add a `:reflected? t` tag to episode meta and filter on it:

```lisp
(defun dmn-fetch-unreflected (n)
  (let ((acc nil) (i 0) (xs *episodic-buffer*))
    (while (and xs (or (null n) (<= n 0) (< i n)))
      (let ((meta (caddr (car xs))))
        (unless (and (consp meta) (assoc :reflected meta))
          (setq acc (cons (car xs) acc))
          (setq i (+ i 1))))
      (setq xs (cdr xs)))
    (nreverse acc)))

(defun dmn-mark-reflected (predicate)
  ;; mark episodes matching PREDICATE as reflected
  ...)
```

Then `dmn-apply-reflection` should mark the consumed episodes as reflected.

---

## F6 — `dmn-autobiography` ignores its argument

**Severity:** Medium
**Type:** Contract violation

### Evidence

`mind/mind-image.ptc` line 78:

```lisp
(defun dmn-autobiography (n) *autobiography*)
```

`n` is bound but never used. The function always returns the entire autobiography regardless of `n`.

`docs/mind-api.md` line 29: "`(dmn-autobiography n)` ... Arc / chapter readers"
`plan/P7-narrative-self.md` line 31: "`(dmn-autobiography n)` → readers"
`plan/P7-narrative-self.md` line 46 (exit criteria): "Cold start → autobiography non-empty → new chapter closed with episode refs"

### Impact

The advertised "fetch last N chapters" API does not exist. As the autobiography grows, this function will return unbounded data. No caller currently notices because the autobiography has only one chapter, but the API is misleading.

### Fix

```lisp
(defun dmn-autobiography (n)
  "Return up to N most recent chapters (newest first). Nil/<=0 => all."
  (if (or (null n) (<= n 0))
      *autobiography*
    (let ((acc nil) (i 0) (xs *autobiography*))
      (while (and xs (< i n))
        (setq acc (cons (car xs) acc))
        (setq xs (cdr xs))
        (setq i (+ i 1)))
      (nreverse acc))))
```

Note: this matches the pattern of `dmn-fetch-unreflected`. Consider extracting a shared `(take n xs)` helper into the prelude if more such functions appear.

---

## F7 — `update-self-schema` reverses new entries

**Severity:** Medium
**Type:** Subtle bug

### Evidence

`mind/mind-image.ptc` lines 21–29:

```lisp
(defun update-self-schema (new-map)
  (let ((old *self-schema*) (acc new-map))
    (while old
      (let ((k (car (car old))))
        (unless (assoc k new-map)
          (setq acc (cons (car old) acc))))
      (setq old (cdr old)))
    (setq *self-schema* (nreverse acc))
    *self-schema*))
```

Trace with `*self-schema* = ((:a . 1) (:b . 2))` and `new-map = ((:c . 3) (:d . 4))`:

1. `acc = ((:c . 3) (:d . 4))`
2. Iterate old. `(:a . 1)` not in new-map → `acc = ((:a . 1) (:c . 3) (:d . 4))`
3. `(:b . 2)` not in new-map → `acc = ((:b . 2) (:a . 1) (:c . 3) (:d . 4))`
4. `nreverse acc = ((:d . 4) (:c . 3) (:a . 1) (:b . 2))`

The new entries (`:c`, `:d`) are now in reverse order. Old entries (`:a`, `:b`) retain their order. `assoc` still works correctly (it returns the first match), but pretty-printing the schema via `(mis-schema)` will show entries in an order that depends on the history of `update-self-schema` calls.

### Impact

Functional correctness is preserved (alist lookups work regardless of order). But:
- Pretty-printed schema is non-deterministic across runs (depends on call order)
- Git diffs on `mind-image.ptc` will be noisy (entries shift around)
- Hard to scan a schema visually

### Fix

```lisp
(defun update-self-schema (new-map)
  "Merge NEW-MAP into *self-schema*; new keys take precedence; preserve order of new-map followed by old keys not in new-map."
  (let ((old *self-schema*) (acc nil))
    ;; new-map entries first, in order
    (setq acc new-map)
    ;; then old entries not overridden
    (while old
      (let ((k (car (car old))))
        (unless (assoc k new-map)
          (setq acc (append acc (list (car old))))))
      (setq old (cdr old)))
    (setq *self-schema* acc)
    *self-schema*))
```

Or use a destructive reverse at the end:

```lisp
(defun update-self-schema (new-map)
  (let ((old *self-schema*) (acc nil))
    (while old
      (let ((k (car (car old))))
        (unless (assoc k new-map)
          (setq acc (cons (car old) acc))))
      (setq old (cdr old)))
    ;; acc is old-not-in-new, reversed; new-map is in original order
    (setq *self-schema* (append new-map (nreverse acc)))
    *self-schema*))
```

---

## F8 — `appendTranscript` is non-atomic

**Severity:** Medium
**Type:** Crash safety

### Evidence

`bridge/eval.ts` lines 139–146:

```typescript
function appendTranscript(forms: string, path: string) {
  ensureMindDir();
  const stamp = new Date().toISOString();
  const block = `\n;; --- ${stamp} ---\n${forms.trim()}\n`;
  const prev = existsSync(path) ? readFileSync(path, "utf8") : "";
  writeFileSync(path, prev + block);
  console.error(`[mis] appended forms to ${path}`);
}
```

Read entire file into memory, concatenate, write back. If the process is killed (sandbox OOM, user Ctrl-C, machine reboot) between `readFileSync` and `writeFileSync` completing, the file can be left in one of these states:
- Empty (writeFileSync truncated then crashed before writing)
- Partial (truncated then wrote partial content)
- Original (crash before writeFileSync)
- New (crash after writeFileSync completed)

The bad states (empty, partial) corrupt the canonical mind image. There is no fsync, no temp-file-then-rename, no journal.

### Impact

A single ill-timed crash during `--save` can brick the mind image. The `--checkpoint` flag (lines 156–161) mitigates this by copying to `.prev.ptc` *before* the append — but `--checkpoint` is opt-in. The default `--save` is unsafe.

### Fix

Use atomic write via temp-file-rename:

```typescript
function appendTranscript(forms: string, path: string) {
  ensureMindDir();
  const stamp = new Date().toISOString();
  const block = `\n;; --- ${stamp} ---\n${forms.trim()}\n`;
  const prev = existsSync(path) ? readFileSync(path, "utf8") : "";
  const tmp = path + ".tmp";
  writeFileSync(tmp, prev + block);
  // fsync(tmp) — optional, requires fd
  renameSync(tmp, path);  // atomic on POSIX
  console.error(`[mis] appended forms to ${path}`);
}
```

`renameSync` is atomic on POSIX (single filesystem operation). On Windows it's atomic if the target doesn't exist; otherwise may fail. Since this is a sandbox tool, POSIX semantics can be assumed.

---

## F9 — Image-load swallows errors and silently drops subsequent forms

**Severity:** Medium
**Type:** Fragility

### Evidence

`bridge/eval.ts` lines 124–137:

```typescript
function loadImage(repl: MemoryRepl, path: string) {
  if (!existsSync(path)) {
    console.error(`[mis] no image at ${path} — starting fresh`);
    return;
  }
  const src = readFileSync(path, "utf8");
  if (!src.trim()) return;
  const { ok, output } = repl.eval(src);
  console.error(`[mis] loaded ${path} (${src.length} chars) ok=${ok}`);
  if (output.trim()) console.error(output.trim());
  if (!ok) {
    console.error(`[mis] warning: image load reported errors (definitions may be partial)`);
  }
}
```

`repl.eval(src)` calls `run(this.currentInterp, code)` which evaluates the entire image as one program. Upstream `run()` (in `lisp.ts`) evaluates top-level forms sequentially; if one throws `EvalException`, the rest are skipped and the exception propagates.

So if form #20 of 83 in `mind-image.ptc` throws, forms #21–83 are silently dropped on every reload. The user sees a "definitions may be partial" warning but doesn't know which definitions were lost.

### Impact

A single broken form (e.g. a multi-line docstring, which the learnings log says breaks the Reader) in the middle of the image silently drops everything after it. The mind appears to load (most helpers work) but specific later definitions are missing. This is exactly how F1 could have happened: if `dmn-reflect-pack` was ever in the image but a form before it broke, it would be silently dropped.

### Fix

Two-part fix:

**(a)** Evaluate the image form-by-form so a single failure doesn't drop the rest:

```typescript
function loadImage(repl: MemoryRepl, path: string) {
  if (!existsSync(path)) { /* ... */ return; }
  const src = readFileSync(path, "utf8");
  if (!src.trim()) return;
  // Split into top-level forms and eval each, recording failures
  const forms = splitTopLevelForms(src);  // need a helper
  const failures: {form: string, error: string}[] = [];
  for (const form of forms) {
    const { ok, output } = repl.eval(form);
    if (!ok) failures.push({form: form.slice(0, 60), error: output.trim()});
  }
  if (failures.length > 0) {
    console.error(`[mis] ${failures.length} form(s) failed during image load:`);
    for (const f of failures) console.error(`  - ${f.form}…: ${f.error}`);
  }
}
```

`splitTopLevelForms` requires a paren-depth scanner similar to `prevalidate`'s loop. Upstream's `Reader` already does tokenization; consider exposing a `splitForms(text: string): string[]` helper from upstream.

**(b)** Add a `--strict-load` flag that fails the bootstrap if any form in the image errors. This makes regressions like F1 impossible to miss.

---

## F10 — Ignored upstream features

**Severity:** Medium
**Type:** Missed opportunity

### Evidence

The fork vendors `lisp.ts` and `arith.ts` from upstream but does not use:

| Upstream feature | Where | What it does | Fork status |
|------------------|-------|--------------|-------------|
| `stripProse(text)` | `lisp.ts` line ~1790 | Blanks non-form text so prose mixed with Lisp is ignored, keeping line numbers stable | Not used; fork's `prevalidate` rejects prose-containing input |
| `AgentRepl` class | `packages/repl/src/repl.ts` line 134 | Adds `setConversationVars()` (inject chat as Lisp globals) and `takeFinished()` (prose-only eval signals loop end) | Not used; fork's `MemoryRepl` has neither |
| `import` form | `lisp.ts` line ~1100 | `(import "path")` reads & evaluates a Lisp file in the current env, with cycle detection | Not used; `mind-image.ptc` is one monolithic file |
| `dump` form | `lisp.ts` | `(dump)` returns list of all global symbols | Not used; fork maintains `*mis-known*` manually |
| `doc` form | `lisp.ts` | `(doc 'name)` prints signature + docstring; `(doc)` lists all docs | Not used; fork has `docs/mind-api.md` as a static doc |
| `defineGlobal(sym, value, doc?)` | `lisp.ts` | API to inject host-side state with documentation | Not used; fork could inject `*today*`, `*session-id*`, etc. |
| `secretsExtension()` | `packages/interpreter/src/secrets.ts` | Taint-tracked secret redaction | Not used; fork uses `extensions: []` (defensible — see ADR 0003) |
| `mcpExtension()` | `packages/interpreter/src/mcp.ts` | MCP tool loading | Not used (defensible — see ADR 0003) |
| `checkSyntax(text)` | `lisp.ts` | Static syntax check, returns `SyntaxError_[]` | Not used; fork's `prevalidate` is a weaker paren-depth check |
| 17 vitest spec files | `packages/interpreter/test/*.test.ts` | Reader, grammar, prose, macros, recursion, errors, etc. | Not vendored; fork has no tests |

### Impact

Each missed feature is a small loss, but together they mean the fork is reimplementing or working around the upstream layer rather than building on it. The most consequential omissions:

1. **No conversation vars.** Grok must manually serialize user input into Lisp strings to log episodes. With `setConversationVars({conversation: [...]})`, the mind could read the recent chat directly.
2. **No `import`.** The mind image is one file. As P7–P11 add state, it will become hard to manage.
3. **No `dump`.** `*mis-known*` is manually maintained and has already drifted (F1).
4. **No tests.** Regressions like F1, F2, F3 would have been caught by a 50-line smoke test.

### Fix

See recommendations R3, R5, R8 in `05-RECOMMENDATIONS.md`.

---

## F11 — `VERIFICATION.md` is stale

**Severity:** Low
**Type:** Stale artifact

### Evidence

`docs/VERIFICATION.md` line 24: `(mis-version)` returns `"mis-helpers-0.2"`
`mind/mind-image.ptc` line 1: `(defun mis-version () ... "mis-helpers-0.3")`

`docs/VERIFICATION.md` line 30: `(half 8)` returns `4.0`
Fork `src/arith.ts` line 24–26: `convertToString(x) = x.toString()` — would print `4`, not `4.0`

The verification was run with an older version of the helpers and with upstream `arith.ts` (which has the `.0` rule). The current fork's `arith.ts` would produce different output.

### Fix

After fixing F4 (revert to upstream `arith.ts`), re-run the verification script and update `VERIFICATION.md` with current output. Add a CI step (or pre-commit hook) that runs the verification and fails if output drifts.

---

## F12 — `prevalidate` regex is narrow

**Severity:** Low
**Type:** Code smell

### Evidence

`bridge/eval.ts` lines 48–77. The symbol regex on line 51:

```
/^[a-zA-Z_*?!+\-*/<>=][\w\-?!*]*$/
```

Subsequent characters allowed: `\w` (word chars), `-`, `?`, `!`, `*`. Does NOT allow `+`, `/`, `<`, `>`, `=` in non-initial position, nor `:`, `>`, `-` followed by `>`.

So valid lisptc atoms like `string->symbol`, `:keyword`, `<=`, `>=`, `1+`, `1-` would fail this regex.

The inner check `if (/\s/.test(trimmed) && !trimmed.startsWith('"'))` only rejects if there's whitespace AND it doesn't start with `"`. So these atoms (no whitespace) pass through to eval. No false negative, but the regex is misleadingly narrow and would mislead a future maintainer.

### Fix

Either remove the regex (rely on the paren-depth check and let eval handle atom parsing) or expand it:

```
/^[a-zA-Z_*?!+\-*/<>=:][\w\-?!*+/<>=:]*$/
```

Better: use upstream's `tokenPattern()` (exported from `lisp.ts`) for consistency.

---

## F13 — Single squashed commit

**Severity:** Low
**Type:** Process

### Evidence

```
$ git log --oneline --all
02c1e49 docs(review): specify MiS OSS-DMN protocol architecture
```

One commit. No history of how F1, F2, F3 were introduced. No bisect capability.

### Fix

Going forward, commit incrementally. Even if squashing before publishing, keep an internal branch with full history. Tag releases.

---

## F14 — Failure log is ephemeral

**Severity:** Low
**Type:** Ops gap

### Evidence

`bridge/eval.ts` line 39: `const FAILURES_LOG = join(MIND_DIR, "mind-failures.log");`
`scripts/push-mind-image.sh` lines 11: `git -C "$REPO_ROOT" add mind/mind-image.ptc mind/helpers.ptc 2>/dev/null || true` — does not add `mind-failures.log`.

The failure log accumulates during a session but is not committed. On sandbox reset, the audit trail of past failures is lost.

### Fix

Either commit `mind-failures.log` (it's small, append-only, and useful for debugging) or document that it's intentionally ephemeral and provide a `scripts/dump-failures.sh` that prints it before sandbox teardown.
