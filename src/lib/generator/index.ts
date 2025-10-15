import { MetaNode, MetaExpr, MetaRule } from "@/types/ast";

export function generatePseudoCode(rules: MetaNode[]): string {
  const ruleMap = new Map<string, MetaExpr>();
  for (const node of rules) {
    if (node.type === "Rule") ruleMap.set(node.name, node.expr);
  }

  const visited = new Map<string, number>();

  function generate(expr: MetaExpr, depth = 0): string {
    if (depth > 20) return "";

    switch (expr.type) {
      case "Terminal": {
        const val = expr.value;
        // return val;
        if (!val.trim()) return "";
        if (/^[><=&|]+$/.test(val)) return "";
        return val;
      }

      case "NonTerminal": {
        const rule = ruleMap.get(expr.name);
        if (!rule) return "";

        const count = visited.get(expr.name) ?? 0;
        if (count > 2) return "";

        visited.set(expr.name, count + 1);
        const res = generate(rule, depth + 1);
        visited.set(expr.name, count);
        return res;
      }

      case "Sequence":
        return expr.items.map((i) => generate(i, depth + 1)).join(" ");

      case "Alternative": {
        if (expr.options.length === 0) return "";

        const opt =
          expr.options[Math.floor(Math.random() * expr.options.length)];
        return generate(opt, depth + 1);
      }

      case "Group":
        return generate(expr.body, depth + 1);

      case "Optional":
        return Math.random() < 0.5 ? generate(expr.body, depth + 1) : "";

      case "Repetition": {
        const times = Math.floor(Math.random() * 3);
        let res = "";
        for (let i = 0; i < times; i++) {
          res += (res ? " " : "") + generate(expr.body, depth + 1);
        }
        return res;
      }

      default:
        return "";
    }
  }

  const start = (rules.find((r) => r.type === "Rule") as MetaRule)?.name ?? "";
  if (!start) throw new Error("No start rule found.");

  return generate({ type: "NonTerminal", name: start })
    .trim()
    .replace(/\s+/g, " ");
}
