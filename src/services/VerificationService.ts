import { z } from "zod";

/**
 * SCHEMA LAYER: The "Contract"
 * Define exactly what valid data looks like. If the API returns
 * something different, the system catches it immediately before
 * it breaks the UI.
 */
export const VerificationResultSchema = z.object({
  status: z.enum(["VALID", "SUSPICIOUS", "INVALID", "UNREADABLE"]),
  confidence: z.number().min(0).max(100),
  details: z.object({
    name: z.string().nullable(),
    epicNumber: z.string().nullable(),
    dateOfBirth: z.string().nullable(),
    address: z.string().nullable(),
    photo: z.enum(["present", "missing", "unclear"]),
  }),
  warnings: z.array(z.string()),
  summary: z.string(),
});

export type VerificationResult = z.infer<typeof VerificationResultSchema>;

/**
 * Contract for a service that communicates with external verification APIs.
 * This interface enables Dependency Injection for testing and multi-vendor support.
 */
export interface IVerificationClient {
  /**
   * Sends image data to the verification provider.
   * @param frontImage - Base64 encoded front image of the ID.
   * @param backImage - Optional Base64 encoded back image of the ID.
   * @returns The raw response from the provider.
   */
  verify(frontImage: string, backImage?: string): Promise<unknown>;
}

/**
 * CORE DOMAIN SERVICE: VerificationService
 * Orchestrates the business logic for voter identity validation.
 *
 * DESIGN PRINCIPLES:
 * 1. Single Responsibility: Only handles the verification workflow.
 * 2. Fail-Fast: Validates API responses using Zod before they reach the UI.
 * 3. Decoupled: Injected with a client, making it 100% testable without a network.
 */
export class VerificationService {
  /**
   * Initializes the service with a specialized client.
   * @param client - The adapter used for network communication.
   */
  constructor(private client: IVerificationClient) {}

  /**
   * Performs high-integrity verification on a voter ID.
   *
   * @param frontImage - The primary identity image.
   * @param backImage - The secondary identity image (optional).
   * @returns A strictly-typed VerificationResult object.
   * @throws {Error} If images are missing or the API response fails schema validation.
   */
  async performVerification(frontImage: string, backImage?: string): Promise<VerificationResult> {
    if (!frontImage) {
      throw new Error("Front image is required for verification");
    }

    // 1. Call the external dependency (The Adapter)
    const rawData = await this.client.verify(frontImage, backImage);

    // 2. Validate the result against our Schema
    // This is "Fail-Fast" design: if data is bad, it stops here.
    const result = VerificationResultSchema.safeParse(rawData);

    if (!result.success) {
      console.error("Schema Validation Failed:", result.error.format());
      throw new Error("Received malformed data from the verification service.");
    }

    return result.data;
  }
}
