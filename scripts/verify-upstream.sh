#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
if [[ ! -f UPSTREAM.lock.json ]]; then
  echo "FAIL: UPSTREAM.lock.json missing" >&2
  exit 1
fi
if ! command -v jq >/dev/null 2>&1; then
  echo "WARN: jq not found; skipping hash check" >&2
  exit 0
fi

PIN=$(jq -r .lisptc_commit UPSTREAM.lock.json)
EXPECTED_LISP=$(jq -r .lisp_source_sha256 UPSTREAM.lock.json)
EXPECTED_ARITH=$(jq -r .arith_source_sha256 UPSTREAM.lock.json)
LISP_URL="https://raw.githubusercontent.com/1hachem/lisptc/${PIN}/packages/interpreter/src/lisp.ts"
ARITH_URL="https://raw.githubusercontent.com/1hachem/lisptc/${PIN}/packages/interpreter/src/arith.ts"

mkdir -p src

# Auto-heal incomplete vendor (missing, empty, or VENDOR_STUB marker)
if [[ ! -f src/lisp.ts ]] || [[ ! -s src/lisp.ts ]] || grep -q 'VENDOR_STUB' src/lisp.ts 2>/dev/null; then
  echo "[verify] src/lisp.ts incomplete — fetching pinned upstream…"
  curl -fsSL -o src/lisp.ts "$LISP_URL"
fi
if [[ ! -f src/arith.ts ]] || [[ ! -s src/arith.ts ]]; then
  echo "[verify] src/arith.ts incomplete — fetching pinned upstream…"
  curl -fsSL -o src/arith.ts "$ARITH_URL"
fi

ACTUAL_LISP=$(sha256sum src/lisp.ts | cut -d' ' -f1)
ACTUAL_ARITH=$(sha256sum src/arith.ts | cut -d' ' -f1)
if [[ "$EXPECTED_LISP" != "$ACTUAL_LISP" ]]; then
  echo "FAIL: src/lisp.ts hash mismatch" >&2
  echo "  expected $EXPECTED_LISP" >&2
  echo "  actual   $ACTUAL_LISP" >&2
  exit 1
fi
if [[ "$EXPECTED_ARITH" != "$ACTUAL_ARITH" ]]; then
  echo "FAIL: src/arith.ts hash mismatch" >&2
  echo "  expected $EXPECTED_ARITH" >&2
  echo "  actual   $ACTUAL_ARITH" >&2
  exit 1
fi
echo "OK: upstream sources match lock file (commit $PIN)"
