#!/usr/bin/env bash
# P0.1 exit: crash recovery / last-known-good
# Verifies that LKG is written before mutation and remains bootable.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RUNTIME="${MIS_RUNTIME:-/tmp/mis}"
STATE_DIR="$ROOT/state"
LKG="$STATE_DIR/checkpoints/last-known-good.ptc"
IMAGE="$ROOT/mind/mind-image.ptc"
TEST_IMAGE="$ROOT/mind/mind-image.crash-test.ptc"

echo "[crash] ensuring runtime…"
if [[ ! -d "$RUNTIME/bridge" ]]; then
  bash "$ROOT/scripts/bootstrap.sh"
fi

# Work on a disposable copy of the image
cp "$IMAGE" "$TEST_IMAGE"
export MIS_IMAGE="$TEST_IMAGE"

EVAL="node --experimental-transform-types --no-warnings $RUNTIME/bridge/eval.ts"
# Bridge paths are relative to runtime; copy image into runtime mind as well
cp "$TEST_IMAGE" "$RUNTIME/mind/mind-image.crash-test.ptc"
export MIS_IMAGE="$RUNTIME/mind/mind-image.crash-test.ptc"

cd "$RUNTIME"

# Baseline: image must load
echo "[crash] baseline load…"
$EVAL --image "$MIS_IMAGE" '(mis-version)' >/tmp/crash-base.out 2>/tmp/crash-base.err

# Successful --save should create/refresh LKG under repo state/ (bridge uses repo-relative state)
# Bridge resolves STATE_DIR relative to bridge/ → ../state under runtime. For this test we
# also check the runtime state path that eval.ts actually writes.
RT_STATE="$RUNTIME/state"
RT_LKG="$RT_STATE/checkpoints/last-known-good.ptc"

echo "[crash] performing --save to create LKG…"
$EVAL --image "$MIS_IMAGE" --save '(setq *crash-test-marker* "ok")' >/tmp/crash-save.out 2>/tmp/crash-save.err

if [[ ! -f "$RT_LKG" ]]; then
  echo "FAIL: last-known-good.ptc was not created at $RT_LKG" >&2
  cat /tmp/crash-save.err >&2 || true
  exit 1
fi
echo "OK: LKG exists ($(wc -c < "$RT_LKG") bytes)"

# Corrupt the live image (truncate / inject garbage)
echo "[crash] corrupting live image…"
printf ';; CORRUPT\n(' > "$MIS_IMAGE"

# LKG must still load cleanly
echo "[crash] loading from LKG…"
set +e
$EVAL --image "$RT_LKG" '(list (mis-version) (mis-ping))' >/tmp/crash-lkg.out 2>/tmp/crash-lkg.err
rc=$?
set -e
if [[ $rc -ne 0 ]]; then
  echo "FAIL: LKG is not bootable (exit $rc)" >&2
  cat /tmp/crash-lkg.err >&2 || true
  exit 1
fi
echo "OK: LKG boots ($(cat /tmp/crash-lkg.out | tr -d '\n'))"

# Restore test image from LKG (simulates recovery)
echo "[crash] recovering live image from LKG…"
cp "$RT_LKG" "$MIS_IMAGE"
$EVAL --image "$MIS_IMAGE" '(mis-version)' >/tmp/crash-recover.out 2>/tmp/crash-recover.err
echo "OK: recovered image boots"

# Cleanup disposable files
rm -f "$ROOT/mind/mind-image.crash-test.ptc" "$RUNTIME/mind/mind-image.crash-test.ptc"

echo "=== crash-recovery checks passed ==="
