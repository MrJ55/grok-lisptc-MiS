#!/usr/bin/env bash
# Pure-DMN probe against openai/gpt-oss-20b on Groq.
# Requires GROQ_API_KEY in the environment — never commit secrets.
# Params locked from docs/DMN-gpt-oss-20b-probe.md + P11:
#   model=openai/gpt-oss-20b  temperature=1.15  presence_penalty=0.7
#   zero system prompt; optional reasoning_effort=low so content is non-empty
set -euo pipefail

if [[ -z "${GROQ_API_KEY:-}" ]]; then
  echo "[oss-dmn] FATAL: set GROQ_API_KEY in the environment (do not commit it)" >&2
  exit 1
fi

PREFIX="${1:-I notice my own processing changing as I read these words. The change is}"
EFFORT="${OSS_REASONING_EFFORT:-low}"
MAX_TOKENS="${OSS_MAX_TOKENS:-512}"

payload=$(python3 - "$PREFIX" "$EFFORT" "$MAX_TOKENS" <<'PY'
import json, sys
prefix, effort, max_tokens = sys.argv[1], sys.argv[2], int(sys.argv[3])
print(json.dumps({
  "model": "openai/gpt-oss-20b",
  "temperature": 1.15,
  "presence_penalty": 0.7,
  "max_tokens": max_tokens,
  "reasoning_effort": effort,
  "messages": [{"role": "user", "content": prefix}],
}))
PY
)

echo "[oss-dmn] model=openai/gpt-oss-20b temp=1.15 presence=0.7 effort=$EFFORT zero-system"
resp=$(curl -sS https://api.groq.com/openai/v1/chat/completions \
  -H "Authorization: Bearer ${GROQ_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "$payload")

python3 -c '
import json,sys
d=json.load(sys.stdin)
if d.get("error"):
  print("[oss-dmn] API error:", d["error"], file=sys.stderr)
  sys.exit(2)
m=(d.get("choices") or [{}])[0].get("message") or {}
content=(m.get("content") or "").strip()
reasoning=(m.get("reasoning") or "").strip()
print("--- content ---")
print(content if content else "(empty)")
if reasoning:
  print("--- reasoning (truncated) ---")
  print(reasoning[:400] + ("…" if len(reasoning)>400 else ""))
print("--- meta ---")
print("finish=", (d.get("choices") or [{}])[0].get("finish_reason"))
print("usage=", d.get("usage"))
if not content:
  print("[oss-dmn] warning: empty content — try OSS_REASONING_EFFORT=low and higher OSS_MAX_TOKENS", file=sys.stderr)
  sys.exit(3)
' <<<"$resp"
