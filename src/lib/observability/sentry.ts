export interface SentryBreadcrumb {
  category: string;
  message: string;
  level: "info" | "warning" | "error";
  timestamp: string;
}

const breadcrumbs: SentryBreadcrumb[] = [];

export function addBreadcrumb(crumb: Omit<SentryBreadcrumb, "timestamp">) {
  breadcrumbs.push({
    ...crumb,
    timestamp: new Date().toISOString(),
  });
  if (breadcrumbs.length > 50) breadcrumbs.shift();
}

export function captureException(error: Error | unknown, context?: Record<string, unknown>) {
  const err = error instanceof Error ? error : new Error(String(error));
  const payload = {
    exception: {
      name: err.name,
      message: err.message,
      stack: err.stack,
    },
    context: context || {},
    breadcrumbs: [...breadcrumbs],
    timestamp: new Date().toISOString(),
  };

  console.error("[Sentry Captured Exception]", JSON.stringify(payload));
  return `sentry-event-${Date.now()}`;
}
