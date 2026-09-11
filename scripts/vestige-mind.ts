/**
 * Host-mediated Vestige CLI (P5). Never evals retrieved text as Lisp.
 *
 *   node --experimental-transform-types --no-warnings scripts/vestige-mind.ts [--profile=NAME] <cmd> …
 *
 * Profiles: mind-memory-read-v1 | mind-candidate-write-v1 | vestige-maintenance-v1
 * Commands: status | recall | ingest | backfill | contradictions
 */
import {
  VestigeAdapter,
  CapabilityDenied,
  VestigeUnavailable,
  type CapabilityProfileName,
} from "../bridge/vestige-adapter.ts";

const args = process.argv.slice(2);
let profile: CapabilityProfileName | undefined;
const rest: string[] = [];
for (const a of args) {
  if (a.startsWith("--profile=")) {
    profile = a.slice(10) as CapabilityProfileName;
  } else {
    rest.push(a);
  }
}
const [cmd, ...cmdArgs] = rest;
const v = new VestigeAdapter(profile ? { profile } : {});

function out(data: unknown) {
  console.log(JSON.stringify(data, null, 2));
}

try {
  switch (cmd) {
    case "status": {
      const alive = await v.ping();
      let health = null;
      try {
        health = alive ? await v.memoryStatus() : null;
      } catch {
        health = null;
      }
      out({
        ok: alive,
        profile: v.getProfile(),
        caps: v.allowedCaps(),
        transport: "http",
        health,
        vestigeStatusHint: alive ? "ok" : "degraded",
      });
      break;
    }
    case "recall": {
      const query = cmdArgs[0];
      const k = Number(cmdArgs[1] ?? 5);
      if (!query) {
        console.error("usage: recall <query> [k]");
        process.exit(1);
      }
      const items = await v.recall(query, k);
      out({ ok: true, profile: v.getProfile(), query, k, count: items.length, items });
      break;
    }
    case "ingest": {
      const text = cmdArgs.filter((a) => !a.startsWith("--")).join(" ");
      const tags = cmdArgs.filter((a) => a.startsWith("--tag=")).map((a) => a.slice(6));
      const queue = cmdArgs.includes("--queue-on-degraded");
      if (!text) {
        console.error("usage: ingest <text> [--tag=foo] [--queue-on-degraded]");
        process.exit(1);
      }
      const r = await v.smartIngest(text, {
        tags: tags.length ? tags : ["host-mediated"],
        source: "vestige-mind",
        queueOnDegraded: queue,
      });
      out({
        ok: true,
        profile: v.getProfile(),
        ...r,
        compactHint: r.id
          ? `(dmn-log-vestige-ref "${r.id}" "one-line summary" (:source host))`
          : null,
      });
      break;
    }
    case "backfill": {
      const failureId = cmdArgs[0];
      const r = await v.backfill(failureId, { promote: false, manual: true });
      out({ ok: true, promote: false, ...r, note: "hypotheses only" });
      break;
    }
    case "contradictions": {
      const topic = cmdArgs[0];
      const r = await v.contradictions(topic, 10);
      out({ ok: true, topic: topic ?? null, pairCount: r.pairs.length, pairs: r.pairs });
      break;
    }
    default:
      console.error("commands: status | recall | ingest | backfill | contradictions");
      process.exit(1);
  }
} catch (e) {
  if (e instanceof CapabilityDenied) {
    console.error(JSON.stringify({ ok: false, error: "capability_denied", capability: e.capability, profile: e.profile }));
    process.exit(3);
  }
  if (e instanceof VestigeUnavailable) {
    console.error(JSON.stringify({ ok: false, error: "unavailable", message: e.message, hint: "degraded" }));
    process.exit(2);
  }
  console.error(JSON.stringify({ ok: false, error: e instanceof Error ? e.message : String(e) }));
  process.exit(2);
}
