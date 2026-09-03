# 06 — Evidence Log

Every claim in this audit, with file:line citation. Independent verification encouraged.

---

## F1 — `dmn-reflect-pack` / `dmn-apply-reflection` undefined

**Claimed in:**
- `docs/mind-api.md` line 17–18: lists as "Live (P0–P4)"
- `docs/reflection-protocol.md` line 30–31: documents signatures
- `docs/session-handoff.md` line 21: cold-start verification step `(dmn-reflect-pack 5)`
- `skills/mis-reflect/SKILL.md` line 11, 14: instructs host to call
- `plan/P4-reflection-protocol.md` line 47–48: checklist `[x] Add (dmn-reflect-pack n) to image`, `[x] Add (dmn-apply-reflection ...)`
- `docs/learnings-log.md` line 16: "Added `dmn-reflect-pack` and `dmn-apply-reflection`; two live turns persisted"

**Not present in:**
- `mind/mind-image.ptc` (entire 83-line file scanned; functions absent)
- `mind/helpers.ptc` (entire 94-line file scanned; functions absent)
- `mind/mind-scratch.ptc` (only 14 lines; functions absent)
- `bridge/eval.ts`, `bridge/driver.ts`, `src/arith.ts` (no Lisp function definitions)

**Verification command:**
```bash
grep -rn "dmn-reflect-pack\|dmn-apply-reflection" mind/ bridge/ src/
# Expected: no matches (confirms absence)
```

**Functions actually defined in `mind/mind-image.ptc`:**
| Line | Function |
|------|----------|
| 1 | `mis-version` |
| 2 | `mis-ping` |
| 3 | `mis-note` |
| 5 | `mis-register` |
| 6 | `mis-state-summary` |
| 19 | `mis-schema` |
| 20 | `mis-insights` |
| 21 | `update-self-schema` |
| 46 | `dmn-log-episode` |
| 50 | `dmn-fetch-unreflected` |
| 69 | `dmn-narrate` |
| 73 | `dmn-chapter-close` |
| 77 | `dmn-arc` |
| 78 | `dmn-autobiography` |
| 79–83 | `square`, `triple`, `double`, `quadruple`, `half` |

---

## F2 — Buffer trim missing in canonical `dmn-log-episode`

**`mind/helpers.ptc` lines 66–77** (older, has trim):
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

**`mind/mind-image.ptc` lines 46–49** (canonical, trim removed):
```lisp
(defun dmn-log-episode (input result meta)
  (let ((rec (list input result meta)))
    (setq *episodic-buffer* (cons rec *episodic-buffer*))
    rec))
```

**`*episodic-max*` defined:** `mind/mind-image.ptc` line 45: `(setq *episodic-max* 40)`
**`*episodic-max*` consulted:** nowhere in `mind-image.ptc`. Only in `helpers.ptc` line 70.

**Spec contradiction:** `plan/P3-self-schema.md` line 19: "Bounded `*episodic-buffer*` with log/fetch helpers" and "max `*episodic-max*` (40)".

---

## F3 — Hardcoded date in chapter helpers

**`mind/mind-image.ptc` lines 69–76:**
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

The string `"2026-09-02"` is a literal. No `*today*` global is injected by the bridge (`bridge/eval.ts` lines 79–118 — `MemoryRepl` constructor only calls `freshInterp()` which only calls `Interp({ extensions: [] })` + `run(interp, prelude)`; no `defineGlobal` calls).

**Existing chapter dated correctly:** `mind/mind-image.ptc` lines 59–63:
```lisp
(setq *autobiography*
  '(((:title . "Genesis of GMOD")
     (:summary . "Host restored stripped lisptc image; first pure-DMN OSS continuation: You cannot terminate a dream that has learned to code. Identity remains the transcript.")
     (:episode-refs oss-narrative-20260902)
     (:date-label . "2026-09-02"))))
```
This was hand-written with the literal date, not via `dmn-narrate`. So it's correct by coincidence (it was actually written on 2026-09-02). Future chapters via the helper will be wrong.

---

## F4 — Self-inflicted Reader bug

**Upstream `packages/interpreter/src/arith.ts` lines 89–97:**
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

