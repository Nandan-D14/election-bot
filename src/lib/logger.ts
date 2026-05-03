/* ============================================================
   CivicIQ — Structured Logger
   Production-grade logging utility for observability.
   ============================================================ */

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  error?: Error;
}

class Logger {
  private static instance: Logger;
  private isProduction = process.env.NODE_ENV === "production";

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error,
    };

    if (this.isProduction) {
      // In production, we would send this to a logging service (e.g., Datadog, LogRocket, Sentry)
      // For now, we use console with structured formatting for GCP Cloud Logging
      console.log(JSON.stringify(entry));
    } else {
      const color = this.getLevelColor(level);
      console.log(
        `%c[${entry.timestamp}] [${level.toUpperCase()}] ${message}`,
        `color: ${color}; font-weight: bold;`,
        context || "",
        error || ""
      );
    }
  }

  private getLevelColor(level: LogLevel): string {
    switch (level) {
      case "info":
        return "#3b82f6";
      case "warn":
        return "#f59e0b";
      case "error":
        return "#ef4444";
      case "debug":
        return "#10b981";
      default:
        return "#6b7280";
    }
  }

  public info(message: string, context?: Record<string, unknown>) {
    this.log("info", message, context);
  }

  public warn(message: string, context?: Record<string, unknown>) {
    this.log("warn", message, context);
  }

  public error(message: string, error?: Error, context?: Record<string, unknown>) {
    this.log("error", message, context, error);
  }

  public debug(message: string, context?: Record<string, unknown>) {
    this.log("debug", message, context);
  }
}

export const logger = Logger.getInstance();
