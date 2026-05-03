/**
 * STRYKER MUTATION TESTING CONFIGURATION
 * This is the ultimate "Test of Tests". It takes your code, 
 * changes a '+' to a '-', or a '>' to a '<' on EVERY LINE, 
 * then runs your tests. If your tests still pass, it means your 
 * code has "Surviving Mutants" (untested logic).
 */
export const strykerConfig = {
  packageManager: "npm",
  reporters: ["html", "clear-text", "progress"],
  testRunner: "vitest",
  coverageAnalysis: "perTest",
  mutationRange: [
    { start: { line: 1, column: 0 }, end: { line: 1000, column: 0 } }
  ],
  thresholds: { high: 95, low: 80, break: 70 }, // Fail build if <70% mutants killed
  mutators: {
    // We target every single operator and word in the code
    arithmeticOperator: true,
    booleanLiteral: true,
    conditionalBoundary: true,
    equalityOperator: true,
    logicalOperator: true,
    stringLiteral: true,
  }
};
