# 03 — Upstream Divergence Analysis

This document catalogs every place the fork `MrJ55/grok-lisptc-MiS` diverges from upstream `1hachem/lisptc` (HEAD `2c10ea8`) and assesses whether the divergence is justified.

---

## 3.1 What the fork vendors

Per `docs/UPSTREAM.md`:

| Path | Upstream location | Fork location | SHA-256 (fork) |
|------|-------------------|---------------|----------------|
| `lisp.ts` | `packages/interpreter/src/lisp.ts` (2401 lines) | `src/lisp.ts` (NOT in repo; curled at bootstrap) | `ad42e6bc...` (claimed; not verifiable since file is not in repo) |
| `arith.ts` | `packages/interpreter/src/arith.ts` (106 lines) | `src/arith.ts` (64 lines) | `aa0e58ca...` |

**First issue:** `src/lisp.ts` is not in the repo. `docs/UPSTREAM.md` claims a content hash for it, but the file is fetched at bootstrap time from `https://raw.githubusercontent.com/1hachem/lisptc/main/packages/interpreter/src/lisp.ts`. This means:

- The hash is unverifiable from the repo contents alone.
- A malicious or compromised upstream could serve a different `lisp.ts` and the bootstrap would silently accept it (no pinning, no signature check).
- If upstream deletes or moves the file, bootstrap breaks.
- The "pin" is really just "we wrote down a hash we think we saw once."

The fork should vendor `src/lisp.ts` directly into the repo. It's ~73 KB — trivially small for git. The hash can then be verified by anyone cloning the repo.

**Second issue:** `src/arith.ts` in the fork is 64 lines; upstream is 106 lines. The fork has silently rewritten it. See F4 in `02-CODE-DEFECTS.md` for the full analysis. The rewrite:

- Drops the `BigInt === "undefined"` defensive guard (lines 11–12 of upstream).
- Changes `tryToParse` return type from `Numeric | null` to `Numeric | undefined`.
- Changes `convertToString` to drop the `123.0` → `"123.0"` rule.
- Uses parameter names `(a, b)` instead of `(x, y)`.
- Removes the comment "Any operation involving an inexact number produces an inexact number."
- Removes the comment about BigInt fallback.

None of these changes are improvements. All of them introduce subtle behavior differences. The fork should revert to upstream `arith.ts` verbatim.

---

## 3.2 What the fork does NOT vendor (and whether that's justified)

### 3.2.1 `packages/repl/src/repl.ts` (MemoryRepl, AgentRepl) — NOT vendored

**Fork's choice:** Reimplements `MemoryRepl` in `bridge/eval.ts` lines 79–118. Does not implement `AgentRepl`.

**Justification:** ADR 0003 says "Full `@repo/repl` pulls MCP SDK, secrets, jobs, and a heavier dependency graph. Sandbox RAM is limited (~1.2 GB)." This is partially true: `packages/repl/src/repl.ts` imports `mcpExtension` and `secretsExtension`, which do pull dependencies.

**Assessment:** The justification is valid for skipping `mcpExtension` (heavy). It is **not** valid for skipping the whole file. The fork could have copied `MemoryRepl` and `AgentRepl` and used `Interp({ extensions: [] })` instead of `Interp({ extensions: [secretsExtension(), mcpExtension()] })`. This would have given them:

- The `setup(interp)` hook for subclassing (which the fork's reimplementation doesn't have)
- `AgentRepl.setConversationVars()` — read-only conversation globals
- `AgentRepl.takeFinished()` — prose-only eval signal
- `stripProse` integration in `eval`

The fork's reimplementation loses all three features and gains nothing in exchange. The RAM savings from skipping the import are zero (the import is conditional on using `mcpExtension`/`secretsExtension`, which the fork doesn't).

**Recommendation:** Vendor `MemoryRepl` and `AgentRepl` from upstream, modified to use `extensions: []`. Remove the fork's `bridge/eval.ts` `MemoryRepl` class. Use `AgentRepl` instead and inject conversation vars from the bridge.

### 3.2.2 `packages/interpreter/src/mcp.ts`, `mcp-broker.ts`, `mcp-oauth.ts` — NOT vendored

**Justification:** ADR 0003 — MCP not needed in v0.

