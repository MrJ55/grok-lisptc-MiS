---
name: mis-eval
description: Evaluate pure Lisp forms in the MiS MemoryRepl. Prefer this for any mind interaction.
---

# mis-eval

Emit only evaluable Lisp (no markdown fences required if the bridge is called with a raw string).

```bash
cd /tmp/mis
node --experimental-transform-types --no-warnings bridge/eval.ts '<forms>'
# permanent definitions:
node --experimental-transform-types --no-warnings bridge/eval.ts --save '<forms>'
```

Stdout = REPL result. Stderr = diagnostics / load messages.