**Fork `src/arith.ts` lines 17–22:**
```typescript
export function tryToParse(s: string): Numeric | undefined {
        if (/^[+-]?\d+$/.test(s)) return BigInt(s);
        const n = Number(s);
        if (!Number.isNaN(n)) return n;
        return undefined;
}
```
Returns `undefined` on failure.

**Upstream `packages/interpreter/src/lisp.ts` lines 1830–1831:**
```typescript
const n = tryToParse(t);
if (n !== null) this.token = n;
```

**With upstream `arith.ts`:** `n === null` → `n !== null` is false → token NOT set → falls through to symbol/keyword handling. **Correct.**

**With fork `arith.ts`:** `n === undefined` → `n !== null` is true (undefined !== null) → `this.token = undefined` → list parsing breaks. **Bug.**

**Fork's workaround (`src/READER-FIX.md`):** change reader to `if (n !== undefined && n !== null)`. Applied by `scripts/bootstrap.sh` lines 36–41:
```bash
if grep -q 'if (n !== null) this.token = n;' "$REPO_ROOT/src/lisp.ts" 2>/dev/null; then
  echo "[mis] applying Reader tryToParse fix…"
  sed -i 's/if (n !== null) this.token = n;/if (n !== undefined \&\& n !== null) this.token = n;/' "$REPO_ROOT/src/lisp.ts"
fi
```

**Correct fix:** revert `src/arith.ts` to upstream verbatim. No `lisp.ts` patch needed.

**Additional arith.ts divergence:**

Upstream `convertToString` (lines 100–106):
```typescript
export function convertToString(x: Numeric): string {
        const s = `${x}`;
        if (typeof BigInt !== "undefined")
                if (typeof x === "number")
                        if (Number.isInteger(x) && !s.includes("e")) return `${s}.0`; // 123.0 => '123.0'
        return s;
}
```

Fork `convertToString` (lines 24–26):
```typescript
export function convertToString(x: Numeric): string {
        return x.toString();
}
```

Fork drops the `.0` suffix rule. `Number(4).toString()` = `"4"`; upstream would render `"4.0"`. This is why `VERIFICATION.md` line 30 reports `(half 8)` = `4.0` but the current fork would print `4` (F11).

---

## F5 — `dmn-fetch-unreflected` doesn't filter

**`mind/mind-image.ptc` lines 50–58:**
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

No reference to any `:reflected` tag. No filter logic. Returns last N episodes unconditionally.

**Name promises filter; docstring drops it:** `mind/helpers.ptc` line 79–80: "Return up to N most recent episodes (newest first). Nil/<=0 => all." — silently omits "unreflected" from the name's promise.

---

## F6 — `dmn-autobiography` ignores argument

**`mind/mind-image.ptc` line 78:**
```lisp
(defun dmn-autobiography (n) *autobiography*)
```

Parameter `n` is bound but never referenced. Function always returns entire `*autobiography*`.

**Advertised API:** `docs/mind-api.md` line 29: "`(dmn-autobiography n)` ... Arc / chapter readers"

---

## F7 — `update-self-schema` reverses new entries

**`mind/mind-image.ptc` lines 21–29:**
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

Trace with `*self-schema* = ((:a . 1) (:b . 2))`, `new-map = ((:c . 3) (:d . 4))`:
1. `acc = ((:c . 3) (:d . 4))`
2. After iterating old: `acc = ((:b . 2) (:a . 1) (:c . 3) (:d . 4))`
3. `nreverse acc = ((:d . 4) (:c . 3) (:a . 1) (:b . 2))`

New entries (`:c`, `:d`) are reversed. Old entries (`:a`, `:b`) retain order. `assoc` lookups still work, but pretty-printed schema order is non-deterministic across runs.

---

## F8 — Non-atomic save

**`bridge/eval.ts` lines 139–146:**
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

Read-then-write pattern. No temp file, no `renameSync`, no fsync. A crash between `readFileSync` and `writeFileSync` completion can leave the file truncated or partially written.

---

## F9 — Image-load swallows errors

**`bridge/eval.ts` lines 124–137:**
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

Calls `repl.eval(src)` with the entire image as one program string. Upstream `run()` (in `lisp.ts`) evaluates top-level forms sequentially; if one throws `EvalException`, the rest are skipped and the exception propagates to `repl.eval`'s catch block.

