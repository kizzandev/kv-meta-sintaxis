export type MetaNode =
  | { type: "Rule"; name: string; expr: MetaExpr } // The declared variable
  | MetaExpr;

export type MetaExpr =
  | { type: "Sequence"; items: MetaExpr[] } // Base, a list of items to appear
  | { type: "Alternative"; options: MetaExpr[] } // One of
  | { type: "Repetition"; body: MetaExpr } // Can appear zero or more times
  | { type: "Optional"; body: MetaExpr } // Optional to be there
  | { type: "Group"; body: MetaExpr } // Group Alternatives
  | { type: "NonTerminal"; name: string } // Variable that points to a Rule name
  | { type: "Terminal"; value: string }; // Terminal values, the output must be of only these
