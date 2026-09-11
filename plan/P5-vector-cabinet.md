# P5 — Vestige Integration (Local-First Memory Substrate)

**Status:** in progress 2026-09-11 — degraded mode, capability profiles, buffer compaction helpers
**Depends on:** P0.1 complete (trust base); P4 useful
**External project:** [`samvallad33/vestige`](https://github.com/samvallad33/vestige)

## Goal

Integrate Vestige as the durable episodic substrate behind MiS. Lisp remains the agent interface; Vestige holds long-term storage, retrieval, causal backfill, and hygiene.

## Checklist
- [x] License compatibility reviewed (AGPL-3.0 vs MIT; MCP network model safe) — 2026-09-11
- [ ] Vestige installed and running locally (`npm install -g vestige-mcp-server`)
- [x] `bridge/vestige-adapter.ts` HTTP MCP — 2026-09-11
- [x] Adapter tested: recall, smart_ingest, backfill, contradictions — vestige-smoke + vestige-mind
- [x] Lisp host-mediated ops in mind/vestige-ops.ptc
- [x] Capability profiles enforced (`mind-memory-read-v1` / `mind-candidate-write-v1` / `vestige-maintenance-v1`)
- [ ] API keys outside the image (never commit)
- [x] Injection policy documented — docs/vestige-injection-policy.md
- [x] No eval of retrieved text (typed MemoryItem)
- [x] Degraded mode tested — scripts/test-vestige-degraded.sh
- [x] Compact buffer helpers — dmn-log-vestige-ref, docs/vestige-buffer-compaction.md
- [ ] FSRS-6 fading replaces *episodic-max* trim for long-term memories
- [ ] Document free-tier / local-resource limits
- [x] Causal backfill evidence run (preview)
- [x] Contradiction detection evidence run

## Scripts
- `scripts/vestige-smoke.ts` — happy path
- `scripts/test-vestige-degraded.sh` — unavailable + profile deny + queue + MiS boot + compact ref
- `scripts/vestige-mind.ts` — host CLI (`--profile=`, `--queue-on-degraded`)

## Profiles
| Profile | Caps |
|---------|------|
| mind-memory-read-v1 | recall, graph, backfill read |
| mind-candidate-write-v1 | + ingest-candidate (default for host tools) |
| vestige-maintenance-v1 | + maintain, suppress |

## Degraded mode
Dead Vestige → `VestigeUnavailable`; optional `queueOnDegraded` → `state/local-queue/`; MiS boots from mind image; host sets `(vestige-set-status 'degraded)`.

## Buffer compaction
After ingest, prefer `(dmn-log-vestige-ref id summary meta)` so the image holds refs, not full prose. See docs/vestige-buffer-compaction.md.

## Exit criteria (remaining)
- Degraded mode + profiles: **met by tests**
- Compact helpers: **met**; full migration of legacy buffer optional
- Local vestige-mcp install, FSRS docs, free-tier notes: open
