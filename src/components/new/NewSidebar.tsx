"use client";

import { useEditorTab, useStore } from "@/hooks/useStore";
import { Tab } from "@/types/tabs";
import { motion } from "motion/react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  {
    id: "howto",
    label: "How to",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    id: "analysis",
    label: "Analysis",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    id: "railroad",
    label: "Diagram",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A2 2 0 013 15.483V4a2 2 0 012.724-1.857L12 5l6.276-2.857A2 2 0 0121 4v11.483a2 2 0 01-1.276 1.857L15 20l-6 0z" />
      </svg>
    ),
  },
  {
    id: "generator",
    label: "Generator",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: "debug",
    label: "Debug",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function NewSidebar() {
  const { tab, setTab } = useEditorTab();
  const { code, setCode } = useStore();

  return (
    <div className="fixed bottom-0 left-0 right-0 md:relative md:bottom-auto md:left-auto md:right-auto flex flex-row md:flex-col items-center justify-around md:justify-start gap-2 md:gap-4 py-3 md:py-8 px-4 md:px-3 bg-[#101010]/95 md:bg-[#101010]/40 border-t md:border-t-0 md:border-r border-white/10 backdrop-blur-xl md:backdrop-blur-md h-auto md:h-full min-w-0 md:min-w-[72px] shadow-[0_-10px_20px_rgba(0,0,0,0.3)] md:shadow-none">
      <div className="flex flex-row md:flex-col gap-1 md:gap-2 w-full max-w-md md:max-w-none">
        {TABS.filter(t => t.id !== 'debug' || process.env.NODE_ENV === 'development').map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "group relative flex-1 md:flex-initial flex items-center justify-center p-3 md:p-3 rounded-xl transition-all duration-300 cursor-pointer",
              tab === t.id
                ? "bg-white/10 text-[#75AADB]"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            )}
          >
            {tab === t.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 md:bottom-auto md:left-0 w-6 md:w-1 h-1 md:h-6 bg-[#75AADB] rounded-t-full md:rounded-t-none md:rounded-r-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            {t.icon}

            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 md:mb-0 md:bottom-auto md:left-full md:translate-x-0 md:ml-4 pointer-events-none">
              <div
                className="px-3.5 py-2 bg-[#101010] border border-white/10 text-[#F5F5F5] text-md font-bold tracking-wide rounded-xl opacity-0 translate-y-2 md:translate-y-0 md:-translate-x-2 group-hover:opacity-100 group-hover:translate-y-0 md:group-hover:translate-x-0 transition-all duration-300 shadow-2xl backdrop-blur-md whitespace-nowrap z-[100]"
              >
                <div className="absolute left-1/2 md:left-0 top-full md:top-1/2 -translate-x-1/2 -translate-y-0 md:-translate-y-1/2 w-2 h-2 bg-[#101010] border-r md:border-r-0 md:border-l border-b border-white/10 rotate-45" />
                {t.label}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="md:mt-auto flex flex-row md:flex-col items-center gap-2 md:gap-4 flex-shrink-0">
        <input
          type="file"
          id="load-grammar"
          className="hidden"
          accept=".json"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
              try {
                const json = JSON.parse(event.target?.result as string);
                if (json.code) setCode(json.code);
              } catch (err) {
                console.error("Failed to parse JSON", err);
              }
            };
            reader.readAsText(file);
          }}
        />

        <button
          onClick={() => document.getElementById('load-grammar')?.click()}
          className="group relative flex items-center justify-center p-3 rounded-xl transition-all duration-300 text-gray-500 hover:bg-white/5 hover:text-white cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 md:mb-0 md:bottom-auto md:left-full md:translate-x-0 md:ml-4 pointer-events-none">
            <div className="px-3.5 py-2 bg-[#101010] border border-white/10 text-[#F5F5F5] text-md font-bold tracking-wide rounded-xl opacity-0 translate-y-2 md:translate-y-0 md:-translate-x-2 group-hover:opacity-100 group-hover:translate-y-0 md:group-hover:translate-x-0 transition-all duration-300 shadow-2xl backdrop-blur-md whitespace-nowrap z-[100]">
              <div className="absolute left-1/2 md:left-0 top-full md:top-1/2 -translate-x-1/2 -translate-y-0 md:-translate-y-1/2 w-2 h-2 bg-[#101010] border-r md:border-r-0 md:border-l border-b border-white/10 rotate-45" />
              {"Load Grammar"}
            </div>
          </div>
        </button>

        <button
          onClick={() => {
            const data = JSON.stringify({ code }, null, 2);
            const blob = new Blob([data], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `grammar-${new Date().toISOString().slice(0, 10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="group relative flex items-center justify-center p-3 rounded-xl transition-all duration-300 text-gray-500 hover:bg-white/5 hover:text-white cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 md:mb-0 md:bottom-auto md:left-full md:translate-x-0 md:ml-4 pointer-events-none">
            <div className="px-3.5 py-2 bg-[#101010] border border-white/10 text-[#F5F5F5] text-md font-bold tracking-wide rounded-xl opacity-0 translate-y-2 md:translate-y-0 md:-translate-x-2 group-hover:opacity-100 group-hover:translate-y-0 md:group-hover:translate-x-0 transition-all duration-300 shadow-2xl backdrop-blur-md whitespace-nowrap z-[100]">
              <div className="absolute left-1/2 md:left-0 top-full md:top-1/2 -translate-x-1/2 -translate-y-0 md:-translate-y-1/2 w-2 h-2 bg-[#101010] border-r md:border-r-0 md:border-l border-b border-white/10 rotate-45" />
              {"Save Grammar"}
            </div>
          </div>
        </button>

        <button
          className="group relative flex items-center justify-center p-3 rounded-xl transition-all duration-300 text-gray-500 hover:bg-white/5 hover:text-white"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>

          <div className="absolute bottom-full right-0 mb-2 md:mb-0 md:bottom-auto md:left-full md:ml-4 pointer-events-none">
            <div
              className="px-4 py-2 bg-[#101010] border border-white/10 text-[#F5F5F5] rounded-xl opacity-0 translate-y-2 md:translate-y-0 md:-translate-x-2 group-hover:opacity-100 group-hover:translate-y-0 md:group-hover:translate-x-0 transition-all duration-300 shadow-2xl backdrop-blur-md z-[100] w-max max-w-[250px] md:max-w-none"
            >
              <div className="absolute right-4 md:right-auto md:left-0 top-full md:top-1/2 -translate-x-0 md:-translate-x-1/2 md:-translate-y-1/2 w-2 h-2 bg-[#101010] border-r md:border-r-0 md:border-l border-b border-white/10 rotate-45" />
              <div className="relative flex flex-col gap-0.5">
                <span className="text-xs font-bold tracking-wide">KV Meta Sintaxis</span>
                <span className="text-[10px] text-gray-400 whitespace-nowrap">{`kvzidev © ${new Date().getFullYear()}`}</span>
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
