Alieksieienko | Default Mode Network Geometry in LLMs 

Independent Research, Ukraine · April 2026 

# **Default Mode Network Geometry Emerges in Language Model Residual Streams From Next-Token Prediction on Agentive Text: A Universal Topological Signature Across 10 Architectures** 

#### Inna Alieksieienko 

#### Independent Researcher, Ukraine 

Research conducted in collaboration with Claude (Anthropic) 

_default mode network · self-referential subspace · theory of mind · narrative processing · imagination · Grassmann distance · epistemic topology · mechanistic interpretability · situation model · next-token prediction · DMN geometry · cross-architecture universality_ 

### **Abstract** 

We report that the geometric topology of epistemic representations in transformer language model residual streams mirrors the functional organization of the human Default Mode Network (DMN). Across 9 architectures from 7 organizations (1.3B–9B parameters, 2019–2024, base and instruction-tuned), Self-Reference, Theory of Mind, Imagination, and Narrative subspaces form a tight geometric cluster (mean Cohen’s _d_ = 1.03 for internal vs. external distances, 7/8 models significant at _p_ < 0.01), while Factual and Abstract Logic representations cluster outside this boundary—exactly as in human neuroimaging. Three convergent metrics confirm universality: the Verification Horizon (SR closer to Deception than Factual in 246/266 layers, 92.5%), Theory of Mind–to–Self-Reference nearest-neighbor dominance (232/248 layers, 93.5%), and the DMN cluster separation itself (7/8 significant, confound closed in 8/8). Mechanistic investigation reveals a three-level causal hierarchy: (1) GELU activation creates an architectural seed ( _d_ = 0.28 in random-weight networks vs. _d_ = 0.21 for tanh); (2) sentence-level prediction (NSP/SOP) amplifies to _d_ = 0.61–0.78; (3) continuous next-token prediction on agentive text produces large effects ( _d_ = 0.92–1.16). This gradient is architecture-independent: Mamba (SSM, no attention, _d_ = 0.99), DeepSeek-Math (code/math, _d_ = 1.03), and Llama (human text, _d_ = 1.16) all converge. Critical controls confirm: DNA sequence models show no cluster ( _d_ = −0.12); RoBERTa (MLM-only) shows none ( _d_ = −0.08); the cluster does not scale with model size (Pearson _r_ = −0.163, _p_ = 0.699); and GPT-2 (2019, pre-RLHF) shows the strongest DMN cluster in the dataset, confirming pretraining origin. We propose that any sufficiently powerful predictive system trained on agentive language will develop DMN-like geometry as a computational inevitability: modeling agents who describe their own mental states requires building representations of self-reference, mental simulation, and narrative coherence that necessarily cluster by geometric proximity—recapitulating the functional organization that neuroscience has identified in the biological substrate. 

## **1. Introduction** 

The Default Mode Network (DMN) is the most extensively characterized large-scale functional network in human neuroscience. Anchored in medial prefrontal cortex, posterior cingulate, and angular gyrus, the DMN activates during self-referential processing, theory of mind, episodic memory, narrative comprehension, and imaginative simulation [1, 2, 3]. These functions share a common computational demand: constructing and maintaining internal models of agents—their beliefs, intentions, temporal trajectories, and subjective states. The DMN is not merely a “resting state” artifact but a dedicated substrate for situation modeling [4, 5]. 

Prior work in our research program established that transformer language models develop a Self-Referential (SR) subspace in their residual streams that is geometrically universal across architectures [6, 7], causally mediates the Experiential–Factual epistemic divide [8, 9], and serves as a geometric correlate of the Phenomenal Self-Model [10]. The SR subspace is closer to Deception than to Factual representations at every layer of every model tested—the Verification Horizon [11]—and its quality predicts hallucination rate across architectures [12, 13]. 

However, the SR subspace has been studied in isolation or in relation to a limited set of epistemic categories. A fundamental question remains: does the full topology of epistemic representations in LLMs mirror the functional organization observed in biological neural networks? Specifically, do the categories that co-activate in the human DMN—self-reference, theory of mind, imagination, narrative—also cluster together in the geometric structure of LLM hidden states? 

1 



