#!/usr/bin/env bash
# Assemble a runnable MiS tree under /tmp/mis
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RUNTIME="${MIS_RUNTIME:-/tmp/mis}"
ZOD_DIR="${MIS_ZOD_DIR:-/tmp/mis-node}"

echo "[mis] repo: $REPO_ROOT"
echo "[mis] runtime: $RUNTIME"

# 1. zod
if [[ ! -d "$ZOD_DIR/node_modules/zod" ]]; then
  echo "[mis] installing zod…"
  mkdir -p "$ZOD_DIR"
  (cd "$ZOD_DIR" && npm init -y >/dev/null 2>&1 && npm install zod@4.4.3 --no-fund --no-audit)
fi

# 2. runtime tree
rm -rf "$RUNTIME"
mkdir -p "$RUNTIME"/{bridge,mind,src}
cp -a "$REPO_ROOT/src/"* "$RUNTIME/src/"
cp -a "$REPO_ROOT/bridge/"* "$RUNTIME/bridge/"
cp -a "$REPO_ROOT/mind/"* "$RUNTIME/mind/"
cp "$REPO_ROOT/package.json" "$RUNTIME/"
cp -a "$ZOD_DIR/node_modules" "$RUNTIME/"

echo "[mis] smoke test…"
cd "$RUNTIME"
out=$(node --experimental-transform-types --no-warnings bridge/eval.ts '(list (mis-version) (mis-ping))' 2>/dev/null || true)
echo "[mis] result: $out"
echo "[mis] bootstrap complete. cd $RUNTIME && node --experimental-transform-types --no-warnings bridge/eval.ts '(…)'"
