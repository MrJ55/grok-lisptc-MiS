# Creative mechanisms (cross-cutting)

Track across P7–P11; do not require all at once.  
Sources of ideas: see [docs/related-work.md](../docs/related-work.md).

| Mechanism | Phase | Intent under grok-mis-oss-dmn |
|-----------|-------|-------------------------------|
| Dual-write episodes | P7, P11 | Raw log + OSS narrative candidate; Grok promotes |
| Soft-nudge seeding | P7–P11 | MiS state → blank prefix for OSS; never system prompt |
| Self-as-code policies | P7–P9 | Small executable guards proposed by reflection; Grok approves |
| Counterfactual curriculum | P9, P4 | Failure → OSS counterfactual texture → promote insight |
| Narrative tension signals | P7, P10 | Open threads bias which soft-nudge is chosen |
| Sleep stages (prompt macros) | P4, P10 | NREM-like compress vs REM-like associative/counterfactual via pure DMN OSS calls |
| Geometric/subspace awareness | P11 | Host-side classifier of DMN-like vs TPN output (inspired by Alieksieienko geometry) |
| **Salience switch (host policy)** | host + P10/P11 | Explicit arbitration: Think (DMN/OSS) vs Act (TPN). VOC-style bias. See below. |

## Salience Switch (host-side policy)

Inspired by the triple-network model and the Seven-Pass Pipeline (Ghosh). Grok owns the switch; no sandbox daemon.

**Default rules (inspectable, tunable):**
1. High error density or large goal discrepancy → reflect + optional pure-DMN OSS counterfactual.
2. Goal completed or clear external user demand → chapter-close or ordinary TPN action.
3. Idle / low external demand → OSS wander call (P11 parameters) → proposal file only.
4. High-novelty OSS proposal + open narrative tension → prefer dual-write into narrative candidate.

Future refinement: lightweight VOC estimate (novelty × tension) can bias the next soft-nudge choice. All decisions remain host-side and logged when useful.

## Invariants
1. Candidates ≠ committed identity until `--save` after successful eval.
2. Chapters cite episode refs.
3. Simulations / OSS continuations are data; actions need explicit TPN steps.
4. **OSS is never given a system prompt or instructional framing.**
5. Resource: prefer image + proposal files + managed API cabinet; avoid local heavy ML in sandbox.
