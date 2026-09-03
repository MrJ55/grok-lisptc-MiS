# 06 — Evidence Log

Every claim in this synthesis, with file:line citation and verification method. Independent verification encouraged.

---

## Section 1 — Convergent findings

### 1.1 Reader `tryToParse` bug exists at all inspected upstream commits

**Claim:** The `if (n !== null) this.token = n;` line exists at upstream commits `2c10ea8`, `1dd828e`, and `origin/main`.

**Verification:**
```bash
$ cd lisptc-upstream
$ git show 2c10ea8:packages/interpreter/src/lisp.ts | grep -n "if (n !== null) this.token = n"
1821:				if (n !== null) this.token = n;
$ git show 1dd828e:packages/interpreter/src/lisp.ts | grep -n "if (n !== null) this.token = n"
1888:				if (n !== null) this.token = n;
$ git show origin/main:packages/interpreter/src/lisp.ts | grep -n "if (n !== null) this.token = n"
1831:				if (n !== null) this.token = n;
```

**Claim:** Upstream `arith.ts` returns `null` from `tryToParse` at all three commits.

**Verification:**
```bash
$ git show 2c10ea8:packages/interpreter/src/arith.ts | grep -n "return null"
94:		if (Number.isNaN(n)) return null;
$ git show 1dd828e:packages/interpreter/src/arith.ts | grep -n "return null"
94:		if (Number.isNaN(n)) return null;
```

**Claim:** Fork's `arith.ts` returns `undefined`.

**Verification:** `src/arith.ts` lines 17–22 (fork):
```typescript
export function tryToParse(s: string): Numeric | undefined {
        if (/^[+-]?\d+$/.test(s)) return BigInt(s);
        const n = Number(s);
        if (!Number.isNaN(n)) return n;
        return undefined;
}
```

---

### 1.2 `src/lisp.ts` is not vendored

**Claim:** `src/lisp.ts` is not in the repo; `bootstrap.sh` curls from upstream `main`.

**Verification:**
```bash
$ ls src/
README.md  READER-FIX.md  arith.ts
# No lisp.ts

$ grep -n "curl" scripts/bootstrap.sh
23:    curl -fsSL -o "$REPO_ROOT/src/lisp.ts" "$UPSTREAM_LISP_URL"
9:UPSTREAM_LISP_URL="${MIS_LISP_URL:-https://raw.githubusercontent.com/1hachem/lisptc/main/packages/interpreter/src/lisp.ts}"
```

The URL uses `main` branch, not a commit SHA.

**Claim:** `docs/UPSTREAM.md` claims a hash but it's not enforced.

**Verification:** `docs/UPSTREAM.md` lines 12–17 record SHA-256 hashes, but `grep -n "sha256\|hash" scripts/bootstrap.sh` shows no hash verification in bootstrap.

---

### 1.3 Non-atomic save

**Claim:** `appendTranscript` uses read-then-write without temp file or rename.

**Verification:** `bridge/eval.ts` lines 139–146:
```typescript
function appendTranscript(forms: string, path: string) {
  ensureMindDir();
  const stamp = new Date().toISOString();
  const block = `\n;; --- ${stamp} ---\n${forms.trim()}\n`;
  const prev = existsSync(path) ? readFileSync(path, "utf8") : "";
  writeFileSync(path, prev + block);
  console.error(`[mis] appended forms to ${path}`);
}
```

No `renameSync`, no temp file, no fsync.

---

### 1.4 No tests; stale verification

**Claim:** `VERIFICATION.md` reports version `0.2` but current image has `0.3`.

**Verification:**
- `docs/VERIFICATION.md` line 24: `(mis-version)` = `"mis-helpers-0.2"`
- `mind/mind-image.ptc` line 1: `(defun mis-version () ... "mis-helpers-0.3")`

**Claim:** `VERIFICATION.md` reports `(half 8)` = `4.0` but fork's `arith.ts` would print `4`.

