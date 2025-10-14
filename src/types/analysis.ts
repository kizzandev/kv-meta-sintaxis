export type AnalysisResult = {
  undefinedRules: string[];
  unreachableRules: string[];
  cyclicRules: string[]; // rules in any detected cycles
  recursiveRules: string[]; // directly or indirectly recursive
};
