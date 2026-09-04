#!/usr/bin/env bash
# Assemble runnable MiS under /tmp/mis — prefer vendored upstream; fetch pinned if incomplete
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RUNTIME="${MIS_RUNTIME:-/tmp/mis}"
ZOD_DIR="${MIS_ZOD_DIR:-/tmp/mis-node}"

echo "[mis] repo: $REPO_ROOT"
echo "[mis] runtime: $RUNTIME"

# --- ensure lisp.ts + arith.ts in repo src (prefer vendored; fall back to lock pin) ---
mkdir -p "$REPO_ROOT/src"
PIN="2c10ea8ed6edb16e065b746a7f52080956b895de"
UPSTREAM_LISP_URL="https://raw.githubusercontent.com/1hachem/lisptc/${PIN}/packages/interpreter/src/lisp.ts"
UPSTREAM_ARITH_URL="https://raw.githubusercontent.com/1hachem/lisptc/${PIN}/packages/interpreter/src/arith.ts"
EXPECTED_LISP_SHA="ad42e6bc123d05894c32783f32bbadf46a8660a9c44bdeb3527f9a8b772026e2"
EXPECTED_ARITH_SHA="aa0e58ca95731c99f3df0acbacba0d5406b8dbc3975b68a2f228f2914f3a50a2"

needs_lisp=0
if [[ ! -f "$REPO_ROOT/src/lisp.ts" ]] || [[ ! -s "$REPO_ROOT/src/lisp.ts" ]]; then
  needs_lisp=1
elif grep -q 'VENDOR_STUB' "$REPO_ROOT/src/lisp.ts" 2>/dev/null; then
  needs_lisp=1
elif command -v sha256sum >/dev/null 2>&1; then
  actual=$(sha256sum "$REPO_ROOT/src/lisp.ts" | cut -d' ' -f1)
  if [[ "$actual" != "$EXPECTED_LISP_SHA" ]]; then
    echo "[mis] src/lisp.ts hash mismatch — re-fetching pinned upstream…"
    needs_lisp=1
  fi
fi

if [[ "$needs_lisp" -eq 1 ]]; then
  echo "[mis] fetching pinned src/lisp.ts…"
  curl -fsSL -o "$REPO_ROOT/src/lisp.ts" "$UPSTREAM_LISP_URL"
fi

if [[ ! -f "$REPO_ROOT/src/arith.ts" ]] || [[ ! -s "$REPO_ROOT/src/arith.ts" ]]; then
  echo "[mis] src/arith.ts missing — fetching pinned upstream…"
  curl -fsSL -o "$REPO_ROOT/src/arith.ts" "$UPSTREAM_ARITH_URL"
elif command -v sha256sum >/dev/null 2>&1; then
  actual=$(sha256sum "$REPO_ROOT/src/arith.ts" | cut -d' ' -f1)
  if [[ "$actual" != "$EXPECTED_ARITH_SHA" ]]; then
    echo "[mis] src/arith.ts hash mismatch — re-fetching pinned upstream…"
    curl -fsSL -o "$REPO_ROOT/src/arith.ts" "$UPSTREAM_ARITH_URL"
  fi
fi

# Optional: verify against lock if present
if [[ -f "$REPO_ROOT/UPSTREAM.lock.json" ]] && command -v jq >/dev/null 2>&1; then
  if [[ -x "$REPO_ROOT/scripts/verify-upstream.sh" ]]; then
    bash "$REPO_ROOT/scripts/verify-upstream.sh" || echo "[mis] warning: upstream hash check failed" >&2
  fi
fi

# --- zod ---
if [[ ! -d "$ZOD_DIR/node_modules/zod" ]]; then
  echo "[mis] installing zod…"
  mkdir -p "$ZOD_DIR"
  (cd "$ZOD_DIR" && npm init -y >/dev/null 2>&1 && npm install zod@4.4.3 --registry https://registry.npmjs.org --no-fund --no-audit)
fi

# --- runtime tree ---
rm -rf "$RUNTIME"
mkdir -p "$RUNTIME"/{bridge,mind,src}
cp -a "$REPO_ROOT/src/"* "$RUNTIME/src/"
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
echo "[mis] bootstrap OK. cd $RUNTIME && node --experimental-transform-types --no-warnings bridge/eval.ts '(…)'"
