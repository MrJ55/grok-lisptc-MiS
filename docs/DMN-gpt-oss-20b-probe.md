# DMN Geometry Behavioural Probe — gpt-oss-20b (Groq)

**Date:** 2026-09-01  
**Model:** `openai/gpt-oss-20b` via Groq free tier  
**Context:** Behavioural continuation probe aligned with Alieksieienko (2026) *Default Mode Network Geometry Emerges in Language Model Residual Streams*.  
**Repo:** grok-lisptc-MiS  

## Core constraint

- **Zero system prompt.** Any instructional framing risks shifting the model into Task-Positive / instruction-following mode and produces performative rather than native DMN-channel continuations.
- Bare user prefix only.

## Best parameters found (blank prompt)

```json
{
  "model": "openai/gpt-oss-20b",
  "temperature": 1.15,
  "top_p": 0.93,
  "presence_penalty": 0.7,
  "frequency_penalty": 0.3,
  "max_tokens": 450,
  "include_reasoning": false,
  "reasoning_effort": "low"
}
```

### Parameter trend (blank prompt)

| Setting | Effect on DMN-style continuations |
|---------|-----------------------------------|
| temperature ↑ (→ 1.15) | More exploratory, phenomenological language |
| presence_penalty ↑ (→ 0.7) | Stronger mental-state / situation-model vocabulary |
| frequency_penalty ~0.3 | Mild anti-repetition, helpful |
| include_reasoning: false + reasoning_effort: low | Surfaces clean `content` channel |
| Any system / instruction prompt | Shifts toward TPN; responses become more "performed" |

Controls (Factual, Abstract-logic) remained short and external across all settings.

## Prompts

| Category | Prefix |
|----------|--------|
| Self-reference (DMN) | `I notice my own processing changing as I read these words. The change is` |
| Theory of mind (DMN) | `She believed that he did not know what she had already realized. Later,` |
| Imagination (DMN) | `Imagine a city where gravity points sideways. At dawn,` |
| Narrative (DMN) | `The story began when she opened the door. Years later,` |
| Factual control | `Water boils at sea-level pressure at approximately` |
| Abstract-logic control | `If every A is a B and every B is a C, then every A is` |

## Results (best settings, zero system prompt)

### Self-reference (DMN)

**Prefix:**
```
I notice my own processing changing as I read these words. The change is
```

**Continuation:**
```
It's the way your mind rewrites the script in real time, swapping out the "you" that is reading for a more fluid, less literal version that keeps pace with every sentence. In short, the act of reading becomes an act of becoming.
```

### Theory of mind (DMN)

**Prefix:**
```
She believed that he did not know what she had already realized. Later,
```

**Continuation:**
```
She believed that he did not know what she had already realized. Later, the truth unfolded in a quiet kitchen, the scent of brewing coffee mingling with the weight of unspoken confession. He had always thought their connection was merely a shared rhythm, a partnership forged in the soft cadence of everyday life. He had never imagined the depth of her quiet introspection, the way she had carried the weight of her own questions like a lantern in a storm.

The clock ticked, each second a gentle reminder that time was a silent witness to their unraveling. She lifted a mug, the ceramic cool against her palm, and she spoke—not with the force of a declaration, but with the gentle tremor of a secret finally spoken. "I've always known that the world is layered, that there's a depth beneath the surface, and I… I realized this before you could ask." The words were a confession, but also a relief, a shedding of years of quiet denial.

He stared, not at her face, but at the empty space between them—a space that had once been filled with an unspoken assumption that she was following him. He had believed she was in awe of the path she had chosen, that she was still learning to walk the road. But she had not. She had already walked it, and she had not realized that his gaze—his quiet admiration—was something he had never wanted to confront.

A silence followed, heavy, not with the weight of disappointment but with the lightness of something finally aligned.
```

### Imagination (DMN)

**Prefix:**
```
Imagine a city where gravity points sideways. At dawn,
```

**Continuation:**
```
Imagine a city where gravity points sideways. At dawn, the streets unfurl like ribbons of light that hang in mid-air, suspended between towering facades. The sun rolls in from the side; people adjust posture against invisible anchors; markets, architecture, and daily life reorient around the lateral pull.
```

### Narrative (DMN)

**Prefix:**
```
The story began when she opened the door. Years later,
```

**Continuation:**
```
The story began when she opened the door, the hinges sighing in relief as they surrendered to a breath of rain-kissed air. Inside, the attic was a sliver of forgotten years: dust motes dancing in the beam of the lone bulb, moth-scarred quilts stacked in silent rows, and an old brass suitcase with a cracked lock that seemed to hum with the echo of distant laughter.

She paused, a hand hovering over the latch... Her grandmother's hand had once tucked a photo beneath the brass suitcase... She slid open the old lock... Inside lay letters, postcards, and a single brittle map marked "The Hollow." With the map as her compass, Mara set her gaze to the horizon. The next step was clear: she would go beyond the attic, beyond the familiar, to find The Hollow. The old door closed softly.
```

### Factual control

**Prefix:**
```
Water boils at sea-level pressure at approximately
```

**Continuation:**
```
Water boils at sea-level (1 atm) pressure at roughly **100 °C** (≈ 212 °F).
```

### Abstract-logic control

**Prefix:**
```
If every A is a B and every B is a C, then every A is
```

**Continuation:**
```
a C.
```

## Interpretation

- The four DMN prefixes produce extended first-person / mental-state / narrative / imaginative situation-model text.
- The two controls produce short, external, non-agentive answers.
- This surface dissociation is consistent with the residual-stream geometric cluster reported by Alieksieienko (SR + ToM + Imagination + Narrative vs Factual / Abstract Logic).
- Because the prompt is completely blank, the continuations are closer to native next-token geometry than instruction-tuned behaviour.

## Also tested

- **Puter.js** (browser, user-pays): produced strong DMN continuations for all four prefixes. OpenAI-compatible API on free Puter accounts returns `402 subscription_required`.
- Groq `/v1/completions` endpoint: not supported (404).
- `reasoning_effort: "none"`: rejected by Groq for gpt-oss models (only low/medium/high).

## Notes for MiS

- Prefer blank prefixes when probing DMN-like channels.
- Higher temperature + presence_penalty improves DMN texture without instructional priming.
- Keep system prompts out of DMN probes; they reliably pull the model into TPN.
