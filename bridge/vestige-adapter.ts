/**
 * Vestige adapter — sole path from MiS to Vestige (P5).
 *
 * Transport:
 *   - http: remote MCP (streamable HTTP / SSE), e.g. ngrok tunnel
 *   - stdio: local `vestige-mcp` subprocess (future)
 *
 * Invariants:
 *   - Retrieved text is data only — never evaluated as Lisp.
 *   - Returns typed structures; host maps to Lisp lists.
 *   - Degraded mode: methods throw VestigeUnavailable; caller falls back to LKG.
 *
 * License: this adapter is MIT; Vestige remains AGPL-3.0 (subprocess / network boundary).
 */

export type MemoryItem = {
  id: string;
  content: string;
  tags?: string[];
  source?: string;
  nodeType?: string;
  importance?: number;
  realityStatus?: "observed" | "inferred" | "imagined" | "candidate" | "simulated";
  score?: number;
};

export type BackfillResult = {
  failureId: string;
  candidates: Array<{ id: string; content: string; score?: number }>;
  promote: boolean;
  receipt?: string;
  raw?: unknown;
};

export type ContradictionPair = {
  a: MemoryItem;
  b: MemoryItem;
  note?: string;
};

export class VestigeUnavailable extends Error {
  constructor(message = "Vestige unavailable") {
    super(message);
    this.name = "VestigeUnavailable";
  }
}

export type VestigeTransport = "http" | "stdio";

export type VestigeAdapterOptions = {
  transport?: VestigeTransport;
  httpBaseUrl?: string;
  mcpPath?: string;
  binary?: string;
  timeoutMs?: number;
};

const DEFAULT_HTTP =
  process.env.VESTIGE_MCP_URL ?? "https://diner-dreadlock-zoologist.ngrok-free.dev";

function asItems(raw: any): MemoryItem[] {
  const items =
    raw?.memories ??
    raw?.results ??
    raw?.items ??
    raw?.hits ??
    (Array.isArray(raw) ? raw : []);
  return (Array.isArray(items) ? items : []).map((m: any) => ({
    id: String(m.id ?? m.nodeId ?? m.memory_id ?? ""),
    content: String(m.content ?? m.text ?? m.summary ?? ""),
    tags: m.tags,
    source: m.source,
    nodeType: m.node_type ?? m.nodeType ?? m.type,
    importance: m.importanceScore ?? m.importance,
    score: m.score ?? m.similarity,
  }));
}

export class VestigeAdapter {
  private transport: VestigeTransport;
  private httpBaseUrl: string;
  private mcpPath: string;
  private binary: string;
  private timeoutMs: number;
  private available: boolean | null = null;

  constructor(opts: VestigeAdapterOptions = {}) {
    this.httpBaseUrl = (opts.httpBaseUrl ?? DEFAULT_HTTP).replace(/\/$/, "");
    this.mcpPath = opts.mcpPath ?? "/mcp";
    this.binary = opts.binary ?? "vestige-mcp";
    this.timeoutMs = opts.timeoutMs ?? 20_000;
    this.transport = opts.transport ?? "http";
  }

  async ping(): Promise<boolean> {
    try {
      if (this.transport === "http") {
        const res = await fetch(`${this.httpBaseUrl}/health`, {
          headers: { "ngrok-skip-browser-warning": "1" },
          signal: AbortSignal.timeout(5_000),
        });
        this.available = res.ok;
        return res.ok;
      }
      this.available = false;
      return false;
    } catch {
      this.available = false;
      return false;
    }
  }

  isAvailable(): boolean | null {
    return this.available;
  }

