import { AnalysisResult } from "@/types/analysis";
import { RuleGraph } from "@/types/graph";

/**
 * Analyze the given dependency graph for potential issues.
 */
export function analyzeGraph(graph: RuleGraph): AnalysisResult {
  const allIds = new Set(graph.nodes.map((n) => n.id));

  const undefinedRules = new Set<string>();
  for (const node of graph.nodes) {
    for (const ref of node.references) {
      if (!allIds.has(ref)) {
        undefinedRules.add(ref);
      }
    }
  }

  // --- Unreachable Rules ---
  const entry = graph.nodes[0]?.id;
  const reachable = new Set<string>();

  if (entry) {
    const stack = [entry];
    while (stack.length > 0) {
      const current = stack.pop()!;
      if (reachable.has(current)) continue;
      reachable.add(current);
      const node = graph.nodes.find((n) => n.id === current);
      if (!node) continue;
      for (const ref of node.references) {
        if (!reachable.has(ref) && allIds.has(ref)) {
          stack.push(ref);
        }
      }
    }
  }

  const unreachableRules = Array.from(allIds).filter(
    (id) => !reachable.has(id)
  );

  // --- Cyclic & Recursive Rules ---
  const visited = new Set<string>();
  const stack = new Set<string>();
  const cyclicRules = new Set<string>();
  const recursiveRules = new Set<string>();

  function dfs(nodeId: string) {
    if (stack.has(nodeId)) {
      cyclicRules.add(nodeId);
      return;
    }
    if (visited.has(nodeId)) return;

    visited.add(nodeId);
    stack.add(nodeId);

    const node = graph.nodes.find((n) => n.id === nodeId);
    if (!node) return;

    for (const ref of node.references) {
      if (ref === nodeId) {
        recursiveRules.add(nodeId); // direct recursion
      }
      dfs(ref);
    }

    stack.delete(nodeId);
  }

  for (const node of graph.nodes) {
    dfs(node.id);
  }

  // Indirect recursion = part of cycles
  // for (const r of cyclicRules) recursiveRules.add(r);

  return {
    undefinedRules: Array.from(undefinedRules),
    unreachableRules,
    cyclicRules: Array.from(cyclicRules),
    recursiveRules: Array.from(recursiveRules),
  };
}
