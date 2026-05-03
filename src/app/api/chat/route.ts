import { GoogleGenerativeAI } from "@google/generative-ai";

// Create an instance of the Google Generative AI client
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

interface ChatMessage {
  role: "user" | "assistant" | "model";
  content: string;
}

/** Allowlisted model IDs to prevent injection of arbitrary model names */
const ALLOWED_MODELS: Record<string, string> = {
  "gemini 3.1 flash": "gemini-2.0-flash",
  "gemini 3 flash": "gemini-2.0-flash-lite",
  "gemini 3.1 pro": "gemini-2.5-pro-preview-06-05",
  haiku: "gemini-2.0-flash",
};

export async function POST(req: Request) {
  try {
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Gemini API key not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { messages, model: requestedModel }: { messages: ChatMessage[]; model?: string } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Messages array must be non-empty" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Validate each message has required fields
    for (const msg of messages) {
      if (!msg.role || !msg.content || typeof msg.content !== "string") {
        return new Response(
          JSON.stringify({ error: "Each message must have a valid role and content" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Format history for Gemini
    // Gemini uses "user" and "model" as roles
    const history = messages.slice(0, -1).map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const latestMessage = messages[messages.length - 1];

    // Resolve model name from allowlist; default to flash
    const modelName = (requestedModel && ALLOWED_MODELS[requestedModel]) || ALLOWED_MODELS["gemini 3.1 flash"];
    const model = genAI.getGenerativeModel({ model: modelName });

    const chat = model.startChat({
      history,
      systemInstruction:
        "You are a helpful, knowledgeable, and neutral Electoral Process Assistant. Explain the election lifecycle, voter eligibility, and polling procedures accurately and neutrally. Respond in the language of the user.",
    });

    const result = await chat.sendMessageStream(latestMessage.content);

    // Create a ReadableStream to stream the response back to the client
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder(); // Create once, reuse per chunk
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            controller.enqueue(encoder.encode(chunkText));
          }
          controller.close();
        } catch (error) {
          console.error("Error streaming Gemini response:", error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Something went wrong";
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
