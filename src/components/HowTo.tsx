"use client";

export default function HowTo() {
  return (
    <div className="h-full space-y-10 pb-10">
      <section className="space-y-3">
        <h2 className="text-3xl font-black text-white tracking-tighter">{"Documentation"}</h2>
        <p className="text-gray-400 leading-relaxed text-sm max-w-2xl">
          {"Learn how to define your own programming language grammar using our custom Meta Syntax. \
          The system provides real-time analysis, visualization, and code generation."}
        </p>
      </section>

      <div className="grid grid-cols-1 gap-8">
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#75AADB]/10 border border-[#75AADB]/20 flex items-center justify-center text-[#75AADB]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-100">{"Syntax Notation"}</h3>
          </div>
          
          <div className="grid grid-cols-1 ml:grid-cols-2 2xl:grid-cols-2 gap-4">
            <NotationCard symbol=":" label="Rule Definition" description="Defines a new grammar rule." />
            <NotationCard symbol="|" label="Alternative" description="Choice between multiple paths." />
            <NotationCard symbol="{ }" label="Repetition" description="Zero or more occurrences." />
            <NotationCard symbol="[ ]" label="Optional" description="Zero or one occurrence." />
            <NotationCard symbol="( )" label="Grouping" description="Combines multiple symbols." />
            <NotationCard symbol='"text"' label="Quoted Terminal" description="Literal text output." />
            <NotationCard symbol="CAPS" label="Symbolic Terminal" description="All-caps words (e.g. NUMBER)." />
            <NotationCard symbol="name" label="Rule Reference" description="Reference to another defined rule." />
            <NotationCard symbol="; " label="Line Comment" description="Ignored until end of line." />
            <NotationCard symbol="/; ;/" label="Block Comment" description="Multiline ignored block." />
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-100">Analysis Features</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-4 gap-4">
            <FeatureSmallCard title="Undefined" desc="Flags missing references." />
            <FeatureSmallCard title="Unreachable" desc="Identifies unused rules." />
            <FeatureSmallCard title="Cycling" desc="Detects infinite loops." />
            <FeatureSmallCard title="Recursive" desc="Tracks self-references." />
          </div>
        </section>
      </div>
    </div>
  );
}

function NotationCard({ symbol, label, description }: { symbol: string, label: string, description: string }) {
  return (
    <div className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-300">
      <div className="flex-shrink-0 w-20 h-12 rounded-xl bg-[#101010] flex items-center justify-center font-mono text-sm font-bold text-[#75AADB] border border-white/5 group-hover:border-[#75AADB]/30 transition-colors overflow-hidden px-2">
        <span className="truncate">{symbol}</span>
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="font-bold text-[#F5F5F5] text-sm leading-none mb-1 truncate">{label}</h4>
        <p className="text-xs text-gray-500 truncate lg:whitespace-normal">{description}</p>
      </div>
    </div>
  );
}

function FeatureSmallCard({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.07] transition-all">
      <h4 className="font-bold text-gray-200 text-sm mb-1">{title}</h4>
      <p className="text-[10px] text-gray-500 font-medium uppercase tracking-tight">{desc}</p>
    </div>
  );
}
