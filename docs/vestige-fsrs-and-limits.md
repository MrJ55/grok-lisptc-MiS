# Vestige FSRS-6 notes and operational limits (P5)

**Status:** documented 2026-09-11; **runtime authority in the mind** since 2026-09-11  
**Runtime:** `(vestige-host-contract)` · `(vestige-injection-rules)` · `(vestige-degraded-protocol)` · `(vestige-working-set-rules)` · `(vestige-profile-rules)`  
**Scope:** This file is **archive / commentary**. Host must not rely on re-reading markdown alone — query the image (same rule as P12 Chorus docs).  
**Sandbox note:** Local `vestige-mcp` install is **not required** when HTTP MCP (e.g. ngrok) is the integration path.

## FSRS-6 in one paragraph

Vestige applies spaced-repetition-style strength (FSRS-6 lineage) so memories that are **retrieved and used** stay available, and memories that are **ignored** fade in retrieval rank. That is strictly more useful than MiS’s in-image rule alone (`*episodic-max*` newest rows). The mind image must not reimplement FSRS fields on every episode; it should treat Vestige `recall` results as already strength-aware.

## What the host should assume

| Assumption | Meaning |
|------------|---------|
| Long-term ranking is Vestige’s | Do not treat `*episodic-buffer*` membership as “still remembered forever.” |
| Buffer is a working set | Prefer compact refs (`dmn-log-vestige-ref`); full text stays in Vestige. |
| Faded ≠ deleted from identity | Autobiography and schema remain in the image; only *search ranking* softens. |
| Degraded mode loses FSRS depth | When Vestige is down, deep ranked recall is stale; LKG + compact refs remain. |
| Ingest ≠ autobiography | `smart_ingest` is candidate/durable store material; chapter commit is still host-gated. |

**Encoded in-image:** `(vestige-working-set-rules)` / `(vestige-host-contract)`.

## What not to do

- Mirror FSRS state into every `.ptc` form.
- Sort “truth” only by buffer order when Vestige is up.
- Bulk-ingest legacy buffer without review (migration is **skipped** — see P5).
- Claim durable episodic search while `*vestige-status*` is `degraded` or `unknown` after a failed probe.

**Encoded in-image:** `:must-not` on `(vestige-host-contract)`.

## Interaction with compaction

See [vestige-buffer-compaction.md](./vestige-buffer-compaction.md). Runtime: `(vestige-working-set-rules)`.

## Operational limits (practical)

These are **operator bounds**, not hard API guarantees. Adjust when the Vestige deployment changes.

| Limit | Guidance |
|-------|----------|
| **Transport** | HTTP MCP to configured base URL; timeouts ~15–20s in adapter |
| **Sandbox / remote** | Depends on tunnel/process uptime; use degraded mode + `state/local-queue` when down |
| **Local binary** | Optional; not available in this sandbox path — skip |
| **In-image buffer** | `*episodic-max*` (default 40); prefer refs so 40 means 40 *summaries*, not 40 novels |
| **Ingest batching** | Prefer small, tagged, reviewed batches; avoid dumping entire chat logs |
| **Profiles** | Default host tools: `mind-candidate-write-v1`; automation can use `mind-memory-read-v1` |
| **Destructive ops** | maintain / suppress need `vestige-maintenance-v1` (and human confirmation for suppress) |
| **Rate / size** | If calls fail with HTTP 429/413 or timeouts, back off; queue non-critical writes |

## Free-tier / resource honesty

- There is **no** assumption of infinite embeddings or infinite graph growth.
- Host should periodically use Vestige health (`memory_status`) and hygiene tools (`maintain` / `dedup`) under a governed profile when the store feels heavy.
- MiS identity and chapters must remain valid if Vestige is wiped or unreachable — transcript image is permanent; Vestige is substrate.

## Related

- **Runtime:** `(vestige-host-contract)` in `mind/vestige-protocol.ptc`
- [vestige-injection-policy.md](./vestige-injection-policy.md) — data-only; never eval retrieved text  
- [vestige-buffer-compaction.md](./vestige-buffer-compaction.md) — compact refs  
- [plan/P5-vector-cabinet.md](../plan/P5-vector-cabinet.md) — phase checklist and accomplishments  
- `scripts/vestige-smoke.ts` / `scripts/test-vestige-degraded.sh` — live verification  
