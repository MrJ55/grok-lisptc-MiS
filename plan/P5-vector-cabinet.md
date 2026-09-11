# P5 — Vestige Integration (Local-First Memory Substrate)

**Status:** in progress 2026-09-11 — adapter skeleton + HTTP MCP; was reframed 2026-09-04 (GLM+Terra)
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
| MCP subprocess (`vestige-mcp` as separate process, communicate via stdio) | **Yes** | Separate programs communicating via protocol; fork remains MIT. Analogous to MIT app calling GPL CLI tool. |
| Direct code linking (Rust FFI or TypeScript `import`) | **No** | AGPL copyleft would apply to combined work; fork must become AGPL. |
| Terra's adapter pattern (`bridge/vestige-adapter.ts` calls MCP) | **Yes** | Adapter is MIT; Vestige is AGPL; they communicate via MCP. |
| HTTP MCP (remote tunnel / local server) | **Yes** | Same boundary as subprocess; network protocol instead of stdio. |

**Decision:** Use MCP integration via `bridge/vestige-adapter.ts` (HTTP first; stdio later). Never directly import Vestige code.

## Objective
- External store for embeddings + metadata + causal graph + contradictions.
- Replace-not-accumulate for turn evidence (in-image buffer is working set; Vestige is history).
- Data-only injection (never `eval` vestige-retrieved text).
- **Causal backfill** for P9 prospection (when a failure occurs, find the root cause).
- **Contradiction detection** for P0.1 trust class enforcement.
- **FSRS-6 fading** so unused memories decay automatically (better than `*episodic-max*` trim).

## Implementation method

### A. Adapter pattern (Terra recommendation)

Create `bridge/vestige-adapter.ts` — the **only** path to Vestige operations. PTC code calls typed mind operations, never raw MCP tools.

HTTP MCP transport is implemented (2026-09-11). Stdio subprocess remains a future option for fully local installs.

### B. Lisp-level operations (Terra names → Vestige tools)

| MiS operation | Vestige tool | Notes |
|---|---|---|
| `(mind-recall query k)` | `recall` (mode=lookup) | Hybrid vector + FTS search |
| `(mind-recall-sequence from to)` | `recall` + `graph` | Temporal neighborhood + spreading activation |
| `(mind-backfill-cause failure-id)` | `backfill` | Retroactive salience backfill |
| `(mind-record-event event)` | `smart_ingest` | Prediction-error gating + dedup |
| `(mind-check-contradictions topic)` | `recall` (mode=contradictions) | Trust-weighted disagreement pairs |
| `(mind-consolidate)` | `maintain` + `dedup` | Bounded maintenance |
| `(mind-memory-status)` | `memory_status` | Health + stats |
| `(mind-suppress memory-id)` | `suppress` | Requires elevated policy |

### C. Capability profile

Vestige access goes through the `mind-memory-read-v1` capability profile (P0.1):
- `vestige/recall-read` — automatic authorization
- `vestige/graph-read` — automatic
- `vestige/backfill-read` — automatic
- `vestige/ingest-candidate` — policy-gated (`mind-candidate-write-v1`)
- `vestige/maintain-governed` — explicit policy (`vestige-maintenance-v1`)
- `vestige/suppress-governed` — explicit policy + user confirmation

### D. Trust class integration

- Vestige retrieves **untrusted** content (retrieved memory text). It is never evaluated as Lisp.
- Vestige stores **approved** content (events that passed schema validation).
- In-image `*episodic-buffer*` is the **derived** working set (compact references to Vestige IDs + selected summaries).
- Vestige IDs are immutable references; the in-image buffer holds only compact projections.

### E. Degraded mode

If Vestige is unavailable:
1. Boot MiS from last verified projection (`state/checkpoints/last-known-good.ptc`).
2. Mark long-term recall as stale (`*vestige-status* = 'degraded`).
3. Queue non-critical candidate writes to `state/local-queue/`.
4. Do not assert fresh durable recall.
5. Re-sync through validation after recovery.

### F. Schema

`mind/vestige-config.ptc` (imported from mind-image):
```lisp
(setq *vestige-config*
  '((:enabled . t)
    (:transport . http)
    (:http-base . "https://…")
    (:mcp-path . "/mcp")
    (:binary . "vestige-mcp")
    (:data-dir . "~/.vestige/grok-lisptc-mis")
    (:capability-profile . mind-memory-read-v1)
    (:degraded-mode . t)
    (:injection-policy . data-only)))
```

## Checklist
- [x] License compatibility reviewed (AGPL-3.0 vs MIT; MCP subprocess/network model confirmed safe) — 2026-09-11
- [ ] Vestige installed and running locally (`npm install -g vestige-mcp-server`)
- [x] `bridge/vestige-adapter.ts` implemented with **HTTP MCP** (remote); stdio subprocess deferred — 2026-09-11
- [ ] Adapter tested: `recall`, `smart_ingest`, `backfill`, `contradictions` all work
- [ ] Lisp-level operations `(mind-recall ...)`, `(mind-backfill-cause ...)` etc. implemented
- [ ] Capability profile `mind-memory-read-v1` enforced (P0.1 dependency)
- [ ] API keys outside the image (never commit)
- [x] Injection policy documented (data only — never `eval` retrieved text) — docs/vestige-injection-policy.md
- [x] No eval of retrieved text (enforced by adapter returning typed `MemoryItem`, not raw strings)
- [ ] Degraded mode tested: kill Vestige process, verify MiS boots from last-known-good
- [ ] In-image `*episodic-buffer*` reduced to compact references (Vestige ID + 1-line summary)
- [ ] FSRS-6 fading replaces `*episodic-max*` trim for long-term memories
- [ ] Document free-tier / local-resource limits
- [ ] One causal backfill run that traces a failure to its root cause
- [ ] One contradiction detection run that flags conflicting episodes

## Exit criteria
- Retrieval returns useful past material via `(mind-recall "query" 5)`.
- `(mind-backfill-cause "failure-id")` returns a root-cause candidate with receipt.
- Mind restores from transcript image if Vestige is down (degraded mode).
- No retrieved text is ever evaluated as Lisp (verified by test).
- In-image buffer stays small (compact references); Vestige holds the full history.

## Non-goals
- Replacing `*self-schema*` with vectors
- Full local RAG stack in `/tmp/mis` (Vestige handles this)
- Direct code linking to Vestige Rust crates (license contamination)
- Auto-promotion of Vestige-retrieved content into `mind-image.ptc`

## Relation to original P5
The original P5 was "Vector Cabinet (optional)" with Pinecone as the default. This revision replaces it with Vestige integration, which is strictly more capable and local-first. The "optional" status is removed — Vestige is the planned P5 substrate, contingent on P0.1 completion and license review.
