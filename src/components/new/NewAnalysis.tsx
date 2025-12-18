"use client";

import { useMemo } from "react";
import { useStore } from "@/hooks/useStore";
import { parseMetaSyntax } from "@/lib/parser";
import { buildRuleGraph } from "@/lib/graph";
import { analyzeGraph } from "@/lib/analyzer";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export default function NewAnalysis() {
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
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow-lg shadow-red-500/10">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-red-100">Syntax Error Detected</h2>
          <p className="text-red-400/80 font-mono text-sm max-w-md bg-red-500/5 p-4 rounded-xl border border-red-500/10">
            {analysis.error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full pb-10">
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
        <AnalysisCard
          title="Undefined Rules"
          subtitle="Rules referenced but never defined"
          items={analysis.undefinedRules}
          status="danger"
          icon="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
        <AnalysisCard
          title="Unreachable Rules"
          subtitle="Rules not used by the entry point"
          items={analysis.unreachableRules}
          status="neutral"
          icon="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
        />
        <AnalysisCard
          title="Cyclic Dependencies"
          subtitle="Circular rule references found"
          items={analysis.cyclicRules}
          status="warning"
          icon="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
        <AnalysisCard
          title="Recursive Rules"
          subtitle="Rules that reference themselves"
          items={analysis.recursiveRules}
          status="info"
          icon="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
        />
      </div>
    </div>
  );
}

function AnalysisCard({
  title,
  subtitle,
  items,
  status,
  icon,
}: {
  title: string;
  subtitle: string;
  items: string[];
  status: "danger" | "warning" | "info" | "neutral";
  icon: string;
}) {
  const themes = {
    danger: {
      card: "border-red-500/20 bg-red-500/5 hover:border-red-500/40",
      icon: "text-red-400 bg-red-400/10 border-red-400/20",
      badge: "bg-red-400/10 text-red-300 border-red-400/20",
      item: "text-red-100 bg-red-400/5 border-red-400/10 hover:bg-red-400/10",
    },
    warning: {
      card: "border-orange-500/20 bg-orange-500/5 hover:border-orange-500/40",
      icon: "text-orange-400 bg-orange-400/10 border-orange-400/20",
      badge: "bg-orange-400/10 text-orange-300 border-orange-400/20",
      item: "text-orange-100 bg-orange-400/5 border-orange-400/10 hover:bg-orange-400/10",
    },
    info: {
      card: "border-[#75AADB]/30 bg-[#75AADB]/5 hover:border-[#75AADB]/50",
      icon: "text-[#75AADB] bg-[#75AADB]/10 border-[#75AADB]/20",
      badge: "bg-[#75AADB]/10 text-[#75AADB] border-[#75AADB]/20",
      item: "text-[#F5F5F5] bg-[#75AADB]/5 border-[#75AADB]/10 hover:bg-[#75AADB]/10",
    },
    neutral: {
      card: "border-gray-500/20 bg-gray-500/5 hover:border-gray-500/40",
      icon: "text-gray-400 bg-gray-400/10 border-gray-400/20",
      badge: "bg-gray-400/10 text-gray-300 border-gray-400/20",
      item: "text-gray-100 bg-gray-400/5 border-gray-400/10 hover:bg-gray-400/10",
    },
  };

  const theme = themes[status];

  return (
    <motion.div
      className={cn(
        "p-6 rounded-3xl border transition-all duration-500 shadow-xl",
        theme.card
      )}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className={cn("p-2.5 rounded-2xl border flex-shrink-0", theme.icon)}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-lg text-[#F5F5F5] leading-tight truncate">
              {title}
            </h3>
            <p className="text-xs text-gray-500 font-medium truncate">
              {subtitle}
            </p>
          </div>
        </div>
        {items.length > 0 && (
          <span className={cn("text-[11px] font-black px-3 py-1 rounded-full border tracking-wider flex-shrink-0", theme.badge)}>
            {items.length}
          </span>
        )}
      </div>
      
      <div className="min-h-[60px] flex flex-col justify-center">
        {items.length === 0 ? (
          <div className="flex items-center gap-3 py-3 px-4 rounded-2xl bg-white/5 border border-white/5 w-fit">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{"Validated"}</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            {items.map((item) => (
              <motion.span
                key={item}
                whileHover={{ scale: 1.05 }}
                className={cn(
                  "px-4 py-2 rounded-xl border text-sm font-mono transition-all duration-300 cursor-default shadow-sm",
                  theme.item
                )}
              >
                {item}
              </motion.span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
