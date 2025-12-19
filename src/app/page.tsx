"use client";

import Sidebar from "@/components/Sidebar";
import Editor from "@/components/Editor";
import Panel from "@/components/Panel";
import { motion } from "motion/react";

export default function DesignPage() {
  return (
    <div className="relative flex flex-col h-screen w-full overflow-hidden bg-[#101010] text-[#F5F5F5]">
      <header className="h-14 md:h-16 flex items-center justify-between px-4 md:px-8 border-b border-white/5 bg-[#101010]/40 backdrop-blur-md z-50 flex-shrink-0">
        <div className="flex items-center gap-2 md:gap-4">
          <h1 className="text-lg md:text-xl font-black text-[#F5F5F5] tracking-tighter uppercase whitespace-nowrap">
            {"KV META"} <span className="text-[#75AADB]">{"SINTAXIS"}</span>
          </h1>
          <div className="hidden md:block h-4 w-[1px] bg-white/10" />
          <span className="hidden md:block text-[10px] uppercase tracking-[0.3em] font-bold text-gray-500">
            {"Grammar Designer"}
          </span>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="hidden sm:block px-3 py-1.5 bg-white/5 border border-white/5 backdrop-blur-md rounded-full text-gray-400 text-[10px] font-bold tracking-tight shadow-xl"
          >
            {"V 1.0.0"}
          </motion.div>
          <a
            href="https://github.com/kvzidev/kv-meta-sintaxis"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all text-gray-400 hover:text-white"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span className="hidden md:inline text-[10px] font-bold tracking-tight">{"GITHUB"}</span>
          </a>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden pb-16 md:pb-0">
        <motion.aside
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="z-40 order-2 md:order-1 flex-shrink-0"
        >
          <Sidebar />
        </motion.aside>

        <main className="flex-1 flex flex-col xl:flex-row gap-4 p-4 md:p-6 overflow-x-hidden xl:overflow-y-hidden z-10 order-1 md:order-2 h-full">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 lg:flex-[1.4] min-w-0 h-[45%] lg:h-full"
          >
            <Editor />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 min-w-0 h-[55%] lg:h-full"
          >
            <Panel />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
