import { MetaNode, MetaExpr } from "@/types/ast";
import { RuleGraph } from "@/types/graph";

export function buildRuleGraph(rules: MetaNode[]): RuleGraph {
  const nodes: Record<
    string,
    { type: "rule" | "terminal"; refs: Set<string> }
  > = {};

  // Collect definitions
  for (const r of rules) {
    if (r.type === "Rule") nodes[r.name] = { type: "rule", refs: new Set() };
  }

  function collect(expr: MetaExpr, refs: Set<string>) {
    switch (expr.type) {
      case "NonTerminal":
        refs.add(expr.name);
        break;
      case "Alternative":
        expr.options.forEach((opt) => collect(opt, refs));
        break;
      case "Sequence":
        expr.items.forEach((it) => collect(it, refs));
        break;
      case "Repetition":
      case "Optional":
      case "Group":
        collect(expr.body, refs);
        break;
    }
  }

  // Walk through rules
  for (const rule of rules) {
    if (rule.type !== "Rule") continue;
    collect(rule.expr, nodes[rule.name].refs);
  }

  const edges: { from: string; to: string }[] = [];
  for (const [from, node] of Object.entries(nodes)) {
    node.refs.forEach((to) => {
      edges.push({ from, to });
    });
  }

  return {
    nodes: Object.entries(nodes).map(([id, n]) => ({
      id,
      type: n.type,
      references: Array.from(n.refs),
    })),
    edges,
  };
}
