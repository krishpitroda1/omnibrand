# OmniBrand OS: Zero-Downtime Migration & Commercial Release Strategy

This document establishes the zero-downtime deployment, blue-green rollover, and rollback strategy for OmniBrand OS.

---

## 1. Zero-Downtime Database Migration Protocol

Every database schema change follows an **Expand and Contract** pattern across multiple releases to ensure continuous backward compatibility with running web worker pods.

```
Phase 1: EXPAND (Additive Changes)
  ├── Deploy DB migration adding new column as NULLABLE (e.g. `mfa_enabled`, `key_version`).
  └── Both old and new code versions function simultaneously without downtime.

Phase 2: DUAL-WRITE & BACKFILL
  ├── Application writes to both old and new schema fields.
  └── Background batch job backfills historical rows.

Phase 3: DEPRECATE & CONTRACT
  ├── Next app release reads exclusively from new fields.
  └── Final DB migration drops obsolete legacy columns.
```

### Prisma Migration Execution
```bash
# Generate and review SQL migration without immediate execution
npx prisma migrate dev --create-only --name harden_commercial_auth

# Apply migrations safely in CI/CD pipeline
npx prisma migrate deploy

# Verify schema synchronization
npx prisma validate
```

---

## 2. Blue-Green Production Rollout

```
                           [ Internet Traffic ]
                                    │
                         ┌──────────▼──────────┐
                         │ Cloudflare / Traefik │
                         │   Ingress Router    │
                         └──────────┬──────────┘
                                    │
                ┌───────────────────┴───────────────────┐
                ▼ (100% Active)                         ▼ (0% Idle Staging)
       ┌─────────────────┐                     ┌─────────────────┐
       │   BLUE FLEET    │                     │   GREEN FLEET   │
       │   (Version N)   │                     │  (Version N+1)  │
       └────────┬────────┘                     └────────┬────────┘
                │                                       │
                └───────────────────┬───────────────────┘
                                    │
                                    ▼
                      ┌───────────────────────────┐
                      │ Shared PostgreSQL & Redis │
                      └───────────────────────────┘
```

1. Deploy new image to **Green Fleet**.
2. Run healthcheck probe: `GET /api/health/ready` (must return `HTTP 200 READY`).
3. Run integration verification tests: `npx ts-node scripts/run-all-tests.ts`.
4. Switch Ingress Router traffic from Blue to Green.
5. Keep Blue fleet standing by for 30 minutes in case immediate rollback is required.

---

## 3. Immediate Rollback Playbook

If error rate spikes above 1% or p99 publish latency exceeds 2,000ms:
1. **Traffic Flip**: Immediately point ingress back to Blue fleet (`0.5s cutover`).
2. **KMS Re-key Rollback**: If a key rotation incident occurs, the keyring retains version N-1 (`CURRENT_KMS_VERSION - 1`) for decryption fallback.
3. **Queue Preservation**: Redis BullMQ jobs remain safe in memory and disk append log; worker pods re-attach to existing queues upon recovery.
