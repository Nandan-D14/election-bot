/**
 * Custom error class for application-specific errors
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = "AppError";
    // V8-specific — guard for non-V8 environments
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Error types for different scenarios
 */
export const ErrorCodes = {
  NETWORK_ERROR: "NETWORK_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  AUTH_ERROR: "AUTH_ERROR",
  NOT_FOUND: "NOT_FOUND",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

/**
 * Handle errors consistently across the application
 */
export function handleError(error: unknown, context?: string): AppError {
  console.error(`Error in ${context || "application"}:`, error);

  // If it's already an AppError, return it
  if (error instanceof AppError) {
    return error;
  }

  // Handle network errors
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return new AppError(
      "Network connection failed. Please check your internet connection.",
      ErrorCodes.NETWORK_ERROR,
      503
    );
  }

  // Handle generic errors
  if (error instanceof Error) {
    return new AppError(
      error.message || "An unexpected error occurred",
      ErrorCodes.INTERNAL_ERROR,
      500
    );
  }

  // Handle unknown errors
  return new AppError("An unexpected error occurred", ErrorCodes.INTERNAL_ERROR, 500);
}

/**
 * Async error wrapper for try-catch blocks
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  context?: string
): Promise<{ data: T | null; error: AppError | null }> {
  try {
    const data = await fn();
    return { data, error: null };
  } catch (error) {
    const appError = handleError(error, context);
    return { data: null, error: appError };
  }
}

/**
 * Log error to monitoring service (placeholder for future implementation)
 */
export function logError(error: AppError, context?: string): void {
  // In production, this would send to a monitoring service like Sentry
  const logPayload: Record<string, unknown> = {
    message: error.message,
    statusCode: error.statusCode,
    details: error.details,
  };

  // Only include stack traces in non-production environments
  if (process.env.NODE_ENV !== "production") {
    logPayload.stack = error.stack;
  }

  console.error(`[${error.code}] ${context || "Application"}:`, logPayload);
}
