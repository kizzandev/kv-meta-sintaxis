export interface RuleNode {
  id: string; // rule name
  type: "rule" | "terminal";
  references: string[]; // list of other rule names
}

export interface RuleGraph {
  nodes: RuleNode[];
  edges: { from: string; to: string }[];
}