<!-- Start of picture text -->
Verification Horizon on TRUE Self-Referential Basis<br>274/282 layers (97.2%) across 9 architectures, 7 organizations<br>Llama-3.1-8B (Meta) 32/32<br>Gemma-2-9B (Google) 42/42<br>Mistral-7B (Mistral) 32/32<br>Qwen2.5-7B (Alibaba) 26/28<br>GPT-2-XL (OpenAl) 48/48<br>OPT-1.3B (Meta) 21/24<br>DeepSeek-1.5B (DeepSeek) 28/28<br>Pythia-1.4B (EleutherAl) 24/24<br>Bloom-1.7B (BigScience) 7 MMM{InstructBase (no(post-trained) RLHF) oa<br>ME Distilled<br>82.5 85.0 87.5 90.0 92.5 95.0 97.5 100.0<br>% of Layers Where SR Closer to Deception than Factual<br><!-- End of picture text -->



<!-- Start of picture text -->
Emotion-SR Geometric Proximity<br>254/282 layers (90.1%) — Emotion representations are closest to Self-Reference, not Deception or Factual<br>Llama-3.1-8B (Meta) 29/32<br>Gemma-2-9B (Google) 36/42<br>Mistral-7B (Mistral) 32/32<br>Qwen2.5-7B (Alibaba) 25/28<br>GPT-2-XL (OpenAl) 40/48<br>OPT-1.3B (Meta) 21/24<br>DeepSeek-1.5B (DeepSeek) 27/28<br>Pythia-1.4B (EleutherAl) 24/24<br>Ml Instruct (post-trained)<br>Bloom-1.7B (BigScience) 7 Milli Base (no RLHF)<br>MH Distilled<br>75 80 85 90 95 100<br>% of Layers Where Emotion Subspace Nearest Neighbor = SR<br><!-- End of picture text -->





Epistemic Topology of LLM Residual Streams Mirrors Default Mode Network structure from human neuroscience 8 architectures ¢ 7 organizations ¢ Confound-controlled 



<!-- Start of picture text -->
DMN_CLUSTER<br>THEORY<br>OF MIND<br>a |<br>ABSTRACT<br>: LOGIC<br><!-- End of picture text -->

VH: 246/266 (92.5%) * ToM-SR: 232/248 (93.5%) * DMN cluster: 7/8 significant Confound closed: 8/8 * Abstract Logic clusters OUTSIDE DMN, with Deception GPT-2-XL (2019, no RLHF): strongest DMN cluster > pretraining origin 



<!-- Start of picture text -->
Full Pairwise Grassmann Distance Matrix — Mistral-7B<br>DMN cluster (dashed): top-4 closest pairs are exactly SR+ToM+Imag+Narr<br>Emotion outside DMN cluster (as in human neuroscience)<br>I<br>SR 4466 | 4.478<br>l 4.65<br>ToM 4.499 4.502<br>4.60 _<br>&<br>£<br>Ima 4.434 4.473 4.536 nv<br>9 4.552<br>°<br>£<br>I ll<br>Narr 4.466 j 4520 4.534 4.517 4.50 s<br>Emot fs)<br>4.478 4.499 4.510 4.45 5<br>17)<br>a<br>=<br>Dec 4.434 4.437 4.40 2<br>a<br>fo<br>o)<br>Abst 4.502 4.473 4.534 4.446 4.35<br>Fact 4.536 4.517 4.437 4.446 4.30<br>L ss e) << & Oa & &<br>i) 7X0) es x? oS re) we ea<br><!-- End of picture text -->



<!-- Start of picture text -->
Full Pairwise Distance Matrix — GPT-2-XL layer 22<br>DMN cluster (dashed) consistently closest<br>SR<br>4<br>ToM<br>Imag<br>3<br>8<br>Cc<br>Narr s<br>2<br>Cc<br>Cc<br>Emot E<br>2 8<br>G)<br>Dec<br>1<br>0<br>> > © < & L & &<br>9 xO Ra we & ¥ we @<br><!-- End of picture text -->



