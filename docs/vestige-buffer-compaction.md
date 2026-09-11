# Vestige buffer compaction (P5)

## Goal
Keep `*episodic-buffer*` small. **Vestige** holds full episodic text; the mind image holds **compact references** plus short summaries.

## Compact record shape

```lisp
("vestige-ref"
 "one-line summary"
 (:vestige-id "uuid"
  :reality-status observed
  :recorded-at …
  :source …
  :tags (…)))
```

Created by `(dmn-log-vestige-ref vestige-id summary meta)`.

## Host convention (after ingest)

1. Host runs `scripts/vestige-mind.ts ingest …` → receives `id`.
2. Host logs:
   ```lisp
   (dmn-log-vestige-ref "uuid" "one-line gloss" (:source host :tags (p5)))
   ```
3. Do **not** copy full ingested prose into the buffer unless needed for the live turn.

## Legacy episodes
Pre-compaction rich episodes remain until natural trim (`*episodic-max*`). New Vestige-backed events should prefer compact refs when `*episodic-prefer-compact*` is `t`.

## Degraded mode
If Vestige is down, compact refs already in the buffer still provide recent glosses; deep recall is stale (`*vestige-status* = degraded`). New full-text logging is allowed only as a temporary local working note.

## FSRS-6
Long-term fading stays in Vestige. The image does not mirror every strength update—only refresh a summary when a ref is re-activated into the working set.