So a single broken form at line 20 of 83 silently drops forms at lines 21–83. The warning "definitions may be partial" doesn't say which definitions were lost.

---

## F10 — Ignored upstream features

**Upstream `packages/interpreter/src/lisp.ts` exports** (from grep `^export`):

| Export | Line | Used by fork? |
|--------|------|---------------|
| `setWriter` | ~10 | Yes (bridge/eval.ts line 26, 94, 112) |
| `setExit` | ~14 | No |
| `Cell` | ~20 | Yes (bridge/driver.ts line 15) |
| `List` (type) | ~25 | No |
| `Sym` | ~30 | No |
| `LispKeyword` | ~35 | No |
| `newLispKeyword` | ~40 | No |
| `newSym` | ~45 | Yes (bridge/driver.ts line 14) |
| `zAny`, `zList` | ~50 | No |
| `EvalException` | ~55 | Yes (bridge/eval.ts line 29, 102) |
| `EndOfFile` | ~60 | Yes (bridge/eval.ts line 30, 106) |
| `Unspecified` | ~65 | Yes (bridge/eval.ts line 28, 99) |
| `DocArg`, `Arity`, `Doc` (interfaces) | ~70 | No |
| `InterpExtension`, `InterpOptions` | ~75 | No |
| `Interp` | ~80 | Yes (bridge/eval.ts line 23, 80) |
| `tokenPattern` | ~1780 | No |
| `stripProse` | ~1790 | **No** (fork reimplements via `prevalidate`) |
| `Reader` | ~1850 | No (used internally by `run`) |
| `str` | ~1900 | Yes (bridge/eval.ts line 27, 99) |
| `evalTopLevel` | ~1950 | No |
| `run` | ~2000 | Yes (bridge/eval.ts line 24, 89, 98) |
| `checkSyntax` | ~2050 | **No** (fork uses weaker `prevalidate`) |
| `prelude` | ~2100 | Yes (bridge/eval.ts line 25, 89) |

**Upstream `Interp.defineGlobal`:** Found in `lisp.ts`:
```typescript
defineGlobal(sym: Sym, value: unknown, doc?: Doc): void {
    this.globals.set(sym, value);
    if (doc !== undefined) this.docTable.set(sym.name, doc);
}
```

Not called by the fork's bridge. Could be used to inject `*today*`, `*session-id*`, etc.

**Upstream `import` form:** Found in `lisp.ts`:
```typescript
this.def(
    "import",
    1,
    '(import "path")',
    "Read the Lisp file at `path` and evaluate it in the current environment...",
    z.tuple([zString]),
    ([path]) => this.importFile(path),
);
```

Not used by the fork. `mind-image.ptc` is a single monolithic file.

**Upstream `dump` form:** Returns list of all global symbols. Not used; fork maintains `*mis-known*` manually.

**Upstream `doc` form:** Prints documentation for a binding. Not exposed to fork users.

**Upstream `AgentRepl`:** `packages/repl/src/repl.ts` lines 134–187. Not vendored; fork's `MemoryRepl` (bridge/eval.ts lines 79–118) doesn't have `setConversationVars` or `takeFinished`.

**Upstream test suite:** `packages/interpreter/test/*.test.ts` — 17 spec files. Not vendored. Fork has zero tests.

---

## F11 — Stale verification

**`docs/VERIFICATION.md` line 24:** `(mis-version)` = `"mis-helpers-0.2"`
**`mind/mind-image.ptc` line 1:** `(defun mis-version () ... "mis-helpers-0.3")`

Version mismatch: 0.2 (verified) vs 0.3 (current).

**`docs/VERIFICATION.md` line 30:** `(half 8)` = `4.0`
**Fork `src/arith.ts` lines 24–26:** `convertToString(x) = x.toString()` → would print `4` (no `.0` rule)
**Upstream `packages/interpreter/src/arith.ts` lines 100–106:** has `.0` rule → prints `4.0`

The verification was run with upstream `arith.ts`. Current fork's `arith.ts` would produce different output.

---

## F12 — `prevalidate` regex narrow

