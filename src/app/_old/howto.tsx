"use client";

import { useEffect } from "react";

import { Tab } from "@/types/tabs";

import { useEditorTab } from "@/hooks/useStore";

export default function MetaSyntaxPage() {
  let { setTab } = useEditorTab();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const newTab = localStorage.getItem("tab") ?? "analysis";
      setTab(newTab as Tab);
    }
  }, []);

  return (
    <div className="scrollbar container mx-auto max-w-4xl space-y-10 overflow-y-auto px-4 py-10">
      <section>
        <h1 className="mb-2 text-4xl font-bold">KV Meta Syntaxis</h1>
        <p className="text-muted-foreground">
          {`Meta Syntax is a compact grammar notation designed as a devtool\
          for developing my programming language. It defines the structure of\
          a language using human-friendly symbols and supports features like\
          rule analysis, visualization, and example code generation.`}
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Syntax Notation</h2>
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="w-1/3 border px-3 py-2 text-left">Notation</th>
                <th className="border px-3 py-2 text-left">Definition</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-3 py-2">
                  <code>:</code>
                </td>
                <td className="border px-3 py-2">Define rule</td>
              </tr>
              <tr>
                <td className="border px-3 py-2">
                  <code>|</code>
                </td>
                <td className="border px-3 py-2">
                  Sequence of alternatives (one of)
                </td>
              </tr>
              <tr>
                <td className="border px-3 py-2">
                  <code>{`{}`}</code>
                </td>
                <td className="border px-3 py-2">Repetition (zero or more)</td>
              </tr>
              <tr>
                <td className="border px-3 py-2">
                  <code>{`[]`}</code>
                </td>
                <td className="border px-3 py-2">Optional</td>
              </tr>
              <tr>
                <td className="border px-3 py-2">
                  <code>{`()`}</code>
                </td>
                <td className="border px-3 py-2">Grouping</td>
              </tr>
              <tr>
                <td className="border px-3 py-2">
                  <code>CAPITALIZED</code>
                  <br />
                  or
                  <br />
                  <code>"quoted"</code>
                </td>
                <td className="border px-3 py-2">Terminal</td>
              </tr>
              <tr>
                <td className="border px-3 py-2">
                  <code>;</code>
                  <br />
                  or
                  <br />
                  <code>/; ... ;/</code>
                </td>
                <td className="border px-3 py-2">
                  Inline or multiline comment
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Rule Analysis</h2>
        <p className="text-muted-foreground mb-4">
          The system automatically analyzes all rules to detect potential
          structural or logical issues in the grammar.
        </p>

        <ul className="ml-6 list-disc space-y-2 text-sm">
          <li>
            <strong>Undefined:</strong> The rule references another that is not
            declared.
          </li>
          <li>
            <strong>Unreachable:</strong> The rule is never used by any other
            rule.
          </li>
          <li>
            <strong>Cycling:</strong> The rule depends on itself through a
            closed chain of other rules.
          </li>
          <li>
            <strong>Recursive:</strong> The rule directly references itself,
            often used for nested or repeating structures.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Visualization</h2>
        <p className="text-muted-foreground">
          Each rule can be represented as a railroad diagram for a clear,
          graphical understanding of the grammar flow. Recursive rules are
          displayed as loops that reconnect to their origin instead of endlessly
          expanding.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Example Generator</h2>
        <p className="text-muted-foreground">
          The generator creates random or structured example code snippets
          following the defined grammar. Only <code>Terminal</code> symbols are
          used for actual text output.
        </p>
      </section>
    </div>
  );
}
