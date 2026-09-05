#!/usr/bin/env bash
# Thin pure-DMN OSS call via bridge/oss.ts (P11 lock).
# Requires GROQ_API_KEY. Never commit secrets.
# Dual-writes imagined candidates; never evaluates OSS text.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
exec node --experimental-transform-types --no-warnings bridge/oss.ts "$@"
