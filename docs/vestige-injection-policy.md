# Vestige injection policy (P5 + P22 + peer minds)

**Rule:** Content retrieved from Vestige is **data only**. It must never be passed to the Lisp evaluator.

## Enforcement

1. `bridge/vestige-adapter.ts` returns typed `MemoryItem` / structured objects — not free-form strings destined for `eval`.
2. Host (Grok) may quote or paraphrase retrieved content in natural language.
3. Host may propose Lisp forms *inspired by* memory content, but those forms are authored by the host and validated like any other mutation.
4. PTC helpers such as `(mind-recall …)` (when implemented) return list structures for inspection; they do not `eval` the `:content` field.
5. Capability profiles authorize paths: read vs candidate write vs governed maintain.
6. **All access is mind-mediated** via bridge — no parallel “Vestige chat cabinet” ([vestige-as-extension.md](./vestige-as-extension.md)).

## Peer minds (ADR 0013)

| Actor | Default profile |
|-------|-----------------|
| Orchestrator | `read+ingest` → compact ref in **canonical** image |
| Peer | **`read` only** → optional compact ref in **role** image only |
| Peer ingest | Not default; time-bounded grant or blackboard propose → Orchestrator ingests |

Bridge enforces `vestigeProfile` from instance config ([bridge-contract.md](./bridge-contract.md)).

## Degraded mode

If the adapter reports unavailable or Vestige is **not connected**:

- Boot continues from last-known-good mind image(s).
- `*vestige-status*` → `degraded` (or equivalent host disclosure).
- Do **not** claim fresh durable recall.
- Compact refs already in-image remain useful as glosses only.

## Related

- [plan/P5-vector-cabinet.md](../plan/P5-vector-cabinet.md)
- [plan/P22-vestige-true-extension.md](../plan/P22-vestige-true-extension.md)
- [adr/0012-vestige-true-extension.md](../adr/0012-vestige-true-extension.md)