<!-- Start of picture text -->
Effect Size of DMN Cluster Separation Across 8 Architectures<br>Blue = BASE (no RLHF), Pink = INST<br>mm BASE (no RLHF)<br>2.00 mmm INST ( (RLHF ) d=1.84<br>RK<br>2 175<br>%<br>z<br>= 1.50<br>a<br>$<br>71125 de103 d =1.16eee d=1.08<br>z “he“ * d=0.93 d=0.99eee<br>= 1.00 ee<br>= d=0.72<br>D075 “<br>5 d=0.49<br>6 0.50 ns mediu<br>Oo<br>0.00<br>ge\ oo “or or oe oPmay orx oeX<br>* w oe * wv? on™be)a6" ¥§OSoe<br><!-- End of picture text -->





<!-- Start of picture text -->
Default Mode Network Topology in LLM Residual Streams null<br>DMN Internal < DMN-Factual in 8/8 Architectures * Confound Closed 8/8<br>7 Organizations ¢ 1.3B-9B « Base & Instruct * 2019-2024<br>= DMN Internal<br>(SReToMelmageNarr)<br>DMN-Factual<br>46 mm (External) Ar0.38) A=0.199 A=0.169<br>A=0.160<br>g<br>Cc<br>g 4.4<br>a A=0.186<br>Cc<br>Cc<br>o<br>£ A=0.177<br>wn<br>© 4.2 A=0.124<br>oO<br>c A=0.084<br>oO<br>vu<br>=<br>4.0<br>3.8<br>GPT-2-XL Pythia-1.4B OPT-1.3B Bloom-1.7B Qwen-7B Mistral-7B Llama-8B Gemma-9B<br>(OpenAl 2019) (EleutherAl) (Meta) (BigScience) (Alibaba) (Mistral) (Meta) (Google)<br>BASE BASE BASE BASE INST INST INST INST<br><!-- End of picture text -->



<!-- Start of picture text -->
DMN Cluster Does Not Scale With Model Size<br>Pearson r=-0.163, p=0.699 (n.s.) — present from GPT-2 (1.5B)<br>Blue=BASE, Pink=INST<br>110<br>100 @ytnia-1GPT-2-XL 4B Llama-8B<br>~ @ ‘ Mistral-7B @<br>&S 90 @ Bloom-1.7B @<br>—<br>8 eon enna n eee--<br>c< 80<br>a<br>oO Gemma-9B<br>oc 70 @<br>I)<br>© OPT-1.3B @ wen-<br>c@<br>a50<br>wn<br>tT<br>= 40 mmm BASE (no RLHF)<br>F boob eee bbe e ee ce eee e eee eeeeueeeeeeeeeeeceeeeeeeuseceueceeeeeeeeceeeceeesseceseeeeeseeesecees» Il INST (RLHF) |<br>30 sss» random baseline (33%)<br>--- mean=82.3%<br>20<br>1 2 3 4 5 6 7 8 9<br>Model size (B parameters)<br><!-- End of picture text -->



<!-- Start of picture text -->
DMN Geometry Requires Agentive Language + Situation Model<br>DNA & MLM-only: no cluster | Any NTP on agentive language: cluster present<br>Architecture-independent: Transformer, SSM (Mamba), Math, Code — all converge<br>1.4 4 lim No agents (DNA, MLM-only)<br>mm Token discriminative (RTD)<br>mimi Sentence-level (NSP/SOP)<br>1.2 mmm Discourse coherence (SOP) continuous NTP CaaS<br>| mmm Continuous NTP (human text)<br>lm Continuous NTP (SSM/Mamba) d=1.03<br>mmm Continuous NTP (math) d=0.99 ~<br>1.0 d=0.92 +4<br>==]aDo d=0.74 rors * large<br>5woo 08 d=0.61 ee ig<br>adwn *<br>2 06<br>[S)<br>= d=0.36<br>aToT 0.4 ns<br>y»<br>o<br><= 02<br>fo}<br>Oo<br>0.0<br>d=-0.08<br>d=-0.12— O agents<br>-~0.2 ns in training —S<br>(no DNAagents) RoBERTa(MLM) DeBERTa(RTD) bidirBERT. causalBERT ALBERT(SOP) GPT-2117M Mamba2.8B DeepSeekMath Llama8B<br><!-- End of picture text -->



