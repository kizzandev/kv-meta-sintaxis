"use client";

import { editor } from "monaco-editor";
import Editor, { OnMount } from "@monaco-editor/react";
import { motion } from "motion/react";
import { useStore } from "@/hooks/useStore";
import { language, languageId } from "@/lib/editor";

const handleEditorDidMount: OnMount = (
  editorInstance: editor.IStandaloneCodeEditor,
  monaco: typeof import("monaco-editor"),
) => {
  monaco.languages.register({ id: languageId });
  monaco.languages.setMonarchTokensProvider(languageId, language);

  monaco.editor.defineTheme("premiumTheme", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "keyword", foreground: "A897DC", fontStyle: "bold" },
      { token: "type", foreground: "75AADB" },
      { token: "string", foreground: "CADB75" },
      { token: "comment", foreground: "6272A4", fontStyle: "italic" },
      { token: "number", foreground: "F1FA8C" },
      { token: "operator", foreground: "F5F5F5" },
    ],
    colors: {
      "editor.background": "#10101000",
      "editor.lineHighlightBackground": "#F5F5F508",
      "editorCursor.foreground": "#75AADB",
      "editor.selectionBackground": "#75AADB30",
      "editorLineNumber.foreground": "#44475A",
    },
  });

  monaco.editor.setTheme("premiumTheme");
};

export default function CompEditor() {
  const { code, setCode } = useStore();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-[#101010]/40 p-2 backdrop-blur-xl transition-all hover:border-white/20"
    >
      <div className="absolute top-0 right-4 p-4 z-10">
        <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
          {"Syntaxis Editor"}
        </span>
      </div>
      <Editor
        defaultLanguage={languageId}
        language={languageId}
        theme="vs-dark"
        height="100%"
        width="100%"
        value={code}
        onMount={handleEditorDidMount}
        onChange={(value) => setCode(value!)}
        options={{
          fontSize: 15,
          fontFamily: "var(--font-geist-mono)",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorSmoothCaretAnimation: "on",
          padding: { top: 20 },
          lineNumbersMinChars: 3,
          glyphMargin: false,
          folding: true,
          renderLineHighlight: "all",
          scrollbar: {
            vertical: "hidden",
            horizontal: "hidden",
          },
        }}
      />
    </motion.div>
  );
}
