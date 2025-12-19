"use client";

import { useMemo, useState } from "react";
import { generatePseudoCode } from "@/lib/generator";
import { parseMetaSyntax } from "@/lib/parser";
import { useStore } from "@/hooks/useStore";
import { motion } from "motion/react";
import { SIMPLE_EXAMPLE, COMPLEX_EXAMPLE } from "@/lib/examples";

export default function Generator() {
  const { code, setCode } = useStore();
  const [version, setVersion] = useState(0);

  const pseudoCode = useMemo(() => {
    try {
      const ast = parseMetaSyntax(code);
      return generatePseudoCode(ast);
    } catch (err: any) {
      return null;
    }
  }, [code, version]);

  const handleRegenerate = () => setVersion((v) => v + 1);

  if (!pseudoCode) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4">
        <div className="w-12 h-12 rounded-full border border-red-500/20 flex items-center justify-center text-red-500/50">
           <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
           </svg>
        </div>
        <p className="italic text-sm">{"Fix syntax errors to generate pseudo-code"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="flex flex-col">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#F5F5F5]/60">
            {"Generated Logic"}
          </h3>
          <p className="text-[10px] text-gray-500 font-medium">{"Randomized examples based on rules"}</p>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {process.env.NODE_ENV === "development" && (
            <div className="flex gap-1 mr-1 pr-2 border-r border-white/5 flex-shrink-0">
              <button
                onClick={() => setCode(SIMPLE_EXAMPLE)}
                className="text-[10px] px-2 py-1 bg-white/5 hover:bg-white/10 rounded border border-white/10 transition-colors text-gray-400 hover:text-[#F5F5F5]"
              >
                {"Simple"}
              </button>
              <button
                onClick={() => setCode(COMPLEX_EXAMPLE)}
                className="text-[10px] px-2 py-1 bg-[#A897DC]/10 hover:bg-[#A897DC]/20 rounded border border-[#A897DC]/20 transition-colors text-[#A897DC] hover:text-[#A897DC]"
              >
                {"Complex"}
              </button>
            </div>
          )}
          <button
            onClick={handleRegenerate}
            className="group flex items-center gap-1.5 text-[10px] px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded border border-white/10 transition-all text-slate-300 active:scale-95 flex-shrink-0"
          >
            <svg className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="hidden sm:inline">Regenerate</span>
          </button>
          <button 
            onClick={() => navigator.clipboard.writeText(pseudoCode)}
            className="text-[10px] px-2.5 py-1 bg-[#75AADB] hover:bg-[#75AADB]/80 rounded border border-[#75AADB] transition-colors text-[#101010] font-bold flex-shrink-0"
          >
            {"Copy"}
          </button>
        </div>
      </div>
      <motion.div 
        key={version}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 scrollbar overflow-auto bg-[#101010]/60 rounded-xl border border-white/5 p-4 font-mono text-[13px] leading-relaxed text-[#F5F5F5]/90"
      >
        <pre className="whitespace-pre-wrap">{pseudoCode}</pre>
      </motion.div>
    </div>
  );
}
