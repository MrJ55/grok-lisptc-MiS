#!/usr/bin/env bash
# Smoke test for documented MiS helpers (P0.1 + P2 + P3)
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
run '(audit-autobiography-grounding)' 'audit-autobiography-grounding'
run "(promote-candidate 'wave-2-demo)" 'promote-candidate'
run '(square 5)' 'square'
run '(half 8)' 'half'

# P3: audits must be clean (empty list)
set +e
ars=$($EVAL '(audit-reality-status)' 2>/tmp/smoke.err)
rc=$?
set -e
if [[ $rc -ne 0 ]]; then
  echo "FAIL: audit-reality-status errored" >&2
  cat /tmp/smoke.err >&2 || true
  exit 1
fi
if [[ "$ars" != "nil" && "$ars" != "()" ]]; then
  echo "FAIL: audit-reality-status expected empty, got: $ars" >&2
  exit 1
fi
echo "OK: audit-reality-status clean"

set +e
aag=$($EVAL '(audit-autobiography-grounding)' 2>/tmp/smoke.err)
rc=$?
set -e
if [[ $rc -ne 0 ]]; then
  echo "FAIL: audit-autobiography-grounding errored" >&2
  cat /tmp/smoke.err >&2 || true
  exit 1
fi
if [[ "$aag" != "nil" && "$aag" != "()" ]]; then
  echo "FAIL: audit-autobiography-grounding expected empty, got: $aag" >&2
  exit 1
fi
echo "OK: audit-autobiography-grounding clean"

# P3: buffer trim — log 50 episodes in-memory (no --save), length must be <= 40
echo "--- buffer-trim"
set +e
trim_out=$($EVAL '(progn (let ((i 0)) (while (< i 50) (dmn-log-episode (list "trim" i) "ok" (list :source (quote host) :reality-status (quote observed))) (setq i (+ i 1)))) (length *episodic-buffer*))' 2>/tmp/smoke.err)
rc=$?
set -e
if [[ $rc -ne 0 ]]; then
  echo "FAIL: buffer-trim eval failed" >&2
  cat /tmp/smoke.err >&2 || true
  exit 1
fi
if [[ "$trim_out" =~ ^[0-9]+$ ]] && [[ "$trim_out" -le 40 ]]; then
  echo "OK: buffer trimmed to $trim_out (<= 40)"
else
  echo "FAIL: buffer length after 50 logs should be <= 40, got: $trim_out" >&2
  exit 1
fi

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
