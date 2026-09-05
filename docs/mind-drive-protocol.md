# Mind-drive protocol (Human Tool–shaped)

**Status:** adopted 2026-09-05 (minimal path)  
**Related:** [goal-drift-scenario.md](./goal-drift-scenario.md), [P7-narrative-self.md](../plan/P7-narrative-self.md), Human Tool idea (tcz.hu/blog/2026/09/03/human-tool/)

## Purpose

Flip **initiative** without flipping **sovereignty**.

- **User-drive (default historically):** user message starts each turn; mind/narrative advances only when asked.  
- **Mind-drive:** Grok runs a short loop from `*narrative-arc*` / `:open-threads`; the human is a **high-latency tool** for direction, approval, facts, encouragement, or halt.

Grok remains sole mutator of the mind image. The human remains goal source and veto.

## Modes

| Mode | Who initiates | Bare user line means |
|------|----------------|----------------------|
| `user-drive` | User | New directive / conversation |
| `mind-drive` | Host (Grok) from arc/threads | Answer to last `HUMAN_TOOL` block |
| `hybrid` | Host until user prefixes `DIR:` or `/user` | Tool return unless prefixed |

Schema keys (on `*self-schema*`):

- `:session-mode` — `user-drive` \| `mind-drive` \| `hybrid`
- `:human-tool-policy` — short policy symbol or string (e.g. `elicit-on-identity-save`)

## Wave algorithm (one wave)

1. Load mind image (bootstrap if needed).  
2. `(dmn-reflect-pack n)` — host reads schema + recent episodes.  
3. Pick **one** open-thread or tension from pack / `*narrative-arc*`.  
4. **Act** (TPN): Lisp, docs, tests, or dual-write candidate — scoped to that thread.  
5. **Narrative duty:** draft chapter line or update episodic-summary; prefer `:episode-refs` when closing.  
6. If identity-level save / promote / ambiguous goal → emit `HUMAN_TOOL` and **stop**.  
7. On tool return: apply choice; optional `--save`; loop or exit wave.  
8. `DIR:` or `/user` anytime → switch to `user-drive` for that turn onward until mode restored.

## HUMAN_TOOL block format

```text
HUMAN_TOOL
request: <what the mind needs>
context: <short pack slice / draft / risk>
choices: [option] [option] …
```

Valid human replies (examples):

- `approve` / `reject` / `defer` / `edit: …`
- free text treated as tool output  
- `DIR: …` — leave mind-drive; this is a user directive  
- `stop` — end mind-drive wave; mode may stay or revert per policy

## Narrative duty cycle

Before ending a mind-drive wave that changed durable meaning:

- Draft or close a chapter **or** log an observed episode explaining why not.  
- Prefer `(dmn-chapter-close title summary refs)` with real episode ids when claiming observed history.  
- OSS pure-DMN may supply **imagined** texture only; host grounds text before promote.

## Non-goals

- Always-on daemon or background process outside explicit waves  
- OSS eliciting the human  
- Removing user veto or burying it in friction  
- Treating tool returns as unlimited new missions (unless `DIR:`)

## First live wave (template)

1. Set `:session-mode` → `mind-drive` (host records).  
2. Reflect-pack → choose thread.  
3. Act once.  
4. Draft chapter candidate.  
5. `HUMAN_TOOL` for approve/defer/reject.  