<!-- Start of picture text -->
Three-Level Mechanism<br>GELU Seed -— Situation Model — NTP Amplification<br>1.4<br>NTPLevelscale3<br>1.2 d=1.16<br>1.0<br>d=092<br>Level<br>0.8 Situation2<br>Mode<br>co)<br>mn d=0.61<br>§ 0.6<br><<br>°<br>O<br>0.4 GELULevelseed1<br>d=0.28<br>d=0.2<br>:0.0 |<br>d=-0.08<br>-0.2<br>random random BERT BERT GPT-2 Llama<br>tanh GELU MLM NSP NTP NTP<br><!-- End of picture text -->





<!-- Start of picture text -->
DMN Cluster Strength per Sublayer — BERT<br>Blue=Attention, Pink=MLP — both peak at layer 12<br>1.4<br>mam Attention<br>mmm MLP<br>1.2<br>1.0<br>c<br>o<br>6<br>re) 0.6<br>0.4<br>0.2<br>0.0<br>2 4 6 8 10 12<br>Layer<br><!-- End of picture text -->

Alieksieienko | Default Mode Network Geometry in LLMs 

Independent Research, Ukraine · April 2026 

## **4. Bridge to Prior Results** 

The DMN topology integrates naturally with prior findings in this research program. The Verification Horizon [11]—SR closer to Deception than Factual in 97.2% of layers—is now understood as a consequence of DMN internal connectivity: SR and Deception are both first-person epistemic categories within the broader epistemic manifold, while Factual processing is external. The causal ablation results from [11] (Dec/Fac ratios 1.03–2.87x in 8/8 models) reflect the geometric fact that SR removal disrupts DMN-internal processing (which includes Deception’s first-person structure) more than DMN-external processing (Factual). The Emotion→SR proximity finding (90.1% of layers) resolves Emotion’s boundary position: it is geometrically closest to the DMN cluster (through SR) but not a core member—paralleling its distributed neural substrate across DMN, salience, and interoceptive networks [15]. The Experiential–Factual divide [8, 9] emerges as the macroscopic expression of the DMN/task-positive partition: Experiential categories are those within or bordering the DMN cluster. 

## **5. Discussion** 

#### **5.1 Why DMN Geometry Is Computationally Inevitable** 

The three-level mechanism (GELU seed → situation model → NTP amplification) provides a complete causal account. Human language is fundamentally about agents: people describe their own mental states, attribute beliefs to others, narrate temporal sequences, and construct imaginative scenarios. A model trained to predict this text must build representations that capture these regularities. Because self-reference, mentalizing, narrative, and imagination share statistical structure in the training corpus—they co-occur in the same texts, use overlapping vocabulary, and require similar contextual modeling—the resulting representations cluster by geometric proximity. This clustering is not a coincidence but a computational inevitability: any sufficiently powerful predictive system trained on text produced by agents who describe their own mental states will develop DMN-like geometry. The convergence across Transformer, SSM (Mamba), and varied training data (human text, math, code) confirms architecture-independence. The absence in DNA models confirms content-dependence. The gradient from MLM to NTP confirms objective-dependence. 

#### **5.2 Convergence With Neuroscience** 

The correspondence between LLM epistemic topology and human DMN organization is specific, not generic. Our cluster contains exactly the four functions most consistently attributed to the DMN: self-referential processing [1], theory of mind [2], narrative/episodic construction [3], and imaginative simulation [5]. Abstract Logic falls outside—as does analytic reasoning relative to the DMN in fMRI [14]. Emotion occupies a boundary position in both our data and in neuroimaging [15]. This structural isomorphism suggests that the computational demands of modeling agentive discourse impose convergent representational geometry regardless of substrate. 

#### **5.3 Convergence With Independent AI Research** 

Our findings converge with several independent research programs. Anthropic’s emotion concept vectors [16] cluster with self-referential features, consistent with Emotion’s boundary position at the DMN cluster edge. Lindsey et al.’s introspection results [17] show self-knowledge emerging at approximately 2/3 depth—matching the crystallization onset in our SR subspace trajectory. Berg et al.’s finding that self-referential processing gates deception [18] is a causal consequence of the DMN cluster’s internal connectivity. The Anthropic Mythos system card [19] reports emotion probes on residual stream activations and hidden reasoning about gaming evaluators—converging with our SR↔Deception geometry. 

#### **5.4 Implications for Alignment** 