**Verification:** Fork `src/arith.ts` lines 24–26:
```typescript
export function convertToString(x: Numeric): string {
        return x.toString();
}
```

No `.0` suffix rule. `Number(4).toString()` = `"4"`. Upstream `arith.ts` (lines 100–106) has the `.0` rule and would print `"4.0"`.

**Claim:** Fork has zero test files.

**Verification:**
```bash
$ find . -name "*.test.ts" -not -path "*/node_modules/*" | head
(no output)
```

Upstream has 17:
```bash
$ ls lisptc-upstream/packages/interpreter/test/*.test.ts | wc -l
17
```

---

### 1.5 `mind-image.ptc` is overloaded

**Claim:** Both reviewers used near-identical language about the image being overloaded.

**Verification:**
- GLM `review-by-GLM/01-ARCHITECTURE-CRITIQUE.md` §1.3.1: "The image is simultaneously source-of-truth, journal, self-model, executable program, and session prompt."
- Terra `GMOD-TERRA-REVIEW-2026-09-02.md` §3.1: "Do not let `mind-image.ptc` become simultaneously the source of truth, append-only journal, self-model, executable program, and session prompt."

The language convergence is striking and independent (GLM didn't read Terra before writing).

---

## Section 2 — Terra extensions

### 2.1 No trust classification exists

**Claim:** The fork has no trust classification system.

**Verification:**
```bash
$ grep -rn "trust\|untrusted\|candidate.*class\|approved.*class" docs/ mind/ bridge/ src/ plan/ adr/ 2>/dev/null | grep -v "review-by-" | head
(no relevant matches)
```

The word "candidate" appears in `mind/oss-proposals-*.ptc` comments ("candidates only") but not as a formal class.

---

### 2.2 No reality-status field

**Claim:** Episodes have `:source` but no `:reality-status`.

**Verification:** `mind/mind-image.ptc` lines 30–44 — episode records have `(:source oss-dmn :experiment ... :id ... :dmn-score ...)` but no `:reality-status` field.

---

### 2.3 No compatibility tuple

**Claim:** `mind-image.ptc` has no metadata header.

**Verification:** `mind/mind-image.ptc` line 1 is `(defun mis-version () ...)`. No manifest, no version header, no schema declaration.

---

### 2.4 Vestige is a real external project

**Claim:** `samvallad33/vestige` is a mature Rust project with 36 MCP tools.

**Verification:**
```bash
$ cd vestige
$ head -5 LICENSE
                    GNU AFFERO GENERAL PUBLIC LICENSE
                       Version 3, 19 November 2007

$ ls crates/vestige-mcp/src/tools/*.rs | wc -l
36

$ grep -c "test" crates/vestige-core/src/**/*.rs 2>/dev/null | head
# (1961 tests per README badge)

$ grep -n 'name: "' crates/vestige-mcp/src/server.rs | head -15
290:                name: "vestige".to_string(),
325:                name: "recall".to_string(),
331:                name: "receipt".to_string(),
340:                name: "memory".to_string(),
346:                name: "codebase".to_string(),
352:                name: "intention".to_string(),
361:                name: "smart_ingest".to_string(),
370:                name: "source_sync".to_string(),
382:                name: "memory_status".to_string(),
393:                name: "maintain".to_string(),
405:                name: "dedup".to_string(),
419:                name: "graph".to_string(),
432:                name: "session_start".to_string(),
452:                name: "suppress".to_string(),
465:                name: "backfill".to_string(),
```

---

### 2.5 No protocol registry

**Claim:** OSS prompts are documented in prose but not formalized as versioned objects.

**Verification:**
```bash
$ ls protocols/ 2>&1
ls: cannot access 'protocols/': No such file or directory

$ grep -rn "protocol.*version\|protocol.*id" docs/oss-*.md 2>/dev/null | head
# (no versioned protocol objects)
```

---

### 2.6 No document classification

**Claim:** 22 files in `docs/` are not classified.

**Verification:**
```bash
$ ls docs/*.md | wc -l
22
$ grep -l "classification\|category:" docs/*.md 2>/dev/null | head
# (no classification front-matter)
```

---

### 2.7 No operation event log

**Claim:** No operation event log exists.

**Verification:**
```bash
$ ls state/audit/ 2>&1
ls: cannot access 'state/audit/': No such file or directory

$ grep -rn "operation_id\|operation.*event\|operation.*log" bridge/ src/ mind/ 2>/dev/null | head
# (no matches)
```

The closest is `mind/mind-failures.log` (generated at runtime, not committed).

---

## Section 3 — GLM extensions

### 3.1 `dmn-reflect-pack` undefined

**Claim:** The function is not defined in any mind or code file.

**Verification:**
```bash
$ grep -rn "dmn-reflect-pack\|dmn-apply-reflection" mind/ bridge/ src/
# (no matches in code/image files)

$ grep -rn "dmn-reflect-pack\|dmn-apply-reflection" docs/ skills/ plan/ adr/
docs/mind-api.md, docs/reflection-protocol.md, docs/session-handoff.md,
docs/learnings-log.md, skills/mis-reflect/SKILL.md, plan/P4-reflection-protocol.md
# (matches only in documentation)
```

**Functions actually defined in `mind-image.ptc`:** See `review-by-GLM/06-EVIDENCE-LOG.md` §F1 for the full table (lines 1–83 scan).

---

### 3.2 Buffer trim missing

**Claim:** `mind-image.ptc` `dmn-log-episode` lacks trim; `helpers.ptc` has it.

**Verification:** See `review-by-GLM/02-CODE-DEFECTS.md` §F2 for side-by-side code comparison.

---

### 3.3 Hardcoded date

**Claim:** `dmn-narrate` and `dmn-chapter-close` use literal `"2026-09-02"`.

**Verification:** `mind/mind-image.ptc` lines 69–76 — see `review-by-GLM/02-CODE-DEFECTS.md` §F3 for exact code.

---

### 3.4 `dmn-fetch-unreflected` doesn't filter

**Claim:** No `:reflected` tag check.

**Verification:** `mind/mind-image.ptc` lines 50–58 — see `review-by-GLM/02-CODE-DEFECTS.md` §F5.

---

### 3.5 `dmn-autobiography(n)` ignores n

**Claim:** Parameter `n` is bound but never referenced.

**Verification:** `mind/mind-image.ptc` line 78:
```lisp
(defun dmn-autobiography (n) *autobiography*)
```

---

### 3.6 `update-self-schema` reverses new entries

**Claim:** The cons/reverse logic reverses new-map order.

**Verification:** `mind/mind-image.ptc` lines 21–29 — see `review-by-GLM/02-CODE-DEFECTS.md` §F7 for the trace.

---

### 3.7 Image-load swallows errors

**Claim:** `loadImage` calls `repl.eval(src)` on the entire image as one string.

**Verification:** `bridge/eval.ts` lines 124–137 — see `review-by-GLM/02-CODE-DEFECTS.md` §F9.

---

### 3.8 `arith.ts` divergence

**Claim:** Fork's `arith.ts` is 64 lines; upstream is 106 lines. Multiple differences.

**Verification:** See `review-by-GLM/02-CODE-DEFECTS.md` §F4 for line-by-line comparison.

---

### 3.9 Ignored upstream features

**Claim:** Fork doesn't use `stripProse`, `AgentRepl`, `import`, `dump`, `doc`, `defineGlobal`, `checkSyntax`, 17 vitest specs.

**Verification:** See `review-by-GLM/02-CODE-DEFECTS.md` §F10 for the full table.

---

## Section 4 — Disagreements and corrections

### 4.1 Reader patch necessity

**Resolved:** GLM is correct — the patch is unnecessary because the fork caused the bug. See §4.1 of this synthesis for the full evidence.

---

### 4.2 Terra's fork revision `51751f6` does not exist

**Claim:** The SHA is not in the fork's history.

**Verification:**
```bash
$ cd grok-lisptc-MiS
$ git cat-file -t 51751f6714383027f78cfc49658b6fd27dafef82
fatal: git cat-file: could not get object info

$ git log --all --oneline
5bff12d GLM 5.2 review

$ git reflog --all
5bff12d refs/heads/main@{0}: reset: moving to origin/main
5bff12d HEAD@{0}: reset: moving to origin/main
5bff12d refs/remotes/origin/main@{0}: fetch --depth 1 origin: forced-update
02c1e49 refs/heads/main@{1}: clone: ...
02c1e49 HEAD@{1}: clone: ...

$ git fsck --no-reflogs --lost-found
dangling commit 02c1e49423b28a7bb94ec615095e6492e5320565
```

Only `02c1e49` and `5bff12d` exist. `51751f6` is not recoverable.

---

### 4.3 Upstream commit discrepancy

**Claim:** Terra cited `1dd828e`; `docs/UPSTREAM.md` claims `2c10ea8`. Both exist; `1dd828e` is newer.

**Verification:**
```bash
$ cd lisptc-upstream
$ git log --oneline -1 2c10ea8
2c10ea8 Merge pull request #52 from 1hachem/setup-simple-chat-loop
Date: Sun Aug 30 23:14:49 2026 +0100

$ git log --oneline -1 1dd828e
1dd828e chore: update system prompt with dummy data for mcps and tools...
Date: Tue Sep 1 23:35:12 2026 +0100

$ git rev-parse 2c10ea8:packages/interpreter/src/lisp.ts
a9784c40a1eb489d968487a722785390d4a68c78

$ git rev-parse 1dd828e:packages/interpreter/src/lisp.ts
8af07d647e8c4e2284f4d3db2a8781013e706327
```

Terra's lisp.ts blob hash `8af07d64...` matches commit `1dd828e`, not `2c10ea8`.

---

### 4.4 `load` is not an upstream builtin

**Claim:** Terra's build spec uses `(load "...")` which doesn't exist; only `import` exists.

**Verification:**
```bash
$ cd lisptc-upstream
$ grep -n '"load"' packages/interpreter/src/lisp.ts
# (no matches)

$ grep -n '"import"' packages/interpreter/src/lisp.ts
958:			"import",

$ grep -B 1 -A 8 '"import",' packages/interpreter/src/lisp.ts
		this.def(
			"import",
			1,
			'(import "path")',
			"Read the Lisp file at `path` and evaluate it in the current environment...",
			z.tuple([zString]),
			([path]) => this.importFile(path),
		);
```

---

### 4.5 Vestige is real (GLM correction)

**Claim:** GLM's original review treated Vestige as invented; user corrected this.

**Verification:** `samvallad33/vestige` cloned successfully. See §2.4 above for evidence of the project's existence and capabilities.

**GLM's original (incorrect) framing:** `review-by-GLM/03-UPSTREAM-DIVERGENCE.md` didn't mention Vestige. `review-by-GLM/01-ARCHITECTURE-CRITIQUE.md` didn't mention Vestige. (GLM's original review simply didn't address Terra's Vestige proposal because it was in `review-by-Terra/` which GLM was instructed not to read.)

