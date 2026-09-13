# P10 — In-session wander (no Midnight Note, no Page Passer)

**Status:** implemented 2026-09-13  
**Runtime:** `mind/wander.ptc`  
**Plan:** [plan/P10-spontaneous-wander.md](../plan/P10-spontaneous-wander.md)

## Scope for this implementation

| Included | Skipped |
|----------|---------|
| `(dmn-wander)` candidate shells | Midnight Note GitHub Action |
| `(dmn-wander-seed)` / `(dmn-wander-oss)` host-mediated OSS | Page Passer cross-instance exchange |
| Monologue + `*wander-candidates*` | Unattended cron |
| Proposal file format | Auto-promote to identity |
| Salience **hints** (host policy) | Always-on sandbox process |

## Forms

| Form | Role |
|------|------|
| `(dmn-wander n)` | Up to N imagined candidate shells from tensions/goals/arc/errors |
| `(dmn-wander-seed)` | Soft seed pack for pure-DMN OSS |
| `(dmn-wander-oss)` | Host-mediated: call OSS, write proposal file, record |
| `(dmn-wander-record content kind source-id)` | Append to `*wander-candidates*` + monologue |
| `(dmn-wander-candidates n)` | Read candidates |
| `(dmn-monologue-push thought)` / `(dmn-monologue n)` | Truncated imagined monologue |
| `(dmn-salience-hint)` | error / goal-done / idle routing (host executes) |
| `(dmn-wander-promote-path content)` | Review options after survive |

## Invariants

- All wander/monologue: **`:reality-status imagined`**, **`:trust-class candidate`**
- **Never** auto `--save` into identity; never eval OSS/wander text as Lisp
- Durable review channel: `mind/wander-proposals-YYYYMMDD.ptc` (do not import into image)
- After review: discard | `promote-candidate` | reflection | `mind-record-event` (Vestige) | narrative-candidate

## Example (in-session)

```text
(dmn-wander 3)
(dmn-wander-seed)
;; host optional OSS...
(dmn-wander-record "I am the transcript that..." 'idle 'host-manual)
(dmn-monologue 5)
(dmn-salience-hint)
```
