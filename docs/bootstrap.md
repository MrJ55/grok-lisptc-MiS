# Bootstrap & restore

## Prerequisites

- Node.js ≥ 22.6 (sandbox has 24.x)
- `git`, `npm` / `pnpm` optional
- Internet for first-time `zod` install and optional upstream clone

## One-shot script

```bash
# From a clone of this repo
bash scripts/bootstrap.sh
# Creates /tmp/mis with sources, bridge, mind image, and node_modules/zod
```

## Manual steps (if script unavailable)

```bash
# 1. Install zod (only runtime dep)
mkdir -p /tmp/mis-node && cd /tmp/mis-node
npm init -y
npm install zod@4.4.3

# 2. Assemble runtime tree
REPO=/path/to/grok-lisptc-MiS   # or /home/workdir/artifacts/mis after copy
rm -rf /tmp/mis
mkdir -p /tmp/mis/{bridge,mind,src}
cp -a "$REPO/src/"* /tmp/mis/src/
cp -a "$REPO/bridge/"* /tmp/mis/bridge/
cp -a "$REPO/mind/"* /tmp/mis/mind/
cp "$REPO/package.json" /tmp/mis/
cp -a /tmp/mis-node/node_modules /tmp/mis/

# 3. Smoke test
cd /tmp/mis
node --experimental-transform-types --no-warnings bridge/eval.ts '(+ 1 2 3)'
node --experimental-transform-types --no-warnings bridge/eval.ts '(list (mis-version) (mis-ping))'
```

## Why /tmp/mis?

Sandbox RAM is ~1.2 GB and I/O under `/home/workdir` can be slow or flaky for `node_modules`. Runtime lives in `/tmp`; durable sources and the mind image live in this repo (and under `artifacts/mis/` in the original project sandbox).

## Upstream full monorepo (optional, heavier)

```bash
git clone --depth 1 https://github.com/1hachem/lisptc.git /tmp/lisptc
# Prefer filtered install of @repo/interpreter + @repo/repl only if RAM allows
```

This repo already vendors the minimal core needed for the stripped MemoryRepl path.
