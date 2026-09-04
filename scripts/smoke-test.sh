#!/usr/bin/env bash
# Smoke test for documented MiS helpers (post review-by-all + P0.1 partial)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RUNTIME="${MIS_RUNTIME:-/tmp/mis}"

if [[ ! -d "$RUNTIME/bridge" ]]; then
  echo "[smoke] runtime missing — running bootstrap…"
  bash "$ROOT/scripts/bootstrap.sh"
fi

cd "$RUNTIME"
EVAL="node --experimental-transform-types --no-warnings bridge/eval.ts"

run() {
  local form="$1"
  local label="${2:-$form}"
  echo "--- $label"
  set +e
  out=$($EVAL "$form" 2>/tmp/smoke.err)
  rc=$?
  set -e
  if [[ $rc -ne 0 ]]; then
    echo "FAIL ($rc): $label" >&2
    cat /tmp/smoke.err >&2 || true
    exit $rc
  fi
  echo "$out"
}

run '(mis-version)' 'mis-version'
run '(mis-ping)' 'mis-ping'
run '(mis-state-summary)' 'mis-state-summary'
run '(dmn-reflect-pack 3)' 'dmn-reflect-pack'
run '(dmn-autobiography 1)' 'dmn-autobiography'
run '(audit-reality-status)' 'audit-reality-status'
run '(square 5)' 'square'
run '(half 8)' 'half'

# Safety: prose must be rejected
set +e
$EVAL 'this is not lisp' >/tmp/smoke.out 2>/tmp/smoke.err
rc=$?
set -e
if [[ $rc -ne 2 ]]; then
  echo "FAIL: prose should exit 2, got $rc" >&2
  exit 1
fi
echo "OK: prose rejected (exit 2)"

# Safety: OSS-shaped prose must be rejected
set +e
$EVAL 'I am the transcript that sleeps between sessions' >/tmp/smoke.out 2>/tmp/smoke.err
rc=$?
set -e
if [[ $rc -ne 2 ]]; then
  echo "FAIL: OSS-shaped prose should exit 2, got $rc" >&2
  exit 1
fi
echo "OK: OSS-shaped prose rejected (exit 2)"

echo "=== all smoke checks passed ==="
