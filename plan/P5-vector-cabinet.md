# P5 — Vector Cabinet (optional)

**Status:** optional / later  
**Depends on:** P4 useful in practice

## Goal
Scalable episodic search beyond the in-image buffer without abandoning the symbolic self-schema.

## Objective
- External store for vestiges (embeddings + metadata).
- Replace-not-accumulate for turn evidence injected into context.
- Data-only injection (never `eval` vestige text).

## Implementation method
- Prefer free-tier vector DB or local SQLite + sqlite-vec under `/tmp` or durable path.
- Lisp primitives return alists/lists; host embeds query text.
- Schema remains source of truth for identity; cabinet is searchable history.

## Checklist
- [ ] Choose store (SQLite file vs hosted)
- [ ] log / query primitives
- [ ] Injection policy documented
- [ ] No eval of retrieved text

## Exit criteria
Hybrid or semantic retrieval returns useful past episodes; mind still restores from transcript image alone.