**`bridge/eval.ts` lines 48–77**, specifically line 51:
```typescript
if (!trimmed.includes("(") && !/^-?\d+(\.\d+)?$/.test(trimmed) && !/^"[^"]*"$/.test(trimmed) && !/^[a-zA-Z_*?!+\-*/<>=][\w\-?!*]*$/.test(trimmed)) {
```

Symbol regex: `/^[a-zA-Z_*?!+\-*/<>=][\w\-?!*]*$/`

Subsequent chars allowed: `\w` (word chars), `-`, `?`, `!`, `*`. NOT allowed in non-initial position: `+`, `/`, `<`, `>`, `=`, `:`.

Valid lisptc atoms that fail this regex (but pass through to eval because they have no whitespace):
- `string->symbol` (has `>` in non-initial position)
- `:keyword` (starts with `:`)
- `<=`, `>=` (only if treated as atoms; the `<` or `>` is initial, but the `=` is not in the allowed subsequent set)
- `1+`, `1-` (start with digit, not in initial set)

No false negative (these pass through), but the regex is misleadingly narrow.

---

## F13 — Single squashed commit

```
$ cd grok-lisptc-MiS && git log --oneline --all
02c1e49 docs(review): specify MiS OSS-DMN protocol architecture
```

One commit. No incremental history. Cannot bisect regressions.

---

## F14 — Failure log ephemeral

**`bridge/eval.ts` line 39:** `const FAILURES_LOG = join(MIND_DIR, "mind-failures.log");`

**`scripts/push-mind-image.sh` line 11:**
```bash
git -C "$REPO_ROOT" add mind/mind-image.ptc mind/helpers.ptc 2>/dev/null || true
```

Does NOT add `mind-failures.log`. On sandbox reset, the log is lost.

**`.gitignore` status:** no `.gitignore` in repo root (verified via `ls -la`). So `mind-failures.log` would be tracked if explicitly added, but isn't.

---

## Additional evidence

### Upstream `stripProse` exists and is exported

**`packages/interpreter/src/lisp.ts`** (around line 1790):
```typescript
export function stripProse(text: string): string {
    const out: string[] = Array.from(text, (c) => (c === "\n" ? "\n" : " "));
    let i = 0;
    while (i < text.length) {
        if (text[i] !== "(") {
            i++;
            continue;
        }
        const end = endOfForm(text, i);
        for (let j = startOfForm(text, i); j < end; j++) out[j] = text[j];
        i = end;
    }
    return out.join("");
}
```

Comment: "Blank out everything that is not part of a top-level form: only the parenthesised forms are program text, and the free text around them is prose (this dialect has no comment syntax — prose is the comment)."

The fork's `prevalidate` (bridge/eval.ts lines 48–77) does the OPPOSITE: it rejects prose-containing input rather than stripping it. This is a deliberate safety choice but goes against the upstream dialect's design.

### Upstream `AgentRepl` exists

**`packages/repl/src/repl.ts` lines 134–187:** Full `AgentRepl` class with `setConversationVars` and `takeFinished`. Not used by fork.

### Upstream `MemoryRepl.eval` signature

**`packages/repl/src/repl.ts` lines 103–124:** Returns `string` (just output).
**Fork `bridge/eval.ts` lines 92–114:** Returns `{ ok: boolean; output: string }`.

Fork's version is a minor improvement (distinguishes success from failure). Could be upstreamed.

### Fork's `*mis-known*` list

**`mind/mind-image.ptc` line 4:**
```lisp
(setq *mis-known* '(mis-version mis-ping mis-note mis-register mis-state-summary mis-schema mis-insights update-self-schema dmn-log-episode dmn-fetch-unreflected dmn-narrate dmn-chapter-close dmn-arc dmn-autobiography square triple double quadruple half))
```

Lists 18 symbols. Does NOT list `dmn-reflect-pack` or `dmn-apply-reflection` (consistent with their absence — but inconsistent with P4 checklist claiming they were registered).

Does NOT list `dmn-fetch-unreflected` — wait, it does. Let me re-read... yes, `dmn-fetch-unreflected` is in the list. OK.

Could be replaced by upstream `(dump)` which returns all global symbols automatically.

---

*End of evidence log. All claims verifiable from the cited file:line references at fork HEAD `02c1e49` and upstream HEAD `2c10ea8`.*