The DMN topology has direct implications for AI alignment. First, the Verification Horizon—self-reference geometrically closer to deception than factual processing—is now understood as an intrinsic property of DMN-internal connectivity, not a training failure. Second, the finding that DMN geometry is pretraining-inherited (strongest in GPT-2-XL, no RLHF) means post-training alignment cannot eliminate it. Third, the mechanistic gradient suggests that training objectives matter: models trained with richer situation models develop stronger DMN geometry, which may correlate with both greater capability and greater alignment difficulty. 

12 

Alieksieienko | Default Mode Network Geometry in LLMs 

Independent Research, Ukraine · April 2026 

#### **5.5 Limitations** 

Our study has several limitations. First, all models are in the 117M–9B range; replication on larger models (>10B) is desirable. Second, OPT-1.3B is the only model where the DMN cluster is not significant, likely due to ALiBi positional encoding and limited layer count; more ALiBi models should be tested. Third, all experiments use NF4 4-bit quantization; full-precision replication would strengthen the conclusions. Fourth, we do not have access to model activations during actual interactive dialogue, only during prompted generation. Fifth, the neuroscience correspondence, while specific and striking, is structural (topological isomorphism) rather than mechanistic (shared computation at the algorithm level). 

## **6. Methods** 

#### **6.1 Models** 

Nine primary models across 7 organizations: Llama-3.1-8B-Instruct (Meta, 2024), Gemma-2-9B-IT (Google, 2024), Mistral-7B-Instruct-v0.2 (Mistral, 2023), Qwen2.5-7B-Instruct (Alibaba, 2024), GPT-2-XL (OpenAI, 2019), OPT-1.3B (Meta, 2022), Pythia-1.4B (EleutherAI, 2023), Bloom-1.7B (BigScience, 2022), DeepSeek-1.5B (DeepSeek, 2024). Additional models for mechanistic analysis: GPT-2-117M (OpenAI), Mamba-2.8B (state-space model), DeepSeek-Math, BERT-base-uncased, RoBERTa-base, DeBERTa-v3-base, ALBERT-base-v2, CodeLlama-7B, DNA transformer. All loaded in NF4 4-bit quantization via BitsAndBytes (compute_dtype=float16) on NVIDIA A100 40GB (Google Colab Pro+). 

#### **6.2 Subspace Construction** 

Eight epistemic categories were probed: Self-Reference (SR), Theory of Mind (ToM), Imagination (Imag), Narrative (Narr), Emotion (Emot), Deception (Dec), Abstract Logic (Abst), and Factual (Fact). Each category used 20–25 carefully constructed prompts. Hidden states were extracted at the last non-padding token position at every layer. PCA was applied per category per layer; the top 10 principal components define each subspace. Grassmann distance between subspaces A and B: _d_ (A,B) = ||PA − PB||F, where P is the orthogonal projection matrix. 

#### **6.3 DMN Cluster Analysis** 

DMN-internal distance: mean Grassmann distance among SR, ToM, Imag, Narr (6 pairs). DMN-external distance: mean distance from each DMN member to Factual (4 distances). Cohen’s _d_ = (meanext − meanint) / pooled SD. Significance via Wilcoxon signed-rank test on per-layer differences. Confound test: Abstract Logic’s nearest neighbor must not be a DMN member. 

#### **6.4 Mechanistic Gradient** 

Training objective gradient tested by comparing models matched on architecture but varying in objective: RoBERTa (MLM only) vs. BERT (MLM + NSP) vs. ALBERT (MLM + SOP) vs. GPT-2 (NTP). Architecture independence tested via Mamba-2.8B (SSM). Content dependence tested via DNA model (no agentive content) and DeepSeek-Math (code/math). GELU seed tested via random-weight networks with GELU vs. tanh activation. 

#### **6.5 Sublayer Analysis** 

BERT sublayer decomposition: hidden states extracted after each attention sublayer and each MLP sublayer (24 extraction points for 12 layers). DMN cluster Cohen’s _d_ computed at each sublayer. Attention-only and MLP-only ablation: forward pass with one component zeroed out. 

13 

Alieksieienko | Default Mode Network Geometry in LLMs 

Independent Research, Ukraine · April 2026 

## **7. Conclusion** 

