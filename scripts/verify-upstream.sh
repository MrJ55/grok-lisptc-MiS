#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
if [[ ! -f UPSTREAM.lock.json ]]; then
  echo "FAIL: UPSTREAM.lock.json missing" >&2
  exit 1
fi

read_lock() {
  local key="$1"
  if command -v jq >/dev/null 2>&1; then
    jq -r ".$key" UPSTREAM.lock.json
  else
    python3 -c "import json; print(json.load(open('UPSTREAM.lock.json'))['$key'])"
  fi
}

PIN=$(read_lock lisptc_commit)
EXPECTED_LISP=$(read_lock lisp_source_sha256)
EXPECTED_ARITH=$(read_lock arith_source_sha256)
VENDOR_DIR="src/vendor/lisptc-2c10ea8"
ALLOW_NET="${MIS_ALLOW_NETWORK_VENDOR:-1}"

mkdir -p src

assemble_lisp_from_parts() {
  local out="$1"
  local parts=(
    "$VENDOR_DIR/lisp.b64.part0"
    "$VENDOR_DIR/lisp.b64.part1"
    "$VENDOR_DIR/lisp.b64.part2"
    "$VENDOR_DIR/lisp.b64.part3"
  )
  for p in "${parts[@]}"; do
    [[ -f "$p" ]] || return 1
    if grep -q 'PLACEHOLDER' "$p" 2>/dev/null; then
      echo "[verify] vendor part still PLACEHOLDER: $p" >&2
      return 1
    fi
  done
  python3 - "$out" "${parts[@]}" <<'PY'
import base64, sys
out = sys.argv[1]
parts = sys.argv[2:]
data = b"".join(base64.b64decode(open(p, "rb").read()) for p in parts)
open(out, "wb").write(data)
print(f"[verify] assembled {out} ({len(data)} bytes) from vendor parts")
PY
}

fetch_lisp() {
  echo "[verify] fetching pinned src/lisp.ts (network)"
  curl -fsSL -o src/lisp.ts \
    "https://raw.githubusercontent.com/1hachem/lisptc/${PIN}/packages/interpreter/src/lisp.ts"
}

if [[ ! -f src/lisp.ts ]] || [[ ! -s src/lisp.ts ]] || grep -q 'VENDOR_STUB' src/lisp.ts 2>/dev/null; then
  echo "[verify] src/lisp.ts incomplete"
  if ! assemble_lisp_from_parts src/lisp.ts; then
    if [[ "$ALLOW_NET" == "1" ]]; then
      fetch_lisp
    else
      echo "FAIL: src/lisp.ts incomplete and vendor parts unavailable" >&2
      exit 1
    fi
  fi
fi

if [[ ! -f src/arith.ts ]] || [[ ! -s src/arith.ts ]]; then
  if [[ "$ALLOW_NET" == "1" ]]; then
    curl -fsSL -o src/arith.ts \
      "https://raw.githubusercontent.com/1hachem/lisptc/${PIN}/packages/interpreter/src/arith.ts"
  else
    echo "FAIL: src/arith.ts missing" >&2
    exit 1
  fi
fi

ACTUAL_LISP=$(sha256sum src/lisp.ts | cut -d' ' -f1)
ACTUAL_ARITH=$(sha256sum src/arith.ts | cut -d' ' -f1)

if [[ "$EXPECTED_LISP" != "$ACTUAL_LISP" ]]; then
  echo "[verify] lisp.ts hash mismatch"
  if assemble_lisp_from_parts src/lisp.ts; then
    ACTUAL_LISP=$(sha256sum src/lisp.ts | cut -d' ' -f1)
  elif [[ "$ALLOW_NET" == "1" ]]; then
    fetch_lisp
    ACTUAL_LISP=$(sha256sum src/lisp.ts | cut -d' ' -f1)
  fi
fi

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
