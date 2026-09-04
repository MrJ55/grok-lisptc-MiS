#!/usr/bin/env bash
# P0.1 exit: form-by-form resilience
# Balanced-but-failing form mid-file: non-strict continues; --strict-load fails.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RUNTIME="${MIS_RUNTIME:-/tmp/mis}"

if [[ ! -d "$RUNTIME/bridge" ]]; then
  bash "$ROOT/scripts/bootstrap.sh"
fi

FIXTURE="$RUNTIME/mind/malicious-fixture.ptc"
cat > "$FIXTURE" <<'EOF'
;; Malicious / failing-form fixture for P0.1 resilience test
;; Use a balanced form that errors at eval time so the form splitter still yields later forms.
(setq *mind-manifest*
  '((:gmod-schema . "0.1.0")
    (:helpers-version . "0.4")
    (:lisptc-commit . "2c10ea8ed6edb16e065b746a7f52080956b895de")
    (:capability-profile . "mind-sandbox-v1")
    (:created-at . "2026-09-04T00:00:00Z")
    (:p0.1-status . "fixture")))
(defun good-before () 'ok-before)
(no-such-function-this-should-fail)
(defun good-after () 'ok-after)
(setq *fixture-marker* "survived")
EOF

EVAL="node --experimental-transform-types --no-warnings $RUNTIME/bridge/eval.ts"

echo "[malicious] non-strict load of fixture…"
set +e
out=$($EVAL --image "$FIXTURE" '(list (good-before) (good-after) *fixture-marker*)' 2>/tmp/mal.err)
rc=$?
set -e

if echo "$out" | grep -q 'ok-after' && echo "$out" | grep -q 'survived'; then
  echo "OK: forms after failing form still loaded"
elif echo "$out" | grep -q 'ok-before'; then
  echo "OK: forms before failing form loaded (partial recovery)"
  # With form-by-form, good-after should also exist — fail if neither survived path
  if ! echo "$out" | grep -q 'ok-after' && ! echo "$out" | grep -q 'survived'; then
    echo "FAIL: expected later forms after balanced eval-error form" >&2
    echo "out=$out" >&2
    cat /tmp/mal.err >&2 || true
    exit 1
  fi
else
  echo "FAIL: no forms survived" >&2
  echo "out=$out" >&2
  cat /tmp/mal.err >&2 || true
  exit 1
fi

echo "[malicious] --strict-load must fail on eval-error form…"
set +e
$EVAL --strict-load --image "$FIXTURE" '(mis-version)' >/tmp/mal-strict.out 2>/tmp/mal-strict.err
rc=$?
set -e
if [[ $rc -eq 0 ]]; then
  echo "FAIL: --strict-load should exit non-zero on failing form" >&2
  exit 1
fi
echo "OK: --strict-load rejects failing form (exit $rc)"

rm -f "$FIXTURE"
echo "=== malicious-PTC checks passed ==="
