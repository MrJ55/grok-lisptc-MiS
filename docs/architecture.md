# Architecture

```
User (English) → Grok host → bridge/eval.ts → lisptc MemoryRepl + mind-image.ptc
```

Validate → eval → save only on success. No reset on EvalException. Scratch image optional.
