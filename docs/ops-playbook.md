# Ops playbook

```bash
bash scripts/bootstrap.sh
cd /tmp/mis
node --experimental-transform-types --no-warnings bridge/eval.ts [flags] '<forms>'
# --save --checkpoint --scratch --image PATH --reset
# exit 0 ok | 1 usage | 2 validation/eval failure
```

See VERIFICATION.md after changes. Push mind-image.ptc after meaningful permanent defs.
