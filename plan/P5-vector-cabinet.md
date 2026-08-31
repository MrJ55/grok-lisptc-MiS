# P5 — Vector Cabinet (optional scale-out)

**Status:** optional / later  
**Depends on:** P4 useful; ideally after P7–P8  
**DMN role:** scalable episodic search under symbolic self (not identity itself)

## Goal
Searchable long-term vestiges beyond the in-image buffer without abandoning symbolic self-schema / autobiography.

## Objective
- External store for embeddings + metadata.
- Replace-not-accumulate for turn evidence.
- Data-only injection (never `eval` vestige text).
- Prefer **managed free-tier API** (e.g. Pinecone Starter) over local SQLite+sqlite-vec in this sandbox.

## Implementation method
- Sandbox: local sqlite-vec + embedding models strain resources; HTTPS APIs fit.
- Schema + autobiography remain source of truth; cabinet is searchable history.
- Optional client-side hybrid: Lisp tags + vector top-k from API.

## Checklist
- [ ] Choose store (default: managed free tier)
- [ ] API keys outside the image (never commit)
- [ ] log / query helpers
- [ ] Injection policy documented (data only)
- [ ] No eval of retrieved text
- [ ] Document free-tier limits

## Exit criteria
Retrieval returns useful past material; mind restores from transcript image if API is down.

## Non-goals
- Replacing `*self-schema*` with vectors
- Full local RAG stack in `/tmp/mis`
