# P5 — Vestige Integration (Local-First Memory Substrate)

**Status:** in progress 2026-09-11 — adapter + smoke + host-mediated Lisp surface; was reframed 2026-09-04 (GLM+Terra)
**Depends on:** P0.1 complete (trust base); P4 useful; ideally after P6 (evaluation) proves the in-image buffer is insufficient
**DMN role:** scalable episodic search + causal backfill + contradiction detection behind symbolic self (not identity itself)
**External project:** [`samvallad33/vestige`](https://github.com/samvallad33/vestige) — AGPL-3.0, 25MB Rust binary, 36 MCP tools, 1961 passing tests

## Goal

Integrate Vestige as the durable episodic, associative, temporal, and causal memory substrate behind MiS, not as a competing mind. The cohesive agent-facing interface remains one mind (Lisptc); Vestige handles long-term storage, retrieval, causal backfill, and memory hygiene.

## Why Vestige instead of Pinecone

The original P5 plan called for "managed free-tier API (e.g. Pinecone Starter)." Vestige is a strictly stronger substitute:

| Capability | Pinecone | Vestige |
|---|---|---|
| Vector search | Yes | Yes (hybrid vector + FTS + graph) |
| Causal backfill (root-cause finding) | No | **Yes** (`backfill` tool — Zaki/Cai 2024 Nature paper) |
| Contradiction detection | No | **Yes** (`recall` mode=contradictions) |
| Memory deduplication / merging | No | **Yes** (`smart_ingest` prediction-error gating) |
| FSRS-6 spaced repetition (fading) | No | **Yes** (memories fade when unused) |
| Local-first (no cloud) | No (cloud) | **Yes** (data never leaves machine) |
| Temporal sequence retrieval | No | **Yes** (`recall` + `graph` spreading activation) |
| License | Proprietary | AGPL-3.0 |

Vestige directly serves P8 (Replay/Scenes — temporal sequence), P9 (Prospection — counterfactual curriculum via `backfill`), and P0.1 (contradiction detection — trust class enforcement).

## License compatibility analysis

**Vestige license:** GNU AGPL-3.0
**Fork license:** MIT

| Integration model | License-safe? | Notes |
|---|---|---|
| MCP subprocess (`vestige-mcp` as separate process, communicate via stdio) | **Yes** | Separate programs communicating via protocol; fork remains MIT. |
| Direct code linking (Rust FFI or TypeScript `import`) | **No** | AGPL copyleft would apply to combined work. |
| Terra's adapter pattern (`bridge/vestige-adapter.ts` calls MCP) | **Yes** | Adapter is MIT; Vestige is AGPL. |
| HTTP MCP (remote tunnel / local server) | **Yes** | Same boundary as subprocess; network protocol instead of stdio. |

**Decision:** Use MCP integration via `bridge/vestige-adapter.ts` (HTTP first; stdio later). Never directly import Vestige code.

## Objective
- External store for embeddings + metadata + causal graph + contradictions.
- Replace-not-accumulate for turn evidence (in-image buffer is working set; Vestige is history).
- Data-only injection (never `eval` vestige-retrieved text).
- **Causal backfill** for P9 prospection.
- **Contradiction detection** for P0.1 trust class enforcement.
- **FSRS-6 fading** so unused memories decay automatically.

## Implementation method

### A. Adapter pattern (Terra recommendation)

`bridge/vestige-adapter.ts` is the **only** path to Vestige operations. HTTP MCP transport is implemented (2026-09-11). Stdio subprocess remains a future option.

Scripts:
- `scripts/vestige-smoke.ts` — ping → status → recall → smart_ingest round-trip
- `scripts/vestige-mind.ts` — host CLI: status | recall | ingest | backfill | contradictions

### B. Lisp-level operations (host-mediated first)

| MiS operation | Vestige tool | Notes |
|---|---|---|
| `(mind-recall query k)` | `recall` (mode=lookup) | Host-mediated stub → vestige-mind.ts |
| `(mind-backfill-cause failure-id)` | `backfill` | Preview; hypotheses only |
| `(mind-record-event event)` | `smart_ingest` | Candidate trust class |
| `(mind-check-contradictions topic)` | `recall` (mode=contradictions) | Review pairs; no auto-merge |
| `(mind-memory-status)` | `memory_status` | Plus local `*vestige-status*` |

Implemented in `mind/vestige-ops.ptc` as structured reminders (same pattern as `promote-candidate`). Host performs I/O; never evals retrieved `:content`.

### C. Capability profile

Vestige access goes through `mind-memory-read-v1` (P0.1) for reads; writes use candidate/governed profiles.

### D. Trust class integration

- Retrieved content is **untrusted** data — never evaluated as Lisp.
- In-image buffer remains the working set; Vestige holds history.

### E. Degraded mode

If Vestige is unavailable: boot from LKG; `*vestige-status* = 'degraded`; do not claim fresh durable recall.

### F. Schema

See `mind/vestige-config.ptc` (imported from mind-image).

## Checklist
- [x] License compatibility reviewed (AGPL-3.0 vs MIT; MCP subprocess/network model confirmed safe) — 2026-09-11
- [ ] Vestige installed and running locally (`npm install -g vestige-mcp-server`)
- [x] `bridge/vestige-adapter.ts` implemented with **HTTP MCP** (remote); stdio subprocess deferred — 2026-09-11
- [x] Adapter tested: `recall`, `smart_ingest`, `backfill`, `contradictions` all work — vestige-smoke + vestige-mind 2026-09-11
- [x] Lisp-level operations `(mind-recall ...)`, `(mind-backfill-cause ...)` etc. implemented as **host-mediated** stubs in mind/vestige-ops.ptc — 2026-09-11
- [ ] Capability profile `mind-memory-read-v1` enforced (P0.1 dependency)
- [ ] API keys outside the image (never commit)
- [x] Injection policy documented (data only — never `eval` retrieved text) — docs/vestige-injection-policy.md
- [x] No eval of retrieved text (enforced by adapter returning typed `MemoryItem`, not raw strings)
- [ ] Degraded mode tested: kill Vestige process, verify MiS boots from last-known-good
- [ ] In-image `*episodic-buffer*` reduced to compact references (Vestige ID + 1-line summary)
- [ ] FSRS-6 fading replaces `*episodic-max*` trim for long-term memories
- [ ] Document free-tier / local-resource limits
- [x] One causal backfill run executed (preview; 0 shared-entity candidates in current store) — 2026-09-11
- [x] One contradiction detection run executed (topic P12 status; 0 pairs in current store) — 2026-09-11

## Exit criteria
- Retrieval returns useful past material via host `vestige-mind.ts recall` / future in-process bridge.
- Backfill returns hypothesis candidates with receipt (preview or promote).
- Mind restores from transcript image if Vestige is down (degraded mode).
- No retrieved text is ever evaluated as Lisp (verified by test).
- In-image buffer stays small (compact references); Vestige holds the full history.

## Non-goals
- Replacing `*self-schema*` with vectors
- Full local RAG stack in `/tmp/mis`
- Direct code linking to Vestige Rust crates
- Auto-promotion of Vestige-retrieved content into `mind-image.ptc`

## Relation to original P5
The original P5 was "Vector Cabinet (optional)" with Pinecone. This revision uses Vestige via MCP — local-first and strictly more capable.
