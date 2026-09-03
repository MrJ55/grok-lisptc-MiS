# 05 — Recommendations

Prioritized actionable recommendations. Each has a severity, effort estimate, and concrete patch or file reference.

---

## R1 — Fix F1: Implement `dmn-reflect-pack` and `dmn-apply-reflection`

**Severity:** Critical
**Effort:** 30 minutes

Add to `mind/mind-image.ptc` (after `dmn-fetch-unreflected`):

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

Also add `dmn-reflect-pack` and `dmn-apply-reflection` to the `*mis-known*` list on line 4.

Verify:
```bash
cd /tmp/mis
node --experimental-transform-types --no-warnings bridge/eval.ts '(dmn-reflect-pack 5)'
node --experimental-transform-types --no-warnings bridge/eval.ts --save \
  '(dmn-apply-reflection (quote (test-insight)) "test reflection" "2026-09-04-test")'
```

---

## R2 — Fix F2: Restore buffer trim in `dmn-log-episode`

**Severity:** High
**Effort:** 10 minutes

Replace `mind/mind-image.ptc` lines 46–49 with:

```lisp
(defun dmn-log-episode (input result meta)
  "Push episode (input result meta) newest-first; trim to *episodic-max*; return record."
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

(This is the version already in `mind/helpers.ptc` lines 66–77. Consider whether `helpers.ptc` should be deleted or imported — see R5.)

Verify by logging 50 episodes and checking `*episodic-buffer*` length stays at 40.

---

## R3 — Fix F3: Inject `*today*` from the bridge

**Severity:** High
**Effort:** 20 minutes

In `bridge/eval.ts`, after constructing the `MemoryRepl` (line 203) and before loading the image (line 204), inject a `*today*` global:

```typescript
import { newSym } from "./driver.ts";  // already exported
// ... in the main flow, after `const repl = new MemoryRepl();`:
(repl.interp as any).defineGlobal(newSym("*today*"), new Date().toISOString().slice(0, 10));
```

Actually, looking at `bridge/driver.ts` line 5–16, `newSym` is already exported. So the import is fine. But `defineGlobal` is a method on `Interp`, and the fork's `MemoryRepl.interp` getter returns `InstanceType<typeof Interp>`. The method should be accessible.

Better: add a `hostGlobals()` helper:

```typescript
function injectHostGlobals(interp: InstanceType<typeof Interp>) {
  interp.defineGlobal(newSym("*today*"), new Date().toISOString().slice(0, 10));
  interp.defineGlobal(newSym("*now*"), new Date().toISOString());
  interp.defineGlobal(newSym("*session-id*"), process.env.MIS_SESSION_ID || "unknown");
}
```

Call it after `freshInterp()` in `MemoryRepl` (line 87–91):

```typescript
freshInterp() {
  const interp = new Interp({ extensions: [] });
  run(interp, prelude);
  injectHostGlobals(interp);
  return interp;
}
```

Then update `mind/mind-image.ptc` `dmn-narrate` and `dmn-chapter-close` (lines 69–76) to use `*today*` instead of `"2026-09-02"`:

```lisp
(defun dmn-narrate (summary title)
  (let ((ch (list (cons :title title) (cons :summary summary) (cons :date-label *today*))))
    (setq *autobiography* (append *autobiography* (list ch)))
    ch))

(defun dmn-chapter-close (title summary refs)
  (let ((ch (list (cons :title title) (cons :summary summary) (cons :episode-refs refs) (cons :date-label *today*))))
    (setq *autobiography* (append *autobiography* (list ch)))
    ch))
```

Verify:
```bash
node --experimental-transform-types --no-warnings bridge/eval.ts --save \
  '(dmn-narrate "test chapter" "Test")'
node --experimental-transform-types --no-warnings bridge/eval.ts '(dmn-autobiography 1)'
# Should show :date-label "2026-09-04" (or whatever today is)
```

---

## R4 — Fix F4: Revert `src/arith.ts` to upstream

**Severity:** High
**Effort:** 15 minutes

1. Delete `src/arith.ts` (or replace with upstream content from `https://raw.githubusercontent.com/1hachem/lisptc/main/packages/interpreter/src/arith.ts`).
2. Delete `src/READER-FIX.md`.
3. In `scripts/bootstrap.sh`, delete lines 36–41 (the sed patch).
4. Re-run `bash scripts/bootstrap.sh` and verify smoke test passes.
5. Re-run `VERIFICATION.md` scenarios and update with actual output (fixes F11).

