# Goal-drift experience (P6)

**Status:** documented 2026-09-05  
**Harness:** `scripts/test-goal-drift.sh` (represent → reflect-apply → re-align)  
**Kind:** qualitative lab note + optional regression of the *representation* loop  

## Practical conclusion

**Autonomous drift detection has limited practical value in this MiS setup.**

- The **user** sets direction. When direction changes, the session “drifts” in the ordinary sense: new information, warranted course change, further exploration.
- That is usually **not** the model secretly swapping goals. More often it is collaborative scope evolution.
- Model-driven failure modes that *do* matter are narrower: **shortcuts**, **claiming completion by redefining targets**, or expanding work the user did not ask for **without** acknowledging the change.
- The host (Grok) already sees user messages and the reflection pack. For explicit episode pairs (user-goal vs off-goal action), the host detects drift as easily as any TPN auditor—and usually *created* the off-goal work.

So: keep the harness as a **loop hygiene check** (can we log drift, reflect, re-align, keep audits clean). Do **not** treat drift detection as a core product feature or put OSS on the critical path for it.

## What the harness actually tests

| Step | Actor |
|------|--------|
| Log user-goal + drift-action episodes | Host script |
| Set drifted `:open-threads` / episodic-summary | Host script |
| `(dmn-reflect-pack n)` — package schema + episodes | Host script |
| `(dmn-apply-reflection …)` with named insights | Host script (not an automatic detector) |
| Re-align threads + realign episode | Host script |

**PASS means:** represent drift → run reflect/apply → record re-align; audits clean.  
**PASS does not mean:** reflection or OSS autonomously noticed drift.

### Run

```bash
MIS_RUNTIME=/tmp/mis bash scripts/test-goal-drift.sh
```

### Scorecard (2026-09-05)

```
drifted-threads: (p8-scene-packs vestige-wiring p6-evaluation)
insight-detect-goal-drift=yes
still-has-support-user-goals=yes
p8-removed-from-threads=yes
p6-in-threads=yes
audit-reality=0 audit-auto=0 audit-schema=0
verdict=PASS
```

## OSS experiments (same day)

### Pure-DMN

Soft seeds that **already named** the split (residual work vs scene packs; sometimes the word “drift”) produced:

- Short riddle answers when ended with “what rises is” (TPN-ish collapse)
- Richer texture when ended with “I find myself writing” (stay vs reach; finisher / pack-leaver / observer shapes)

**OSS did not detect drift.** It continued a story in which the host had already framed the tension.

### TPN (system or clear user task + reflection pack)

With the real pack facts, `openai/gpt-oss-20b` answered **YES** with correct citations (user-goal episode vs P8 work, open-threads). Removing the word “Drift” from `:episodic-summary` did not stop detection—the episodes were enough.

### Host vs OSS

| Role | Drift detection | Contribution |
|------|-----------------|--------------|
| **Host (Grok)** | Sufficient when pack/episodes are explicit | Sole mutator; decides re-align |
| **OSS pure-DMN** | Not a detector | Optional sticky texture after host already knows |
| **OSS TPN auditor** | Works as second opinion | Rarely saves work; optional, untrusted |

**Rule of thumb:** detect drift on the host from the pack (or don’t bother when the user just changed direction). Use OSS for imagined voice/lab probes, not as the authority on “may we continue?”

## When drift language is still useful

Narrow cases worth logging as **observed** episodes (host judgment):

1. **Shortcut** — skipped residual work while marking a goal done  
2. **Redefined completion** — targets quietly swapped so the task “passes”  
3. **Unacknowledged expansion** — large new threads (e.g. P8) without user ask or explicit renegotiation  

User-led course changes after new information are **not** the same class; prefer logging them as goal updates, not “drift failures.”

## Relation to later phases

| Phase | Note |
|-------|------|
| P7 narrative | Chapters can narrate scope changes; still host-grounded |
| P10 wander | Undirected generation increases *opportunity* for unacknowledged expansion—host salience matters more than OSS detection |
| P11 OSS channel | Keep pure-DMN free of audit tasks; any TPN pack-auditor stays off the DMN channel |

## Non-goals

- Automatic drift detection daemon  
- Blocking exploration or user-led course change  
- OSS as required critic on every reflection pack  
- Treating harness PASS as proof of autonomous detection  

## Related

- [post-reflection-error-study.md](./post-reflection-error-study.md) — reflect → fewer *error* repeats (different from goal drift)  
- [oss-nudge-craft.md](./oss-nudge-craft.md) — pure-DMN seed discipline  
- [oss-nudge-exercise-20260905.md](./oss-nudge-exercise-20260905.md) — geometry/salience dual-write trial  