**Assessment:** Correct call. MCP adds substantial dependencies (`@modelcontextprotocol/sdk`, OAuth flows). The MiS use case (Lisp mind state) doesn't need MCP tools. If MCP is ever needed, it can be added back via `Interp({ extensions: [mcpExtension()] })` without re-architecting.

### 3.2.3 `packages/interpreter/src/secrets.ts` — NOT vendored

**Justification:** ADR 0003 — secrets not needed in v0.

**Assessment:** Correct call for now. The fork's image contains no secrets, and the host (Grok) handles API keys outside the Lisp world. If the mind ever needs to call external APIs directly from Lisp (e.g. P5 vector cabinet), `secretsExtension` should be reconsidered — it provides taint-tracked redaction that prevents accidental secret leakage through `prin1`/`str`.

### 3.2.4 `packages/interpreter/src/jobs.ts`, `jobs-broker.ts`, `jobs-protocol.ts` — NOT vendored

**Justification:** Not mentioned. Presumably skipped because MCP-related.

**Assessment:** Correct call. Jobs are an MCP-adjacent feature for async tool loading. Not needed for the mind path.

### 3.2.5 `packages/interpreter/src/source.ts` — NOT vendored

**Justification:** Not mentioned.

**Assessment:** Need to check what this does. Likely source-map support for error reporting. If so, it's a nice-to-have for debugging but not essential. The fork's error reporting (which just prints `${ex}`) is sufficient for current needs.

### 3.2.6 `packages/interpreter/src/grammar.ts`, `lisptc.gbnf` — NOT vendored

**Justification:** Not mentioned.

**Assessment:** These are for structured-output grammar (constraining an LLM to emit valid lisptc). The fork doesn't use grammar-based output — Grok is trusted to emit valid Lisp, and `prevalidate` catches syntax errors. This is a reasonable omission for v0, but it's worth noting that upstream's grammar-based approach is more robust: it makes it impossible for the LLM to emit invalid lisptc in the first place. If Grok (or a future cheaper model) starts producing frequent syntax errors, the grammar constraint is worth revisiting.

### 3.2.7 `packages/interpreter/test/*.test.ts` (17 spec files) — NOT vendored

**Justification:** Not mentioned.

**Assessment:** This is the most consequential omission. Upstream has comprehensive tests for reader, grammar, prose, macros, recursion, errors, numbers, strings, lists, control flow, loop control, try-catch, imports, secrets, mcp, mcp-oauth, oauth-logout, printing, prelude, docs, fixture-enum-mcp-server, fixture-mcp-server, fixture-empty-mcp-server. The fork has none of these.

Even if the fork doesn't run upstream's tests directly (they depend on the upstream package structure), they should be adapted into a fork-specific test suite that verifies the vendored `lisp.ts` + `arith.ts` + bridge behave correctly. This would have caught F4 (arith divergence) immediately.

### 3.2.8 `packages/ai/` — NOT vendored

**Justification:** Not mentioned. The fork uses Grok for the host role, so doesn't need the upstream AI provider abstraction.

**Assessment:** Correct call. `packages/ai/` is for upstream's `apps/pi` integration. The fork has its own host (Grok) and doesn't need this.

### 3.2.9 `packages/env/` — NOT vendored

**Justification:** Not mentioned.

**Assessment:** Correct call. The fork uses environment variables directly (`MIS_IMAGE`, `MIS_SAVE`) and doesn't need the env/secret loading helpers.

### 3.2.10 `packages/ui/`, `packages/bloub/` — NOT vendored

**Justification:** Not mentioned. These are UI components (React, BloubBot). The fork has no UI.

**Assessment:** Correct call.

### 3.2.11 `apps/api`, `apps/app`, `apps/lsp`, `apps/mcp` — NOT vendored

**Justification:** Not mentioned.

**Assessment:** Correct call. The fork is a CLI/library only. No web app, no LSP server, no MCP server.

### 3.2.12 `editors/nvim` — NOT vendored

**Justification:** Not mentioned.

**Assessment:** Correct call. The fork doesn't ship an editor integration.

### 3.2.13 `examples/` — NOT vendored

**Justification:** Not mentioned.

**Assessment:** Worth looking at. Upstream's `examples/` has runnable `.ptc` walkthroughs (language basics, macros, closures, MCP usage). The fork could adapt one or two as smoke tests for the vendored interpreter. Not critical, but low-effort and high-value.

