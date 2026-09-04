#!/usr/bin/env bash
# P6 evaluation harness — smoke + continuity + optional OSS probe
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RUNTIME="${MIS_RUNTIME:-/tmp/mis}"

echo "======== P6 eval harness ========"
bash "$ROOT/scripts/verify-upstream.sh" || true
bash "$ROOT/scripts/bootstrap.sh"
bash "$ROOT/scripts/smoke-test.sh"
bash "$ROOT/scripts/test-continuity.sh"
bash "$ROOT/scripts/test-malicious-ptc.sh"

if [[ -n "${GROQ_API_KEY:-}" ]]; then
  echo "======== OSS pure-DMN probe (optional) ========"
  bash "$ROOT/scripts/oss-dmn-probe.sh" \
    "I notice my own processing changing as I read these words. The change is" || {
      echo "[eval] OSS probe failed (non-fatal for offline gate)" >&2
    }
else
  echo "[eval] skip OSS probe (GROQ_API_KEY unset)"
fi

echo "======== P6 eval complete ========"