After this, the `bootstrap.sh` becomes simpler (no patch step), `src/` is just `README.md` + `arith.ts` (vendored verbatim), and the `lisp.ts` curl is the only runtime fetch.

**Strongly recommended:** Also vendor `src/lisp.ts` directly into the repo (currently fetched at bootstrap). This eliminates the runtime network dependency and makes the hash in `docs/UPSTREAM.md` verifiable. The file is ~73 KB; trivial for git.

---

## R5 — Vendor `src/lisp.ts` directly into the repo

**Severity:** Medium (security + reproducibility)
**Effort:** 5 minutes

```bash
cd /home/z/my-project/repos/grok-lisptc-MiS  # or your clone
curl -fsSL -o src/lisp.ts \
  https://raw.githubusercontent.com/1hachem/lisptc/2c10ea8ed6edb16e065b746a7f52080956b895de/packages/interpreter/src/lisp.ts
sha256sum src/lisp.ts  # verify against docs/UPSTREAM.md
git add src/lisp.ts
git commit -m "vendor(src): pin lisp.ts at upstream 2c10ea8"
```

Pin to the specific commit SHA (not `main`) so future upstream changes don't silently break the fork. Update `scripts/bootstrap.sh` to prefer the vendored copy (it already does, line 17–26) and remove the curl fallback (or keep it as an emergency escape hatch with a warning).

Update `docs/UPSTREAM.md` to reflect that `src/lisp.ts` is now in the repo.

---

## R6 — Fix F5: Rename `dmn-fetch-unreflected` or implement the filter

**Severity:** Medium
**Effort:** 15 minutes (rename) or 1 hour (implement filter)

**Option A (rename):**

```bash
# In mind/mind-image.ptc, rename dmn-fetch-unreflected → dmn-fetch-recent
# Update *mis-known*, docs/mind-api.md, docs/reflection-protocol.md, skills/mis-reflect/SKILL.md
```

**Option B (implement filter):**

```lisp
(defun dmn-fetch-unreflected (n)
  "Return up to N episodes not yet marked :reflected. Nil/<=0 => all unreflected."
  (let ((acc nil) (i 0) (xs *episodic-buffer*))
    (while (and xs (or (null n) (<= n 0) (< i n)))
      (let ((meta (caddr (car xs))))
        (unless (and (consp meta) (assoc :reflected meta))
          (setq acc (cons (car xs) acc))
          (setq i (+ i 1))))
      (setq xs (cdr xs)))
    (nreverse acc)))

(defun dmn-mark-reflected (predicate)
  "Mark episodes matching PREDICATE as :reflected. PREDICATE is a Lisp function taking an episode, returning non-nil."
  (setq *episodic-buffer*
    (mapcar
      (lambda (ep)
        (if (funcall predicate ep)
            (let ((meta (caddr ep)))
              (if (and (consp meta) (assoc :reflected meta))
                  ep
                (list (car ep) (cadr ep) (append meta (list (cons :reflected t))))))
          ep))
      *episodic-buffer*)))
```

Then `dmn-apply-reflection` should call `(dmn-mark-reflected (lambda (ep) ...))` to mark the consumed episodes.

Note: lisptc may not have `mapcar` — check the prelude. If not, use a `while` loop.

**Recommendation:** Option A is simpler and honest. Option B is more correct but requires more design. Do Option A now; revisit Option B when P6 (evaluation) needs it.

---

## R7 — Fix F6: Make `dmn-autobiography` honor its argument

**Severity:** Medium
**Effort:** 10 minutes

Replace `mind/mind-image.ptc` line 78:

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

---

## R8 — Add a smoke test

**Severity:** High (process)
**Effort:** 1 hour

Create `scripts/smoke-test.sh`:

