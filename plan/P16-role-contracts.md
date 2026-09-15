# P16 — Role contracts (peer minds)

**Status:** planned  
**Depends on:** P13.1, [adr/0013-peer-minds.md](../adr/0013-peer-minds.md)  
**Normative doc:** [docs/role-contracts.md](../docs/role-contracts.md)

## Goal

Codify Orchestrator + peer roles so implementors share one codebase with config-selected role image, queue, and Vestige profile.

## Tasks

- [x] Normative Model B in docs/role-contracts.md (peer minds, sole canonical mutator).
- [ ] Implement bridge config: `role`, `canonicalImagePath`, `roleImagePath`, `vestigeProfile`, `queueName`, `author-mind-id`.
- [ ] Save gate: peer cannot write canonical path.
- [ ] Map role → `queues/<name>/`.
- [ ] Diversity rule (≥2 sources before promote) configurable in Orchestrator policy.
- [ ] Forbidden: eval of other roles’ free text as Lisp (document in role system prompts).
- [ ] Sample envelopes per role in schema doc or `docs/examples/` (optional).
- [ ] Bootstrap instructions per tab (Comet): which image + role env.

## Exit criteria

Role doc + bridge config surface reviewed; dry-run two peers + orchestrator with correct save gates and queue names.

## Related

- [P17-async-workflow.md](P17-async-workflow.md)  
- [docs/bridge-contract.md](../docs/bridge-contract.md)  
