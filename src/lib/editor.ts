import { languages } from "monaco-editor";

export const language: languages.IMonarchLanguage = {
  // Set defaultToken to invalid to see what you do not tokenize yet
  defaultToken: "invalid",

  // C# style strings
  escapes: /\\(?:[abfnrtv\\"'])/,

  // The main tokenizer for our languages
  tokenizer: {
    root: [
      [/^[a-z_áéíóú]+/, "type.identifier"],
      [/[a-z_áéíóú]+\s*/, { cases: { "@default": "identifier" } }],

      { include: "@whitespace" },

      // Delimitors
      [/[|{}()\[\]:]/, "annotation"],
      [/[?]/, "number.float"],

      // TERMINALS
      [/[A-Z_ÁÉÍÓÚÑ]+/, "keyword"],
      [/"([^"\\]|\\.)*$/, "string.invalid"], // non-teminated string
      [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],
    ],

    string: [
      [/[^\\"]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
    ],

    whitespace: [
      [/[ \t\r\n]+/, "white"],
      [/;.*$/, "comment"],
      [/\/;/, { token: "comment", bracket: "@open", next: "@comment" }],
    ],

    comment: [
      [/;\//, { token: "comment", bracket: "@close", next: "@pop" }],
      [/[^;\/]+/, "comment"],
    ],
  },
};

export const languageId = "kvms";
