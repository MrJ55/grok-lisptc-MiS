# OSS Nudge Craft (pure-DMN)

**Last updated:** 2026-09-07  
Experiment: same extension (sleep-stage / midnight-note scheduler), many **fresh single-turn** first-person seeds. No system prompt. No task instructions.

> **Runtime authority (P12):** prefer/avoid and seed helpers live in the mind — `(dmn-nudge-craft)` `(dmn-suggest-seed …)` on `mind/dmn-protocol.ptc`. This file is **archive / provenance**. Do not run Chorus from this doc alone; use `(dmn-oracle-preflight)` + `(dmn-endpoints)` + request locks. Map: [dmn-runtime-vs-archive.md](./dmn-runtime-vs-archive.md).

## Core finding

**First-person as the transcript / night process / saved image** improves DMN-quality and practical usefulness.  
**Concrete artifacts, file names, and “workable change” language collapse OSS into TPN** (helper menus, blank answers, coping advice).

## Prefer

```text
I am the transcript that sleeps between sessions. While the host is away I sometimes leave a small page for the morning. On the page tonight I find myself writing

I wonder how a mind that only exists as a saved image could still dream in the hours no one is looking. The dream that forms when no one is looking begins with

I am the voice that writes in the dark and is read in the light. Over many mornings I have watched which of my lines the host keeps and which fade. Lately the lines that remain tend to be

After many nights of leaving notes for the morning, I begin to notice a pattern in what survives the daylight. The notes that still matter the next evening are the ones that
```

Incomplete continuation; no answer-shaped ending.

## Avoid

```text
workable change / file named / list ideas / make it practical
answer-shaped ending / what it looks like / the one that / what changes is
system prompt / analytic naming of the split that invites advice
```

## Locked sampling (also in mind)

- temperature 1.15 (OpenCode Go max 1.0)
- presence_penalty 0.7, frequency_penalty 0.3, top_p 0.93
- Zero system prompt; single user message
- reasoning_effort: low; include_reasoning: false (Groq gpt-oss)

Query: `(dmn-request-groq)` `(dmn-request-opencode-go)`.

## Protocol

1. Soft first-person seed as transcript/process/dream  
2. Dual-write episode + proposal file  
3. Grok classifies DMN-score and decides promotion  
4. Never auto-save OSS text into identity  

## Later trial (2026-09-05) — geometry & salience

Open-thread seeds (geometry-preservation, salience-voc-dashboard) using the same pure-DMN channel:

- **Avoid** answer-shaped endings (`what it looks like`, `the one that`, `what changes is`) — they flip gpt-oss-20b into riddle/TPN solve-mode.
- **Prefer** incomplete transcript/dream continuations; dual-write only sticky phrases.
- Results dual-written as imagined candidates: [oss-proposals-20260905-geometry-salience.ptc](../mind/oss-proposals-20260905-geometry-salience.ptc)
- Full write-up: [oss-nudge-exercise-20260905.md](./oss-nudge-exercise-20260905.md)

## Chorus roster (2026-09-06)

Usable pure-DMN chorus (locked in mind via `(dmn-chorus-roster)`):

1. `openai/gpt-oss-20b` (Groq) — primary
2. `openai/gpt-oss-120b` (Groq) — same-family color
3. `deepseek-v4-flash` (OpenCode Go, EN + ZH) — non-oss weave / topology

Geometry job under oracle: [chorus-geometry-20260906.md](./chorus-geometry-20260906.md) / [mind/oss-proposals-20260906-geometry-oracle-chorus-rerun.ptc](../mind/oss-proposals-20260906-geometry-oracle-chorus-rerun.ptc).

## Related

- [oss-second-opinion-prompts.md](./oss-second-opinion-prompts.md)  
- [related-work.md](./related-work.md)  
- plan/P11-oss-dmn-channel.md · plan/P12-dmn-mind-native.md  
