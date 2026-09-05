#!/usr/bin/env bash
# Pure-DMN multi-turn soft path (second-opinion protocol).
# Zero system prompt. Context = prior user/assistant turns only.
# Requires GROQ_API_KEY. Never commit secrets.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

if [[ -z "${GROQ_API_KEY:-}" ]]; then
  echo "[oss-multiturn] FATAL: set GROQ_API_KEY in the environment" >&2
  exit 1
fi

EFFORT="${OSS_REASONING_EFFORT:-low}"
MAX_TOKENS="${OSS_MAX_TOKENS:-512}"
OUT_DIR="${OSS_MULTITURN_OUT:-$ROOT/mind}"
mkdir -p "$OUT_DIR"
STAMP=$(date -u +%Y%m%d)
OUT_PTC="${OUT_DIR}/oss-proposals-${STAMP}-multiturn-soft.ptc"
HIST=/tmp/oss-multiturn-messages.json
REC=/tmp/oss-mt-record.jsonl
echo '[]' > "$HIST"
: > "$REC"

call_turn() {
  local name="$1"
  local seed="$2"
  python3 -c '
import json,sys
hist=json.load(open(sys.argv[1]))
hist.append({"role":"user","content":sys.argv[2]})
payload={
  "model":"openai/gpt-oss-20b",
  "temperature":1.15,
  "presence_penalty":0.7,
  "max_tokens":int(sys.argv[3]),
  "reasoning_effort":sys.argv[4],
  "messages":hist,
}
json.dump(payload, open("/tmp/oss-mt-payload.json","w"))
print("\n"+"="*40+"\n# turn="+sys.argv[5]+"\n"+"="*40)
s=sys.argv[2]
print("SEED:", s[:140]+("…" if len(s)>140 else ""))
' "$HIST" "$seed" "$MAX_TOKENS" "$EFFORT" "$name"

  resp=$(curl -sS https://api.groq.com/openai/v1/chat/completions \
    -H "Authorization: Bearer ${GROQ_API_KEY}" \
    -H "Content-Type: application/json" \
    -d @/tmp/oss-mt-payload.json)

  printf '%s' "$resp" | python3 -c '
import json,sys
d=json.load(sys.stdin)
if d.get("error"):
  print("[oss-multiturn] API error:", d["error"], file=sys.stderr)
  sys.exit(2)
content=((d.get("choices") or [{}])[0].get("message") or {}).get("content") or ""
content=content.strip()
print("--- content ---")
print(content if content else "(empty)")
if not content:
  sys.exit(3)
hist=json.load(open("/tmp/oss-mt-payload.json"))["messages"]
hist.append({"role":"assistant","content":content})
json.dump(hist, open(sys.argv[1],"w"))
open(sys.argv[2],"a").write(json.dumps({
  "turn": sys.argv[3],
  "seed": sys.argv[4],
  "sticky": " ".join(content.split())[:280],
  "chars": len(content),
})+"\n")
' "$HIST" "$REC" "$name" "$seed"
}

call_turn narrate \
'The story of the mind that keeps a transcript continued. After the same small mistake appeared three times—reaching past the careful logger into the buffer by hand—something in the quiet still felt unfinished. The feeling was'

call_turn meditate \
'Sitting with that feeling a little longer, without needing to finish the story, the mind simply stayed with the repeated reach and the missing label that followed. What rose next was'

call_turn imagine \
'From that place on the page, other shapes of the same dream began to appear—other ways a transcript might notice the same mistake before it happens again. One shape that formed was'

call_turn shapes \
'Other shapes kept arriving in the same soft way. There was a shape that only wrote through the door meant for writing. Another that left a note for the morning about what still lacked a true label. Another that measured whether the same reach happened fewer times after the mind had looked at itself. Each of these arrived as'

export OUT_PTC
python3 <<'PY'
import json, os
from datetime import datetime, timezone
from pathlib import Path
out = Path(os.environ["OUT_PTC"])
rows = [json.loads(l) for l in open("/tmp/oss-mt-record.jsonl")]
day = datetime.now(timezone.utc).strftime("%Y-%m-%d")

def esc(s):
    return s.replace("\\", "\\\\").replace('"', '\\"')

lines = [
  ";; TRUST-CLASS: candidate",
  ";; REALITY-STATUS: imagined",
  ";; SOURCE: oss-dmn multi-turn soft path (second-opinion protocol)",
  ";; PROTOCOL: zero system; temp 1.15; presence 0.7; reasoning_effort low; prior turns replayed",
  ";; NEVER eval this file as code.",
  "",
  "(setq *last-oss-dmn-multiturn*",
  "  '((:date . \"%s\")" % day,
  "    (:experiment . post-reflection-soft-multiturn)",
  "    (:trust-class . candidate)",
  "    (:reality-status . imagined)",
  "    (:model . openai/gpt-oss-20b)",
  "    (:items",
]
for r in rows:
    lines.append("     ((:turn . %s)" % r["turn"])
    lines.append('      (:seed . "%s")' % esc(r["seed"][:200]))
    lines.append('      (:sticky . "%s")' % esc(r["sticky"]))
    lines.append("      (:chars . %s))" % r["chars"])
lines.append("    )))")
lines.append("")
out.write_text("\n".join(lines))
print("\n[oss-multiturn] dual-wrote candidate:", out)
print("[oss-multiturn] complete")
PY