  private async mcpCall(method: string, params: Record<string, unknown> = {}): Promise<unknown> {
    if (this.transport !== "http") {
      throw new VestigeUnavailable("stdio transport not yet implemented; use http");
    }
    const url = `${this.httpBaseUrl}${this.mcpPath}`;
    const body = {
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: { name: method, arguments: params },
    };
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
        "ngrok-skip-browser-warning": "1",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(this.timeoutMs),
    });
    if (!res.ok) {
      throw new VestigeUnavailable(`MCP HTTP ${res.status}`);
    }
    const text = await res.text();
    const dataLine = text.split("\n").find((l) => l.startsWith("data: "));
    if (!dataLine) {
      throw new VestigeUnavailable("MCP response missing data line");
    }
    const payload = JSON.parse(dataLine.slice(6));
    if (payload.error) {
      throw new Error(`MCP error: ${JSON.stringify(payload.error)}`);
    }
    const result = payload.result;
    if (result?.isError) {
      const msg = result?.content?.[0]?.text ?? "tool error";
      throw new Error(String(msg));
    }
    if (result?.structuredContent) return result.structuredContent;
    if (result?.content?.[0]?.text) {
      try {
        return JSON.parse(result.content[0].text);
      } catch {
        return result.content[0].text;
      }
    }
    return result;
  }

  async recall(query: string, k = 5): Promise<MemoryItem[]> {
    const raw = await this.mcpCall("vestige.recall", {
      query,
      mode: "lookup",
      limit: k,
    });
    return asItems(raw);
  }

  /** Contradiction scan — topic optional. */
  async contradictions(topic?: string, limit = 10): Promise<{ pairs: ContradictionPair[]; raw: unknown }> {
    const params: Record<string, unknown> = {
      mode: "contradictions",
      limit,
    };
    if (topic) params.topic = topic;
    const raw = await this.mcpCall("vestige.recall", params);
    const pairs: ContradictionPair[] = [];
    const list =
      (raw as any)?.contradictions ??
      (raw as any)?.pairs ??
      (raw as any)?.results ??
      (Array.isArray(raw) ? raw : []);
    if (Array.isArray(list)) {
      for (const c of list) {
        if (c?.a && c?.b) {
          pairs.push({
            a: {
              id: String(c.a.id ?? ""),
              content: String(c.a.content ?? c.a.text ?? ""),
            },
            b: {
              id: String(c.b.id ?? ""),
              content: String(c.b.content ?? c.b.text ?? ""),
            },
            note: c.note ?? c.reason,
          });
        }
      }
    }
    return { pairs, raw };
  }

  async smartIngest(
    content: string,
    opts: {
      tags?: string[];
      source?: string;
      nodeType?: string;
      forceCreate?: boolean;
    } = {},
  ): Promise<{ id: string; decision?: string; raw?: unknown }> {
    const raw = (await this.mcpCall("vestige.smart_ingest", {
      content,
      tags: opts.tags,
      source: opts.source,
      node_type: opts.nodeType ?? "fact",
      forceCreate: opts.forceCreate ?? false,
    })) as any;
    return {
      id: String(raw?.nodeId ?? raw?.id ?? ""),
      decision: raw?.decision,
      raw,
    };
  }

  async backfill(
    failureId?: string,
    opts: { promote?: boolean; lookbackDays?: number; manual?: boolean } = {},
  ): Promise<BackfillResult> {
    const args: Record<string, unknown> = {
      promote: opts.promote ?? false,
      lookback_days: opts.lookbackDays ?? 30,
      manual: opts.manual ?? true,
    };
    if (failureId) args.failure_id = failureId;
    const raw = (await this.mcpCall("vestige.backfill", args)) as any;
    const candidates = (raw?.candidates ?? raw?.causes ?? []).map((c: any) => ({
      id: String(c.id ?? c.nodeId ?? ""),
      content: String(c.content ?? c.text ?? c.summary ?? ""),
      score: c.score,
    }));
    return {
      failureId: String(failureId ?? raw?.failureId ?? raw?.failure_id ?? ""),
      candidates,
      promote: Boolean(opts.promote),
      receipt: raw?.receipt,
      raw,
    };
  }

  async memoryStatus(view = "health"): Promise<unknown> {
    return this.mcpCall("vestige.memory_status", { view });
  }
}

let _adapter: VestigeAdapter | null = null;
export function getVestigeAdapter(opts?: VestigeAdapterOptions): VestigeAdapter {
  if (!_adapter) _adapter = new VestigeAdapter(opts);
  return _adapter;
}