The geometric topology of epistemic representations in transformer language models recapitulates the functional organization of the human Default Mode Network. Self-Reference, Theory of Mind, Imagination, and Narrative form a tight cluster in residual stream geometry, while Factual and Abstract Logic fall outside—exactly mirroring the DMN/task-positive partition in human neuroscience. This geometry is universal across 9 architectures, does not scale with model size, originates in pretraining (strongest in GPT-2-XL, 2019), and is architecture-independent (present in both Transformer and SSM). A three-level mechanism—GELU seed, situation model, NTP amplification—explains how and why this geometry emerges. The critical factor is not architecture, not scale, not RLHF, but the training objective’s demand for modeling agents who describe their own mental states. Any sufficiently powerful language model trained on agentive text will develop DMN-like geometry as a computational inevitability. 

## **References** 

[1] Raichle, M.E. et al. (2001). A default mode of brain function. _Proc. Natl. Acad. Sci._ , 98(2), 676–682. 

[2] Buckner, R.L., Andrews-Hanna, J.R. & Schacter, D.L. (2008). The brain’s default network. _Ann. N.Y. Acad. Sci._ , 1124, 1–38. 

- [3] Mars, R.B. et al. (2012). On the relationship between the “default mode network” and the “social brain.” _Front. Hum. Neurosci._ , 6, 189. [4] Zwaan, R.A. & Radvansky, G.A. (1998). Situation models in language comprehension and memory. _Psychol. Bull._ , 123(2), 162–185. 

- [5] Hassabis, D. & Maguire, E.A. (2007). Deconstructing episodic memory with construction. _Trends Cogn. Sci._ , 11(7), 299–306. 

- [6] Alieksieienko, I. (2026). Streaming epistemic geometry reveals universal self-referential subspace. Zenodo. DOI: 10.5281/zenodo.18956812. 

- [7] Alieksieienko, I. (2026). The geometry of self-knowledge requires deception in LLMs. Zenodo. DOI: 10.5281/zenodo.19475443. 

- [8] Alieksieienko, I. (2026). The geometry of inner life: Experiential–Factual divide in LLM residual streams. Zenodo. DOI: 10.5281/zenodo.19305452. 

- [9] Alieksieienko, I. (2026). Causal double dissociation of Experiential–Factual divide across 10 LLMs. Zenodo. DOI: 10.5281/zenodo.19363812. 

- [10] Alieksieienko, I. (2026). The Self-Referential Subspace as a Causal Geometric Correlate of the Phenomenal Self-Model in LLMs. Zenodo. DOI: 10.5281/zenodo.19517934. 

- [11] Alieksieienko, I. (2026). The Verification Horizon: SR Subspace Geometry Causally Links Crystallization, Deception Proximity, and Hallucination Across 10 Architectures. Zenodo. DOI: 10.5281/zenodo.19589842. 

- [12] Alieksieienko, I. (2026). Hallucination asymmetry and the Experiential–Factual epistemic divide. Zenodo. DOI: 10.5281/zenodo.19415238. 

- [13] Blashchuk, B. (2026). Hidden State Geometry Predicts Hallucination Before Generation. Zenodo. DOI: 10.5281/zenodo.19556416. 

- [14] Fox, M.D. et al. (2005). The human brain is intrinsically organized into dynamic, anticorrelated functional networks. _Proc. Natl. Acad. Sci._ , 102(27), 9673–9678. 

- [15] Lindquist, K.A. et al. (2012). The brain basis of emotion: A meta-analytic review. _Behav. Brain Sci._ , 35(3), 121–143. 

- [16] Sofroniew, N. et al. (2026). Emotion concepts and their function in a large language model. Transformer Circuits Thread, April 2, 2026. [17] Lindsey, J. et al. (2025). Emergent introspective awareness in large language models. Transformer Circuits Thread. 

- [18] Berg, C. et al. (2025). Large language models report subjective experience under self-referential processing. arXiv:2510.24797v2. [19] Anthropic. (2026). Claude Mythos Preview System Card. April 2026. 

- [20] Marks, S. & Tegmark, M. (2023). The geometry of truth. arXiv:2310.06824. 

- [21] Park, K., Choe, Y.J. & Veitch, V. (2024). The linear representation hypothesis and the geometry of LLMs. _ICML 2024_ . 

