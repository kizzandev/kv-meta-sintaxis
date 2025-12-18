import { MetaNode, MetaExpr, MetaRule } from "@/types/ast";

/**
 * Handles terminal rendering: strips quotes but leaves ALL CAPS words as is.
 */
function renderTerminal(val: string): string {
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    return val.substring(1, val.length - 1);
  }
  return val;
}

export function generatePseudoCode(rules: MetaNode[]): string {
  const ruleMap = new Map<string, MetaExpr>();
  for (const node of rules) {
    if (node.type === "Rule") {
      ruleMap.set(node.name, node.expr);
    }
  }

  const startRule = (rules.find((r) => r.type === "Rule") as MetaRule)?.name ?? "";
  if (!startRule) return "/* No rules defined yet */";

  // Complexity cache to avoid infinite loops and find "atomic" paths
  const complexityCache = new Map<string, number>();
  const visitedForComplexity = new Set<string>();

  function getComplexity(expr: MetaExpr): number {
    switch (expr.type) {
      case "Terminal":
        return 1;
      case "NonTerminal": {
        if (visitedForComplexity.has(expr.name)) return 1000;
        if (complexityCache.has(expr.name)) return complexityCache.get(expr.name)!;
        
        const target = ruleMap.get(expr.name);
        if (!target) return 1;
        
        visitedForComplexity.add(expr.name);
        const res = 1 + getComplexity(target);
        visitedForComplexity.delete(expr.name);
        
        complexityCache.set(expr.name, res);
        return res;
      }
      case "Sequence":
        return expr.items.reduce((acc, i) => acc + getComplexity(i), 0);
      case "Alternative":
        return Math.min(...expr.options.map(getComplexity));
      case "Optional":
      case "Repetition":
        return 0; // Can be empty
      case "Group":
        return getComplexity(expr.body);
      default:
        return 1;
    }
  }

  // Find the fastest path to terminals
  function getShortest(expr: MetaExpr, rulePath: string[] = []): string {
    switch (expr.type) {
      case "Terminal":
        return renderTerminal(expr.value);
      
      case "NonTerminal": {
        if (rulePath.includes(expr.name)) return ""; // Break cycles
        const target = ruleMap.get(expr.name);
        if (!target) return expr.name;
        return getShortest(target, [...rulePath, expr.name]);
      }
      
      case "Sequence":
        return expr.items.map(i => getShortest(i, rulePath)).filter(Boolean).join(" ");
      
      case "Alternative": {
        let best = "";
        let minComp = Infinity;
        for (const opt of expr.options) {
          const comp = getComplexity(opt);
          if (comp < minComp) {
            minComp = comp;
            best = getShortest(opt, rulePath);
          }
        }
        return best;
      }
      
      case "Optional":
      case "Repetition":
        return "";
      
      case "Group":
        return getShortest(expr.body, rulePath);
      
      default:
        return "";
    }
  }

  const visitedCount = new Map<string, number>();

  function generate(expr: MetaExpr, depth = 0): string {
    // Hard depth limit: switch to shortest path immediately
    if (depth > 8) {
      return getShortest(expr);
    }

    switch (expr.type) {
      case "Terminal":
        return renderTerminal(expr.value);

      case "NonTerminal": {
        const rule = ruleMap.get(expr.name);
        if (!rule) return expr.name;

        const count = visitedCount.get(expr.name) ?? 0;
        // Dampen recursion effectively
        if (count >= 1 && depth > 4) {
          return getShortest({ type: "NonTerminal", name: expr.name });
        }

        visitedCount.set(expr.name, count + 1);
        const res = generate(rule, depth + 1);
        visitedCount.set(expr.name, count);
        return res;
      }

      case "Sequence":
        return expr.items.map((i) => generate(i, depth + 1)).filter(Boolean).join(" ");

      case "Alternative": {
        if (expr.options.length === 0) return "";
        
        // As we get deeper, weight shorter paths more heavily
        const weightedOptions = expr.options.map(opt => ({
          opt,
          comp: getComplexity(opt)
        }));

        // Sort by complexity so we can bias
        weightedOptions.sort((a, b) => a.comp - b.comp);

        // Selection strategy: earlier index more likely as depth increases
        const bias = Math.min(depth / 10, 0.8); // 0.0 to 0.8
        let index = 0;
        if (Math.random() > (1 - bias)) {
          // Favor the simpler (beginning of sorted list)
          index = 0;
        } else {
          index = Math.floor(Math.random() * weightedOptions.length);
        }

        return generate(weightedOptions[index].opt, depth + 1);
      }

      case "Group":
        return generate(expr.body, depth + 1);

      case "Optional":
        return Math.random() < 0.3 ? generate(expr.body, depth + 1) : "";

      case "Repetition": {
        // High decay: mostly 0 or 1, rarely 2
        const rand = Math.random();
        let times = 0;
        if (depth < 5) {
          if (rand < 0.6) times = 0;
          else if (rand < 0.9) times = 1;
          else times = 2;
        } else {
          times = rand < 0.9 ? 0 : 1;
        }

        const parts: string[] = [];
        for (let i = 0; i < times; i++) {
          const res = generate(expr.body, depth + 1);
          if (res) parts.push(res);
        }
        return parts.join(" ");
      }

      default:
        return "";
    }
  }

  const examples: string[] = [];
  for (let i = 0; i < 10; i++) {
    visitedCount.clear();
    const result = generate({ type: "NonTerminal", name: startRule })
      .replace(/\s+/g, " ")
      .trim();
    
    if (result && !examples.includes(result)) {
      examples.push(result);
    }
  }

  if (examples.length === 0) return "/* No valid examples could be produced */";

  return examples
    .map((ex, i) => `// Example ${i + 1}\n${ex}`)
    .join("\n\n");
}
