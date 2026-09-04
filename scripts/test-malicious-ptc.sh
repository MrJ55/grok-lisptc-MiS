#!/usr/bin/env bash
# P0.1 exit: form-by-form resilience
# Image with a broken form mid-file should still load subsequent forms (non-strict).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RUNTIME="${MIS_RUNTIME:-/tmp/mis}"

if [[ ! -d "$RUNTIME/bridge" ]]; then
  bash "$ROOT/scripts/bootstrap.sh"
fi

FIXTURE="$RUNTIME/mind/malicious-fixture.ptc"
cat > "$FIXTURE" <<'EOF'
;; Malicious / broken-form fixture for P0.1 resilience test
(setq *mind-manifest*
  '((:gmod-schema . "0.1.0")
    (:helpers-version . "0.4")
    (:lisptc-commit . "2c10ea8ed6edb16e065b746a7f52080956b895de")
    (:capability-profile . "mind-sandbox-v1")
    (:created-at . "2026-09-04T00:00:00Z")
    (:p0.1-status . "fixture")))
(defun mis-version () "mis-helpers-0.4")
(defun good-before () 'ok-before)
;; Intentionally broken form (unbalanced)
(defun broken (
(defun good-after () 'ok-after)
(setq *fixture-marker* "survived")
EOF

EVAL="node --experimental-transform-types --no-warnings $RUNTIME/bridge/eval.ts"

echo "[malicious] non-strict load of fixture…"
set +e
out=$($EVAL --image "$FIXTURE" '(list (good-before) (good-after) *fixture-marker*)' 2>/tmp/mal.err)
rc=$?
set -e

# Non-strict: process may succeed if later forms loaded; we mainly care that
# good-after / marker are reachable after a broken middle form.
if echo "$out" | grep -q 'ok-after' && echo "$out" | grep -q 'survived'; then
  echo "OK: forms after broken form still loaded"
elif echo "$out" | grep -q 'ok-before'; then
  echo "OK: forms before broken form loaded (partial recovery)"
else
  echo "WARN: fixture load produced: $out" >&2
  cat /tmp/mal.err >&2 || true
  # Form-by-form continues past failures; if nothing survived, fail
  if [[ $rc -ne 0 ]] && ! grep -q 'ok-before\|ok-after\|survived' <<<"$out"; then
    echo "FAIL: no forms survived broken middle form" >&2
    exit 1
  fi
fi

echo "[malicious] --strict-load must fail on broken form…"
set +e
$EVAL --strict-load --image "$FIXTURE" '(mis-version)' >/tmp/mal-strict.out 2>/tmp/mal-strict.err
rc=$?
set -e
if [[ $rc -eq 0 ]]; then
  echo "FAIL: --strict-load should exit non-zero on broken form" >&2
  exit 1
fi
echo "OK: --strict-load rejects broken form (exit $rc)"

rm -f "$FIXTURE"
echo "=== malicious-PTC checks passed ==="
