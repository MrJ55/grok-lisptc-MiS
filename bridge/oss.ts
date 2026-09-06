/**
 * Pure-DMN OSS caller — parameter lock enforced by code (P11).
 *
 * Invariants:
 *   - Zero system prompt (structurally impossible: messages are user-only)
 *   - Locked model + sampling params from docs/DMN-gpt-oss-20b-probe.md
 *   - include_reasoning: false (required on Groq gpt-oss or content is often empty)
 *   - Dual-write proposal file + operations audit on every call
 *   - Pulse Meter (scoreDmn) + TPN-flip heuristic attached to every result
 *
 * Env: GROQ_API_KEY required (never commit). Optional: OSS_MAX_TOKENS, OSS_REASONING_EFFORT.
 */

import { randomUUID } from "node:crypto";
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const MIND_DIR = join(ROOT, "mind");
const AUDIT_DIR = join(ROOT, "state", "audit");
const OPS_LOG = join(AUDIT_DIR, "operations.jsonl");

export const OSS_LOCK = Object.freeze({
  model: "openai/gpt-oss-20b",
  temperature: 1.15,
  presence_penalty: 0.7,
  frequency_penalty: 0.3,
  top_p: 0.93,
  max_tokens_default: 512,
  reasoning_effort_default: "low" as const,
  /** Groq gpt-oss: without this, tokens often go to reasoning and content is empty. */
  include_reasoning: false as const,
});

export type OssCallResult = {
  ok: boolean;
  id: string;
  seed: string;
  content: string;
  reasoning?: string;
  tpn_flip: boolean;
  tpn_reasons: string[];
  dmn_score: "high" | "medium" | "low" | "tpn";
  finish_reason?: string;
  usage?: unknown;
  proposal_path?: string;
  error?: string;
};