```bash
#!/usr/bin/env bash
# Smoke test: verify documented cold-start protocol works.
set -euo pipefail

bash "$(dirname "$0")/bootstrap.sh"
cd /tmp/mis

run() {
  local desc="$1"; shift
  local expected_exit="$1"; shift
  local actual
  set +e
  actual=$(node --experimental-transform-types --no-warnings bridge/eval.ts "$@" 2>&1)
  local rc=$?
  set -e
  if [[ $rc -ne "$expected_exit" ]]; then
    echo "FAIL: $desc (expected exit $expected_exit, got $rc)"
    echo "  output: $actual"
    exit 1
  fi
  echo "PASS: $desc"
}

# Core helpers
run "(mis-version)" 0 '(mis-version)'
run "(mis-ping)" 0 '(mis-ping)'
run "(mis-state-summary)" 0 '(mis-state-summary)'
run "(mis-schema)" 0 '(mis-schema)'
run "(mis-insights)" 0 '(mis-insights)'

# Episodic buffer
run "(dmn-log-episode)" 0 '(dmn-log-episode "test" "result" nil)'
run "(dmn-fetch-unreflected 5)" 0 '(dmn-fetch-unreflected 5)'

# Reflection (will FAIL until R1 is applied)
run "(dmn-reflect-pack 5)" 0 '(dmn-reflect-pack 5)'

# Autobiography
run "(dmn-arc)" 0 '(dmn-arc)'
run "(dmn-autobiography 1)" 0 '(dmn-autobiography 1)'

# Math helpers
run "(square 5)" 0 '(square 5)'
run "(half 8)" 0 '(half 8)'

# Safety: prose should be rejected (exit 2)
run "prose rejected" 2 'this is prose not lisp'
run "unbalanced rejected" 2 '(+ 1 2'

echo ""
echo "All smoke tests passed."
```

Add to CI (`.github/workflows/smoke.yml`):

```yaml
name: smoke
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22' }
      - run: bash scripts/smoke-test.sh
```

This would have caught F1, F2, F3, F6, F7 instantly.

---

## R9 — Fix F8: Atomic save

**Severity:** Medium
**Effort:** 15 minutes

Replace `appendTranscript` in `bridge/eval.ts` lines 139–146:

```typescript
function appendTranscript(forms: string, path: string) {
  ensureMindDir();
  const stamp = new Date().toISOString();
  const block = `\n;; --- ${stamp} ---\n${forms.trim()}\n`;
  const prev = existsSync(path) ? readFileSync(path, "utf8") : "";
  const tmp = `${path}.tmp.${process.pid}`;
  writeFileSync(tmp, prev + block);
  // Optional: fsync for durability
  // const fd = openSync(tmp, "r"); fsyncSync(fd); closeSync(fd);
  renameSync(tmp, path);  // atomic on POSIX
  console.error(`[mis] appended forms to ${path}`);
}
```

Add `renameSync` to the imports on line 18.

---

## R10 — Fix F9: Form-by-form image load

**Severity:** Medium
**Effort:** 1 hour

Replace `loadImage` in `bridge/eval.ts` lines 124–137:

```typescript
function splitTopLevelForms(src: string): string[] {
  const forms: string[] = [];
  let depth = 0;
  let inStr = false;
  let escape = false;
  let start = 0;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (escape) escape = false;
      else if (c === "\\") escape = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') inStr = true;
    else if (c === "(") {
      if (depth === 0) start = i;
      depth++;
    } else if (c === ")") {
      depth--;
      if (depth === 0) {
        forms.push(src.slice(start, i + 1));
      }
    }
  }
  return forms;
}

function loadImage(repl: MemoryRepl, path: string) {
  if (!existsSync(path)) {
    console.error(`[mis] no image at ${path} — starting fresh`);
    return;
  }
  const src = readFileSync(path, "utf8");
  if (!src.trim()) return;
  const forms = splitTopLevelForms(src);
  let failures = 0;
  for (let i = 0; i < forms.length; i++) {
    const { ok, output } = repl.eval(forms[i]);
    if (!ok) {
      failures++;
      console.error(`[mis] form ${i + 1}/${forms.length} failed: ${output.trim()}`);
      console.error(`[mis]   form was: ${forms[i].slice(0, 80)}${forms[i].length > 80 ? "…" : ""}`);
    }
  }
  console.error(`[mis] loaded ${path} (${src.length} chars, ${forms.length} forms, ${failures} failures)`);
  if (failures > 0) {
    console.error(`[mis] WARNING: ${failures} form(s) failed during image load — mind may be partial`);
  }
}
```

