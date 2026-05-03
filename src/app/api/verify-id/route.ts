import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import { VerificationService, IVerificationClient } from "@/services/VerificationService";
import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import { validateEnv } from "@/lib/env";

/**
 * ADAPTER PATTERN: Gemini Verification Client
 * Implements the external communication logic without exposing 
 * the VerificationService to the underlying GenAI details.
 */
class GeminiVerificationClient implements IVerificationClient {
  private genAI: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async verify(frontImage: string, backImage?: string): Promise<unknown> {
    const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const parts: Part[] = [
      {
        text: `You are an expert Indian Voter ID (EPIC card) verification assistant. Analyze the provided voter ID card image(s) and return a structured JSON assessment.

Your task:
1. Determine if this appears to be a genuine Indian Voter ID card (EPIC).
2. Extract all visible details from the card.
3. Check for signs of tampering, forgery, or expiration.
4. Provide an overall verification status.

Return ONLY valid JSON in this exact format (no markdown, no code fences):
{
  "status": "VALID" | "SUSPICIOUS" | "INVALID" | "UNREADABLE",
  "confidence": 95,
  "details": {
    "name": "<extracted name or null>",
    "fatherOrHusbandName": "<extracted relation name or null>",
    "epicNumber": "<extracted EPIC number or null>",
    "gender": "<Male/Female or null>",
    "dateOfBirth": "<extracted DOB or null>",
    "age": "<extracted age or null>",
    "address": "<extracted address or null>",
    "assemblyConstituency": "<extracted constituency or null>",
    "partNumber": "<extracted part number or null>",
    "photo": "present"
  },
  "checks": [
    { "check": "<check name>", "passed": true, "note": "<explanation>" }
  ],
  "warnings": ["<list of warning strings>"],
  "summary": "<2-3 sentence summary>"
}

Be thorough but fair.`,
      },
    ];

    const frontBase64 = frontImage.split(",")[1] || frontImage;
    const frontMimeType = frontImage.match(/data:([^;]+);/)?.[1] || "image/jpeg";
    parts.push({ inlineData: { mimeType: frontMimeType, data: frontBase64 } });

    if (backImage) {
      parts.push({ text: "\n\nThis is the BACK side of the same voter ID card:" });
      const backBase64 = backImage.split(",")[1] || backImage;
      const backMimeType = backImage.match(/data:([^;]+);/)?.[1] || "image/jpeg";
      parts.push({ inlineData: { mimeType: backMimeType, data: backBase64 } });
    }

    const result = await model.generateContent(parts);
    const responseText = result.response.text();

    try {
      const cleaned = responseText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      return JSON.parse(cleaned);
    } catch {
      return {
        status: "UNREADABLE",
        confidence: 0,
        details: { name: null, epicNumber: null, dateOfBirth: null, address: null, photo: "unclear" },
        checks: [],
        warnings: ["AI response could not be parsed into structured format."],
        summary: responseText,
      };
    }
  }
}

/**
 * STANDARD API ROUTE
 * Follows enterprise patterns: strict env validation, isolated service logic, 
 * and predictable standardized response envelopes.
 */
export async function POST(req: NextRequest) {
  try {
    const env = validateEnv();
    const body = await req.json();
    const { frontImage, backImage } = body;

    // Input validation: frontImage is required and must be a string
    if (!frontImage || typeof frontImage !== "string") {
      return errorResponse(
        new Error("frontImage is required and must be a base64 encoded string."),
        400
      );
    }

    if (backImage && typeof backImage !== "string") {
      return errorResponse(
        new Error("backImage must be a base64 encoded string if provided."),
        400
      );
    }

    const client = new GeminiVerificationClient(env.GEMINI_API_KEY);
    const service = new VerificationService(client);
    
    // The performVerification method enforces all Zod schema validation
    const result = await service.performVerification(frontImage, backImage);
    
    return successResponse(result);
  } catch (error: unknown) {
    return errorResponse(error, 400);
  }
}
