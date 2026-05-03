import { GoogleGenerativeAI, Part } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export async function POST(req: Request) {
  try {
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Gemini API key not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { frontImage, backImage } = body;

    if (!frontImage) {
      return new Response(JSON.stringify({ error: "Front image of voter ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Build parts array with images
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
  "confidence": <number 0-100>,
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
    "photo": "present" | "missing" | "unclear"
  },
  "checks": [
    { "check": "<check name>", "passed": <boolean>, "note": "<explanation>" }
  ],
  "warnings": ["<list of warning strings>"],
  "summary": "<2-3 sentence human-readable summary of the verification>"
}

Checks to perform:
- Format consistency: Does it follow the standard EPIC card format?
- EPIC number format: Is it in the standard 3-letter + 7-digit format (e.g., ABC1234567)?
- Photo presence: Is there a visible photo on the card?
- Hologram/watermark signs: Any signs of security features?
- Text clarity: Is the text clear and not obviously manipulated?
- Card condition: Is the card damaged, expired-looking, or tampered with?

Be thorough but fair. If the image is low quality, indicate that in the summary rather than marking it invalid.`,
      },
    ];

    // Add front image
    const frontBase64 = frontImage.split(",")[1] || frontImage;
    const frontMimeType = frontImage.match(/data:([^;]+);/)?.[1] || "image/jpeg";
    parts.push({
      inlineData: {
        mimeType: frontMimeType,
        data: frontBase64,
      },
    });

    // Add back image if provided
    if (backImage) {
      parts.push({ text: "\n\nThis is the BACK side of the same voter ID card:" });
      const backBase64 = backImage.split(",")[1] || backImage;
      const backMimeType = backImage.match(/data:([^;]+);/)?.[1] || "image/jpeg";
      parts.push({
        inlineData: {
          mimeType: backMimeType,
          data: backBase64,
        },
      });
    }

    const result = await model.generateContent(parts);
    const responseText = result.response.text();

    // Try to parse JSON from the response
    let verificationResult;
    try {
      // Remove any markdown code fences if present
      const cleaned = responseText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      verificationResult = JSON.parse(cleaned);
    } catch {
      // If parsing fails, return the raw text as summary
      verificationResult = {
        status: "UNREADABLE",
        confidence: 0,
        details: {},
        checks: [],
        warnings: ["AI response could not be parsed into structured format."],
        summary: responseText,
      };
    }

    return new Response(JSON.stringify(verificationResult), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Verification failed";
    console.error("Verify ID API Error:", error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
