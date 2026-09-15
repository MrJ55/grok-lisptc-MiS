# grok-lisptc-MiS

**Grok + sandbox lisptc Mind-in-Sandbox (MiS)** — a permanent neuro-symbolic Lisp mind driven by Grok, with pure-DMN channels (OSS/Chorus), Vestige long-term memory substrate, and (on this branch) a **multi-agent peer-minds blackboard**.

Upstream engine: [1hachem/lisptc](https://github.com/1hachem/lisptc) (pinned — see [docs/UPSTREAM.md](./docs/UPSTREAM.md) / `UPSTREAM.lock.json`)  
Sibling projects: [grok-zero-anneal](https://github.com/MrJ55/grok-zero-anneal) · [pi-zero-shot](https://github.com/MrJ55/pi-zero-shot) · injector [comet-mcp](https://github.com/MrJ55/comet-mcp)

| Doc | Purpose |
|-----|--------|
| **[WIKI.md](./WIKI.md)** | Navigation map |
| **[docs/session-handoff.md](./docs/session-handoff.md)** | Host restore protocol |
| **[plan/README.md](./plan/README.md)** | Phase status (source of truth) |
| **[docs/architecture.md](./docs/architecture.md)** | Layer diagram |

## Status (2026-09-15, branch `blackboard`)

| Area | State |
|------|--------|
| P00–P4, P7 | Exit / verified |
| P5 Vestige substrate | Substantially complete (HTTP MCP; local binary optional) |
| P6 | Substantially met; residuals parked |
| **P8 scenes · P9 prospection · P10 wander** | **Implemented** |
| P11 OSS DMN · P12 Chorus | Live / exit |
| **P13–P22 blackboard + peer minds** | **Designed & documented** (implementation planned) |
| **ADR 0013 Peer minds (Model B)** | **Accepted** — every tab is full MiS; Orchestrator sole canonical mutator |

**Active design focus on this branch:** implement blackboard cold-start (P13.0) → schema/bridge (P13.1–P15) → peer role bootstrap, then closed-loop D/F and Vestige extension discipline (P18–P22).

### Peer minds (locked)

- Same codebase per Grok tab; config selects role, images, Vestige profile, queue.
- **Mind authorizes → bridge writes** (blackboard, Vestige, inject) — symmetry with Vestige purity.
- Canonical identity: Orchestrator only. Peers evolve **role** minds.
- Vestige: peers **read-only** by default; Orchestrator owns ingest + compact refs in canonical image.
- Specs: [adr/0013-peer-minds.md](./adr/0013-peer-minds.md) · [docs/role-contracts.md](./docs/role-contracts.md) · [docs/blackboard-architecture.md](./docs/blackboard-architecture.md) · [docs/blackboard-schema.md](./docs/blackboard-schema.md) (v0.2)

### Vestige (extension, not second cabinet)

- Substrate for ranked long-term episodes; **not** identity.
- Mind indexes via compact refs (`dmn-log-vestige-ref`); see [docs/vestige-as-extension.md](./docs/vestige-as-extension.md).
- If Vestige is disconnected: degraded mode — mind still boots; do not claim fresh durable search.

## Quick restore

```bash
git clone -b blackboard https://github.com/MrJ55/grok-lisptc-MiS.git /tmp/grok-lisptc-MiS
bash /tmp/grok-lisptc-MiS/scripts/bootstrap.sh
bash /tmp/grok-lisptc-MiS/scripts/verify-upstream.sh
bash /tmp/grok-lisptc-MiS/scripts/smoke-test.sh
cd /tmp/mis
node --experimental-transform-types --no-warnings bridge/eval.ts '(mis-state-summary)'
node --experimental-transform-types --no-warnings bridge/eval.ts '(mind-duty-check)'
```

Host protocol: [docs/session-handoff.md](./docs/session-handoff.md). Ops: [docs/ops-playbook.md](./docs/ops-playbook.md).

## Architecture (summary)

```
human goals
    → Grok host(s)  [Orchestrator and/or peer tabs]
        → local mind authorizes
            → bridge/eval.ts  (+ vestige-adapter, future blackboard watcher)
                → canonical or role mind image
                → optional Vestige HTTP MCP (substrate)
                → artifacts/blackboard/ (coordination; planned)
                → ngrok → comet-mcp → CDP inject (planned multi-tab wake)
```

## License

MIT for original code in this repo. Upstream lisptc remains under its own MIT license.  
Portions of `src/lisp.ts` / `src/arith.ts` derive from Nukata Lisp / 1hachem/lisptc (see upstream pin).
