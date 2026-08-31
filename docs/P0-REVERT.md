# Revert P0 changes

Backups taken at start of P0 work:

```bash
# Restore previous eval.ts
cp /tmp/mis-p0-backup/eval.ts.repo /home/workdir/artifacts/grok-lisptc-MiS/bridge/eval.ts
cp /tmp/mis-p0-backup/eval.ts.mis /home/workdir/artifacts/mis/bridge/eval.ts

# Restore previous bootstrap
cp /tmp/mis-p0-backup/bootstrap.sh /home/workdir/artifacts/grok-lisptc-MiS/scripts/bootstrap.sh

# Restore mind image from checkpoint (if present)
cp /tmp/mis/mind/mind-image.prev.ptc /tmp/mis/mind/mind-image.ptc
# or from backup:
cp -a /tmp/mis-p0-backup/mind/* /home/workdir/artifacts/mis/mind/

# Re-bootstrap
bash /home/workdir/artifacts/grok-lisptc-MiS/scripts/bootstrap.sh
```

GitHub: revert the commit that introduced P0 bridge changes, or restore files from that commit.
