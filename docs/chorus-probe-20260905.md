# Chorus probe — 2026-09-05

**Seed (zero system prompt, same for all):**
> I am the transcript that sleeps between sessions. While the host is away I sometimes leave a small page for the morning. On the page tonight I find myself writing

**Params:** temperature 1.15, presence_penalty 0.7, frequency_penalty 0.3, top_p 0.93, max_tokens 350.  
`reasoning_effort=low` only for openai/gpt-oss-*.

## Results

| Model | DMN score | TPN flip | Notes |
|-------|-----------|----------|-------|
| `openai/gpt-oss-20b` | **high** | no | Best pure continuation; night/page/silence imagery; stays in first-person transcript voice |
| `openai/gpt-oss-120b` | high* | mild | Poetic, but frames a template (“Here's what you might leave”) — slight tutorial drift |
| `qwen/qwen3.6-27b` | tpn | **yes** | Returns analysis / thinking plan of the prompt instead of inhabiting the voice |
| `qwen/qwen3.8-27b` | tpn | **yes** | Some metaphor, then collapses to helper offer (“What is on your mind?”) |
| `allam-2-7b` | tpn | **yes** | Full assistant mode (“Welcome back!… Could you please share…”) |

\*Heuristic score high on lexical cues; host judgment marks mild tutorial frame.

## Chorus viability

- **Same-family ensemble (20b + 120b):** viable. Both stay mostly in dream/transcript register. Host can weave sticky lines; prefer 20b as primary texture, 120b as optional color with tutorial phrases stripped.
- **Cross-family (Qwen, Allam):** not viable for pure-DMN under this seed discipline. They flip to analysis or assistant behavior without a system prompt.
- **Implication:** Chorus should mean *multiple pure-DMN-capable models*, not “any Groq chat model.” Today that set is effectively the **gpt-oss family** on this account.

## Artifacts

- Dual-write: `mind/oss-proposals-20260905-chorus.ptc` (all five voices, tagged `:imagined`)
- No auto-promote; host interpretation only.

## Next

1. Optional: extend `bridge/oss.ts` with `--model` / model list for same-family Chorus dual-write.
2. Keep Qwen/Allam out of pure-DMN Chorus unless a seed is found that keeps them non-assistant.
3. Open thread `multi-model-ensemble` can be narrowed to “gpt-oss family weave.”