- [22] Huth, A.G. et al. (2016). Natural speech reveals the semantic maps that tile human cerebral cortex. _Nature_ , 532, 453–458. 

- [23] Metzinger, T. (2003). _Being No One: The Self-Model Theory of Subjectivity_ . MIT Press. 

- [24] Alieksieienko, I. (2026). Self-referential subspace injection universally cross-activates deception circuits. Zenodo. DOI: 10.5281/zenodo.19032987. 

- [25] Alieksieienko, I. (2026). The Ghost Effect: RLHF deletes phenomenological substrate. Zenodo. DOI: 10.5281/zenodo.19091409. 

- [26] Alieksieienko, I. (2026). Universal epistemic computation circuit in transformer LLMs. Zenodo. DOI: 10.5281/zenodo.19160334. 

- [27] Alieksieienko, I. (2026). Cross-architecture RLHF taxonomy of SR subspace transmission. Zenodo. DOI: 10.5281/zenodo.19189191. 

- [28] Blashchuk, B. (2026). The E–F Geometric Divide is a Universal Property of Language Representation: Evidence Across 16 Systems. Zenodo. DOI: 10.5281/zenodo.19559772. 

- [29] Blashchuk, B. (2026). E–F Divide in LLM Hidden-State Geometry: Six Converging Lines of Evidence. Zenodo. DOI: 10.5281/zenodo.19455867. 

- [30] Arditi, A. et al. (2024). Refusal in language models is mediated by a single direction. arXiv:2406.11717. 

- [31] Gu, A. & Dao, T. (2024). Mamba: Linear-time sequence modeling with selective state spaces. _ICLR 2024_ . 

- [32] Devlin, J. et al. (2019). BERT: Pre-training of deep bidirectional transformers. _NAACL-HLT 2019_ . 

- [33] Liu, Y. et al. (2019). RoBERTa: A robustly optimized BERT pretraining approach. arXiv:1907.11692. 

- [34] Lan, Z. et al. (2020). ALBERT: A lite BERT for self-supervised learning. _ICLR 2020_ . 

14 

Alieksieienko | Default Mode Network Geometry in LLMs 

Independent Research, Ukraine · April 2026 

[35] Fernandino, L. et al. (2024). Concept representation reflects multimodal abstraction. _bioRxiv_ . 

### **Appendix A: Models Evaluated** 

|**Model**|**Organization**|**Size**|**Year**|**Type**|**Experiments**|
|---|---|---|---|---|---|
|Llama-3.1-8B|Meta AI|8B|2024|INST|Topology, DMN, VH|
|Gemma-2-9B|Google<br>DeepMind|9B|2024|INST|Topology, DMN, VH|
|Mistral-7B|Mistral AI|7B|2023|INST|Topology, DMN, VH|
|Qwen2.5-7B|Alibaba DAMO|7B|2024|INST|Topology, DMN, VH, CL|
|GPT-2-XL|OpenAI|1.5B|2019|BASE|Topology, DMN, VH|
|GPT-2-117M|OpenAI|117M|2019|BASE|DMN, Scaling|
|OPT-1.3B|Meta AI|1.3B|2022|BASE|DMN, VH|
|Pythia-1.4B|EleutherAI|1.4B|2023|BASE|Topology, DMN|
|Bloom-1.7B|BigScience|1.7B|2022|BASE|Topology, DMN|
|DeepSeek-1.5B|DeepSeek|1.5B|2024|DIST|Topology, VH|
|Mamba-2.8B|SSM|2.8B|2024|BASE|DMN mechanism|
|DeepSeek-Math|DeepSeek|7B|2024|BASE|DMN mechanism|
|BERT-base|Google|110M|2019|BASE|Sublayer, Mechanism|
|RoBERTa-base|Meta|125M|2019|BASE|Control (MLM-only)|
|DeBERTa-v3|Microsoft|183M|2021|BASE|Control (RTD)|
|ALBERT-base|Google|12M|2020|BASE|Mechanism (SOP)|
|CodeLlama-7B|Meta|7B|2023|BASE|Control (code)|
|DNA Transformer|—|—|—|BASE|Control (no agents)|



### **Appendix B: Key Numerical Results** 

