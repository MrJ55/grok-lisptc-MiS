# Permanence

Primary durable store: GitHub repo `MrJ55/grok-lisptc-MiS`, especially `mind/mind-image.ptc`.

Runtime under `/tmp/mis` is disposable; restore with `scripts/bootstrap.sh`.

## DMN-related durability (2026-08-31)

- Primary: `mind/mind-image.ptc` in git (schema, episodes, future autobiography/arc).
- Secondary: optional `mind/wander-proposals.ptc` (or artifacts) — **proposals only**, applied in a later Grok turn.
- Tertiary: external vector cabinet (P5) for searchable vestiges; not required for identity restore.
- Process memory under `/tmp/mis` is disposable; always re-bootstrap from repo.