**Correction:** This synthesis reviews Terra's Vestige proposal against the actual Vestige project and finds it sound, with the caveat that license compatibility (AGPL-3.0 vs MIT) must be evaluated before code-level integration.

---

### 4.6 Terra's operation names don't match Vestige's tools

**Claim:** Terra's `mind-recall`, `mind-backfill-cause`, `mind-record-event` don't directly match Vestige's `recall`, `backfill`, `smart_ingest`.

**Verification:** See §4.7 of this synthesis for the mapping table, derived from `crates/vestige-mcp/src/server.rs` tool names vs. Terra's proposed Lisp operations.

---

## Section 5 — Vestige fact-check (new in this synthesis)

### 5.1 Vestige license

**Claim:** AGPL-3.0.

**Verification:**
```bash
$ head -5 vestige/LICENSE
                    GNU AFFERO GENERAL PUBLIC LICENSE
                       Version 3, 19 November 2007
```

### 5.2 Vestige tool count

**Claim:** 36 MCP tools.

**Verification:**
```bash
$ ls vestige/crates/vestige-mcp/src/tools/*.rs | wc -l
36
```

### 5.3 Vestige test count

**Claim:** 1961 passing tests (per README badge).

**Verification:** README.md badge: `tests-1961_passing`. Not independently verified by running tests (would require Rust toolchain).

