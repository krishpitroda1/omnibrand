export type QueueName = "publish" | "media-process" | "webhook-ingest" | "ai-generate";

export interface QueueJob<T = any> {
  id: string;
  queueName: QueueName;
  workspaceId: string;
  idempotencyKey?: string;
  data: T;
  status: "WAITING" | "ACTIVE" | "COMPLETED" | "FAILED" | "DLQ";
  attempts: number;
  maxAttempts: number;
  lastError?: string;
  nextRetryAt?: number;
  createdAt: number;
  completedAt?: number;
  progress: number; // 0 - 100
}

export interface PublishJobPayload {
  campaignId: string;
  contentItemId: string;
  channels: string[];
  caption: string;
  mediaUrls?: string[];
  scheduleTime?: string;
}

export type GranularErrorCode =
  | "ERR_AUTH_EXPIRED"
  | "ERR_RATE_LIMITED"
  | "ERR_MEDIA_DIMENSIONS_INVALID"
  | "ERR_24H_WINDOW_CLOSED"
  | "ERR_CARRIER_REJECTED"
  | "ERR_NETWORK_TIMEOUT"
  | "ERR_CONTENT_FILTER_TRIGGERED";

export interface ChannelPublishResult {
  channel: string;
  status: "PUBLISHED" | "FAILED";
  postId?: string;
  errorCode?: GranularErrorCode;
  errorMessage?: string;
  publishedAt?: string;
}

// In-Memory Queue Store (BullMQ-compatible architecture)
class DistributedJobQueue {
  private jobs: Map<string, QueueJob> = new Map();
  private maxAttempts = 5;

  /**
   * Calculate exponential backoff with jitter (max 30 seconds)
   */
  calculateBackoffWithJitter(attempt: number): number {
    const baseBackoffMs = 1000; // 1s base
    const exponential = baseBackoffMs * Math.pow(2, attempt);
    const jitter = Math.floor(Math.random() * 500); // 0 - 500ms random jitter
    return Math.min(30000, exponential + jitter);
  }

  enqueue<T>(
    queueName: QueueName,
    workspaceId: string,
    data: T,
    idempotencyKey?: string,
    forcedJobId?: string
  ): QueueJob<T> {
    const jobId = forcedJobId || `job-${queueName}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const job: QueueJob<T> = {
      id: jobId,
      queueName,
      workspaceId,
      idempotencyKey,
      data,
      status: "WAITING",
      attempts: 0,
      maxAttempts: this.maxAttempts,
      createdAt: Date.now(),
      progress: 0,
    };

    this.jobs.set(jobId, job);
    return job;
  }

  getJob(jobId: string): QueueJob | undefined {
    return this.jobs.get(jobId);
  }

  getQueueMetrics(queueName?: QueueName) {
    const all = Array.from(this.jobs.values()).filter(
      (j) => !queueName || j.queueName === queueName
    );

    const waiting = all.filter((j) => j.status === "WAITING").length;
    const active = all.filter((j) => j.status === "ACTIVE").length;
    const completed = all.filter((j) => j.status === "COMPLETED").length;
    const failed = all.filter((j) => j.status === "FAILED").length;
    const dlq = all.filter((j) => j.status === "DLQ").length;

    return {
      total: all.length,
      depth: waiting + active,
      waiting,
      active,
      completed,
      failed,
      dlq,
    };
  }

  /**
   * Simulates running a publish job with per-channel granular states, retries, and DLQ
   */
  async processPublishJob(
    jobId: string,
    channelSimulator?: (channel: string) => ChannelPublishResult
  ): Promise<{
    overallStatus: "PUBLISHED" | "PARTIAL" | "FAILED" | "DLQ";
    channelResults: ChannelPublishResult[];
  }> {
    const job = this.jobs.get(jobId) as QueueJob<PublishJobPayload>;
    if (!job) throw new Error(`Job ${jobId} not found`);

    job.status = "ACTIVE";
    job.attempts += 1;

    const payload = job.data;
    const channelResults: ChannelPublishResult[] = [];

    for (const channel of payload.channels) {
      if (channelSimulator) {
        channelResults.push(channelSimulator(channel));
      } else {
        // Default deterministic execution:
        // WhatsApp with consent succeeds, TikTok restricted fails with ERR_AUTH_EXPIRED
        if (channel === "TIKTOK") {
          channelResults.push({
            channel,
            status: "FAILED",
            errorCode: "ERR_AUTH_EXPIRED",
            errorMessage: "TikTok direct publishing API token expired or restricted",
          });
        } else {
          channelResults.push({
            channel,
            status: "PUBLISHED",
            postId: `pub-${channel.toLowerCase()}-${Date.now()}`,
            publishedAt: new Date().toISOString(),
          });
        }
      }
    }

    const hasSuccess = channelResults.some((r) => r.status === "PUBLISHED");
    const hasFail = channelResults.some((r) => r.status === "FAILED");

    if (hasSuccess && !hasFail) {
      job.status = "COMPLETED";
      job.progress = 100;
      job.completedAt = Date.now();
      return { overallStatus: "PUBLISHED", channelResults };
    } else if (hasSuccess && hasFail) {
      job.status = "COMPLETED";
      job.progress = 100;
      job.completedAt = Date.now();
      return { overallStatus: "PARTIAL", channelResults };
    } else {
      // Complete failure
      if (job.attempts >= job.maxAttempts) {
        job.status = "DLQ"; // Move to Dead-Letter Queue
        job.lastError = `Max ${job.maxAttempts} retry attempts exhausted. Sent to Dead Letter Queue.`;
        return { overallStatus: "DLQ", channelResults };
      } else {
        job.status = "FAILED";
        const delay = this.calculateBackoffWithJitter(job.attempts);
        job.nextRetryAt = Date.now() + delay;
        job.lastError = `Publish failed on all channels. Retrying in ${Math.round(delay / 1000)}s (Attempt ${job.attempts}/${job.maxAttempts}).`;
        return { overallStatus: "FAILED", channelResults };
      }
    }
  }

  getAllJobs(): QueueJob[] {
    return Array.from(this.jobs.values());
  }

  clearQueue() {
    this.jobs.clear();
  }
}

export const publishingQueue = new DistributedJobQueue();
