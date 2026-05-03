import { VerificationService } from "../services/VerificationService";

/**
 * PROPERTY-BASED FUZZING
 * Instead of specific inputs, we define the "Shape" of data and
 * bomb the system with 10,000 random variations to find edge cases.
 */

export class Fuzzer {
  static generateRandomString(length: number) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;':\",./<>? \n\t";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static async runFuzzTest(service: VerificationService) {
    console.log("🧨 Starting Property-Based Fuzzing...");
    const iterations = 100; // In production, this would be 10,000+
    let crashes = 0;

    for (let i = 0; i < iterations; i++) {
      // Create chaotic, potentially malicious input
      const payload = i % 10 === 0 ? "" : this.generateRandomString(Math.floor(Math.random() * 5000));
      
      try {
        // We don't care if it fails validation, we care if it CRASHES the process
        await service.performVerification(payload);
      } catch (e: unknown) {
        if (e instanceof Error) {
          if (e.message.includes("is not a function") || e instanceof TypeError) {
            console.error(`🚨 FATAL CRASH detected with payload size ${payload.length}`);
            crashes++;
          }
        }
        // AppError or Zod errors are EXPECTED (passed the test)
      }
    }

    console.log(`\n✅ Fuzzing Complete. Crashes: ${crashes}/${iterations}`);
    if (crashes > 0) throw new Error("Fuzzing failed: System is unstable.");
  }
}
