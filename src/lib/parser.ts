import { MetaNode, MetaExpr } from "@/types/ast";

const isWhitespace = (char: string) => /\s/.test(char);
const isIdChar = (char: string) => /[a-zA-Z_áéíóúñÁÉÍÓÚÑ]/.test(char);

function tokenize(input: string): string[] {
  const tokens: string[] = [];
  let cursor = 0;
  const length = input.length;

  while (cursor < length) {
    const char = input[cursor];

    if (isWhitespace(char)) {
      cursor++;
      continue;
    }

    if (char === "/" && input[cursor + 1] === ";") {
      let depth = 1;
      cursor += 2;
      while (cursor < length) {
        if (input[cursor] === "/" && input[cursor + 1] === ";") {
          depth++;
          cursor += 2;
        } else if (input[cursor] === ";" && input[cursor + 1] === "/") {
          depth--;
          cursor += 2;
          if (depth === 0) break;
        } else {
          cursor++;
        }
      }
      continue;
    }


    if (char === ";") {
      while (cursor < length && input[cursor] !== "\n") {
        cursor++;
      }
      continue;
    }


    if (char === '"') {
      let value = '"';
      cursor++; 
      while (cursor < length) {
        const next = input[cursor];
        if (next === '"' && input[cursor - 1] !== "\\") {
          value += '"';
          cursor++;
          break;
        }
        value += next;
        cursor++;
      }
      tokens.push(value);
      continue;
    }


    if ("|{}()[]:".includes(char)) {
      tokens.push(char);
      cursor++;
      continue;
    }


    if (isIdChar(char)) {
      let value = "";
      while (cursor < length && isIdChar(input[cursor])) {
        value += input[cursor];
        cursor++;
      }
      tokens.push(value);
      continue;
    }

    cursor++;
  }

  return tokens;
}

export function parseMetaSyntax(source: string): MetaNode[] {
  const tokens = tokenize(source);

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
    const name = consume();
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


  const rules: MetaNode[] = [];
  while (pos < tokens.length) {
    if (!peek()) break;
    const rule = parseRule();
    rules.push(rule);
  }

  return rules;
}
