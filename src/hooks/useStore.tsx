import { create } from "zustand";

import { Tab } from "@/types/tabs";

interface AppState {
  code: string;
  setCode: (v: string) => void;
}

export const useStore = create<AppState>((set) => ({
  code: '/;\n  ¡Comentario!\n;/\n\nexpresión   : igualdad  ; Inicio\nigualdad    : comparación {  ( "=" | "!="  ) comparación   }\ncomparación : término     {  ( "<" | "<="  | ">="   | ">=" ) término }\ntérmino     : factor      {  ( "+" | "-"   ) factor }\nfactor      : unario      {  ( "*" | "/"   ) unario }\nunario      : primario    |  ( "-" | "!"   ) unario\nprimario    : NÚMERO      | "(" expresión ")"\n',
  setCode: (code) => {
    localStorage.setItem("code", code);
    set({ code });
  },
}));

interface EditorTab {
  tab: Tab;
  setTab: (v: Tab) => void;
}

export const useEditorTab = create<EditorTab>((set) => ({
  tab: "analysis",
  setTab: (tab) => {
    localStorage.setItem("tab", tab);
    set({ tab });
  },
}));