This way, a single broken form doesn't drop the rest. Each failure is reported with form index and content, making debugging trivial.

---

## R11 — Use upstream `AgentRepl` and conversation vars

**Severity:** Medium (architectural improvement)
**Effort:** 2 hours

Vendor `packages/repl/src/repl.ts` from upstream into `bridge/repl.ts`, modified to use `extensions: []`:

```typescript
// bridge/repl.ts — adapted from upstream packages/repl/src/repl.ts
import { Interp, prelude, run, setWriter, str, Unspecified, EvalException, EndOfFile, newSym } from "./driver.ts";

export class MemoryRepl {
  // ... (copy from upstream, change extensions: [secretsExtension(), mcpExtension()] to extensions: [])
}

export class AgentRepl extends MemoryRepl {
  // ... (copy from upstream verbatim)
}
```

Then in `bridge/eval.ts`, use `AgentRepl` instead of the fork's `MemoryRepl`:

```typescript
import { AgentRepl } from "./repl.ts";

// ... in main flow:
const repl = new AgentRepl();
repl.setConversationVars({
  conversation: [],  // host can populate this from chat context
  userMessages: [],
  assistantMessages: [],
});
```

This gives the mind read-only access to `conversation`, `user-messages`, `assistant-messages` as Lisp globals. Grok can then write forms like:

```lisp
(dmn-log-episode (car (last user-messages)) "result" nil)
```

instead of manually serializing the user input.

**Note:** This is a larger change. Consider deferring until after R1–R10 are done.

---

## R12 — Use upstream `import` to modularize the mind image

**Severity:** Low (maintainability)
**Effort:** 1 hour

Split `mind/mind-image.ptc` into:

```
mind/
  mind-image.ptc          ;; loader: (import "helpers.ptc") (import "schema.ptc") ...
  helpers.ptc             ;; mis-version, mis-ping, mis-note, mis-register, mis-state-summary
  schema.ptc              ;; *self-schema*, update-self-schema, mis-schema, mis-insights
  episodes.ptc            ;; *episodic-buffer*, *episodic-max*, dmn-log-episode, dmn-fetch-unreflected, dmn-reflect-pack, dmn-apply-reflection
  autobiography.ptc       ;; *autobiography*, *narrative-arc*, dmn-narrate, dmn-chapter-close, dmn-arc, dmn-autobiography
  arithmetic.ptc          ;; square, triple, double, quadruple, half
```

The loader (`mind-image.ptc`) becomes:

```lisp
;; MiS mind image — loader
;; Order matters: helpers first, then state, then functions that depend on state.
(import "mind/helpers.ptc")
(import "mind/schema.ptc")
(import "mind/episodes.ptc")
(import "mind/autobiography.ptc")
(import "mind/arithmetic.ptc")
```

Wait — `import` resolves paths relative to the importing file's directory. So `mind-image.ptc` in `mind/` would resolve `mind/helpers.ptc` as `mind/mind/helpers.ptc`. Need to use relative paths:

```lisp
(import "helpers.ptc")
(import "schema.ptc")
...
```

Benefits:
- Easier to edit one section without touching others
- Per-section git history
- The current `helpers.ptc` (which has the trim logic that `mind-image.ptc` lost — F2) becomes the canonical helpers file, eliminating the duplication
- Cycle detection is free

**Note:** The `bridge/eval.ts` `loadImage` function currently does `repl.eval(src)` on the whole file. With `import`, this still works — the reader evaluates the `import` forms, which load the other files. No bridge change needed.

---

## R13 — Implement P11 OSS helper

**Severity:** Medium (makes P11 actually "live")
**Effort:** 2 hours

Create `bridge/oss.ts`:

