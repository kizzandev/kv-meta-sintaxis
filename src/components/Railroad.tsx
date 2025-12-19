"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import rr from "@/lib/thirdparty/railroad";
import "@/lib/thirdparty/railroad.css";
import { parseMetaSyntax } from "@/lib/parser";
import { useStore } from "@/hooks/useStore";
import type { MetaExpr, MetaNode } from "@/types/ast";
import Modal from "@/components/Modal";

function RuleDiagram({ rule, ruleMap, expand = false }: { rule: { name: string, expr: MetaExpr }, ruleMap: Map<string, MetaExpr>, expand?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const visited = useRef(new Set<string>());

  useEffect(() => {
    if (!containerRef.current) return;
    visited.current.clear();

    function renderExpr(expr: MetaExpr): any {
      switch (expr.type) {
        case "Terminal":
          return rr.Terminal(expr.value);
        case "NonTerminal": {
          if (!expand) return rr.NonTerminal(expr.name);
          
          const target = ruleMap.get(expr.name);
          if (!target) return rr.NonTerminal(expr.name);
          if (visited.current.has(expr.name)) return rr.NonTerminal(expr.name + " ⟳");
          
          visited.current.add(expr.name);
          const expanded = renderExpr(target);
          return rr.Stack(rr.Comment(expr.name), expanded);
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

    try {
      const diagram = rr.Diagram(renderExpr(rule.expr)).toString();
      containerRef.current.innerHTML = diagram;
    } catch (err) {
      containerRef.current.innerHTML = "<div class='text-red-400 text-xs text-center p-4'>Failed to render</div>";
    }
  }, [rule, ruleMap, expand]);

  return (
    <div className="group flex flex-col gap-3 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-[#A897DC]/30 transition-all duration-300">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#75AADB] px-2 py-0.5 rounded bg-[#75AADB]/10 border border-[#75AADB]/20">
          {rule.name}
        </span>
      </div>
      <div ref={containerRef} className="railroad-container overflow-x-auto py-2 scrollbar-none" />
    </div>
  );
}

export default function Railroad() {
  const { code } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { ast, ruleMap } = useMemo(() => {
    try {
      const parsedAst = parseMetaSyntax(code) as MetaNode[];
      const map = new Map<string, MetaExpr>();
      const rules: { name: string; expr: MetaExpr }[] = [];

      for (const node of parsedAst) {
        if (node.type === "Rule") {
          map.set(node.name, node.expr);
          rules.push({ name: node.name, expr: node.expr });
        }
      }
      return { ast: rules, ruleMap: map };
    } catch (err) {
      return { ast: [], ruleMap: new Map<string, MetaExpr>() };
    }
  }, [code]);

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between gap-2 md:gap-4 flex-shrink-0">
        <div className="hidden sm:block">
          <h3 className="text-sm font-bold text-gray-200">{"Grammar Rules"}</h3>
          <p className="text-[11px] text-gray-500 uppercase tracking-widest font-medium">{"Individual definitions"}</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={ast.length === 0}
          className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 md:px-4 py-2 rounded-xl bg-[#75AADB] hover:bg-[#75AADB]/90 disabled:opacity-50 disabled:cursor-not-allowed text-[#101010] text-xs font-black transition-all shadow-lg shadow-[#75AADB]/20 active:scale-95 whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
          <span>{"Full Diagram"}</span>
        </button>
      </div>

      <div className="flex-1 overflow-auto scrollbar pr-2">
        <div className="flex flex-col gap-4 pb-4">
          {ast.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-gray-500 italic text-sm">
              {"No rules to display. Defined syntax will appear here."}
            </div>
          ) : (
            ast.map((rule) => (
              <RuleDiagram key={rule.name} rule={rule} ruleMap={ruleMap} />
            ))
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Full Grammar Diagram"
        className="max-w-7xl"
      >
        <div className="p-4 bg-[#101010]/50 rounded-2xl border border-white/5">
          {ast.length > 0 && (
            <RuleDiagram rule={ast[0]} ruleMap={ruleMap} expand={true} />
          )}
        </div>
      </Modal>

      <style dangerouslySetInnerHTML={{ __html: `
        .railroad-container svg.railroad-diagram {
          background-color: transparent !important;
          margin: 0 auto;
        }
        .railroad-container svg.railroad-diagram path {
          stroke: #75AADB !important;
          stroke-width: 2 !important;
        }
        .railroad-container svg.railroad-diagram text {
          fill: #F5F5F5 !important;
          font-family: var(--font-geist-mono), monospace !important;
          font-size: 13px !important;
          font-weight: 500 !important;
        }
        .railroad-container svg.railroad-diagram rect {
          stroke: #75AADB !important;
          fill: #1A1A1A !important;
          stroke-width: 2 !important;
          rx: 10 !important;
        }
        .railroad-container svg.railroad-diagram g.non-terminal rect {
          fill: #24283b !important;
          stroke: #A897DC !important;
        }
        .railroad-container svg.railroad-diagram text.comment {
          fill: #6272A4 !important;
          font-style: italic !important;
          font-size: 11px !important;
        }
        .railroad-container svg.railroad-diagram rect.group-box {
          stroke: #44475A !important;
          stroke-dasharray: 4 4 !important;
          fill: rgba(255, 255, 255, 0.02) !important;
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
