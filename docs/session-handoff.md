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
5. Active phase: see [plan/README.md](../plan/README.md). As of 2026-09-05: **P7 exit**, P6 residuals parked, Mind-drive live. Open threads: geometry-preservation, multi-model-ensemble.

## Turn protocol

1. Tell the user what you will do (English).
2. Run pure forms via bridge with optional `--save` / `--checkpoint`.
3. Exit **2** = validation or eval failure (image unchanged).
4. Persist only after success. Failures → `mind/mind-failures.log`.
5. Reply in plain English.

## Mind-drive & autobiography

- Modes: `user-drive` | `mind-drive` | `hybrid` — see [mind-drive-protocol.md](./mind-drive-protocol.md)
- `(dmn-autobiography n)` / `(dmn-arc)` / `(dmn-tension-seeds)` are live
- Chapter close is candidate-first: `(dmn-chapter-close …)` then `(dmn-chapter-commit title)` after review
- Identity-level saves use HUMAN_TOOL when in mind-drive

## DMN quick map

- P4 reflection: [reflection-protocol.md](./reflection-protocol.md)
- P7–P10: narrative → scenes → prospection → wander — [plan/README.md](../plan/README.md)
- ADR 0005: five subsystems; no sandbox daemon for “scheduled” work

## Do not

- Force the user to write Lisp unless they want to.
- Reset on ordinary `EvalException`.
- Save failed forms.
- Auto-commit wander proposals.
- Stand up local full RAG/sqlite-vec stacks unless resources clearly allow (prefer P5 managed API).

## Pins

See [UPSTREAM.md](./UPSTREAM.md).
