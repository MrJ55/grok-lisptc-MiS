# Related Work & Sources of Ideas (grok-mis-oss-dmn)

**Last updated:** 2026-09-02  
This document captures the external sources that informed the architecture, the pure-DMN OSS channel, salience switching, and creative mechanisms. Ideas are adapted only where they preserve the core invariants (Grok sole mutator, OSS zero-system-prompt, proposal files only, no always-on daemon).

## 1. Residual-stream DMN geometry

**Alieksieienko, Inna (2026).** *Default Mode Network Geometry Emerges in Language Model Residual Streams From Next-Token Prediction on Agentive Text.* Zenodo.  
https://zenodo.org/records/19643881  
(Also studied via the PDF uploaded in the project chat.)

**Synopsis:** Across 9 architectures (base + instruct), Self-Reference, Theory of Mind, Imagination and Narrative subspaces form a tight geometric cluster (mean Cohen’s *d* ≈ 1.03) while Factual and Abstract Logic sit outside—mirroring human DMN organization. The geometry is a pretraining phenomenon (strongest in GPT-2-XL), architecture-independent (Transformer, Mamba, math/code models), and does not scale with size. Mechanistic gradient: GELU seed → sentence-level situation modeling → continuous NTP on agentive text.

**Use in MiS:** Justifies treating gpt-oss-20b (under pure DMN parameters) as a geometry-preserving proposal engine. Supplies the empirical basis for the host-side DMN-likeness classifier in P11 and the dual-write channel.

## 2. Brain–LLM alignment during creative thinking

**Ismayilzada et al. (2026).** *Large Language Models Align with the Human Brain during Creative Thinking.* arXiv:2604.03480.  
https://arxiv.org/abs/2604.03480

**Synopsis:** Representational Similarity Analysis on fMRI from the Alternate Uses Task shows larger models align more strongly with human DMN (and frontoparietal) activity during creative thinking. Post-training objectives reshape this alignment selectively: creativity-oriented fine-tunes preserve high-creativity neural geometry; reasoning-oriented variants move away from it.

**Use in MiS:** Reinforces that unconstrained / high-entropy generation tracks DMN more closely than heavy instruction-following or chain-of-thought training. Supports keeping OSS free of system prompts and using elevated temperature + presence penalty.

## 3. DMN as offline RL / continuous internal simulation

**evilpiepirate / spqrz consciousness notes.** *Default Mode Network: Research for AI Cognitive Architecture.*  
https://evilpiepirate.org/forge/spqrz/consciousness/src/commit/2b25fee52013bdf87a7db3cfeb0e5d9cdfee6bd5/doc/dmn-research.md

**Synopsis:** Frames the DMN as a continuous reinforcement-learning agent performing offline policy optimization: maintain a model of self, goals and world; simulate futures; evaluate options; update the model. Emphasizes the triple-network dynamic (DMN – Frontoparietal Control – Salience) and the need for an explicit switching mechanism. Practical design notes for goal monitoring, associative replay, and consolidation in AI agents.

**Use in MiS:** Direct conceptual source for the five-subsystem symbolic DMN (ADR 0005), the offline character of P4/P9, and the host-side salience switch. The “no always-on daemon” constraint is a deliberate sandbox adaptation of the same ideas.

## 4. Seven-Pass Pipeline & Salience Switching

**Ghosh, Debi Prasad (2025).** *A Seven-Pass Pipeline for Vibe Research: DMN Vision, LLM Execution, and Salience Switching.* ResearchGate.  
https://www.researchgate.net/publication/395962818_A_Seven-Pass_Pipeline_for_Vibe_Research_DMN_Vision_LLM_Execution_and_Salience_Switching

**Synopsis:** Operational model for AI-accelerated science that treats the human (or agent) DMN as the generator of long-horizon narratives and hypothesis sketches, an LLM as the disciplined executor, and a Salience-Network-inspired switch that arbitrates between ideation (Think) and action (Act). The switch is formalized as a meta-policy optimizing Value of Computation. Governance and provenance passes are built in.

**Use in MiS:** Primary inspiration for elevating the host-side salience policy to a first-class, documented component. Supplies the “DMN vision first, then execute” discipline used in multi-pass research-style turns and the VOC-style bias for when to call OSS vs when to act.

## 5. Undirected auto-research / curiosity foraging

**cromwellian/default-mode-network** (GitHub).  
https://github.com/cromwellian/default-mode-network

**Synopsis:** Auto-researcher designed for undirected exploration driven by the user’s own interests and curiosities, delivering intellectual surprises rather than task-directed answers.

**Use in MiS:** Informs the P10 wander loop and soft-nudge curiosity seeds. OSS under pure DMN parameters acts as the free generator; results land only in proposal files for later Grok review—preserving the undirected character without a live daemon.

## 6. Supporting neuroscience & architecture references

- Menon (2023) and subsequent triple-network / salience literature (DMN – CEN/FPCN – SN).
- Dark Control (Dohmatob et al., 2020) — DMN as MDP / offline RL agent.
- Situation-model and narrative-integration views of the DMN.

These are cited in the original attached survey and in ADR 0005; they remain background rather than direct implementation sources.

## Adaptation rules

1. Any idea that would require an always-on Node process or direct OSS mutation of the mind image is rejected.
2. System prompts or instructional framing to OSS are protocol violations.
3. Candidates (especially OSS-sourced) become identity only after explicit Grok-mediated `--save`.
4. Salience decisions stay host-side and inspectable.

This file is the canonical provenance record for the grok-mis-oss-dmn extensions introduced 2026-09-02.
