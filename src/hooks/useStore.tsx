import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { Tab } from "@/types/tabs";

interface AppState {
  code: string;
  setCode: (v: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      code: '/;\n  ¡Comentario!\n;/\n\nexpresión   : igualdad  ; Inicio\nigualdad    : comparación {  ( "=" | "!="  ) comparación   }\ncomparación : término     {  ( "<" | "<="  | ">="   | ">=" ) término }\ntérmino     : factor      {  ( "+" | "-"   ) factor }\nfactor      : unario      {  ( "*" | "/"   ) unario }\nunario      : primario    |  ( "-" | "!"   ) unario\nprimario    : NÚMERO      | "(" expresión ")"\n',
      setCode: (code) => set({ code }),
    }),
    {
      name: "kv-meta-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

interface EditorTab {
  tab: Tab;
  setTab: (v: Tab) => void;
}

export const useEditorTab = create<EditorTab>()(
  persist(
    (set) => ({
      tab: "analysis",
      setTab: (tab) => set({ tab }),
    }),
    {
      name: "kv-tab-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
