# Page Passer — proposal-file exchange (P11)

**Purpose:** Identity-local, low-ceremony hand-off of pure-DMN / Chorus texture between sessions or hosts without ever evaluating untrusted text as Lisp.

## Format

Proposal files live under `mind/` and follow the existing append-only convention:

```
mind/oss-proposals-YYYYMMDD.ptc          # daily stream (bridge/oss.ts default)
mind/oss-proposals-YYYYMMDD-<slug>.ptc   # named job (geometry-chorus, bilingual, …)
```

Each entry is a single Lisp-looking form that is **never** passed to `bridge/eval.ts`. Canonical shapes already in use:

- `(oss-seed …)`
- `(oss-candidate …)` — individual voice
- `(oss-weave …)` — host-synthesized sticky weave

Required keys on candidates / weaves:

| Key | Meaning |
|-----|---------|
| `:id` | Stable string id |
| `:reality-status` | Always `imagined` |
| `:trust-class` | `candidate` (or `rejected`) |
| `:source` | `oss-dmn` / `oss-dmn-chorus` / `host-weave` |
| `:content` | Raw text (or host-translated ZH) |
| `:recorded-at` | ISO timestamp |

Optional but useful: `:model`, `:host`, `:lang`, `:dmn-score`, `:tpn-flip`, `:sticky`, `:thread`, `:host-claim`, `:note`.

## Heartbeat annotation (optional)

A lightweight “still here” marker for long-running open threads:

```lisp
(oss-heartbeat
  (:thread . geometry-preservation)
  (:last-weave . "geometry-20260906-weave-bilingual")
  (:status . open)
  (:note . "4-channel richer draft available; pure-lyric 3-voice retained")
  (:recorded-at . "2026-09-06T16:10:00+02:00"))
```

Heartbeats are review-only; they do not mutate schema or autobiography.

## Exchange rules

1. Writer (any host session) only appends; never rewrites history of a proposal file.
2. Reader (next P00 or deliberate review) classifies, may promote via `(promote-candidate id)` or leave as `:imagined`.
3. Chinese content must be accompanied by a host translation (`:content-en` or English rewrite in the weave).
4. No proposal file is ever loaded under `--strict-load` into the eval path.

## Related

- `bridge/oss.ts` dual-write
- `docs/chorus-geometry-20260906.md`
- `plan/P11-oss-dmn-channel.md`
