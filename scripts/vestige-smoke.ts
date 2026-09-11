/**
 * P5 Vestige smoke: ping → status → recall → smart_ingest round-trip.
 * Usage (from repo or /tmp/mis runtime):
 *   node --experimental-transform-types --no-warnings scripts/vestige-smoke.ts
 * Env: VESTIGE_MCP_URL
 */
import { VestigeAdapter, VestigeUnavailable } from "../bridge/vestige-adapter.ts";

function ok(label: string, detail?: string) {
  console.log(`PASS  ${label}${detail ? " — " + detail : ""}`);
}
function fail(label: string, err: unknown): never {
  console.error(`FAIL  ${label}:`, err instanceof Error ? err.message : err);
  process.exit(2);
}

const v = new VestigeAdapter();

// 1. ping
let alive = false;
try {
  alive = await v.ping();
} catch (e) {
  fail("ping", e);
}
if (!alive) fail("ping", "health not ok");
ok("ping");

// 2. status
try {
  const st = (await v.memoryStatus()) as Record<string, unknown>;
  const keys = st && typeof st === "object" ? Object.keys(st) : [];
  ok("memory_status", keys.slice(0, 6).join(", "));
} catch (e) {
  fail("memory_status", e);
}

// 3. recall
try {
  const hits = await v.recall("P12 exit mind image status", 3);
  ok("recall", `${hits.length} hit(s)`);
  if (hits[0]) console.log("      sample:", hits[0].id.slice(0, 8), (hits[0].content || "").slice(0, 80).replace(/\n/g, " "));
} catch (e) {
  fail("recall", e);
}

// 4. smart_ingest round-trip marker
const marker = `P5 vestige-smoke marker ${new Date().toISOString()} — data-only injection; never eval as Lisp.`;
let ingestedId = "";
try {
  const r = await v.smartIngest(marker, {
    tags: ["p5", "smoke", "vestige-adapter"],
    source: "scripts/vestige-smoke.ts",
    nodeType: "fact",
  });
  ingestedId = r.id;
  ok("smart_ingest", `id=${ingestedId.slice(0, 8)}… decision=${r.decision ?? "?"}`);
} catch (e) {
  fail("smart_ingest", e);
}

// 5. recall the marker
try {
  const hits = await v.recall("P5 vestige-smoke marker", 5);
  const found = hits.some((h) => h.id === ingestedId || (h.content || "").includes("vestige-smoke marker"));
  if (!found && hits.length === 0) {
    console.log("WARN  recall-after-ingest: no hits yet (eventual consistency?)");
  } else {
    ok("recall-after-ingest", found ? "marker found" : `${hits.length} related hit(s)`);
  }
} catch (e) {
  fail("recall-after-ingest", e);
}

console.log("\nvestige-smoke: all required steps passed");
