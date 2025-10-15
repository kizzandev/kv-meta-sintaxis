"use client";

import { useEffect, useRef } from "react";

import rr from "@/lib/thirdparty/railroad";
import "@/lib/thirdparty/railroad.css";

import { parseMetaSyntax } from "@/lib/parser";
import { useStore } from "@/hooks/useStore";

import type { MetaExpr, MetaNode } from "@/types/ast";

export default function Railroad() {
  const svgRef = useRef<HTMLDivElement>(null);
  const { code } = useStore();
  let cicle = 0;

  useEffect(() => {
    if (!svgRef.current) return;

    const ast = parseMetaSyntax(code) as MetaNode[];

    if (!ast?.length) {
      svgRef.current.innerHTML =
        "<p class='text-zinc-400 text-sm p-4'>No rules to display</p>";
      return;
    }

    // Build a map of rule names → expressions
    const ruleMap = new Map<string, MetaExpr>();
    for (const node of ast) {
      if (node.type === "Rule") ruleMap.set(node.name, node.expr);
    }

    // Keep track of visited rules to avoid infinite recursion
    const visited = new Set<string>();

    // --- Recursive renderer ---
    function renderExpr(expr: MetaExpr): any {
      switch (expr.type) {
        case "Terminal":
          return rr.Terminal(expr.value);
        case "NonTerminal": {
          const target = ruleMap.get(expr.name);
          if (!target) return rr.NonTerminal(expr.name);

          // Detect recursive cycles
          if (visited.has(expr.name)) {
            return rr.NonTerminal(expr.name + " ⟳");
          }

          visited.add(expr.name);
          const expanded = renderExpr(target);

          // return rr.Sequence(rr.Comment(expr.name), expanded);
          // return rr.Stack(rr.Comment(expr.name), expanded);

          if (cicle % 5 == 0) {
            // return rr.Group(rr.Stack(rr.Comment(expr.name), expanded));
            return rr.Stack(rr.Comment(expr.name), expanded);
          }

          return rr.Group(rr.Sequence(rr.Comment(expr.name), expanded));
        }
        case "Sequence":
          return rr.Sequence(...expr.items.map(renderExpr));
        case "Alternative":
          return rr.Choice(0, ...expr.options.map(renderExpr));
        case "Repetition":
          return rr.ZeroOrMore(renderExpr(expr.body));
        case "Optional":
          return rr.Optional(renderExpr(expr.body));
        case "Group":
          return rr.Group(renderExpr(expr.body));
        default:
          return rr.Terminal("?");
      }
    }

    // Entry point: first rule in the list
    const entry = ast.find((n) => n.type === "Rule");
    if (!entry) return;

    const diagram = rr.Diagram(renderExpr(entry.expr)).toString();

    svgRef.current.innerHTML = `
      <div class="text-zinc-200 font-semibold text-sm tracking-wide mb-4">
        ${entry.name.at(0)?.toUpperCase() + entry.name.slice(1).toLowerCase()}
        <small class="text-zinc-400 text-xs tracking-wide mb-4">${"— Updating the code here may break the site, please update your code on the Analyze tab."}<br/>${"Contributions welcomed!"}</small>
      </div>
      ${diagram}
    `;
  }, [code]);

  return (
    <div
      ref={svgRef}
      className="scrollbar h-full w-full overflow-auto rounded-lg bg-zinc-950 p-4 shadow-inner"
    />
  );
}