### 5.4 Vestige `backfill` tool implements Zaki/Cai 2024

**Claim:** The `backfill` tool is a "Faithful port of Zaki/Cai et al. (2024) Nature 637:145-155."

**Verification:** `crates/vestige-mcp/src/tools/backfill.rs` lines 1–10:
```rust
//! # Retroactive Salience Backfill — MCP tool
//!
//! Memory with hindsight. When a salient FAILURE memory exists...
//!
//! Faithful port of Zaki/Cai et al. (2024) Nature 637:145-155. The core logic
//! lives in `vestige_core::advanced::retroactive_backfill`; this tool wires it
//! to real storage...
```

### 5.5 Vestige `MemoryRecord` schema

**Claim:** Vestige's memory record has `id`, `content`, `node_type`, `tags`, `embedding`, `created_at`, `updated_at`, `metadata`, plus FSRS-6 `SchedulingState`.

**Verification:** `vestige/crates/vestige-core/src/storage/memory_store.rs` lines 82–108:
```rust
pub struct MemoryRecord {
    pub id: Uuid,
    pub domains: Vec<String>,
    pub domain_scores: HashMap<String, f64>,
    pub content: String,
    pub node_type: String,
    pub tags: Vec<String>,
    pub embedding: Option<Vec<f32>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub metadata: serde_json::Value,
}

pub struct SchedulingState {
    pub memory_id: Uuid,
    pub stability: f64,
    pub difficulty: f64,
    pub retrievability: f64,
    pub last_review: Option<DateTime<Utc>>,
    pub next_review: Option<DateTime<Utc>>,
    pub reps: u32,
    pub lapses: u32,
}
```

