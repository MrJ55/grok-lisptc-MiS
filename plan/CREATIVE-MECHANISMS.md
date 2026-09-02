# Creative mechanisms (cross-cutting)

Track across P7–P11; do not require all at once.  
Sources of ideas: see [docs/related-work.md](../docs/related-work.md).  
Extensions contrast (original → OSS shape → value): [docs/gmod-extensions-contrast-20260902.md](../docs/gmod-extensions-contrast-20260902.md).

| Mechanism | Phase | Intent under grok-mis-oss-dmn | Source shape |
|-----------|-------|-------------------------------|--------------|
| Dual-write episodes | P7, P11 | Raw log + OSS narrative candidate; Grok promotes | — |
| Soft-nudge seeding | P7–P11 | MiS state → blank prefix for OSS; never system prompt | — |
| Self-as-code policies | P7–P9 | Small executable guards proposed by reflection; Grok approves | — |
| Counterfactual curriculum | P9, P4 | Failure → OSS counterfactual texture → promote insight | Third-voice bridge (§4) |
| Narrative tension signals | P7, P10 | Open threads bias which soft-nudge is chosen | — |
| Sleep stages (prompt macros) | P4, P10 | NREM-like compress vs REM-like associative via pure DMN OSS; **Midnight Note** GitHub Action that only writes proposals | Midnight Note + ink/pencil (§2) |
| Geometric/subspace awareness | P11 | Host-side classifier of DMN-like vs TPN output (Alieksieienko-inspired) + **Pulse Meter** scoring | Pulse Meter (§3) |
| **Salience switch (host policy)** | host + P10/P11 | Explicit arbitration: Think (DMN/OSS) vs Act (TPN). VOC-style bias. **Observer** logging of decisions | The Observer (§6) |
| Multi-model Chorus | P11 | Concurrent pure-DMN calls across models; weave strongest / most coherent voices | Chorus of Many Voices (§1) |
| Page Passer exchange | P10, P11 | Proposal-file exchange between GMOD instances; identity stays local; optional heartbeat annotation | Page Passer (§5) |

## Salience Switch (host-side policy)

Inspired by the triple-network model and the Seven-Pass Pipeline (Ghosh). Grok owns the switch; no sandbox daemon.  
See also contrast report §6 (The Observer).

**Default rules (inspectable, tunable):**
1. High error density or large goal discrepancy → reflect + optional pure-DMN OSS counterfactual (Third-voice / §4).
2. Goal completed or clear external user demand → chapter-close or ordinary TPN action.
3. Idle / low external demand → OSS wander call (P11 parameters) → proposal file only (Midnight Note style).
4. High-novelty OSS proposal + open narrative tension → prefer dual-write into narrative candidate.
5. Log every Think/Act decision with a short novelty × tension note when useful (Observer dashboard precursor).

Future refinement: lightweight VOC estimate (novelty × tension) can bias the next soft-nudge choice. All decisions remain host-side and logged when useful.

## Sleep-stage / Midnight Note notes

- Prefer proposals written in “ink” (high-DMN, high-presence, sticky) over “pencil” (thin, fades by evening review).
- Prefer chorus-like short, repeatable insights that survive multiple morning reviews.
- Night process is a caretaker of open threads, not a free generator of unbounded novelty.
- Implementation: GitHub Action (or equivalent) that only writes `mind/oss-proposals-*.ptc` or `mind/wander-proposals.ptc`; P00 reviews.

## Invariants
1. Candidates ≠ committed identity until `--save` after successful eval.
2. Chapters cite episode refs.
3. Simulations / OSS continuations are data; actions need explicit TPN steps.
4. **OSS is never given a system prompt or instructional framing.**
5. Resource: prefer image + proposal files + managed API cabinet; avoid local heavy ML in sandbox.
