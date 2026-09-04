# P2 — Helpers, Scratch, Push

**Status:** done → **revised 2026-09-04** (GLM+Terra synthesis) — host globals, modularization, `dmn-reflect-pack` fix

## Goal
Give Grok a small, stable Mind API, safe experimentation paths, and a modular mind image that scales.

## Objective
- Core helpers: version, ping, note, register, state-summary.
- **Host-injected globals** (`*today*`, `*now*`, `*session-id*`) so the mind knows what time it is.
- **Implement `dmn-reflect-pack` and `dmn-apply-reflection`** (critical fix — were documented as live but missing).
- Isolated scratch image for experiments.
- **Modularize `mind-image.ptc` via upstream `(import "path")`** — split into helpers, schema, episodes, autobiography, arithmetic.
- Script or path to push the main image to GitHub.

## Implementation method

### A. Host-injected globals (UR3)

In `bridge/eval.ts`, after constructing the `MemoryRepl`, inject host globals:

```typescript
import { newSym } from "./driver.ts";  // already exported

function injectHostGlobals(interp: InstanceType<typeof Interp>) {
  interp.defineGlobal(newSym("*today*"), new Date().toISOString().slice(0, 10));
  interp.defineGlobal(newSym("*now*"), new Date().toISOString());
  interp.defineGlobal(newSym("*session-id*"), process.env.MIS_SESSION_ID || "unknown");
}

// In MemoryRepl.freshInterp():
freshInterp() {
  const interp = new Interp({ extensions: [] });
  run(interp, prelude);
  injectHostGlobals(interp);
  return interp;
}
```

Update `dmn-narrate` and `dmn-chapter-close` to use `*today*` instead of the hardcoded `"2026-09-02"`.

### B. Implement missing reflection helpers (UR1 — CRITICAL)

Add to `mind/episodes.ptc` (after modularization) or directly to `mind-image.ptc`:

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
  (dmn-log-episode "reflection" summary (list :source 'reflection :label label :reality-status 'inferred)))
```

Add both to `*mis-known*` list.

**P0.1 improvement (defer):** `dmn-apply-reflection` should create a *candidate* proposal, not directly mutate. Promotion is a separate step via `(promote-candidate ...)`.

### C. Modularize `mind-image.ptc` via `import` (UR11)

**Important:** Use `(import "...")` not `(load "...")`. `load` is not an upstream builtin; `import` is (line 958 of `lisp.ts`).

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
;; *mind-manifest* is set by P0.1 before this loader runs.
(import "helpers.ptc")
(import "schema.ptc")
(import "episodes.ptc")
(import "autobiography.ptc")
(import "arithmetic.ptc")
```

`import` resolves paths relative to the importing file's directory, so if `mind-image.ptc` is in `mind/`, the imports use relative paths.

**Delete the duplicate `mind/helpers.ptc`** — the old parallel copy caused the F2 regression (buffer trim lost). The new `helpers.ptc` replaces it and is imported by the loader.

### D. Fix `dmn-log-episode` buffer trim (UR2)

Restore the trim logic from the old `helpers.ptc` into the new `episodes.ptc`:

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

### E. Fix medium code defects (UR7)

In `episodes.ptc`:
- **`dmn-fetch-unreflected`** — either rename to `dmn-fetch-recent` (simplest) or implement `:reflected` tag filter. For now, rename to `dmn-fetch-recent` and update docs. Implement the filter in P0.1 when reality-status is available.
- **`dmn-autobiography(n)`** — implement the take-N logic:
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

In `schema.ptc`:
- **`update-self-schema`** — fix the cons/reverse order bug:
```lisp
(defun update-self-schema (new-map)
  "Merge NEW-MAP into *self-schema*; new keys take precedence; preserve order of new-map followed by old keys not in new-map."
  (let ((old *self-schema*) (acc nil))
    (setq acc new-map)
    (while old
      (let ((k (car (car old))))
        (unless (assoc k new-map)
          (setq acc (append acc (list (car old))))))
      (setq old (cdr old)))
    (setq *self-schema* acc)
    *self-schema*))
```

### F. Replace `*mis-known*` with upstream `(dump)` (UR11 sub)

The manually-maintained `*mis-known*` list has already drifted (didn't list `dmn-reflect-pack`). Replace `(mis-state-summary)`'s use of `*mis-known*` with `(dump)` which returns all global symbols automatically.

### G. Push script (existing + improvements)

`scripts/push-mind-image.sh` already works. Improvements:
- Add `mind/mind-failures.log` to staging (UR19) — or document ephemerality.
- After P0.1, push `state/manifest.json` and `state/audit/mutations.jsonl` alongside the image.
- After modularization, push all `mind/*.ptc` files, not just `mind-image.ptc`.

## Checklist

### Host globals
- [ ] `injectHostGlobals(interp)` in `bridge/eval.ts` (UR3)
- [ ] `*today*`, `*now*`, `*session-id*` available in Lisp
- [ ] `dmn-narrate` and `dmn-chapter-close` use `*today*` instead of `"2026-09-02"` (UR3)

### Critical fixes
- [ ] **`dmn-reflect-pack` implemented** (UR1) — cold-start verification step works
- [ ] **`dmn-apply-reflection` implemented** (UR1) — reflection protocol is real
- [ ] Both added to `*mis-known*` (or `*mis-known*` replaced by `(dump)`)
- [ ] `dmn-log-episode` buffer trim restored (UR2)
- [ ] `dmn-fetch-unreflected` renamed to `dmn-fetch-recent` (UR7) — or filter implemented in P0.1
- [ ] `dmn-autobiography(n)` honors argument (UR7)
- [ ] `update-self-schema` order bug fixed (UR7)

### Modularization
- [ ] `mind-image.ptc` split into `helpers.ptc`, `schema.ptc`, `episodes.ptc`, `autobiography.ptc`, `arithmetic.ptc` (UR11)
- [ ] Loader uses `(import "...")` not `(load "...")`
- [ ] Old duplicate `helpers.ptc` deleted
- [ ] `*mis-known*` replaced by `(dump)` where possible (UR11 sub)

### Scratch + push
- [x] `--scratch` isolation works (done)
- [x] `scripts/push-mind-image.sh` works (done)
- [ ] Push script stages all `mind/*.ptc` files after modularization
- [ ] Push script stages `mind/mind-failures.log` or documents ephemerality (UR19)

## Exit criteria
- `(mis-state-summary)` works after cold bootstrap.
- `(dmn-reflect-pack 5)` returns schema + episodes (no longer throws `unbound variable`).
- `(dmn-apply-reflection ...)` with `--save` persists across restart.
- Scratch does not pollute main image.
- `mind-image.ptc` is a thin loader; actual state lives in imported sub-files.
- `(dmn-narrate "test" "Test")` with `--save` produces a chapter dated today, not `2026-09-02`.

## Non-goals
- Trust class enforcement (P0.1)
- Reality-status field (P0.1) — but new episodes should leave room for it
- Vestige integration (P5)
