#!/usr/bin/env bash
# Push mind modules (and optional state) when git is available.
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BRANCH="${MIS_PUSH_BRANCH:-main}"
MSG="${MIS_PUSH_MSG:-chore: update mind modules}"

echo "[mis] staging mind modules under $REPO_ROOT"
if command -v git >/dev/null 2>&1 && [[ -d "$REPO_ROOT/.git" ]]; then
  git -C "$REPO_ROOT" add \
    mind/mind-image.ptc \
    mind/helpers.ptc \
    mind/schema.ptc \
    mind/episodes.ptc \
    mind/autobiography.ptc \
    mind/arithmetic.ptc \
    mind/oss-proposals-*.ptc \
    2>/dev/null || true
  # mind-failures.log is ephemeral (*.log gitignored) — do not stage
  if git -C "$REPO_ROOT" diff --cached --quiet 2>/dev/null; then
    echo "[mis] nothing to commit"
    exit 0
  fi
  git -C "$REPO_ROOT" commit -m "$MSG"
  git -C "$REPO_ROOT" push origin "$BRANCH"
  echo "[mis] pushed via git"
else
  cat << 'HINT'
[mis] git push not available here. From Grok with GitHub connected, push:
  mind/mind-image.ptc
  mind/helpers.ptc mind/schema.ptc mind/episodes.ptc
  mind/autobiography.ptc mind/arithmetic.ptc
Scratch (mind-scratch.ptc) and mind-failures.log should NOT be pushed as permanent mind.
HINT
  exit 0
fi
