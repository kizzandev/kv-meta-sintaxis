import { languages } from "monaco-editor";

export const language: languages.IMonarchLanguage = {
  // Set defaultToken to invalid to see what you do not tokenize yet
  defaultToken: "invalid",

  // C# style strings
  escapes: /\\(?:[abfnrtv\\"'])/,

  // The main tokenizer for our languages
    tokenizer: {
    root: [
      [/^[a-z_áéíóúñ]+/, "type.identifier"],
      [/[a-z_áéíóúñ]+\s*/, { cases: { "@default": "identifier" } }],

      { include: "@whitespace" },

      // Delimiters
      [/[|{}()\[\]:]/, "annotation"],

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
      [/\/;/, { token: "comment.quote", bracket: "@open", next: "@comment" }],
    ],

    comment: [
      [/[^;\/]+/, "comment"],
      [/\/;/, { token: "comment.quote", bracket: "@open", next: "@push" }], // nested comment
      [/;\//, { token: "comment.quote", bracket: "@close", next: "@pop" }],
      [/./, "comment"],
    ],
  },
};

export const languageId = "kvms";
