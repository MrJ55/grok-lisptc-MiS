# P20 — Capacity / tiered retention

**Status:** planned  
**Depends on:** P13.1

## Goal

Prevent closed-loop growth from exhausting sandbox RAM (~1.2GiB, no swap) or drowning host context.

## Tiers

| Tier | Location | Content |
|------|----------|--------|
| Hot | `/tmp/mis` | Working image copy, short eval |
| Warm | `artifacts` + GitHub | mind-image, modules, schema, autobiography, episodic window, blackboard |
| Cold | User PC / external | Full history, old chapters, raw OSS logs |

## Tasks

- [ ] Soft budgets → compaction duty.
- [ ] Capacity metrics in `mis-state-summary` or new form.
- [ ] Blackboard `archive/` retention.
- [ ] Document export to PC as cold tier (no remote RAM mount).

## Exit criteria

Metrics visible; compaction path documented; hot rebuild from warm verified.
