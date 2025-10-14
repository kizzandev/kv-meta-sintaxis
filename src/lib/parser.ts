import { MetaNode, MetaExpr } from "@/types/ast";

function preprocess(source: string): string {
  return source.replace(/[\t \r]+/g, " ").trim();
}

const tokenPattern =
  /"(\\(?:[abfnrtv\\"'])|[^\\"]+)*"|\/;[^;\/]*;\/|;.*[^$]|[a-z_áéíóú]+|[|{}()\[\]:]|[A-Z_ÁÉÍÓÚÑ]+/g;

function tokenize(input: string): string[] {
  return Array.from(input.matchAll(tokenPattern))
    .map((m) => m[0].trim())
    .filter((a) => !a.startsWith(";") && !a.startsWith("/;"));
}

export function parseMetaSyntax(source: string): MetaNode[] {
  const text = preprocess(source);

  const tokens = tokenize(text);

  let pos = 0;

  function peekn(offset: number) {
    if (pos + offset > tokens.length) return "-1";
    return tokens[pos + offset];
  }
  function peek() {
    return tokens[pos];
  }
  function consume() {
    return tokens[pos++];
  }
  function expect(t: string) {
    if (peek() !== t) throw new Error(`Expected '${t}' but got '${peek()}'`);
    consume();
  }

  function parseRule(): MetaNode {
    const name = consume(); // rule name
    expect(":");
    const expr = parseExpression();
    return { type: "Rule", name, expr };
  }

  function parseExpression(): MetaExpr {
    let left = parseSequence();
    if (peek() === "|") {
      const options = [left];
      while (peek() === "|") {
        consume();
        options.push(parseSequence());
      }
      return { type: "Alternative", options };
    }
    return left;
  }

  function parseSequence(): MetaExpr {
    const items: MetaExpr[] = [];
    while (
      peek() &&
      ![")", "]", "}", "|"].includes(peek()) &&
      peekn(1) !== ":"
    ) {
      items.push(parseTerm());
    }
    return items.length === 1 ? items[0] : { type: "Sequence", items };
  }

  function parseTerm(): MetaExpr {
    const token = peek();

    if (token === "{") {
      consume();
      const body = parseExpression();
      expect("}");
      return { type: "Repetition", body };
    }
    if (token === "[") {
      consume();
      const body = parseExpression();
      expect("]");
      return { type: "Optional", body };
    }
    if (token === "(") {
      consume();
      const body = parseExpression();
      expect(")");
      return { type: "Group", body };
    }
    if (token?.startsWith('"')) {
      consume();
      return { type: "Terminal", value: token.replace(/^"|"$/g, "") };
    }
    if (token?.match(/^[A-ZÁÉÍÓÚÑ_]+/)) {
      consume();
      return { type: "Terminal", value: token };
    }
    consume();
    return { type: "NonTerminal", name: token };
  }

  // Parse all rules
  const rules: MetaNode[] = [];
  while (pos < tokens.length) {
    if (!peek()) break;
    const rule = parseRule();
    rules.push(rule);
  }

  return rules;
}
