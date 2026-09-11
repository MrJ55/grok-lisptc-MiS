#!/usr/bin/env bash
# P5: Vestige degraded-mode + capability-profile test
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RUNTIME="${MIS_RUNTIME:-/tmp/mis}"
QUEUE="$ROOT/state/local-queue"
NODE="node --experimental-transform-types --no-warnings"

echo "[degraded] ensure runtime…"
if [[ ! -d "$RUNTIME/bridge" ]]; then
  bash "$ROOT/scripts/bootstrap.sh"
fi

cd "$ROOT"

echo "[degraded] 1) ping dead endpoint…"
out=$($NODE -e '
import { VestigeAdapter } from "./bridge/vestige-adapter.ts";
const v = new VestigeAdapter({ httpBaseUrl: "http://127.0.0.1:9" });
const ok = await v.ping();
console.log(ok ? "UP" : "DOWN");
process.exit(ok ? 1 : 0);
' 2>/tmp/deg-ping.err) || true
if [[ "$out" != "DOWN" ]]; then
  echo "FAIL: expected DOWN, got: $out" >&2
  cat /tmp/deg-ping.err >&2 || true
  exit 2
fi
echo "PASS  dead ping → unavailable"

echo "[degraded] 2) queueOnDegraded ingest…"
rm -rf "$QUEUE"
$NODE -e '
import { VestigeAdapter } from "./bridge/vestige-adapter.ts";
const v = new VestigeAdapter({
  httpBaseUrl: "http://127.0.0.1:9",
  queueDir: process.argv[1],
});
const r = await v.smartIngest("degraded-mode queue test payload", {
  tags: ["p5", "degraded"],
  queueOnDegraded: true,
});
if (r.decision !== "queued-degraded" || !r.queued) {
  console.error("expected queued-degraded", r);
  process.exit(2);
}
console.log("PASS  queueOnDegraded →", r.queued);
' "$QUEUE"

echo "[degraded] 3) read-only profile denies ingest…"
$NODE -e '
import { VestigeAdapter, CapabilityDenied } from "./bridge/vestige-adapter.ts";
const v = new VestigeAdapter({
  httpBaseUrl: "http://127.0.0.1:9",
  profile: "mind-memory-read-v1",
});
try {
  await v.smartIngest("should deny");
  console.error("FAIL: ingest should be denied");
  process.exit(2);
} catch (e) {
  if (e instanceof CapabilityDenied) {
    console.log("PASS  read-only denies ingest:", e.capability);
  } else {
    console.error("FAIL: expected CapabilityDenied", e);
    process.exit(2);
  }
}
'

echo "[degraded] 4) read profile still allows requireCap structure (recall denied only by network)…"
$NODE -e '
import { VestigeAdapter, CapabilityDenied, VestigeUnavailable } from "./bridge/vestige-adapter.ts";
const v = new VestigeAdapter({
  httpBaseUrl: "http://127.0.0.1:9",
  profile: "mind-memory-read-v1",
});
try {
  await v.recall("x", 1);
  console.error("FAIL: should not reach server successfully");
  process.exit(2);
} catch (e) {
  if (e instanceof CapabilityDenied) {
    console.error("FAIL: recall should be allowed by profile", e);
    process.exit(2);
  }
  if (e instanceof VestigeUnavailable) {
    console.log("PASS  read profile allows recall path; network unavailable as expected");
  } else {
    console.log("PASS  read profile allows recall attempt; error:", (e as Error).name || e);
  }
}
'

echo "[degraded] 5) MiS boots without Vestige…"
cd "$RUNTIME"
node --experimental-transform-types --no-warnings bridge/eval.ts \
  '(list (mis-version) (vestige-status) (mind-memory-status))' \
  >/tmp/deg-boot.out 2>/tmp/deg-boot.err
if ! grep -q "mis-helpers" /tmp/deg-boot.out; then
  echo "FAIL: mind did not boot" >&2
  cat /tmp/deg-boot.err >&2
  exit 2
fi
echo "PASS  MiS boot from image while Vestige down"

echo "[degraded] 6) compact ref form loads…"
node --experimental-transform-types --no-warnings bridge/eval.ts \
  '(list (dmn-log-vestige-ref "test-id-000" "compact gloss" (quote (:source host :tags (p5)))) (episodic-ref-p (car *episodic-buffer*)) (episodic-compact-count))' \
  >/tmp/deg-compact.out 2>/tmp/deg-compact.err || {
  echo "FAIL compact form" >&2
  cat /tmp/deg-compact.err >&2
  exit 2
}
echo "PASS  dmn-log-vestige-ref + episodic-ref-p"
echo "      $(head -c 240 /tmp/deg-compact.out)"

echo ""
echo "test-vestige-degraded: all checks passed"
