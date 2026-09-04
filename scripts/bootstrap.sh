#!/usr/bin/env bash
# Assemble runnable MiS under /tmp/mis — vendored sources (offline for interpreter)
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RUNTIME="${MIS_RUNTIME:-/tmp/mis}"
ZOD_DIR="${MIS_ZOD_DIR:-/tmp/mis-node}"
ALLOW_NET="${MIS_ALLOW_NETWORK_VENDOR:-0}"

echo "[mis] repo: $REPO_ROOT"
echo "[mis] runtime: $RUNTIME"

mkdir -p "$REPO_ROOT/src"
PIN="2c10ea8ed6edb16e065b746a7f52080956b895de"
EXPECTED_LISP_SHA="ad42e6bc123d05894c32783f32bbadf46a8660a9c44bdeb3527f9a8b772026e2"
EXPECTED_ARITH_SHA="aa0e58ca95731c99f3df0acbacba0d5406b8dbc3975b68a2f228f2914f3a50a2"
VENDOR_DIR="$REPO_ROOT/src/vendor/lisptc-2c10ea8"

assemble_lisp_from_parts() {
  local out="$1"
  local parts=(
    "$VENDOR_DIR/lisp.b64.part0"
    "$VENDOR_DIR/lisp.b64.part1"
    "$VENDOR_DIR/lisp.b64.part2"
    "$VENDOR_DIR/lisp.b64.part3"
  )
  for p in "${parts[@]}"; do
    if [[ ! -f "$p" ]]; then
      echo "[mis] missing vendor part: $p" >&2
      return 1
    fi
  done
  python3 - "$out" "${parts[@]}" <<'PY'
import base64, sys
out = sys.argv[1]
parts = sys.argv[2:]
data = b"".join(base64.b64decode(open(p, "rb").read()) for p in parts)
open(out, "wb").write(data)
print(f"[mis] assembled {out} ({len(data)} bytes) from {len(parts)} vendor parts")
PY
}

needs_lisp=0
if [[ ! -f "$REPO_ROOT/src/lisp.ts" ]] || [[ ! -s "$REPO_ROOT/src/lisp.ts" ]]; then
  needs_lisp=1
elif grep -q 'VENDOR_STUB' "$REPO_ROOT/src/lisp.ts" 2>/dev/null; then
  needs_lisp=1
elif command -v sha256sum >/dev/null 2>&1; then
  actual=$(sha256sum "$REPO_ROOT/src/lisp.ts" | cut -d' ' -f1)
  if [[ "$actual" != "$EXPECTED_LISP_SHA" ]]; then
    echo "[mis] src/lisp.ts hash mismatch — will reassemble from vendor parts"
    needs_lisp=1
  fi
fi

if [[ "$needs_lisp" -eq 1 ]]; then
  if assemble_lisp_from_parts "$REPO_ROOT/src/lisp.ts"; then
    :
  elif [[ "$ALLOW_NET" == "1" ]]; then
    echo "[mis] vendor parts missing — fetching pinned upstream (MIS_ALLOW_NETWORK_VENDOR=1)…"
    curl -fsSL -o "$REPO_ROOT/src/lisp.ts" \
      "https://raw.githubusercontent.com/1hachem/lisptc/${PIN}/packages/interpreter/src/lisp.ts"
  else
    echo "[mis] FATAL: src/lisp.ts incomplete and vendor parts unavailable (set MIS_ALLOW_NETWORK_VENDOR=1 to allow fetch)" >&2
    exit 1
  fi
fi

if [[ ! -f "$REPO_ROOT/src/arith.ts" ]] || [[ ! -s "$REPO_ROOT/src/arith.ts" ]]; then
  if [[ "$ALLOW_NET" == "1" ]]; then
    echo "[mis] src/arith.ts missing — fetching pinned upstream…"
    curl -fsSL -o "$REPO_ROOT/src/arith.ts" \
      "https://raw.githubusercontent.com/1hachem/lisptc/${PIN}/packages/interpreter/src/arith.ts"
  else
    echo "[mis] FATAL: src/arith.ts missing (expected vendored in repo)" >&2
    exit 1
  fi
elif command -v sha256sum >/dev/null 2>&1; then
  actual=$(sha256sum "$REPO_ROOT/src/arith.ts" | cut -d' ' -f1)
  if [[ "$actual" != "$EXPECTED_ARITH_SHA" ]]; then
    echo "[mis] FATAL: src/arith.ts hash mismatch (expected vendored upstream)" >&2
    exit 1
  fi
fi

if [[ -f "$REPO_ROOT/UPSTREAM.lock.json" ]]; then
  if [[ -x "$REPO_ROOT/scripts/verify-upstream.sh" ]]; then
    bash "$REPO_ROOT/scripts/verify-upstream.sh" || echo "[mis] warning: upstream hash check failed" >&2
  fi
fi

if [[ ! -d "$ZOD_DIR/node_modules/zod" ]]; then
  echo "[mis] installing zod…"
  mkdir -p "$ZOD_DIR"
  (cd "$ZOD_DIR" && npm init -y >/dev/null 2>&1 && npm install zod@4.4.3 --registry https://registry.npmjs.org --no-fund --no-audit)
fi

rm -rf "$RUNTIME"
mkdir -p "$RUNTIME"/{bridge,mind,src}
cp -a "$REPO_ROOT/src/lisp.ts" "$RUNTIME/src/"
cp -a "$REPO_ROOT/src/arith.ts" "$RUNTIME/src/"
if [[ -f "$REPO_ROOT/src/README.md" ]]; then cp -a "$REPO_ROOT/src/README.md" "$RUNTIME/src/"; fi
cp -a "$REPO_ROOT/bridge/"* "$RUNTIME/bridge/"
cp -a "$REPO_ROOT/mind/"* "$RUNTIME/mind/" 2>/dev/null || true
cp "$REPO_ROOT/package.json" "$RUNTIME/"
cp -a "$ZOD_DIR/node_modules" "$RUNTIME/"

if [[ ! -f "$RUNTIME/src/lisp.ts" ]]; then
  echo "[mis] FATAL: lisp.ts still missing after bootstrap" >&2
  exit 1
fi

echo "[mis] smoke test…"
cd "$RUNTIME"
set +e
out=$(node --experimental-transform-types --no-warnings bridge/eval.ts '(list (mis-version) (mis-ping))' 2>/tmp/mis-smoke.err)
rc=$?
set -e
echo "[mis] smoke stdout: $out"
if [[ $rc -ne 0 ]]; then
  echo "[mis] smoke stderr:" >&2
  cat /tmp/mis-smoke.err >&2 || true
  echo "[mis] FATAL: smoke test failed (exit $rc)" >&2
  exit $rc
fi
echo "[mis] bootstrap OK. cd $RUNTIME && node --experimental-transform-types --no-warnings bridge/eval.ts '(\u2026)'"
