---
name: mis-save
description: Persist Lisp definitions into the permanent mind image and optionally push to GitHub.
---

# mis-save

1. Eval with `--save` so forms are appended to `mind/mind-image.ptc`.
2. Copy the updated image back into the repo working tree if different.
3. Commit and push to https://github.com/MrJ55/grok-lisptc-MiS so future sessions restore the same state.

Keep commits small and focused on the image + any new learnings.
