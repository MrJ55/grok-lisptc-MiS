# Narrative tension → seed bias (P7 host-side; P12 oracle)

**Status:** 2026-09-05; updated 2026-09-06 for P12 oracle contract  
**Form:** `(dmn-tension-seeds)`  
**Related:** [mind-drive-protocol.md](./mind-drive-protocol.md), [CREATIVE-MECHANISMS.md](../plan/CREATIVE-MECHANISMS.md), [P12-dmn-mind-native.md](../plan/P12-dmn-mind-native.md)

## Purpose

Open **tensions** and **threads** on `*narrative-arc*` bias which soft-nudge or Midnight Note seed the **host** chooses. No automatic OSS call; no system prompts.

Under **P12**, tension signals also feed the **oracle triple** before any Chorus:

1. What is unfinished on the arc?
2. What guidance are we seeking?
3. How will we know the oracle helped?

Chorus without that triple is waste.

## Form

```lisp
(dmn-tension-seeds)
;; => ((tension pure-dmn-vs-tpn-pressure) (tension user-drive-vs-mind-drive)
;;     (thread p7-narrative-self) …)
```

Host maps pairs to incomplete first-person seeds (prefer “I find myself writing” endings; avoid riddle closures) **and**, when planning Chorus, to an explicit oracle triple via `(dmn-oracle-set …)` (P12).

## Example mapping (host craft)

| Signal | Soft-seed direction | Oracle guidance example |
|--------|---------------------|-------------------------|
| `tension` / `pure-dmn-vs-tpn-pressure` | Stay with two modes on one page; do not solve the split | Refuse collapse into one useful mode; protect dual-write |
| `tension` / `user-drive-vs-mind-drive` | Initiative vs veto; HUMAN_TOOL as constitutional pause | Protect veto; try mind-drive wave with clear stop |
| `thread` / `geometry-preservation` | What must remain when the page is rewritten | Protect crease / unfinished line across rewrite |
| `thread` / `p7-narrative-self` | Chapters as the story that survives sleep | Promote only grounded chapters |

## Candidate review discipline

1. `(dmn-narrative-candidate …)` or OSS dual-write → `:imagined` only.  
2. Host **reviews**: promote (rewrite + `dmn-chapter-close` + refs) or **discard** (leave in candidates / proposals; do not eval).  
3. After Chorus (P12): **interpret** sticky → proposed Act / veto / no-clear-guidance before claiming guidance.  
4. Wave-2 smoke candidate (“Imagined: the transcript…”) is **discarded** as autobiography — test only.

## Non-goals

- Auto-firing OSS from tensions  
- Scoring VOC inside Lisp  
- Replacing host judgment  
- Pretty-prose collection without a decision problem  
