"use client";

import { useMemo } from "react";

import { useStore } from "@/hooks/useStore";
import { parseMetaSyntax } from "@/lib/parser";
import { buildRuleGraph } from "@/lib/graph";
import { analyzeGraph } from "@/lib/analyzer";

export default function Analysis() {
  const { code } = useStore();

  const analysis = useMemo(() => {
    try {
      const ast = parseMetaSyntax(code);
      const graph = buildRuleGraph(ast);
      return analyzeGraph(graph);
    } catch (err: any) {
      return { error: err.message };
    }
  }, [code]);

  if ("error" in analysis) {
    return <div className="p-4 text-red-500">Error: {analysis.error}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">🧮 Analysis Results</h1>

      <ResultSection
        title="Undefined Rules"
        items={analysis.undefinedRules}
        color="text-red-500"
      />
      <ResultSection
        title="Unreachable Rules"
        items={analysis.unreachableRules}
        color="text-gray-400"
      />
      <ResultSection
        title="Cyclic Rules"
        items={analysis.cyclicRules}
        color="text-orange-500"
      />
      <ResultSection
        title="Recursive Rules"
        items={analysis.recursiveRules}
        color="text-yellow-400"
      />
    </div>
  );
}

function ResultSection({
  title,
  items,
  color,
}: {
  title: string;
  items: string[];
  color: string;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold">{title}</h2>
      {items.length === 0 ? (
        <p className="text-zinc-500">✅ None</p>
      ) : (
        <ul className={`list-disc pl-6 ${color}`}>
          {items.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
