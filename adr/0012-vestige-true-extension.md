# ADR 0012: Vestige as true extension, not second cabinet

- **Status:** Accepted (design); implementation continues under P22
- **Date:** 2026-09-15
- **Supersedes / extends:** [plan/P5-vector-cabinet.md](../plan/P5-vector-cabinet.md) non-goals and host-mediated path

## Context

P5 integrated Vestige as durable episodic substrate via HTTP MCP (`bridge/vestige-adapter.ts`, host-mediated Lisp, compact refs). That correctly kept identity in the transcript image. The remaining risk is **operational dual-cabinet**: host or roles talk to Vestige as a parallel memory surface (raw recall in chat, parallel docs, ad-hoc CLI as “the truth”), so the mind stops being the only external environment that must be maintained and grown.

Original promise (design thread item E): Vestige is the **long-term store the transcript indexes into**; the **mind remains the only authoritative surface the host talks to**.

## Decision

1. **Authority hierarchy (normative)**  
   - Host speaks to **mind** (Lisp forms, duties, schema, autobiography, compact episodic refs).  
   - Mind **indexes** long-term mass via Vestige ids + glosses in-image.  
   - Vestige holds full text / rankings / causal graph; it is never the identity surface and never auto-promotes into `mind-image.ptc`.

2. **Single conversational surface**  
   Host must not treat Vestige CLI/MCP results as a second “cabinet” to file narrative, goals, or identity. Retrieval enters the turn only as **data** after mind-mediated ops (or explicit host tool that immediately logs a mind-facing compact ref / duty).

3. **Index, don’t mirror**  
   Prefer `(dmn-log-vestige-ref …)` and related compact forms over copying full prose into the image ([docs/vestige-buffer-compaction.md](../docs/vestige-buffer-compaction.md)). Full text lives in Vestige; the transcript holds pointers + one-line glosses + trust metadata.

4. **Mind-owned recall agenda**  
   Long-term search should be driven by mind duties / host following `(mind-duty-check)` and documented ops (`mind/vestige-ops.ptc`), not by open-ended “query Vestige and decide outside the image.”

5. **Same purity and trust rules as P5**  
   Retrieved text is never eval’d as Lisp. Degraded mode: mind still boots; host must not claim fresh durable search when `*vestige-status*` is degraded.

6. **Not a second wiki**  
   Do not maintain parallel permanent narrative in Vestige that the host reads instead of autobiography/schema. Vestige is substrate for *episodes and associations*; chapters and self-schema stay in the image.

## Consequences

- Positive: one product surface; capacity scales without identity split; aligns with “mind is the only external environment.”  
- Negative: host discipline required; some convenience “just search Vestige in chat” patterns are forbidden.  
- Follow-on: [plan/P22-vestige-true-extension.md](../plan/P22-vestige-true-extension.md), [docs/vestige-as-extension.md](../docs/vestige-as-extension.md).

## Related

- [docs/architecture.md](../docs/architecture.md)  
- [docs/vestige-injection-policy.md](../docs/vestige-injection-policy.md)  
- [adr/0009-injection-pipeline.md](0009-injection-pipeline.md) (bridge purity pattern shared with Vestige HTTP)
