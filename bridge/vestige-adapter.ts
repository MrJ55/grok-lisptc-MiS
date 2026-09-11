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
};

export type BackfillResult = {
  failureId: string;
  candidates: Array<{ id: string; content: string; score?: number }>;
  promote: boolean;
  receipt?: string;
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
  /** Base URL for HTTP MCP, e.g. https://….ngrok-free.dev */
  httpBaseUrl?: string;
  /** Path for MCP endpoint (default /mcp) */
  mcpPath?: string;
  /** Local binary name for stdio transport */
  binary?: string;
  timeoutMs?: number;
};

const DEFAULT_HTTP =
  process.env.VESTIGE_MCP_URL ?? "https://diner-dreadlock-zoologist.ngrok-free.dev";

export class VestigeAdapter {
  private transport: VestigeTransport;
  private httpBaseUrl: string;
  private mcpPath: string;
  private binary: string;
  private timeoutMs: number;
  private available: boolean | null = null;

  constructor(opts: VestigeAdapterOptions = {}) {
    this.transport = opts.transport ?? (opts.httpBaseUrl || process.env.VESTIGE_MCP_URL ? "http" : "stdio");
    this.httpBaseUrl = (opts.httpBaseUrl ?? DEFAULT_HTTP).replace(/\/$/, "");
    this.mcpPath = opts.mcpPath ?? "/mcp";
    this.binary = opts.binary ?? "vestige-mcp";
    this.timeoutMs = opts.timeoutMs ?? 15_000;
  }

  /** Health probe — does not throw. */
  async ping(): Promise<boolean> {
    try {
      if (this.transport === "http") {
        const res = await fetch(`${this.httpBaseUrl}/health`, {
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
    const raw = (await this.mcpCall("vestige.recall", {
      query,
      mode: "lookup",
      limit: k,
    })) as any;
    const items = raw?.memories ?? raw?.results ?? raw?.items ?? [];
    return (Array.isArray(items) ? items : []).map((m: any) => ({
      id: String(m.id ?? m.nodeId ?? ""),
      content: String(m.content ?? m.text ?? ""),
      tags: m.tags,
      source: m.source,
      importance: m.importanceScore ?? m.importance,
    }));
  }

  async smartIngest(content: string, opts: {
    tags?: string[];
    source?: string;
    nodeType?: string;
    forceCreate?: boolean;
  } = {}): Promise<{ id: string; decision?: string }> {
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
    };
  }

  async backfill(failureId?: string, opts: { promote?: boolean; lookbackDays?: number } = {}): Promise<BackfillResult> {
    const raw = (await this.mcpCall("vestige.backfill", {
      failure_id: failureId,
      promote: opts.promote ?? false,
      lookback_days: opts.lookbackDays ?? 30,
    })) as any;
    return {
      failureId: String(failureId ?? raw?.failureId ?? ""),
      candidates: (raw?.candidates ?? []).map((c: any) => ({
        id: String(c.id ?? ""),
        content: String(c.content ?? ""),
        score: c.score,
      })),
      promote: Boolean(opts.promote),
      receipt: raw?.receipt,
    };
  }

  async memoryStatus(): Promise<unknown> {
    return this.mcpCall("vestige.memory_status", { view: "health" });
  }
}

let _adapter: VestigeAdapter | null = null;
export function getVestigeAdapter(opts?: VestigeAdapterOptions): VestigeAdapter {
  if (!_adapter) _adapter = new VestigeAdapter(opts);
  return _adapter;
}
