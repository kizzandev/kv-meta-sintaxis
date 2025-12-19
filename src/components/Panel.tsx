"use client";

import { useEditorTab } from "@/hooks/useStore";
import { motion, AnimatePresence } from "motion/react";
import Analysis from "./Analysis";
import Railroad from "./Railroad";
import Generator from "./Generator";
import HowTo from "./HowTo";
import Debug from "@/components/Debug";

export default function Panel() {
  const { tab } = useEditorTab();

  return (
    <div className="h-full w-full bg-[#101010]/40 rounded-2xl border border-white/10 backdrop-blur-xl overflow-hidden flex flex-col shadow-2xl z-50">
      <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-200 capitalize tracking-widest">
          {tab === "howto" ? "Documentation" : tab === "none" ? "Preview" : tab}
        </h2>
      </div>
      
      <div className="flex-1 overflow-hidden p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="h-full overflow-auto scrollbar pr-2"
          >
            {tab === "howto" ? (
              <HowTo />
            ) : tab === "analysis" ? (
              <Analysis />
            ) : tab === "railroad" ? (
              <Railroad />
            ) : tab === "generator" ? (
              <Generator />
            ) : tab === "debug" && process.env.NODE_ENV === "development" ? (
              <Debug />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4">
                <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center animate-pulse">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <p className="text-xs uppercase tracking-widest font-medium opacity-50 text-gray-400">{"Select a module to begin"}</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