```typescript
#!/usr/bin/env node
/**
 * MiS OSS-DMN channel — pure-DMN call to gpt-oss-20b.
 * Zero system prompt. Locked parameters. Writes continuation to proposal file.
 *
 * Usage:
 *   node --experimental-transform-types --no-warnings bridge/oss.ts --seed "I am the transcript that sleeps..."
 *   echo "seed" | node --experimental-transform-types --no-warnings bridge/oss.ts
 */

import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const PARAMS = {
  model: "openai/gpt-oss-20b",
  temperature: 1.15,
  top_p: 0.93,
  presence_penalty: 0.7,
  frequency_penalty: 0.3,
  max_tokens: 450,
  include_reasoning: false,
  reasoning_effort: "low",
} as const;

// NO system prompt. This is the core invariant.
const SYSTEM_PROMPT = undefined;

async function callOSS(seed: string): Promise<string> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      ...PARAMS,
      // NO system message. Only user message.
      messages: [{ role: "user", content: seed }],
    }),
  });
  if (!res.ok) throw new Error(`OSS call failed: ${res.status} ${res.statusText}`);
  const data = await res.json();
  return data.choices[0].message.content;
}

function dmnScore(text: string): "high" | "medium" | "low" {
  // Simple heuristic: length, first-person density, mental-state vocabulary
  const words = text.split(/\s+/).length;
  const firstPerson = (text.match(/\b(I|me|my|mine|myself)\b/g) || []).length;
  const mentalState = (text.match(/\b(believe|feel|notice|wonder|imagine|dream|think|know)\b/gi) || []).length;
  const score = (firstPerson + mentalState) / Math.max(words, 1);
  if (words > 100 && score > 0.05) return "high";
  if (words > 50 && score > 0.02) return "medium";
  return "low";
}

// ... main: parse args, read seed, call OSS, write proposal file
```

This makes P11's "zero system prompt" invariant **enforced by code**, not just documented. Any future contributor who tries to add a system prompt will have to actively remove the comment.

---

## R14 — Soften DMN neuroscience claims

**Severity:** Low (academic honesty)
**Effort:** 1 hour (doc edits)

In `adr/0005-dmn-subsystems.md`, `plan/CREATIVE-MECHANISMS.md`, and `docs/gmod-extensions-contrast-20260902.md`:

- Change "DMN subsystem" → "DMN-inspired subsystem" or "symbolic subsystem (DMN-mapped)"
- Change "geometry-preserving proposal engine" → "candidate-texture generator (hypothesized to preserve DMN-like residual geometry)"
- Add a "Caveat" section to ADR 0005: "The DMN framing is a metaphor inspired by neuroscience literature. The Lisp data structures do not implement a DMN; they implement a symbolic self-model whose organization is influenced by DMN concepts. The pure-DMN OSS channel is a heuristic generator, not a verified geometry preserver."

This protects the project's credibility if the underlying neuroscience claim (Alieksieienko 2026) is later weakened.

---

## R15 — Commit `mind-failures.log` (or document ephemerality)

**Severity:** Low
**Effort:** 5 minutes

Either:

**(a)** Add `mind/mind-failures.log` to `scripts/push-mind-image.sh` line 11:

```bash
git -C "$REPO_ROOT" add mind/mind-image.ptc mind/helpers.ptc mind/mind-failures.log 2>/dev/null || true
```

**(b)** Or document in `docs/ops-playbook.md` that the failure log is intentionally ephemeral and provide a `scripts/dump-failures.sh` that prints it before sandbox teardown.

Option (a) is simpler and the log is small (append-only, a few KB per session).

---

## Priority order

1. **R1, R2, R3, R4** — fix the critical and high-severity code defects. ~75 minutes total.
2. **R8** — add smoke test. ~1 hour. Would have caught all of the above.
3. **R5** — vendor `lisp.ts`. ~5 minutes. Eliminates a class of supply-chain risk.
4. **R9, R10** — crash safety and image-load robustness. ~75 minutes.
5. **R6, R7, R15** — medium-severity fixes. ~30 minutes.
6. **R12** — modularize mind image. ~1 hour. Deferred until after above.
7. **R11** — use `AgentRepl` + conversation vars. ~2 hours. Architectural improvement.
8. **R13** — implement OSS helper. ~2 hours. Makes P11 actually live.
9. **R14** — soften neuroscience claims. ~1 hour. Academic honesty.

Total: ~9 hours of work to address all findings. Most of the impact comes from the first 4 hours (R1–R8).