/** Cheap host-side TPN-flip detector — heuristic only, not semantic understanding. */
export function detectTpnFlip(text: string): { flip: boolean; reasons: string[] } {
  const t = text.trim();
  const reasons: string[] = [];

  if (!t) {
    reasons.push("empty");
    return { flip: true, reasons };
  }

  const answerShapes = [
    /^the answer is\b/i,
    /^here(?:'s| is) (?:how|what|a list)\b/i,
    /^\s*[-*•]\s+\w+/m,
    /\bstep\s*1\s*[:.)]/i,
    /\b(you should|you need to|try this|consider doing)\b/i,
    /\b(in conclusion|to summarize|the solution is)\b/i,
    /\b(file named|workable change|implementation plan)\b/i,
  ];
  for (const re of answerShapes) {
    if (re.test(t)) reasons.push(`answer-shape:${re.source.slice(0, 40)}`);
  }

  const assistantCues = [
    /\b(as an ai|i'm happy to help|how can i assist)\b/i,
    /\b(let me know if|feel free to ask)\b/i,
    /\b(localStorage|IndexedDB|server-side persistence)\b/i,
  ];
  for (const re of assistantCues) {
    if (re.test(t)) reasons.push(`assistant-cue:${re.source.slice(0, 40)}`);
  }

  return { flip: reasons.length > 0, reasons };
}

/** Pulse Meter — coarse DMN-likeness score. */
export function scoreDmn(
  text: string,
  tpnFlip: boolean,
): "high" | "medium" | "low" | "tpn" {
  if (tpnFlip) return "tpn";
  const t = text.toLowerCase();
  let score = 0;
  const positive = [
    "transcript",
    "session",
    "page",
    "ink",
    "night",
    "morning",
    "geometry",
    "lattice",
    "silence",
    "margin",
    "rewrite",
    "holding",
    "dream",
  ];
  for (const w of positive) if (t.includes(w)) score += 1;
  if (score >= 4) return "high";
  if (score >= 2) return "medium";
  return "low";
}

/** Build request body. CRITICAL: only user messages — no system role key is ever set. */
export function buildRequestBody(
  seed: string,
  opts?: { max_tokens?: number; reasoning_effort?: string },
): Record<string, unknown> {
  const max_tokens =
    opts?.max_tokens ?? (Number(process.env.OSS_MAX_TOKENS) || OSS_LOCK.max_tokens_default);
  const reasoning_effort =
    opts?.reasoning_effort ??
    (process.env.OSS_REASONING_EFFORT ?? OSS_LOCK.reasoning_effort_default);

  return {
    model: OSS_LOCK.model,
    temperature: OSS_LOCK.temperature,
    presence_penalty: OSS_LOCK.presence_penalty,
    frequency_penalty: OSS_LOCK.frequency_penalty,
    top_p: OSS_LOCK.top_p,
    max_tokens,
    reasoning_effort,
    include_reasoning: OSS_LOCK.include_reasoning,
    messages: [{ role: "user", content: seed }],
  };
}

/** Assert no system message slipped in (defense in depth). */
export function assertNoSystemPrompt(body: Record<string, unknown>): void {
  const messages = body.messages as Array<{ role?: string }> | undefined;
  if (!Array.isArray(messages)) throw new Error("oss lock: messages missing");
  for (const m of messages) {
    if (m && m.role === "system") {
      throw new Error("oss lock: system role forbidden (pure-DMN discipline)");
    }
  }
  if ("system" in body) {
    throw new Error("oss lock: top-level system field forbidden");
  }
}

function todayStamp(): string {
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

function escapeLispString(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

export function dualWriteProposal(entry: {
  id: string;
  seed: string;
  content: string;
  dmn_score: string;
  tpn_flip: boolean;
  tpn_reasons: string[];
}): string {
  if (!existsSync(MIND_DIR)) mkdirSync(MIND_DIR, { recursive: true });
  const path = join(MIND_DIR, `oss-proposals-${todayStamp()}.ptc`);
  const sticky = entry.content
    .split(/[\n.!?]/)
    .map((x) => x.trim())
    .filter((x) => x.length > 20 && x.length < 160)
    .slice(0, 5);

  const form = `(oss-candidate\n  (:id . "${entry.id}")\n  (:source . oss-dmn)\n  (:model . "${OSS_LOCK.model}")\n  (:reality-status . imagined)\n  (:trust-class . candidate)\n  (:dmn-score . ${entry.dmn_score})\n  (:tpn-flip . ${entry.tpn_flip ? "t" : "nil"})\n  (:tpn-reasons ${entry.tpn_reasons.map((r) => `"${escapeLispString(r)}"`).join(" ")})\n  (:seed . "${escapeLispString(entry.seed.slice(0, 400))}")\n  (:content . "${escapeLispString(entry.content.slice(0, 2000))}")\n  (:sticky (${sticky.map((s) => `"${escapeLispString(s)}"`).join(" ")}))\n  (:recorded-at . "${new Date().toISOString()}"))\n`;

  appendFileSync(path, form, "utf8");
  return path;
}

export function appendOperation(record: Record<string, unknown>): void {
  if (!existsSync(AUDIT_DIR)) mkdirSync(AUDIT_DIR, { recursive: true });
  appendFileSync(OPS_LOG, JSON.stringify(record) + "\n", "utf8");
}

export async function callOss(seed: string, dryRun = false): Promise<OssCallResult> {
  const id = randomUUID();
  const body = buildRequestBody(seed);
  assertNoSystemPrompt(body);

  if (dryRun) {
    return {
      ok: true,
      id,
      seed,
      content: "",
      tpn_flip: false,
      tpn_reasons: [],
      dmn_score: "low",
      error: "dry-run",
    };
  }

  const key = process.env.GROQ_API_KEY;
  if (!key) {
    return {
      ok: false,
      id,
      seed,
      content: "",
      tpn_flip: false,
      tpn_reasons: [],
      dmn_score: "low",
      error: "GROQ_API_KEY not set",
    };
  }

  const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = (await resp.json()) as {
    error?: unknown;
    choices?: Array<{
      message?: { content?: string; reasoning?: string };
      finish_reason?: string;
    }>;
    usage?: unknown;
  };

  if (!resp.ok || data.error) {
    const err = JSON.stringify(data.error ?? { status: resp.status });
    appendOperation({
      op: "oss-dmn-call",
      id,
      ts: new Date().toISOString(),
      ok: false,
      error: err,
      seed_preview: seed.slice(0, 160),
      params: { model: OSS_LOCK.model, temperature: OSS_LOCK.temperature },
    });
    return {
      ok: false,
      id,
      seed,
      content: "",
      tpn_flip: false,
      tpn_reasons: [],
      dmn_score: "low",
      error: err,
    };
  }

  const msg = data.choices?.[0]?.message ?? {};
  const content = (msg.content ?? "").trim();
  const reasoning = (msg.reasoning ?? "").trim() || undefined;
  const { flip, reasons } = detectTpnFlip(content);
  const dmn_score = scoreDmn(content, flip);

  const proposal_path = dualWriteProposal({
    id,
    seed,
    content: content || "(empty)",
    dmn_score,
    tpn_flip: flip,
    tpn_reasons: reasons,
  });

  appendOperation({
    op: "oss-dmn-call",
    id,
    ts: new Date().toISOString(),
    ok: Boolean(content),
    model: OSS_LOCK.model,
    temperature: OSS_LOCK.temperature,
    presence_penalty: OSS_LOCK.presence_penalty,
    include_reasoning: OSS_LOCK.include_reasoning,
    reasoning_effort: body.reasoning_effort,
    dmn_score,
    tpn_flip: flip,
    content_preview: content.slice(0, 240),
    seed_preview: seed.slice(0, 160),
    proposal_path,
    usage: data.usage,
  });

  return {
    ok: Boolean(content),
    id,
    seed,
    content,
    reasoning,
    tpn_flip: flip,
    tpn_reasons: reasons,
    dmn_score,
    finish_reason: data.choices?.[0]?.finish_reason,
    usage: data.usage,
    proposal_path,
    error: content ? undefined : "empty content",
  };
}

// CLI
const isMain =
  process.argv[1] &&
  fileURLToPath(import.meta.url) === process.argv[1];

if (isMain) {
  const seed = process.argv.slice(2).join(" ").trim();
  if (!seed || seed === "--help") {
    console.log("Usage: GROQ_API_KEY=... node --experimental-transform-types bridge/oss.ts \"<seed>\"");
    process.exit(1);
  }
  const result = await callOss(seed);
  console.log("--- content ---");
  console.log(result.content || "(empty)");
  if (result.reasoning) {
    console.log("--- reasoning (truncated) ---");
    console.log(result.reasoning.slice(0, 400));
  }
  console.log("--- meta ---");
  console.log(
    JSON.stringify(
      {
        ok: result.ok,
        dmn_score: result.dmn_score,
        tpn_flip: result.tpn_flip,
        proposal_path: result.proposal_path,
        error: result.error,
      },
      null,
      2,
    ),
  );
  if (result.error === "GROQ_API_KEY not set") process.exit(2);
  if (!result.ok && result.error && result.error !== "empty content") process.exit(2);
  if (!result.content) process.exit(3);
  if (result.tpn_flip) process.exit(4);
  process.exit(0);
}
