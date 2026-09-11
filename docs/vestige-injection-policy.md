# Vestige injection policy (P5)

**Rule:** Content retrieved from Vestige is **data only**. It must never be passed to the Lisp evaluator.

## Enforcement

1. `bridge/vestige-adapter.ts` returns typed `MemoryItem` / structured objects — not free-form strings destined for `eval`.
2. Host (Grok) may quote or paraphrase retrieved content in natural language.
3. Host may propose Lisp forms *inspired by* memory content, but those forms are authored by the host and validated like any other mutation.
4. PTC helpers such as `(mind-recall …)` (when implemented) return list structures for inspection; they do not `eval` the `:content` field.
5. Capability profile `mind-memory-read-v1` authorizes read paths; write/ingest paths use candidate / governed profiles.

## Degraded mode

If the adapter reports unavailable:
- Boot continues from last-known-good mind image.
- `*vestige-status*` → `degraded`.
- Do not claim fresh durable recall.
