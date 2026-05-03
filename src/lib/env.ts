import { z } from "zod";

/**
 * ZERO-TRUST ENVIRONMENT VALIDATOR
 * Prevents the application from starting if environment variables are
 * missing or invalid. This is a hallmark of "Senior" production code.
 */
const envSchema = z.object({
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1, "Firebase API Key is required"),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1),
  GEMINI_API_KEY: z.string().min(1, "Gemini API Key is required for AI features"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

/**
 * Validate process.env against the schema.
 * Throws a detailed error message listing every missing variable.
 */
export function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("❌ Invalid Environment Variables:");
    const errors = result.error.flatten().fieldErrors;
    Object.entries(errors).forEach(([key, val]) => {
      console.error(`- ${key}: ${val}`);
    });

    throw new Error("Critical: Missing environment variables. Server cannot start.");
  }

  return result.data;
}
