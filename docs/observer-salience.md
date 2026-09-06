# Observer + Salience Switch (P11)

**Purpose:** Make the host’s Think vs Act decision explicit and auditable without adding a daemon.

## Policy (host-side)

Grok decides:

- **Think** — call pure-DMN / Chorus, run reflection pack, or leave a Midnight Note
- **Act** — emit Lisp forms that mutate the mind image (schema, episodes, chapters, etc.)

Inputs to the decision (non-exhaustive):

- Error density / recent eval failures
- Goal state and open tension seeds
- Idle detection (long stretch without DMN texture)
- Novelty of pending proposal files
- Identity-level stakes (HUMAN_TOOL required)

See also `plan/CREATIVE-MECHANISMS.md` and the contrast report §6.

## Logging path

Append one JSON line per decision to:

```
state/audit/salience-decisions.jsonl
```

Minimal schema:

```json
{
  "ts": "2026-09-06T16:12:00+02:00",
  "decision": "think",
  "reason": "open geometry-preservation thread; bilingual weave available for review",
  "action": "review oss-proposals-20260906-geometry-chorus-bilingual.ptc",
  "session": "optional-session-id"
}
```

or

```json
{
  "ts": "…",
  "decision": "act",
  "reason": "promote reviewed candidate after HUMAN_TOOL",
  "action": "(promote-candidate …) + --save",
  "session": "…"
}
```

No automatic enforcement; the file is an Observer log for later audit and for blank-session continuity.

## Practice

- Prefer a one-line log whenever the host deliberately chooses Think (OSS/Chorus) or a high-stakes Act.
- Ordinary low-stakes Act (e.g. simple episode log) need not be logged.
- On P00, skim the last few salience decisions together with open proposal files.

## Related

- `state/audit/operations.jsonl` (per OSS call)
- `plan/P11-oss-dmn-channel.md`
- `docs/page-passer.md`
