import { NextResponse } from "next/server";
import { AppError } from "./errorHandler";

/**
 * STANDARDIZED API RESPONSE WRAPPER
 * Every API route in a production-grade app must return
 * the exact same JSON structure to be predictable.
 */

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: {
    code: string;
    message: string;
    details?: unknown;
  } | null;
  timestamp: string;
}

/**
 * Utility to create a successful JSON response.
 */
export function successResponse<T>(data: T, status: number = 200) {
  const body: ApiResponse<T> = {
    success: true,
    data,
    error: null,
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(body, { status });
}

/**
 * Utility to create an error JSON response.
 */
export function errorResponse(error: unknown, status: number = 500) {
  let code = "INTERNAL_ERROR";
  let message = "An unexpected error occurred";
  let details: unknown = undefined;

  if (error instanceof AppError) {
    code = error.code;
    message = error.message;
    details = error.details;
    status = error.statusCode;
  } else if (error instanceof Error) {
    message = error.message;
  }

  const body: ApiResponse<null> = {
    success: false,
    data: null,
    error: { code, message, details },
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(body, { status });
}
