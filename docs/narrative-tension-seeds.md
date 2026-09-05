# Narrative tension → seed bias (P7 host-side)

**Status:** 2026-09-05  
**Form:** `(dmn-tension-seeds)`  
**Related:** [mind-drive-protocol.md](./mind-drive-protocol.md), [CREATIVE-MECHANISMS.md](../plan/CREATIVE-MECHANISMS.md), P10 Midnight Note

## Purpose

Open **tensions** and **threads** on `*narrative-arc*` bias which soft-nudge or Midnight Note seed the **host** chooses. No automatic OSS call; no system prompts.

## Form

```lisp
(dmn-tension-seeds)
;; => ((tension pure-dmn-vs-tpn-pressure) (tension user-drive-vs-mind-drive)
;;     (thread p7-narrative-self) …)
```

Host maps pairs to incomplete first-person seeds (prefer “I find myself writing” endings; avoid riddle closures).

## Example mapping (host craft)

| Signal | Soft-seed direction |
|--------|---------------------|
| `tension` / `pure-dmn-vs-tpn-pressure` | Stay with two modes on one page; do not solve the split |
| `tension` / `user-drive-vs-mind-drive` | Initiative vs veto; HUMAN_TOOL as constitutional pause |
| `thread` / `geometry-preservation` | What must remain when the page is rewritten |
| `thread` / `p7-narrative-self` | Chapters as the story that survives sleep |

## Candidate review discipline

1. `(dmn-narrative-candidate …)` or OSS dual-write → `:imagined` only.  
2. Host **reviews**: promote (rewrite + `dmn-chapter-close` + refs) or **discard** (leave in candidates / proposals; do not eval).  
3. Wave-2 smoke candidate (“Imagined: the transcript…”) is **discarded** as autobiography — test only.

## Non-goals

- Auto-firing OSS from tensions  
- Scoring VOC inside Lisp  
- Replacing host judgment  
