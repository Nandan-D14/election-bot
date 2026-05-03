import { VerificationService, IVerificationClient } from "./VerificationService";

/**
 * UNIT TESTS — VerificationService
 * Uses mock clients + throws-based assertions (no framework dependency).
 * Compatible with `npx tsx src/services/VerificationService.test.ts`
 */

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

/** Provides a well-formed response that passes Zod validation */
class MockValidClient implements IVerificationClient {
  async verify(): Promise<unknown> {
    return {
      status: "VALID",
      confidence: 95,
      details: {
        name: "John Doe",
        epicNumber: "ABC1234567",
        dateOfBirth: "1990-01-01",
        address: "123 Street, City",
        photo: "present",
      },
      warnings: [],
      summary: "All checks passed",
    };
  }
}

/** Provides a malformed response that should be rejected by the Zod schema */
class MockMalformedClient implements IVerificationClient {
  async verify(): Promise<unknown> {
    return { status: "WRONG_STATUS", confidence: "NOT_A_NUMBER" };
  }
}

/** Simulates an API network failure */
class MockFailingClient implements IVerificationClient {
  async verify(): Promise<unknown> {
    throw new Error("Network timeout");
  }
}

async function runTests(): Promise<void> {
  let passed = 0;
  let failed = 0;

  // ── Test 1: Valid data passes Zod validation ──
  try {
    const service = new VerificationService(new MockValidClient());
    const result = await service.performVerification("fake-image-data");
    assert(result.status === "VALID", 'Expected status "VALID"');
    assert(result.confidence === 95, "Expected confidence 95");
    assert(result.details.name === "John Doe", 'Expected name "John Doe"');
    console.log("✅ Test 1 Passed: Valid data handled correctly.");
    passed++;
  } catch (e) {
    console.error("❌ Test 1 Failed:", e);
    failed++;
  }

  // ── Test 2: Malformed data is rejected by Zod schema ──
  try {
    const badService = new VerificationService(new MockMalformedClient());
    await badService.performVerification("fake-image-data");
    console.error("❌ Test 2 Failed: Should have thrown for malformed data.");
    failed++;
  } catch {
    console.log("✅ Test 2 Passed: Malformed API response caught by Zod.");
    passed++;
  }

  // ── Test 3: Network errors propagate correctly ──
  try {
    const failService = new VerificationService(new MockFailingClient());
    await failService.performVerification("fake-image-data");
    console.error("❌ Test 3 Failed: Should have thrown for network error.");
    failed++;
  } catch (e) {
    const isExpected = e instanceof Error && e.message === "Network timeout";
    if (isExpected) {
      console.log("✅ Test 3 Passed: Network error propagated correctly.");
      passed++;
    } else {
      console.error("❌ Test 3 Failed: Unexpected error type:", e);
      failed++;
    }
  }

  // ── Test 4: Missing required image throws ──
  try {
    const service = new VerificationService(new MockValidClient());
    await service.performVerification("");
    console.error("❌ Test 4 Failed: Should have thrown for empty image input.");
    failed++;
  } catch {
    console.log("✅ Test 4 Passed: Empty image input rejected.");
    passed++;
  }

  // ── Summary ──
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed out of ${passed + failed} tests.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
