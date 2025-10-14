"use client";
import { useState } from "react";
import { parseMetaSyntax } from "@/lib/parser";
import { buildRuleGraph } from "@/lib/graph";

export default function Debug() {
  const [code, setCode] = useState(`programa : declaración { declaración }
declaración : usar_decl | fn_decl
usar_decl : "usar" id ";"
fn_decl : "fn" id ";"
id : "a" | "b" | "c"`);

  let astOutput = "";
  let graphOutput = "";

  try {
    const ast = parseMetaSyntax(code);
    const graph = buildRuleGraph(ast);
    astOutput = JSON.stringify(ast, null, 2);
    graphOutput = JSON.stringify(graph, null, 2);
  } catch (e: any) {
    astOutput = `Error: ${e.message}`;
  }

  return (
    <div className="h-full w-full space-y-4 overflow-hidden p-6">
      <h1 className="text-2xl font-bold">🧩 Meta-Syntax Debug</h1>
      <textarea
        className="h-40 w-full rounded border bg-zinc-950 p-2 text-zinc-50"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <div className="grid h-full grid-cols-2 gap-4 overflow-hidden">
        <div className="h-full">
          <h2 className="mb-2 text-lg font-semibold">AST</h2>
          <pre className="h-full max-h-[400px] overflow-auto rounded bg-zinc-900 p-2 text-sm text-zinc-100">
            {astOutput}
          </pre>
        </div>
        <div className="h-full">
          <h2 className="mb-2 text-lg font-semibold">Graph</h2>
          <pre className="h-full max-h-[400px] overflow-auto rounded bg-zinc-900 p-2 text-sm text-zinc-100">
            {graphOutput}
          </pre>
        </div>
      </div>
    </div>
  );
}
