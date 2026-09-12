**Runtime:** `(mind-drive-protocol)` · `(mind-duty-check)` · `(narrative-duty)` in `mind/mind-duty.ptc`. See [mind-duty.md](./mind-duty.md). This file is **archive / commentary**.

# Mind-drive protocol

## Modes

- **User-drive (default historically):** user message starts each turn; mind/narrative advances only when asked.  
- **Mind-drive:** Grok runs a short loop from `*narrative-arc*` / `:open-threads`; the human is a **high-latency tool** for direction, approval, facts, encouragement, or halt.
- **Hybrid:** mix per turn.

Session fields (schema): `:session-mode`, `:human-tool-policy` (e.g. `elicit-on-identity-save`).

## Wave algorithm (one wave)

1. Load mind image (bootstrap if needed).  
2. `(dmn-reflect-pack n)` — host reads schema, episodes, **oracle surface**.  
3. Pick **one** open-thread or tension from pack / `*narrative-arc*`.  
4. **Optional Think(Chorus)** — only if the thread needs imaginative / non-analytic guidance:
   - Require `(dmn-oracle-preflight)` → `ok`.
   - Seed; call roster; dual-write `:imagined`; **interpret** sticky; `(dmn-oracle-clear)` when done.
   - Skip when TPN action is enough. Never auto-fire Chorus from tensions alone.
5. **Act** (TPN): Lisp, docs, tests, or dual-write candidate — scoped to that thread.  
6. **Narrative duty:** draft chapter line or update episodic-summary; prefer `:episode-refs` when closing. Poll `(mind-duty-check)` / honor `HOST_DUTY`.  
7. If identity-level save / promote / ambiguous goal → emit `HUMAN_TOOL` and **stop**.  
8. On tool return: apply choice; optional `--save`; loop or exit wave.  
9. `DIR:` or `/user` anytime → switch to `user-drive` for that turn onward until mode restored.

## Narrative duty cycle

Before ending a mind-drive wave that changed durable meaning:

- Draft or close a chapter **or** log an observed episode explaining why not.  
- Prefer `(dmn-chapter-close title summary refs)` with real episode ids when claiming observed history.  
- High duties from `(mind-duty-check)` must not be silently skipped.

## HUMAN_TOOL

Identity-level saves use HUMAN_TOOL when in mind-drive. See session-handoff.