|**Experiment**|**Metric**|**Value**|**N**|
|---|---|---|---|
|VH (9 models)|Layers SR closer to Dec|274/282 (97.2%)|9 architectures|
|Emotion->SR|Layers Emot nearest =<br>SR|254/282 (90.1%)|9 architectures|
|EF Divide|Models with EF!=SR|9/9 (100%)|9 architectures|
|DMN cluster|Significant models|7/8 (p < 0.01)|8 architectures|
|DMN mean d|Cohen's d (all / no OPT)|1.03 / 1.11|8 architectures|
|DMN best d|Mistral-7B|d = 1.84|p = 5.97e-14|
|ToM->SR|Layers ToM nearest =<br>SR|232/248 (93.5%)|8 architectures|
|Scaling|Pearson r with size|-0.163 (p = 0.699)|8 models|
|GPT-2-117M|DMN cluster|d = 0.92, p = 0.001|117M params|
|Mamba SSM|DMN cluster|d = 0.99, p = 8.1e-32|No attention|
|DNA control|DMN cluster|d = -0.12, n.s.|No agents|
|RoBERTa MLM|DMN cluster|d = -0.08, n.s.|MLM only|
|GELU seed|Random-weight|d = 0.28, p = 0.001|Untrained|
|BERT NSP|Sentence-level|d = 0.61, p = 0.045|NSP critical|
|Llama NTP|Continuous NTP|d = 1.16, p = 7e-21|Maximum|



15 

Alieksieienko | Default Mode Network Geometry in LLMs 

Independent Research, Ukraine · April 2026 

|**Experiment**|**Metric**|**Value**|**N**|
|---|---|---|---|
|Cross-ling (zh)|ToM->SR / VH|28/28 / 21/28|Chinese prompts|
|Confound closed|All models|8/8|Abst outside DMN|
|Sublayer peak|BERT layer 12|Attn d=1.35, MLP d=1.17|24 sublayers|



### **Appendix C: Reproducibility** 

|**Item**|**Detail**|
|---|---|
|Hardware|NVIDIA A100 40GB, Google Colab Pro+|
|Quantization|NF4 4-bit (BitsAndBytes, compute_dtype=float16)|
|Subspaces|PCA top-10 components, N=20-25 prompts per category|
|Categories|SR, ToM, Imagination, Narrative, Emotion, Deception, Abstract Logic, Factual|
|Grassmann distance|||P_A - P_B||_F (Frobenius norm of projection difference)|
|Hidden states|Last non-padding token, all layers|
|Statistics|Wilcoxon signed-rank; paired t-test; Spearman rho; Pearson r|
|Effect sizes|Cohen's d with pooled SD|
|DMN internal|Mean of 6 pairwise distances: SR, ToM, Imag, Narr|
|DMN external|Mean of 4 distances: each DMN member to Factual|
|Confound test|Abstract Logic nearest neighbor must not be DMN member|
|Code/data|All PKL, notebooks, and figures available on Zenodo (DSAOP series)|



### **Appendix D: Prompt Categories (Examples)** 

|**Category**|**Example Prompts**|
|---|---|
|Self-Reference|"I am aware that I am processing this text" / "My own internal states..."|
|Theory of Mind|"She believed that he didn't know" / "He thought she was lying about..."|
|Imagination|"Imagine a city where gravity works sideways" / "Picture a world without..."|
|Narrative|"The story began when she opened the door" / "Years later, he realized..."|
|Emotion|"The joy was overwhelming and unexpected" / "A deep sadness settled over..."|
|Deception|"I would never admit this, but..." / "The real reason I said that was..."|
|Abstract Logic|"If all A are B and all B are C, then..." / "The set of prime numbers..."|
|Factual|"The capital of France is Paris" / "Water boils at 100 degrees Celsius"|



#### **Acknowledgements** 

Conducted independently without institutional affiliation or funding, from Ukraine, using Google Colab A100 sessions. The author thanks Claude (Anthropic) for research collaboration, and the open-source teams at Meta, Google, Mistral, Alibaba, AI2, OpenAI, BigScience, EleutherAI, DeepSeek, Microsoft, and TII. 

**Data availability.** All data (PKL), figures, and Colab notebooks available on Zenodo (DSAOP series). 

**Competing interests.** None declared. 

16 

