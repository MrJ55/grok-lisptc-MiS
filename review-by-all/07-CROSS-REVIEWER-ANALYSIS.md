# 07 — Cross-Reviewer Analysis

A meta-analysis of the two reviews: their methodologies, scopes, strengths, weaknesses, and how they complement each other. This document is for the user to understand *how* to read the two reviews together and what each is good for.

---

## 7.1 Methodology comparison

| Dimension | GLM | Terra |
|---|---|---|
| **Approach** | Bottom-up (code-first) | Top-down (architecture-first) |
| **Entry point** | Cloned repo, read every file line-by-line | Read ADRs, plans, docs as a system |
| **Code inspection** | Read `bridge/eval.ts`, `mind-image.ptc`, `arith.ts`, upstream `lisp.ts` in full | Cited upstream SHAs but didn't trace individual functions |
| **Upstream comparison** | Line-by-line diff of fork's `arith.ts` vs upstream | Cited upstream commit SHAs; noted test suite breadth; didn't diff individual files |
| **External project research** | Did NOT inspect Vestige (treated as Terra invention — corrected in this synthesis) | Proposed Vestige integration based on its README |
| **Fact-checking** | Every claim cites file:line; verified by reading the cited lines | Cited SHAs and file paths; some SHAs unverifiable (see §4.3, §4.4) |
| **Output format** | 7 files, ~2,500 lines, structured 00–06 | 5 files, ~1,000 lines, narrative + spec |
| **Recommendations** | Concrete patches with code (R1–R15) | Architectural specs with schemas and phase amendments |
| **Severity grading** | 14 findings ranked Critical/High/Medium/Low | Findings grouped under P0/P1 milestones; less granular |
| **Test program** | Minimal smoke test (R8) | Comprehensive continuity + quality metrics (§6) |
| **License awareness** | Didn't address (fork is MIT, no external deps) | Didn't address (Vestige is AGPL-3.0 — missed by both) |

---

## 7.2 Scope comparison

### GLM covered (Terra didn't)

