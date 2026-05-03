import { GranularAuditor } from "./src/tests/granular-auditor";
import * as fs from "fs";

async function main() {
  const filePath = "src/services/VerificationService.ts";
  const code = fs.readFileSync(filePath, "utf-8");
  
  try {
    await GranularAuditor.auditFile(code, filePath);
    console.log("✅ Code Audit Passed!");
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error("❌ Code Audit Failed:", e.message);
    } else {
      console.error("❌ Code Audit Failed with unknown error.");
    }
    process.exit(1);
  }
}

main();
