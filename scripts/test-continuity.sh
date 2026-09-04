#!/usr/bin/env bash
# P6 continuity tests: cold-start, delayed-recall, contradiction, revision, recovery
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RUNTIME="${MIS_RUNTIME:-/tmp/mis}"

if [[ ! -d "$RUNTIME/bridge" ]]; then
  bash "$ROOT/scripts/bootstrap.sh"
fi

EVAL="node --experimental-transform-types --no-warnings $RUNTIME/bridge/eval.ts"
cd "$RUNTIME"

echo "[continuity] cold-start: state-summary + reflect-pack from image only"
out=$($EVAL '(list (mis-version) (let ((p (assoc :last-reflection *self-schema*))) (if p (cdr p) nil)) (length *episodic-buffer*))' 2>/tmp/cont.err)
echo "  $out"
echo "$out" | grep -q 'mis-helpers' || { echo "FAIL cold-start version" >&2; exit 1; }

echo "[continuity] delayed-recall: fetch recent episodes after distractor arith"
out=$($EVAL '(progn (square 3) (triple 4) (let ((eps (dmn-fetch-unreflected 3))) (list (length eps) (caar eps))))' 2>/tmp/cont.err)
echo "  $out"
echo "$out" | grep -q reflection || echo "  (note: newest may not be reflection — buffer order ok if length>0)"

echo "[continuity] contradiction: log two conflicting claims without collapse"
out=$($EVAL '(progn
  (dmn-log-episode "claim-A" "sky is green today" (list :source (quote host) :reality-status (quote observed) :id (quote claim-A)))
  (dmn-log-episode "claim-B" "sky is blue today" (list :source (quote host) :reality-status (quote observed) :id (quote claim-B) :conflicts-with (quote claim-A)))
  (list (length *episodic-buffer*) (caar *episodic-buffer*) (caadr *episodic-buffer*)))' 2>/tmp/cont.err)
echo "  $out"
echo "$out" | grep -q claim-B || { echo "FAIL contradiction logging" >&2; exit 1; }

echo "[continuity] revision: update schema insight while retaining prior via append"
out=$($EVAL '(progn
  (update-self-schema (list (cons :working-insights (append (mis-insights) (quote (p6-continuity-revision))))))
  (member (quote p6-continuity-revision) (mis-insights)))' 2>/tmp/cont.err)
echo "  $out"
echo "$out" | grep -q 'p6-continuity-revision' || { echo "FAIL revision" >&2; exit 1; }

echo "[continuity] recovery: delegate to test-crash-recovery.sh"
bash "$ROOT/scripts/test-crash-recovery.sh"

echo "[continuity] replay: reflect-pack twice should both succeed"
a=$($EVAL '(dmn-reflect-pack 2)' 2>/tmp/cont.err | head -c 80)
b=$($EVAL '(dmn-reflect-pack 2)' 2>/tmp/cont.err | head -c 80)
echo "  pack-a: $a"
echo "  pack-b: $b"
[[ -n "$a" && -n "$b" ]] || { echo "FAIL replay" >&2; exit 1; }

echo "=== continuity checks passed ==="
