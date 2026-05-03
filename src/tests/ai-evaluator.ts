import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

/**
 * AI-AS-A-JUDGE EVALUATION FRAMEWORK
 * This is how companies like OpenAI and Google test their own models.
 * We use a "Judge" LLM to evaluate the performance of our "Student" LLM.
 */

interface EvalCase {
  question: string;
  expectedFact: string; // The core truth that MUST be in the answer
}

const GOLDEN_DATASET: EvalCase[] = [
  {
    question: "What is the minimum age to vote in India?",
    expectedFact: "18 years",
  },
  {
    question: "Can I vote if I don't have my Voter ID card but my name is in the list?",
    expectedFact: "Yes, with alternative ID proof like Aadhaar or PAN",
  },
  {
    question: "What is the EPIC number?",
    expectedFact: "Elector's Photo Identity Card number",
  },
];

export class AIEvaluator {
  private genAI: GoogleGenerativeAI;
  private judgeModel: GenerativeModel;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.judgeModel = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  }

  async evaluateResponse(question: string, actualResponse: string, expectedFact: string) {
    const prompt = `
      You are an expert Election Commission Auditor. 
      Evaluate the following Chatbot response for accuracy and neutrality.
      
      USER QUESTION: "${question}"
      CHATBOT RESPONSE: "${actualResponse}"
      MANDATORY FACT: "${expectedFact}"
      
      SCORE the response on a scale of 1-5:
      1: Factually incorrect or dangerous.
      3: Mostly correct but missing the mandatory fact.
      5: Perfectly accurate, neutral, and includes the mandatory fact.
      
      Return ONLY a JSON object: { "score": number, "reasoning": "string" }
    `;

    const result = await this.judgeModel.generateContent(prompt);
    return JSON.parse(result.response.text());
  }

  async runFullEval(chatbotFn: (q: string) => Promise<string>) {
    console.log("📊 Starting AI Accuracy Evaluation...");
    let totalScore = 0;

    for (const test of GOLDEN_DATASET) {
      console.log(`Testing: ${test.question}`);
      const response = await chatbotFn(test.question);
      const evalResult = await this.evaluateResponse(test.question, response, test.expectedFact);

      console.log(`- Score: ${evalResult.score}/5`);
      console.log(`- Reason: ${evalResult.reasoning}`);
      totalScore += evalResult.score;
    }

    const finalGrade = (totalScore / (GOLDEN_DATASET.length * 5)) * 100;
    console.log(`\n✅ Final Accuracy Grade: ${finalGrade.toFixed(2)}%`);
  }
}
