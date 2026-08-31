#!/usr/bin/env bash
# Optional: push mind/mind-image.ptc to GitHub when git/gh available.
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
IMAGE="${1:-$REPO_ROOT/mind/mind-image.ptc}"
BRANCH="${MIS_PUSH_BRANCH:-main}"
MSG="${MIS_PUSH_MSG:-chore: update mind-image.ptc}"
if [[ ! -f "$IMAGE" ]]; then echo "[mis] no image at $IMAGE" >&2; exit 1; fi
echo "[mis] image: $IMAGE ($(wc -c < "$IMAGE") bytes)"
if command -v gh >/dev/null 2>&1 && [[ -d "$REPO_ROOT/.git" ]]; then
  git -C "$REPO_ROOT" add mind/mind-image.ptc mind/helpers.ptc 2>/dev/null || true
  if git -C "$REPO_ROOT" diff --cached --quiet 2>/dev/null; then echo "[mis] nothing to commit"; exit 0; fi
  git -C "$REPO_ROOT" commit -m "$MSG"
  git -C "$REPO_ROOT" push origin "$BRANCH"
  echo "[mis] pushed via git"
else
  cat << 'HINT'
[mis] git/gh push not available here. From Grok with GitHub connected, push mind/mind-image.ptc via the repo tool.
Scratch (mind-scratch.ptc) should NOT be pushed as the permanent mind.
HINT
  exit 0
fi
