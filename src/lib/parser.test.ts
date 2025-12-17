
import { describe, it, expect } from "vitest";
import { parseMetaSyntax } from "./parser";

describe("Parser", () => {
  it("should parse a simple rule", () => {
    const input = 'rule: "a"';
    const result = parseMetaSyntax(input);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      type: "Rule",
      name: "rule",
      expr: { type: "Terminal", value: "a" },
    });
  });

  it("should parse a sequence", () => {
    const input = 'rule: "a" "b"';
    const result = parseMetaSyntax(input) as any;
    expect(result[0].expr).toEqual({
      type: "Sequence",
      items: [
        { type: "Terminal", value: "a" },
        { type: "Terminal", value: "b" },
      ],
    });
  });

  it("should parse repetition", () => {
    const input = 'rule: { "a" }';
    const result = parseMetaSyntax(input) as any;
    expect(result[0].expr).toEqual({
      type: "Repetition",
      body: { type: "Terminal", value: "a" },
    });
  });

  it("should parse optional", () => {
    const input = 'rule: [ "a" ]';
    const result = parseMetaSyntax(input) as any;
    expect(result[0].expr).toEqual({
      type: "Optional",
      body: { type: "Terminal", value: "a" },
    });
  });

  it("should parse group", () => {
    const input = 'rule: ( "a" )';
    const result = parseMetaSyntax(input) as any;
    expect(result[0].expr).toEqual({
      type: "Group",
      body: { type: "Terminal", value: "a" },
    });
  });

  it("should throw error on mismatched repetition brackets", () => {
    const input = 'rule: { "a" ]';
    expect(() => parseMetaSyntax(input)).toThrow();
  });

  it("should throw error on mismatched optional brackets", () => {
    const input = 'rule: [ "a" }';
    expect(() => parseMetaSyntax(input)).toThrow();
  });

  it("should throw error on mismatched group brackets", () => {
    const input = 'rule: ( "a" }';
    expect(() => parseMetaSyntax(input)).toThrow();
  });
});
