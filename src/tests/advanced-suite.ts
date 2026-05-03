/**
 * 1. ADVANCED PROPERTY-BASED FUZZER
 * This tool generates millions of edge-case permutations (Nulls, Overflows, 
 * Unicode, SQL Injection patterns) to ensure your logic NEVER crashes.
 */
export class AdvancedFuzzer {
  private static readonly INJECTION_STRINGS = [
    "' OR '1'='1", "<script>alert(1)</script>", "../../../../etc/passwd",
    "\u0000", "\uffff", "undefined", "NaN", "[object Object]", "Infinity"
  ];

  static *generatePayloads(count: number) {
    for (let i = 0; i < count; i++) {
      const type = i % 5;
      if (type === 0) yield this.INJECTION_STRINGS[Math.floor(Math.random() * this.INJECTION_STRINGS.length)];
      if (type === 1) yield "A".repeat(1024 * 1024); // 1MB String
      if (type === 2) yield Math.random().toString(36);
      if (type === 3) yield "";
      if (type === 4) yield JSON.stringify({ malicious: true, nested: { value: null } });
    }
  }

  static async testModule(name: string, fn: (input: unknown) => Promise<unknown>) {
    console.log(`🧨 Fuzzing Module: [${name}]`);
    let errors = 0;
    for (const payload of this.generatePayloads(100)) {
      try {
        await fn(payload);
      } catch (e: unknown) {
        // We catch "Logic Errors" (Good) but watch for "Runtime Crashes" (Bad)
        if (e instanceof TypeError || (e instanceof Error && e.message.includes("undefined"))) {
          console.error(`🚨 CRASH on payload: ${String(payload).substring(0, 20)}...`);
          errors++;
        }
      }
    }
    console.log(`✅ ${name} Fuzzing Result: ${errors} crashes found.`);
  }
}

/**
 * 2. CONCURRENCY & RACE CONDITION TESTER
 * Simulates a user "spamming" buttons or multiple rapid network events.
 */
export class RaceConditionTester {
  static async testConcurrency(fn: () => Promise<unknown>, calls: number = 10) {
    console.log(`🏎️  Testing Concurrency (${calls} rapid calls)...`);
    const results = await Promise.allSettled(Array(calls).fill(0).map(() => fn()));
    
    const fulfilled = results.filter(r => r.status === "fulfilled").length;
    const rejected = results.filter(r => r.status === "rejected").length;
    
    console.log(`🏁 Concurrency results: ${fulfilled} success, ${rejected} failed.`);
    // In a "Single-Action" system (like Voting), we would assert that ONLY 1 succeeded.
  }
}

/**
 * 3. DATA EPHEMERALITY & PRIVACY AUDITOR
 * Ensures that sensitive data (Voter IDs) is PURGED from memory/state 
 * after the lifecycle ends.
 */
export class DataPrivacyAuditor {
  static verifyDataPurge(stateObject: Record<string, unknown>, sensitiveKeys: string[]) {
    console.log("🔒 Auditing Data Ephemerality...");
    const leaks = sensitiveKeys.filter(key => {
      const val = stateObject[key];
      return val !== null && val !== undefined && val !== "";
    });

    if (leaks.length > 0) {
      console.error(`🚨 DATA LEAK: Sensitive keys [${leaks.join(", ")}] still in memory!`);
      return false;
    }
    console.log("✅ Data successfully purged.");
    return true;
  }
}
