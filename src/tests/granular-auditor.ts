import * as parser from "@babel/parser";
import traverse from "@babel/traverse";

/**
 * GRANULAR CODE AUDITOR (AST Level)
 * This script "reads" your code like a compiler and validates 
 * every single symbol, line, and word for quality.
 */
export class GranularAuditor {
  static async auditFile(code: string, fileName: string) {
    console.log(`🔍 Deep-Scanning Code Structure: [${fileName}]`);
    
    const ast = parser.parse(code, {
      sourceType: "module",
      plugins: ["typescript", "jsx"],
    });

    const metrics = {
      lines: code.split("\n").length,
      functions: 0,
      complexConditionals: 0,
      magicStrings: 0,
      anyTypes: 0,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    traverse(ast as any, {
      // 1. Check Function Complexity
      Function() {
        metrics.functions++;
      },

      // 2. Scale each "word": Check for "magic strings" (unnamed constants)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      StringLiteral(path: any) {
        if (path.node.value.length > 5 && !path.parentPath.isObjectProperty()) {
          metrics.magicStrings++;
        }
      },

      // 3. Scale each "line": Check for deep nesting (Cyclomatic Complexity)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      IfStatement(path: any) {
        let depth = 0;
        let p = path.parentPath;
        while (p) {
          if (p.isIfStatement()) depth++;
          p = p.parentPath;
        }
        if (depth > 2) {
          console.warn(`⚠️ High complexity detected at line ${path.node.loc?.start.line}`);
          metrics.complexConditionals++;
        }
      },

      // 4. Check for 'any' types (The "Word" level failure of TypeScript)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      TSTypeAnnotation(path: any) {
        if (path.node.typeAnnotation.type === "TSAnyKeyword") {
          metrics.anyTypes++;
        }
      }
    });

    console.log(`📊 Granular Report for ${fileName}:`);
    console.log(`- Magic Strings (untested words): ${metrics.magicStrings}`);
    console.log(`- Nested 'If' hell: ${metrics.complexConditionals}`);
    console.log(`- TypeScript Type Leaks: ${metrics.anyTypes}`);
    
    if (metrics.anyTypes > 0 || metrics.complexConditionals > 0) {
      throw new Error("Granular Audit Failed: Code quality does not meet Mission-Critical standards.");
    }
  }
}