### 3.2.14 `devdocs/` — NOT vendored

**Justification:** Not mentioned.

**Assessment:** Worth reading for design context. Not critical to vendor.

### 3.2.15 `tree-sitter-lisptc/` — NOT vendored

**Justification:** Not mentioned.

**Assessment:** Correct call. Tree-sitter grammar is for editor integration. The fork doesn't need it.

### 3.2.16 `flake.nix`, `flake.lock`, `nix/` — NOT vendored

**Justification:** Not mentioned.

**Assessment:** Correct call. Nix is for upstream's reproducible dev environment. The fork uses `bootstrap.sh` which is simpler.

### 3.2.17 `turbo.json`, `pnpm-workspace.yaml`, `biome.json`, `knip.json`, `Taskfile.yml` — NOT vendored

**Justification:** Not mentioned.

**Assessment:** Correct call. These are monorepo tooling. The fork is a single package.

### 3.2.18 `CLAUDE.md` (upstream root) — NOT vendored

**Justification:** Not mentioned.

**Assessment:** Worth reading. Upstream's `CLAUDE.md` likely has agent instructions similar to the fork's `docs/CUSTOM_INSTRUCTIONS.md`. Could inform the fork's host protocol.

---

## 3.3 What the fork adds

| Addition | Location | Purpose | Assessment |
|----------|----------|---------|------------|
| `bridge/eval.ts` | fork only | Validate → eval → save-on-success | Sound design; has bugs F8, F9, F12 |
| `bridge/driver.ts` | fork only | Re-export interpreter symbols | Unnecessary if `lisp.ts` is vendored directly; could be inlined |
| `mind/mind-image.ptc` | fork only | Durable symbolic mind | Core artifact; has bugs F1, F2, F3, F5, F6, F7 |
| `mind/helpers.ptc` | fork only | Older parallel copy of helpers | Confusing; should be deleted or imported |
| `mind/mind-scratch.ptc` | fork only | Experimentation image | Useful; correctly isolated |
| `mind/oss-proposals-*.ptc` (3 files) | fork only | Pure-DMN OSS candidate proposals | Good pattern; correctly read-only |
| `scripts/bootstrap.sh` | fork only | Assemble `/tmp/mis` runtime | Works; has the unnecessary sed patch (F4) |
| `scripts/mis-eval.sh` | fork only | Thin wrapper for eval | Trivial; could be inlined or removed |
| `scripts/push-mind-image.sh` | fork only | Commit + push image to GitHub | Works; doesn't push failure log (F14) |
| `skills/mis-*/SKILL.md` (4 files) | fork only | Grok skill definitions | Good pattern; mis-reflect references nonexistent function (F1) |
| `adr/0001-0005*.md` | fork only | Architecture decisions | High quality; see 01-ARCHITECTURE-CRITIQUE.md |
| `plan/P00-P11*.md`, `CREATIVE-MECHANISMS.md` | fork only | Roadmap | Mixed quality; see 04-PLAN-EXECUTION-CRITIQUE.md |
| `docs/*.md` (28 files) | fork only | Playbooks, handoff, learnings | Mixed quality; some stale (F11) |
| `src/arith.ts` (modified) | fork only | Rewritten arithmetic | Unnecessary divergence (F4) |
| `src/READER-FIX.md` | fork only | Documents the workaround for F4 | Should be deleted after F4 fix |

---

## 3.4 Summary of divergence quality

| Category | Count | Assessment |
|----------|-------|------------|
| Justified omissions (MCP, secrets, UI, apps, monorepo tooling) | 11 | Correct calls |
| Unjustified omissions (AgentRepl, tests, import, dump, doc, defineGlobal) | 6 | Should be revisited |
| Unjustified modifications (arith.ts rewrite) | 1 | Should be reverted |
| Necessary additions (bridge, mind image, bootstrap) | 8 | Good; some have bugs |
| Documentation additions (adr, plan, docs) | 33+ | High volume; some drift from code |

**Bottom line:** The fork's "what to skip" decisions are mostly right. The fork's "what to modify" decisions are mostly wrong (the `arith.ts` rewrite is the clearest example). The fork's "what to add" decisions are reasonable in shape but buggy in execution. The biggest gap is testing — upstream has 17 spec files, fork has zero.
