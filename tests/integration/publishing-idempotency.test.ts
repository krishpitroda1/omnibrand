import {
  checkOrRegisterIdempotencyKey,
  clearIdempotencyStore,
} from "@/lib/queue/idempotency";
import { publishingQueue } from "@/lib/queue/publishing-queue";

export async function runPublishingIdempotencyTest() {
  console.log("▶ Running Integration Test: Publishing Idempotency & Queue Backoff...");

  clearIdempotencyStore();
  publishingQueue.clearQueue();

  const testKey = "idemp-key-test-uuid-99214";
  const workspaceId = "ws-prod-01";

  // First submission: should register new job
  const attempt1 = checkOrRegisterIdempotencyKey(testKey, workspaceId, () => "job-pub-original-001");
  if (attempt1.isDuplicate) {
    throw new Error("Idempotency test failed: First submission falsely marked as duplicate");
  }
  const job1 = publishingQueue.enqueue("publish", workspaceId, { caption: "Post 1" }, testKey, attempt1.record.jobId);
  const queueDepthAfter1 = publishingQueue.getQueueMetrics("publish").total;

  // Second submission with DUPLICATED idempotency key
  const attempt2 = checkOrRegisterIdempotencyKey(testKey, workspaceId, () => "job-pub-duplicate-SHOULD-NOT-EXIST");
  if (!attempt2.isDuplicate) {
    throw new Error("Idempotency test failed: Second submission with identical key was NOT recognized as duplicate!");
  }
  if (attempt2.record.jobId !== "job-pub-original-001") {
    throw new Error("Idempotency test failed: Duplicate did not return original jobId");
  }

  // Queue must NOT have accepted a second job!
  const queueDepthAfter2 = publishingQueue.getQueueMetrics("publish").total;
  if (queueDepthAfter2 !== queueDepthAfter1 || queueDepthAfter2 !== 1) {
    throw new Error(
      `Idempotency test failed: Queue size increased to ${queueDepthAfter2}! Duplicated idempotency key created multiple jobs.`
    );
  }

  // Backoff with Jitter calculation test
  const backoff0 = publishingQueue.calculateBackoffWithJitter(0);
  const backoff3 = publishingQueue.calculateBackoffWithJitter(3);
  if (backoff3 <= backoff0 || backoff3 > 30000) {
    throw new Error("Exponential backoff math out of bounds");
  }

  console.log("  ✔ Confirmed: Duplicated idempotency key strictly returns existing job and does not create duplicate jobs.");
  return true;
}
