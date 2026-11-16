export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

export interface LogContext {
  requestId?: string;
  workspaceId?: string;
  userId?: string;
  path?: string;
  [key: string]: unknown;
}

class StructuredLogger {
  private baseContext: LogContext = {};

  setContext(context: LogContext) {
    this.baseContext = { ...this.baseContext, ...context };
  }

  private log(level: LogLevel, message: string, meta?: Record<string, unknown>) {
    const entry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...this.baseContext,
      ...meta,
    };

    const serialized = JSON.stringify(entry);

    if (level === "error" || level === "fatal") {
      console.error(serialized);
    } else if (level === "warn") {
      console.warn(serialized);
    } else {
      console.log(serialized);
    }
  }

  debug(message: string, meta?: Record<string, unknown>) {
    this.log("debug", message, meta);
  }

  info(message: string, meta?: Record<string, unknown>) {
    this.log("info", message, meta);
  }

  warn(message: string, meta?: Record<string, unknown>) {
    this.log("warn", message, meta);
  }

  error(message: string, meta?: Record<string, unknown>) {
    this.log("error", message, meta);
  }

  child(context: LogContext) {
    const childLogger = new StructuredLogger();
    childLogger.setContext({ ...this.baseContext, ...context });
    return childLogger;
  }
}

export const logger = new StructuredLogger();
