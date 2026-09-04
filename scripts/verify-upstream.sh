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
EXPECTED_LISP=$(jq -r .lisp_source_sha256 UPSTREAM.lock.json)
EXPECTED_ARITH=$(jq -r .arith_source_sha256 UPSTREAM.lock.json)
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
echo "OK: upstream sources match lock file (commit $(jq -r .lisptc_commit UPSTREAM.lock.json))"