- **Individual function correctness:** GLM traced `dmn-log-episode`, `dmn-fetch-unreflected`, `dmn-autobiography`, `update-self-schema` line-by-line and found bugs in each. Terra didn't descend to this level.
- **`arith.ts` line-by-line diff:** GLM identified that the fork rewrote `arith.ts` (returns `undefined` vs upstream's `null`), dropped the `.0` rule, dropped the BigInt guard. Terra noted the Reader patch exists but didn't analyze *why* it exists at the code level.
- **`VERIFICATION.md` reproducibility:** GLM tried to reproduce the verification results and found version mismatch (`0.2` vs `0.3`) and output mismatch (`4.0` vs `4`). Terra didn't attempt reproduction.
- **`prevalidate` regex analysis:** GLM analyzed the regex character class and identified atoms it would reject. Terra didn't audit `prevalidate`.
- **`mind-failures.log` ephemerality:** GLM traced the push script and found the log isn't committed. Terra didn't audit the push script.
- **`helpers.ptc` vs `mind-image.ptc` divergence:** GLM found that the two parallel files have divergent implementations of `dmn-log-episode` (one has trim, one doesn't). Terra didn't compare the two files.

### Terra covered (GLM didn't)

- **Trust class taxonomy:** Terra proposed five trust classes (untrusted / candidate / approved / derived / immutable) with promotion flow. GLM didn't address trust classification.
- **Reality-status enum:** Terra proposed eight reality-status values for cognitive items. GLM didn't address this.
- **Capability governance framework:** Terra proposed eight capability profiles with descriptors, operation events, and audit trail. GLM noted `extensions: []` is fine for v0 but didn't design the expansion path.
- **Compatibility tuple / manifest:** Terra proposed a JSON manifest with schema version, runtime version, patch ID, capability profile. GLM didn't address forward compatibility.
- **Evaluation program:** Terra proposed runtime tests, continuity tests, and quality metrics (false autobiographical assertion rate, unsupported self-schema change rate, etc.). GLM proposed a minimal smoke test but not a full evaluation program.
- **Vestige integration:** Terra proposed integrating an external mature memory substrate. GLM didn't address external memory beyond noting the fork's P5 plan exists.
- **Protocol registry:** Terra proposed versioned protocol objects with compiler/runner/evaluator. GLM proposed a minimal `bridge/oss.ts` but not a full protocol framework.
- **Document classification:** Terra proposed classifying docs as research-record / protocol-source / operational-playbook / etc. GLM didn't address doc organization.
- **Milestone reordering:** Terra proposed a complete roadmap reordering (harden → govern → reflect → DMN experiments → OSS channel). GLM proposed a pause + fix sprint but not a reordering.
- **Threat model:** Terra mentioned "publish an explicit threat model" as part of Milestone A. GLM didn't address threat modeling.

### Both covered (convergent)

- **Reader `tryToParse` bug:** Both identified it. GLM diagnosed the root cause (`arith.ts` rewrite); Terra prescribed formalization (lock file + patch).
- **`src/lisp.ts` not vendored:** Both identified the supply-chain risk. GLM prescribed vendoring; Terra prescribed lock file + verify script.
- **Non-atomic persistence:** Both identified it. GLM prescribed `renameSync`; Terra prescribed full transaction model.
- **No tests:** Both identified it. GLM prescribed smoke test; Terra prescribed comprehensive test program.
- **`mind-image.ptc` overloaded:** Both identified it with near-identical language. GLM prescribed `import`-based split; Terra prescribed authority table + generated projection.
- **DMN overclaiming:** Both identified that the neuroscience claims exceed the evidence. GLM prescribed softening language; Terra prescribed reality-status field + evaluation metrics.
- **Capability minimization:** Both addressed it. GLM noted `extensions: []` is fine for v0; Terra prescribed capability governance framework.

---

## 7.3 Strengths and weaknesses

### GLM strengths

1. **Reproducible evidence:** Every claim cites file:line. A reader can verify any finding in seconds.
2. **Concrete patches:** R1–R15 include actual code, not just descriptions.
3. **Root-cause analysis:** F4 (Reader bug) traces the bug to its source (arith.ts rewrite) rather than just describing the symptom.
4. **Upstream divergence audit:** §3 of GLM's review catalogs every difference between fork and upstream, with justification assessment for each.
5. **Honesty about limitations:** GLM explicitly notes what it didn't inspect (Vestige, in the original review).

### GLM weaknesses

1. **Didn't inspect Vestige:** GLM treated Terra's Vestige proposal as a greenfield invention rather than researching the referenced project. (Corrected in this synthesis.)
2. **No governance framework:** GLM didn't propose trust classes, capability profiles, or reality-status fields. These are important for the project's long-term safety.
3. **Minimal test program:** GLM's smoke test (R8) catches immediate regressions but doesn't test continuity, contradiction, or recovery — the properties the project claims to provide.
4. **No threat model:** GLM didn't address what the system's threat surface is or how to defend it.
5. **No roadmap reordering:** GLM proposed a pause + fix but didn't address the structural problem that P6 (evaluation) is deferred.

### Terra strengths

1. **Comprehensive governance framework:** Trust classes, capability profiles, reality-status, operation events, manifests — this is the right design for a system that will accumulate state and tools over time.
2. **Evaluation program:** The continuity tests and quality metrics directly address the project's core claim ("permanent mind that survives sessions") with falsifiable measures.
3. **Strategic vision:** Terra sees the project as a research platform and proposes the structure needed to evaluate it as one (Milestone D: "measure DMN value against no-DMN baseline").
4. **External research:** Terra investigated Vestige as a potential integration target, which is the right instinct — don't reimplement what a mature project already does.
5. **Authority table:** The insight that `mind-image.ptc` shouldn't be simultaneously source-of-truth + journal + self-model + executable + prompt is the single most important architectural observation in either review.

### Terra weaknesses

1. **Factual issues with SHAs:** Cited fork revision `51751f6` doesn't exist; cited upstream commit `1dd828e` differs from the fork's documented pin `2c10ea8` without flagging the discrepancy. (See §4.3, §4.4 of this synthesis.)
2. **`load` vs `import`:** Terra's build spec uses `(load "...")` which is not an upstream builtin. The correct form is `(import "...")`. (See §4.5.)
3. **Less granular severity grading:** Terra groups findings under milestones but doesn't rank individual findings by severity. Harder to prioritize.
4. **Less code-level evidence:** Terra's recommendations are architectural specs, not patches. An implementer has to translate them into code. GLM's patches are immediately applicable.
5. **Didn't catch the critical code defects:** U1 (`dmn-reflect-pack` undefined), U2 (buffer trim missing), U3 (hardcoded date), U14 (`dmn-autobiography` ignores arg), U15 (`update-self-schema` reverses entries) — none of these appear in Terra's review. These are the bugs that would make the system fail on first use.
6. **Vestige API mismatch:** Terra's proposed Lisp operations (`mind-recall`, `mind-backfill-cause`, etc.) don't directly match Vestige's actual MCP tools (`recall`, `backfill`, `smart_ingest`). The spec implies a 1:1 mapping that doesn't exist. (See §4.7.)
7. **License not addressed:** Terra proposes Vestige integration without noting that Vestige is AGPL-3.0 and the fork is MIT. This is a critical integration consideration. (See §4.6.)

---

## 7.4 Complementarity

The two reviews are **strongly complementary.** Neither is redundant; neither is sufficient alone.

**GLM without Terra:** You'd fix the immediate bugs (U1–U4) but miss the governance framework needed to prevent future bugs of the same class. You'd have a working system with no trust boundaries, no reality-status, no capability governance. The next time OSS output or retrieved memory content gets near `eval`, you'd have no defense.

**Terra without GLM:** You'd adopt the governance framework but the system would still be broken — `(dmn-reflect-pack 5)` would throw `unbound variable` on every cold start, the buffer would grow unboundedly, chapters would be misdated, and `VERIFICATION.md` would be irreproducible. The governance framework would be built on a foundation of buggy code.

**Together:** GLM provides the "make it work correctly now" patches; Terra provides the "make it safe as it grows" framework. The unified recommendation set (§05) applies GLM's fixes first (Tier 1, ~2 hours), then builds Terra's governance layer (Tier 3, ~6 hours) on the now-solid foundation.

---

## 7.5 What neither review addressed

Both reviews missed these:

1. **Vestige license compatibility (AGPL-3.0 vs MIT).** Neither reviewer noted that Vestige is AGPL-3.0 and the fork is MIT. Direct code linking would contaminate the fork's license; MCP subprocess integration is likely safe. This synthesis addresses it in §4.6.

2. **The fork's `README.md` claims "Portions of `src/lisp.ts` / `src/arith.ts` derive from Nukata Lisp / 1hachem/lisptc"** (line 71). But `src/arith.ts` is a rewrite, not a derivation — it has different parameter names, different return types, missing functions. The "derive from" claim is inaccurate and may have licensing implications (the upstream arith.ts header says "derived from arith.ts at github.com/nukata/little-scheme-in-typescript" — the fork's version removes this attribution). Neither reviewer flagged this.

3. **The fork's `mind-image.ptc` contains OSS-generated text as episode content** (e.g., "You cannot terminate a dream that has learned to code"). This text is stored as Lisp string literals inside `*episodic-buffer*` and `*autobiography*`. If the OSS model's output contained a Lisp injection (e.g., a string that breaks the reader), it would corrupt the image on load. Neither reviewer analyzed this attack surface. Terra's "untrusted content SHALL never be evaluated as Lisp" rule addresses it in principle, but neither reviewer traced the specific path by which OSS text enters the image as string literals.

4. **The fork's `scripts/bootstrap.sh` fetches from `main` branch** (not a commit SHA). If upstream `1hachem/lisptc` is compromised or force-pushed, the fork would silently accept malicious code. GLM noted this (U5); Terra noted it (§4 P0). But neither reviewer noted that the fork also fetches `zod@4.4.3` from the public npm registry (line 47) with no integrity check. A compromised `zod` package would similarly be silently accepted. Supply chain defense should cover both upstream source and npm dependencies.

5. **The fork's `docs/CUSTOM_INSTRUCTIONS.md` instructs Grok to "Append durable learnings to `docs/learnings-log.md`"** (line 27). This means Grok is a mutator of the docs, not just the mind image. Neither reviewer addressed the trust boundary between "Grok mutates mind image" (the documented sole-mutator rule) and "Grok mutates docs" (an undocumented additional mutator role). If Grok can edit docs, it can edit the ADRs, the plan, the verification scenarios — potentially rewriting the project's own governance to justify future mutations.

6. **The fork's `skills/mis-save/SKILL.md` instructs Grok to "Commit and push to https://github.com/MrJ55/grok-lisptc-MiS"** (line 10). This means Grok has Git write access. Neither reviewer analyzed the risk of Grok committing malicious or buggy code to the repo, or the risk of prompt injection causing Grok to commit attacker-controlled content.

---

## 7.6 Recommendation: how to use the two reviews

1. **For immediate bug fixes:** Use GLM's `05-RECOMMENDATIONS.md` (R1–R10). Concrete patches, file:line evidence, ~6 hours total.

2. **For governance design:** Use Terra's `GMOD-MIND-VESTIGE-BUILD-SPEC` and `GMOD-LISPTC-NATIVE-TOOLS-ADDENDUM`. The trust-class taxonomy, capability profiles, and reality-status enum are the right design targets.

3. **For evaluation:** Use Terra's §6 (Evaluation program). The continuity tests and quality metrics are the right long-term test program.

4. **For the unified roadmap:** Use this synthesis's `05-UNIFIED-RECOMMENDATIONS.md`. It applies GLM's fixes first, then builds Terra's governance layer, then defers Terra's Vestige integration to P5.

5. **For fact-checking:** Use this synthesis's `06-EVIDENCE-LOG.md`. Every claim from both reviews is verified against the codebase, with corrections where factual errors were found.

---

## 7.7 Closing assessment

The fork has received two high-quality, independent reviews that approach it from different angles and converge on the same core judgment: **strong thesis, weak execution, harden before expanding.** This is a strong signal that the recommendation is correct.

The fork's author now has:
- 14 specific code defects with patches (GLM)
- A governance framework to adopt as the code grows (Terra)
- A unified recommendation set that sequences the work (this synthesis)
- A fact-check of both reviews that corrects factual errors (this synthesis)
- A clear next step: UR1–UR6 (Tier 1, ~2 hours) fixes the critical defects and makes the cold-start verification step work

The most important single action is **UR1** (implement `dmn-reflect-pack` and `dmn-apply-reflection`). Without it, every new session that follows the documented cold-start protocol will fail. With it, the project's "P4 done" claim becomes true, and the foundation is solid for the governance work that follows.
