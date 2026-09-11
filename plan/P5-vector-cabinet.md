# P5 — Vestige Integration (Local-First Memory Substrate)

**Status:** **substantially complete** 2026-09-11 (HTTP MCP path; local binary optional / skipped in sandbox)  
**Depends on:** P0.1 trust base; P4 reflection useful; P6 substantially met  
**DMN role:** scalable episodic search + causal backfill + contradiction detection behind symbolic self (not identity itself)  
**External project:** [`samvallad33/vestige`](https://github.com/samvallad33/vestige) — AGPL-3.0; integrate only via MCP (never link)

## Goal

Integrate Vestige as the durable episodic, associative, temporal, and causal memory **substrate** behind MiS. The cohesive agent-facing interface remains one mind (Lisptc); Vestige handles long-term storage, retrieval, causal backfill, and memory hygiene.

## Why Vestige

| Capability | Role in MiS |
|------------|-------------|
| Hybrid recall | Deep episodic search beyond `*episodic-max*` |
| Causal backfill | Hypothesis search for P9-style root-cause questions |
| Contradictions mode | Trust-weighted disagreement pairs (P0.1 ally) |
| smart_ingest | Prediction-error / dedup gating for candidate writes |
| FSRS-6 strength | Unused memories fade in rank (see docs/vestige-fsrs-and-limits.md) |
| MCP boundary | MIT adapter ↔ AGPL server; license-safe |

## Implementation (what landed)

| Piece | Location |
|-------|----------|
| Adapter | `bridge/vestige-adapter.ts` — typed MemoryItem, profiles, queueOnDegraded |
| Config | `mind/vestige-config.ptc` |
| Host-mediated Lisp | `mind/vestige-ops.ptc` |
| Compact buffer | `dmn-log-vestige-ref`, `*episodic-prefer-compact*` in `mind/episodes.ptc` |
| Smoke | `scripts/vestige-smoke.ts` |
| Degraded + profiles test | `scripts/test-vestige-degraded.sh` |
| Host CLI | `scripts/vestige-mind.ts` |
| Policies | `docs/vestige-injection-policy.md`, `docs/vestige-buffer-compaction.md`, `docs/vestige-fsrs-and-limits.md` |

## Checklist

- [x] License compatibility reviewed (AGPL vs MIT; MCP boundary) — 2026-09-11
- [x] Local `vestige-mcp` install — **skipped** in sandbox (HTTP MCP is the supported path)
- [x] `bridge/vestige-adapter.ts` HTTP MCP
- [x] Adapter tested: recall, smart_ingest, backfill, contradictions
- [x] Host-mediated Lisp surface
- [x] Capability profiles enforced
- [x] Injection policy: data-only; never eval retrieved text
- [x] Degraded mode tested
- [x] Compact buffer helpers + host convention documented
- [x] FSRS-6 / operational limits documented (`docs/vestige-fsrs-and-limits.md`)
- [x] Full buffer → refs migration — **skipped (optional non-goal)**; hybrid buffer OK until natural trim
- [x] Backfill + contradictions evidence runs
- [ ] Optional later: local binary install when a machine has resources
- [ ] Optional later: governed maintain/dedup automation

## Explicit non-goals (this exit)

- Replacing `*self-schema*` or autobiography with vectors
- Full migration of legacy fat episodes into Vestige refs
- Direct linking to Vestige Rust crates
- Auto-promotion of retrieved text into `mind-image.ptc`
- Sole identity in an external store

## What this accomplishes for Grok-MiS

Before P5, durable memory was almost entirely the transcript image: a capped episodic buffer, schema, and autobiography chapters. That is the right home for **identity**, but it does not scale as a searchable life history. After cold start the host could reload symbols; it could not honestly say “search everything we stored and rank it by use,” or “when this failed, what earlier episodes share entities?” without inventing an ad-hoc store.

P5 adds a **substrate**, not a second mind. Vestige holds long-term episodic mass; Lisp keeps control, trust classes, and the story of self.

### What Grok-MiS can do now that it could not do cleanly before

1. **Search beyond the working set**  
   Host-mediated recall reaches material that no longer fits in `*episodic-max*`. The buffer can stay small (especially with compact refs) without erasing history.

2. **Survive Vestige outages without lying**  
   Degraded mode is tested: dead endpoint → unavailable; optional local queue; MiS still boots from the mind image; host can set `*vestige-status*` to `degraded` and must not claim fresh durable search.

3. **Gate memory power with capability profiles**  
   Read-only automation cannot ingest. Candidate write is explicit. Maintain/suppress stay on a higher profile. This extends P0.1 trust discipline to an external store.

4. **Ingest without eval**  
   Retrieved and stored text is data. The adapter returns typed structures; injection policy forbids evaluating Vestige content as Lisp. Same family of rule as OSS dual-write.

5. **Prefer compact working memory**  
   `(dmn-log-vestige-ref id summary meta)` records Vestige ids + glosses in-image so the transcript does not grow a second copy of every paragraph.

6. **Borrow causal and contradiction tools for later phases**  
   Backfill (hypothesis-only by default) and contradictions mode are wired for P9 / trust work without promoting them into automatic truth.

### What did not change (on purpose)

- Identity remains chapters + schema in the image, not a vector centroid.
- Host still decides saves, chapter commits, and HUMAN_TOOL identity moves.
- FSRS ranking is Vestige’s; MiS does not reimplement spaced repetition in Lisp.
- Legacy buffer rows were **not** bulk-migrated; hybrid shape is accepted.

## Exit criteria (substantially met)

| Criterion | Status |
|-----------|--------|
| Useful retrieval via host path | Met (`vestige-smoke`) |
| Backfill / contradictions callable | Met (evidence runs) |
| Mind boots if Vestige down | Met (`test-vestige-degraded.sh`) |
| No eval of retrieved text | Met (policy + typed adapter) |
| Profiles + degraded queue | Met |
| Compact helpers + FSRS/limits docs | Met |
| Local binary | Skipped (optional) |
| Full legacy migration | Skipped (optional) |

## Related docs

- [docs/vestige-injection-policy.md](../docs/vestige-injection-policy.md)
- [docs/vestige-buffer-compaction.md](../docs/vestige-buffer-compaction.md)
- [docs/vestige-fsrs-and-limits.md](../docs/vestige-fsrs-and-limits.md)
- [docs/session-handoff.md](../docs/session-handoff.md)
- [docs/architecture.md](../docs/architecture.md)