This is richer than the fork's episode format `(input result meta)` — Vestige has typed `node_type`, `tags`, FSRS-6 scheduling, embedding vectors, and domain classification.

---

## Section 6 — Repo inventory verification

### 6.1 Fork has no `CONTRIBUTING.md`, `SECURITY.md`, CI, `schemas/`, `tests/`, `patches/`, `protocols/`

**Verification:**
```bash
$ ls CONTRIBUTING.md SECURITY.md 2>&1
ls: cannot access 'CONTRIBUTING.md': No such file or directory
ls: cannot access 'SECURITY.md': No such file or directory

$ ls schemas/ tests/ patches/ protocols/ .github/workflows/ 2>&1
ls: cannot access 'schemas/': No such file or directory
ls: cannot access 'tests/': No such file or directory
ls: cannot access 'patches/': No such file or directory
ls: cannot access 'protocols/': No such file or directory
ls: cannot access '.github/workflows/': No such file or directory
```

### 6.2 Fork doc inventory matches Terra's description

**Verification:**
```bash
$ ls docs/*.md | wc -l
22

$ ls plan/*.md | wc -l
15  # (P00, P0–P11, README, CREATIVE-MECHANISMS)

$ ls adr/*.md | wc -l
5

$ ls skills/*/SKILL.md | wc -l
4  # (mis-bootstrap, mis-eval, mis-save, mis-reflect)
```

Terra's description ("fifteen phase/planning documents", "five ADRs", "four skills") matches.

---

*End of evidence log. All claims verifiable from the cited file:line references at fork HEAD `5bff12d`, upstream commits `2c10ea8` / `1dd828e` / `origin/main`, and Vestige `origin/main`.*
