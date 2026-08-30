---
name: mis-bootstrap
description: Restore the lisptc Mind-in-Sandbox runtime and mind image. Use at the start of a new session or when /tmp/mis is missing.
---

# mis-bootstrap

1. Ensure the grok-lisptc-MiS repo is available (clone or already under artifacts).
2. Run `bash scripts/bootstrap.sh` (or follow docs/bootstrap.md).
3. Confirm with:
   ```bash
   cd /tmp/mis && node --experimental-transform-types --no-warnings bridge/eval.ts '(list (mis-version) (mis-ping))'
   ```
4. Report success or the exact error so the host can fix bootstrap.
