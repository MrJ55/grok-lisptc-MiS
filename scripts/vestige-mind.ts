/**
 * Host-mediated Vestige CLI (P5). Never evals retrieved text as Lisp.
 *
 *   node --experimental-transform-types --no-warnings scripts/vestige-mind.ts <cmd> [args…]
 *
 * Commands:
 *   status
 *   recall <query> [k]
 *   ingest <text> [--tag t]...
 *   backfill [failureId]
 *   contradictions [topic]
 */
import { VestigeAdapter } from "../bridge/vestige-adapter.ts";

const [cmd, ...rest] = process.argv.slice(2);
const v = new VestigeAdapter();

function out(data: unknown) {
  console.log(JSON.stringify(data, null, 2));
}

try {
  switch (cmd) {
    case "status": {
      const alive = await v.ping();
      const health = alive ? await v.memoryStatus() : null;
      out({ ok: alive, transport: "http", health });
      break;
    }
    case "recall": {
      const query = rest[0];
      const k = Number(rest[1] ?? 5);
      if (!query) {
        console.error("usage: recall <query> [k]");
        process.exit(1);
      }
      const items = await v.recall(query, k);
      out({ ok: true, query, k, count: items.length, items });
      break;
    }
    case "ingest": {
      const text = rest.filter((a) => !a.startsWith("--")).join(" ");
      const tags = rest.filter((a) => a.startsWith("--tag=")).map((a) => a.slice(6));
      if (!text) {
        console.error("usage: ingest <text> [--tag=foo]...");
        process.exit(1);
      }
      const r = await v.smartIngest(text, { tags: tags.length ? tags : ["host-mediated"], source: "vestige-mind" });
      out({ ok: true, ...r });
      break;
    }
    case "backfill": {
      const failureId = rest[0];
      const r = await v.backfill(failureId, { promote: false, manual: true });
      out({ ok: true, promote: false, ...r, note: "hypotheses only; not proven causes" });
      break;
    }
    case "contradictions": {
      const topic = rest[0];
      const r = await v.contradictions(topic, 10);
      out({
        ok: true,
        topic: topic ?? null,
        pairCount: r.pairs.length,
        pairs: r.pairs,
        rawKeys: r.raw && typeof r.raw === "object" ? Object.keys(r.raw as object) : typeof r.raw,
      });
      break;
    }
    default:
      console.error("commands: status | recall | ingest | backfill | contradictions");
      process.exit(1);
  }
} catch (e) {
  console.error(JSON.stringify({ ok: false, error: e instanceof Error ? e.message : String(e) }));
  process.exit(2);
}
