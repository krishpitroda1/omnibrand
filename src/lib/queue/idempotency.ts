export interface IdempotencyRecord {
  idempotencyKey: string;
  workspaceId: string;
  jobId: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "DLQ";
  resultPayload?: any;
  createdAt: number;
  lastAttemptAt: number;
  duplicateAttemptsCount: number;
}

// In-memory Redis-compatible idempotency key store
const IDEMPOTENCY_STORE = new Map<string, IdempotencyRecord>();

export class IdempotencyConflictError extends Error {
  statusCode: number;
  jobId: string;
  constructor(key: string, jobId: string) {
    super(`Duplicate request: Idempotency key '${key}' already processed under job '${jobId}'.`);
    this.name = "IdempotencyConflictError";
    this.statusCode = 409;
    this.jobId = jobId;
  }
}

/**
 * Checks an idempotency key.
 * If key already exists: returns existing record and increments duplicate counter.
 * If key does NOT exist: registers key and returns null.
 */
export function checkOrRegisterIdempotencyKey(
  idempotencyKey: string,
  workspaceId: string,
  generateJobId: () => string
): { isDuplicate: boolean; record: IdempotencyRecord } {
  if (!idempotencyKey) {
    throw new Error("Idempotency key is required on every publish operation");
  }

  const compositeKey = `${workspaceId}:${idempotencyKey}`;
  const existing = IDEMPOTENCY_STORE.get(compositeKey);

  if (existing) {
    existing.duplicateAttemptsCount += 1;
    existing.lastAttemptAt = Date.now();
    return {
      isDuplicate: true,
      record: existing,
    };
  }

  const newRecord: IdempotencyRecord = {
    idempotencyKey,
    workspaceId,
    jobId: generateJobId(),
    status: "PENDING",
    createdAt: Date.now(),
    lastAttemptAt: Date.now(),
    duplicateAttemptsCount: 0,
  };

  IDEMPOTENCY_STORE.set(compositeKey, newRecord);

  return {
    isDuplicate: false,
    record: newRecord,
  };
}

export function updateIdempotencyRecord(
  idempotencyKey: string,
  workspaceId: string,
  updates: Partial<IdempotencyRecord>
) {
  const compositeKey = `${workspaceId}:${idempotencyKey}`;
  const existing = IDEMPOTENCY_STORE.get(compositeKey);
  if (existing) {
    Object.assign(existing, updates);
  }
}

export function getIdempotencyRecord(idempotencyKey: string, workspaceId: string) {
  return IDEMPOTENCY_STORE.get(`${workspaceId}:${idempotencyKey}`);
}

export function clearIdempotencyStore() {
  IDEMPOTENCY_STORE.clear();
}
