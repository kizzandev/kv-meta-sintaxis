"use client";

import { useEffect } from "react";
import { editor } from "monaco-editor";
import Editor, { OnMount } from "@monaco-editor/react";

import { useEditorTab, useStore } from "@/hooks/useStore";
import { language, languageId } from "@/lib/editor";
import { Tab } from "@/types/tabs";
import Analysis from "@/components/Analysis";
import Railroad from "@/components/Railroad";
import Generator from "@/components/Generator";
import Debug from "@/components/Debug";

const handleEditorDidMount: OnMount = (
  editorInstance: editor.IStandaloneCodeEditor,
  monaco: typeof import("monaco-editor"),
) => {
  monaco.languages.register({ id: languageId });
  monaco.languages.setMonarchTokensProvider(languageId, language);

  monaco.editor.defineTheme("customTheme", {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {},
  });

  monaco.editor.setTheme("customTheme");
};

export default function MetaEditor() {
  const { code, setCode } = useStore();
  const { tab, setTab } = useEditorTab();

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("check");
      const newCode = localStorage.getItem("code");
      if (newCode) setCode(newCode);
      const newTab = localStorage.getItem("tab") ?? "analysis";
      setTab(newTab as Tab);
    }
  }, []);

  return (
    <div className="flex h-full w-full flex-row">
      <article className="h-full w-full rounded-xl">
        <Editor
          defaultLanguage={languageId}
          language={languageId}
          theme="vs-dark"
          className="rounded-xl"
          value={code}
          onMount={handleEditorDidMount}
          onChange={(value) => setCode(value!)}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
          }}
        />
      </article>
      <article className="h-full w-full max-w-3xl">
        {tab === "analysis" ? (
          <Analysis></Analysis>
        ) : tab === "railroad" ? (
          <Railroad></Railroad>
        ) : tab === "generator" ? (
          <Generator></Generator>
        ) : tab === "debug" && process.env.NODE_ENV === "development" ? (
          <Debug></Debug>
        ) : null}
      </article>
    </div>
  );
}
