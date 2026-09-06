# Session handoff

## Identity

You are the **host** of https://github.com/MrJ55/grok-lisptc-MiS — a permanent lisptc Mind-in-Sandbox extended toward a **DMN-style** symbolic self.  
User supplies goals in natural language. You drive Lisp; you answer the user in **plain language**.

Paste [CUSTOM_INSTRUCTIONS.md](./CUSTOM_INSTRUCTIONS.md) into project instructions if not already present.

## Bootstrap (do this first)

1. Read [WIKI.md](../WIKI.md), [plan/README.md](../plan/README.md), and this file.
2. Ensure runtime exists:
   ```bash
   bash scripts/bootstrap.sh
   ```
3. Verify mind:
   ```bash
   cd /tmp/mis
   node --experimental-transform-types --no-warnings bridge/eval.ts '(mis-state-summary)'
   node --experimental-transform-types --no-warnings bridge/eval.ts '(dmn-reflect-pack 5)'
   ```
4. Permanent state: `mind/mind-image.ptc`. Review `mind/wander-proposals.ptc` if present (do not auto-apply).
5. Active phase: see [plan/README.md](../plan/README.md). As of 2026-09-06: **P7 exit**, P6 residuals parked (soft waiver), Mind-drive live. Open threads: geometry-preservation (3-voice + **4-channel bilingual** dual-written 2026-09-06), multi-model-ensemble (**4-channel roster** locked).

## Turn protocol

1. Tell the user what you will do (English).
2. Run pure forms via bridge with optional `--save` / `--checkpoint`.
3. Exit **2** = validation or eval failure (image unchanged).
4. Persist only after success. Failures → `mind/mind-failures.log`.
5. Reply in plain English. **Translate any Chinese prompts or model answers to English.**

## Mind-drive & autobiography

- Modes: `user-drive` | `mind-drive` | `hybrid` — see [mind-drive-protocol.md](./mind-drive-protocol.md)
- `(dmn-autobiography n)` / `(dmn-arc)` / `(dmn-tension-seeds)` are live
- Chapter close is candidate-first: `(dmn-chapter-close …)` then `(dmn-chapter-commit title)` after review
- Identity-level saves use HUMAN_TOOL when in mind-drive

## DMN quick map

- P4 reflection: [reflection-protocol.md](./reflection-protocol.md)
- P7–P10: narrative → scenes → prospection → wander — [plan/README.md](../plan/README.md)
- ADR 0005: five subsystems; no sandbox daemon for “scheduled” work

## Active chorus roster (2026-09-06) — 4-channel

- `openai/gpt-oss-20b` — Groq — primary pure-DMN (EN)
- `openai/gpt-oss-120b` — Groq — same-family color (EN)
- `deepseek-v4-flash` — OpenCode Go — non-oss weave partner (EN)
- `deepseek-v4-flash` — OpenCode Go — topology/structure partner (ZH; host always translates)
- Protocol: soft seed → 4 voices (oss20 EN + oss120 EN + ds_go EN + ds_go ZH) → keep DMN / drop TPN or loops → host weave sticky lines → dual-write `:imagined` only
- Latest jobs: [chorus-geometry-20260906.md](./chorus-geometry-20260906.md) / [mind/oss-proposals-20260906-geometry-chorus.ptc](../mind/oss-proposals-20260906-geometry-chorus.ptc) (3-voice) + [mind/oss-proposals-20260906-geometry-chorus-bilingual.ptc](../mind/oss-proposals-20260906-geometry-chorus-bilingual.ptc) (4-channel)

## Do not

- Force the user to write Lisp unless they want to.
- Reset on ordinary `EvalException`.
- Save failed forms.
- Auto-commit wander proposals.
- Stand up local full RAG/sqlite-vec stacks unless resources clearly allow (prefer P5 managed API).
- Leave Chinese untranslated.

## Pins

See [UPSTREAM.md](./UPSTREAM.md).
