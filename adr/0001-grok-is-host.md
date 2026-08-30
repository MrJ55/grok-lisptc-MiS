# ADR 0001: Grok is the host (replaces Pi)

## Status

Accepted

## Context

Upstream lisptc is designed for a neuro-symbolic loop where an LLM writes Lisp into a REPL and the REPL state steers the LLM. The reference integration is the Pi extension (`apps/pi`). We want the same loop with **Grok in the chat seat** instead of Pi, using the existing Grok sandbox.

## Decision

**Grok is the sole host.** The user supplies goals; Grok decides Lisp forms, drives the eval bridge, and owns permanence. No Pi extension host is required.

## Consequences

- Session handoff and custom instructions must tell every new Grok instance to take ownership immediately.
- The mind has no tools of its own; Grok may still use normal Grok tools for orchestration.
- Closer to lisptc’s intended design than multi-API subagent workers.
