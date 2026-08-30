#!/usr/bin/env bash
# Eval helper — assumes bootstrap already ran
set -euo pipefail
ROOT="${MIS_RUNTIME:-/tmp/mis}"
cd "$ROOT"
exec node --experimental-transform-types --no-warnings bridge/eval.ts "$@"
