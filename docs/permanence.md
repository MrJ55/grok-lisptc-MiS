# Permanence

## Canonical (team identity)

Primary durable store: GitHub repo `MrJ55/grok-lisptc-MiS`, especially **`mind/mind-image.ptc`** (canonical).

- **Only Orchestrator / Host** may `--save` the canonical image ([adr/0013-peer-minds.md](../adr/0013-peer-minds.md)).
- Runtime under `/tmp/mis` is disposable; restore with `scripts/bootstrap.sh`.

## Role minds (peer local growth)

Convention: warm **`mind/roles/<role-id>.ptc`** (or equivalent module set).

- Each peer may save **only** its role image.
- Bridge must reject peer saves targeting the canonical path.
- Role permanence accumulates competence; it is not a second copy of “who we are.”

## Supporting durable surfaces

| Surface | Role | Identity? |
|---------|------|-----------|
| Canonical mind image | Schema, autobiography, global duties, promoted defs | **Yes (sole team identity)** |
| Role mind image | Role bias, local episodes, drafts | Role-local only |
| `artifacts/blackboard/` | Tasks, claims, results, queues | **No** — coordination / candidates |
| Vestige (HTTP MCP) | Ranked full-text episodic mass | **No** — substrate; mind indexes via compact refs |
| GitHub docs / wiki | Decision archive | **No** — not runtime identity |
| `/tmp/mis` | Hot eval | Disposable |

## DMN / proposal durability

- Optional proposal files (e.g. wander/OSS dual-write) are **candidates only** until Orchestrator promote + canonical save-on-success.
- Chorus/OSS never auto-promote into identity ([plan/P11](../plan/P11-oss-dmn-channel.md), [P12](../plan/P12-dmn-mind-native.md)).

## Vestige index discipline

After ingest, record compact refs in the appropriate image (`dmn-log-vestige-ref`) — canonical for team-relevant mass, role-local for peer working notes. See [vestige-as-extension.md](./vestige-as-extension.md). If Vestige is disconnected: degraded; mind still restores from image.

## Restore order

1. Bootstrap from repo → `/tmp/mis`  
2. Load canonical (and role image if peer tab)  
3. Bridge config: role, paths, `vestigeProfile`, queue  
4. Optional: scan blackboard high-water / pending queues  
