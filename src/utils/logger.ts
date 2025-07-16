// src/utils/logger.ts
// A simple logging utility for our server that works well with Vercel's logging system

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogMessage {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
}

/**
 * Structured logger that works well with Vercel's log system
 */
class Logger {
  private context: Record<string, any> = {};

  /**
   * Create a logger with optional default context
   */
  constructor(defaultContext: Record<string, any> = {}) {
    this.context = defaultContext;
  }

  /**
   * Set additional context for all log messages
   */
  setContext(context: Record<string, any>) {
    this.context = { ...this.context, ...context };
    return this;
  }

  /**
   * Log a debug message
   */
  debug(message: string, context?: Record<string, any>) {
    this.log("debug", message, context);
  }

  /**
   * Log an info message
   */
  info(message: string, context?: Record<string, any>) {
    this.log("info", message, context);
  }

  /**
   * Log a warning message
   */
  warn(message: string, context?: Record<string, any>) {
    this.log("warn", message, context);
  }

  /**
   * Log an error message
   */
  error(message: string, error?: Error, context?: Record<string, any>) {
    this.log("error", message, {
      ...context,
      error: error
        ? {
            message: error.message,
            stack: error.stack,
            name: error.name,
          }
        : undefined,
    });
  }

  /**
   * Internal logging method
   */
  private log(level: LogLevel, message: string, context?: Record<string, any>) {
    const logObject: LogMessage = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: { ...this.context, ...context },
    };

    // In production (Vercel), use JSON format for better log parsing
    if (process.env.NODE_ENV === "production") {
      console.log(JSON.stringify(logObject));
    } else {
      // In development, use more readable format
      const colorMap = {
        debug: "\x1b[34m", // blue
        info: "\x1b[32m", // green
        warn: "\x1b[33m", // yellow
        error: "\x1b[31m", // red
      };

      const color = colorMap[level];
      console.log(
        `${color}[${level.toUpperCase()}]\x1b[0m ${
          logObject.timestamp
        } - ${message}`
      );

      if (context && Object.keys(context).length > 0) {
        console.log("Context:", context);
      }

      if (level === "error" && context?.error?.stack) {
        console.log("Stack:", context.error.stack);
      }
    }
  }

  /**
   * Create a child logger with additional context
   */
  child(context: Record<string, any>) {
    return new Logger({ ...this.context, ...context });
  }
}

// Export a default logger instance
export const logger = new Logger({
  service: "simpple-server",
  environment: process.env.NODE_ENV || "development",
});

// Export the Logger class
export default Logger;
