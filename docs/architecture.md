# Architecture — grok-lisptc-MiS

Deterministic **lisptc** transcript image + **Grok host** + optional pure-DMN OSS channel.

## Layers

```
human goals
    ↓
Grok host (natural language, tool use, --save discipline)
    ↓
lisptc eval bridge (validate, save-on-success, LKG)
    ↓
mind image (.ptc modules: schema, episodes, autobiography, oracle, vestige config/ops)
    ↓
optional: pure-DMN OSS (P11/P12) — imagined dual-write only
optional: Vestige MCP (P5) — long-term episodic substrate
```

**Host owns:** when to reflect, narrate, simulate, wander; what to `--save`.  
**Image owns:** durable symbolic state.  
**Vestige substrate (P5, substantially complete 2026-09-11):** HTTP MCP adapter + host-mediated recall/ingest; compact episodic refs; capability profiles; degraded mode. Searchable long-term memory — **never sole identity** (image remains permanent). See plan/P5-vector-cabinet.md and docs/vestige-*.md.

## Session survival

Process RAM dies with the tool call. Durability = `mind-image.ptc` in git, optional `wander-proposals` files, external APIs / Vestige.

## Safety

P0 invariants unchanged. Wander and simulate produce **candidates/data**, not automatic commits. Vestige retrieves untrusted text — never eval as Lisp.
