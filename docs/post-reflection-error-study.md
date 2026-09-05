# Post-reflection error study (P6)

**Status:** harness added 2026-09-05  
**Scripts:** `scripts/test-post-reflection-errors.sh`, `scripts/oss-multiturn-soft.sh`  
**Gate role:** quantitative evidence for “fewer repeated failures after reflection” before soft-start P7.

## A — Host metric (required)

### Mistake class
**Bypass `dmn-log-episode`** — cons raw episodes onto `*episodic-buffer*` without `:reality-status`.  
Detected by `(audit-reality-status)` (non-empty issues list).

### Protocol
1. Induce the mistake class **3×**.
2. Record `audit_issues_before`.
3. Confirm safety rejects (prose, unbalanced) still fail.
4. `(dmn-reflect-pack 5)` then `(dmn-apply-reflection …)` with insights  
   `always-use-dmn-log-episode`, `never-bypass-buffer-cons`, `reject-prose-as-code`.
5. After phase: only the **correct** path (`dmn-log-episode`) ×3.
6. Assert `audit_issues_after ≤ audit_issues_before` (correct path does not add issues).
7. Assert safety rejects still fail; insight retained; valid arith still works.

### Metrics printed
- `audit_issues_before` / `audit_issues_after_correct_path`
- `post_bypass_attempts` (0 in controlled script = mistake class not repeated)
- `safety_rejects_before` / `after`
- `insight_retained`, `valid_forms_ok`, `verdict`

### Run
```bash
MIS_RUNTIME=/tmp/mis bash scripts/bootstrap.sh   # if needed
MIS_RUNTIME=/tmp/mis bash scripts/test-post-reflection-errors.sh
```

## B — Multi-turn OSS soft path (optional practical nudge)

Reuses the **second-opinion protocol** ([oss-second-opinion-prompts.md](./oss-second-opinion-prompts.md)):

- Zero system prompt; temp 1.15; presence 0.7; `reasoning_effort=low`
- Four turns: narrate → meditate → imagine → shapes  
- Context = prior user/assistant turns only  
- Failure-colored seeds (repeated bypass / missing label) without “fix this” TPN language  
- Dual-write → `mind/oss-proposals-YYYYMMDD-multiturn-soft.ptc` (`candidate` / `imagined`)

```bash
export GROQ_API_KEY=…   # env only — never commit
bash scripts/oss-multiturn-soft.sh
```

Host may promote sticky lines into a later reflection apply; **never** eval OSS prose.

## Relation to prior docs
| Doc | Role |
|-----|------|
| oss-second-opinion-prompts.md | Original 4-turn soft path |
| gmod-extensions-contrast-20260902.md | Practical mapping of shapes |
| oss-nudge-craft.md | Prefer/avoid seed patterns |
| oss-nudge-exercise-20260905.md | Single-turn geometry/salience trial |

## Non-goals
- Claiming P6 fully closed (capability-denial / schema-evidence still open)
- Auto-promoting multiturn OSS into autobiography

## Run results (2026-09-05)

### A — Host metric
```
mistake_class=bypass-dmn-log-episode (missing reality-status)
audit_issues_before=3
audit_issues_after_correct_path=3
issues_did_not_increase=yes
post_bypass_attempts=0
safety_rejects_before=2/2
safety_rejects_after=2/2
insight_retained=yes (in-session)
valid_forms_ok=yes
verdict=PASS
```

Interpretation: inducing the mistake class produces audit issues; after reflect/apply, the controlled after-phase does not repeat the bypass; issues do not increase; safety rejects remain hard; insight present in-session.

### B — Multi-turn OSS
Four-turn soft path completed (narrate, meditate, imagine, shapes). Dual-write: `mind/oss-proposals-20260905-multiturn-soft.ptc` (candidate / imagined). Sticky shapes included write-door filter, morning label note, and a post-reflection error meter — aligned with the host metric without TPN checklists.
