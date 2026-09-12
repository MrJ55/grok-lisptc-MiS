# Mind duty surface (host agenda)

**Status:** live 2026-09-12  
**Runtime authority:** `mind/mind-duty.ptc` — query the image, not this file alone.  
**Constraint:** lisptc **cannot push** to Grok. Duties are computed in the image; the host **must poll** and act.

## Why

Completed-phase host lore (when to narrate, when to reflect, mind-drive wave steps) lived only in markdown. That repeated the pre-P12 Chorus problem and the pre-contract Vestige problem: cold sessions skip obligations.

`(mind-duty-check)` is the single entrypoint. Narrative lag (e.g. Post-P5 arc without a P5 autobiography chapter) becomes a **high** duty instead of silent drift.

## Forms

| Form | Role |
|------|------|
| **`(mind-duty-check)`** | Full agenda: `:duty-count`, `:high-count`, `:medium-count`, `:duties`, nested narrative/reflection/mind-drive |
| `(narrative-duty)` | Arc / phase vs autobiography |
| `(reflection-duty)` | Buffer length vs `*reflection-unreflected-threshold*` (default 5) |
| `(mind-drive-protocol)` | Wave steps + narrative-duty text (docs/mind-drive-protocol.md is archive) |

## Predicates (current)

**Narrative — high**

- Manifest `:p5-status` is substantially-complete **or** `:current-chapter` is a known Post-P5 marker
- **and** last autobiography chapter title is not already a P5 chapter

**Narrative — medium**

- `:last-closed` ≠ last chapter title (true lag after a close)

**Reflection — medium**

- `(length *episodic-buffer*)` > threshold

Further phase markers can be added the same way (P8/P9/P10) without changing the host API.

## Bridge trailer

After every **successful** `bridge/eval.ts` eval (unless disabled):

```text
[mis] HOST_DUTY: high=N medium=M — query (mind-duty-check); discharge or log defer
```

or `HOST_DUTY: clear`.

| Env | Effect |
|-----|--------|
| `MIS_DUTY_TRAILER=0` | Disable trailer |
| `MIS_DUTY_STRICT=1` | Exit code **2** if high duties remain and the evaluated form is not already a discharge form |

Discharge form patterns (strict allowlist): `mind-duty`, `narrative-duty`, `chapter-close`, `chapter-commit`, `dmn-apply-reflection`, `dmn-reflect-pack`.

## Host obligations

1. Bootstrap: run `(mind-duty-check)` (see [session-handoff.md](./session-handoff.md)).
2. After meaning-changing work / end of mind-drive wave: poll again or honor trailer.
3. **High** duties: discharge (e.g. `dmn-chapter-close` → review → `dmn-chapter-commit`) **or** log an **observed** defer episode explaining why not.
4. Chapter commit remains **host-gated** — duty never auto-mutates autobiography.
5. Do not treat “no user request to narrate” as license to ignore high duties under mind-drive.

## Mechanism (cooperative, not push)

```text
Host runs eval → mind returns / trailer shows duties → host discharges or defers
```

There is no long-lived sandbox process that messages the chat. Architecture ([architecture.md](./architecture.md)): **host owns when** to actuate; the mind **owns the agenda**.

## Related

- [mind-drive-protocol.md](./mind-drive-protocol.md) — wave algorithm (archive; runtime `(mind-drive-protocol)`)
- [reflection-protocol.md](./reflection-protocol.md) — pack/apply
- [vestige-fsrs-and-limits.md](./vestige-fsrs-and-limits.md) / `(vestige-host-contract)` — same internalization pattern
- [mind-api.md](./mind-api.md) — form index
- [session-handoff.md](./session-handoff.md) — cold-start checklist

## 2026-09-12 discharge note

P5 narrative **high** duty was discharged: autobiography chapter **P5 substantially complete**; `:last-closed` updated. Reflection medium may still appear when the episodic buffer is above threshold — that is hygiene, not phase lag.
