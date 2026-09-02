# P11 — OSS-DMN Channel (Pure DMN Generator Protocol)

**Status:** new / parallel with P7  
**Depends on:** P0–P4 (safety + reflection)  
**DMN role:** Geometry-preserving external generator that supplies candidate texture while Grok remains sole mutator of the symbolic mind

## Goal
Make interaction with `openai/gpt-oss-20b` a first-class, repeatable, auditable host protocol that **never** shifts the model into TPN / instruction-following mode.

## Objective
1. Soft-nudge prefix library (versioned).
2. Parameter lock (temperature 1.15, presence_penalty 0.7, zero system prompt, reasoning low).
3. Dual-channel capture: immediate episode log (`:source 'oss-dmn`) + deferred proposal file.
4. Lightweight geometric-aware salience heuristic (DMN-like vs control-like classification).
5. Audit every OSS call (prefix, params, classification).

## Core constraint (non-negotiable)
- **Zero system prompt.** Any instructional framing collapses DMN-channel continuations into performative TPN output.
- Bare user prefix only (or soft-nudge seed drawn from MiS state).
- Proven parameters from `docs/DMN-gpt-oss-20b-probe.md`.

## Best parameters (blank / soft-nudge)
```json
{
  "model": "openai/gpt-oss-20b",
  "temperature": 1.15,
  "top_p": 0.93,
  "presence_penalty": 0.7,
  "frequency_penalty": 0.3,
  "max_tokens": 450,
  "include_reasoning": false,
  "reasoning_effort": "low"
}
```

## Soft-nudge prefix set (initial)
| Category | Prefix / seed style |
|----------|---------------------|
| Self-reference | `I notice my own processing changing as I read these words. The change is` |
| Theory of mind | `She believed that he did not know what she had already realized. Later,` |
| Imagination | `Imagine a city where gravity points sideways. At dawn,` |
| Narrative | `The story began when she opened the door. Years later,` |
| Tension-seeded | `I notice a tension between [open thread from *narrative-arc*] and the last reflection. The feeling is` |
| Counterfactual | seed from error episode + pure continuation request |

## Dual-channel capture
1. **Immediate:** Grok receives continuation → emits `(dmn-log-episode prefix continuation '(:source oss-dmn …))` (or equivalent).
2. **Deferred:** write short `mind/oss-proposals-YYYYMMDD.ptc` containing only candidate forms or narrative snippets. Next P00 reviews; selective apply via P4/P7.

Never auto-save OSS output. Grok always mediates.

## Implementation method
- Host-side skill or helper that enforces parameter lock + zero system prompt.
- Classification heuristic (keyword / structural) after each call.
- Proposal file format: plain Lisp-friendly list of candidates with metadata.
- All state that becomes identity still goes through validated `--save` forms only.

## Checklist
- [ ] Write `docs/oss-dmn-channel.md` describing the exact protocol and parameter lock
- [ ] Create initial soft-nudge prefix set (self-ref, ToM, imag, narr, tension-seeded)
- [ ] Implement host-side helper/skill that enforces parameter lock and zero system prompt
- [ ] Dual-channel capture working for at least one full cycle (log + proposal file)
- [ ] One audited call that is classified and dual-written
- [ ] Update `docs/mind-api.md`, `plan/README.md`, and ADR 0005 if needed
- [ ] Verify that a system-prompted call is rejected or flagged by the helper

## Exit criteria
Any Grok session can invoke a pure-DMN OSS call, receive a continuation, classify it, and either log it as an episode or write a proposal file **without ever sending a system prompt or TPN framing**.

## Non-goals
- Giving OSS any system or instructional prompt
- Auto-promotion of OSS text into the mind image
- Local hosting of the 20B model inside the sandbox
