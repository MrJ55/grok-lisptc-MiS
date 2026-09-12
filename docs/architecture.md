# Architecture — grok-lisptc-MiS

Deterministic **lisptc** transcript image + **Grok host** + optional pure-DMN OSS channel.

## Layers

```
human goals
    ↓
Grok host (natural language, tool use, --save policy)
    ↓
bridge/eval.ts (validate, load image, eval, HOST_DUTY trailer, optional save)
    ↓
mind image (lisptc) — schema, episodes, autobiography, oracle, vestige contract, mind-duty
    ↓
optional substrate: Vestige HTTP MCP (ranked long-term memory; not identity)
```

**Host owns:** when to reflect, narrate, simulate, wander; what to `--save`.  
**Mind owns the agenda:** `(mind-duty-check)` computes obligations; host must poll (bridge `HOST_DUTY` trailer). See [mind-duty.md](./mind-duty.md).

**Runtime authority is the mind** for Chorus (P12), Vestige host rules (P5), and duty surface (2026-09-12). Docs are archive.

## Trust

Untrusted text (OSS, Vestige recall content, raw transcript snippets) is **never** evaluated as Lisp. See [trust-classes.md](./trust-classes.md).

## Related

- [mind-duty.md](./mind-duty.md)
- [session-handoff.md](./session-handoff.md)
- [mind-api.md](./mind-api.md)
- [dmn-runtime-vs-archive.md](./dmn-runtime-vs-archive.md)
