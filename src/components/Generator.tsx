"use client";

import { useMemo } from "react";

import { generatePseudoCode } from "@/lib/generator";
import { parseMetaSyntax } from "@/lib/parser";

import { useStore } from "@/hooks/useStore";

export default function Generator() {
  const { code } = useStore();

  const pseudoCode = useMemo(() => {
    try {
      const ast = parseMetaSyntax(code);
      return generatePseudoCode(ast);
    } catch (err: any) {
      return err.message;
    }
  }, [code]);

  return (
    <div className="scrollbar h-full w-full overflow-auto bg-zinc-950 p-4 font-mono text-sm text-zinc-100">
      <pre>{pseudoCode}</pre>
    </div>
  );
}
