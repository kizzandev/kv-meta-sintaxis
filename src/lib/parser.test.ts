
import { describe, it, expect } from "vitest";
import { parseMetaSyntax } from "./parser";

describe("Parser", () => {
  describe("Basic Structures", () => {
    it("should parse a simple rule", () => {
      const input = 'rule: "a"';
      const result = parseMetaSyntax(input) as any;
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

    it("should parse alternatives", () => {
      const input = 'rule: "a" | "b"';
      const result = parseMetaSyntax(input) as any;
      expect(result[0].expr).toEqual({
        type: "Alternative",
        options: [
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
  });

  describe("Complex Combinations", () => {
    it("should parse alternatives with sequences", () => {
      const input = 'rule: "a" "b" | "c" "d"';
      const result = parseMetaSyntax(input) as any;
      expect(result[0].expr).toEqual({
        type: "Alternative",
        options: [
          {
            type: "Sequence",
            items: [
              { type: "Terminal", value: "a" },
              { type: "Terminal", value: "b" },
            ],
          },
          {
            type: "Sequence",
            items: [
              { type: "Terminal", value: "c" },
              { type: "Terminal", value: "d" },
            ],
          },
        ],
      });
    });

    it("should parse repetition of groups", () => {
      const input = 'rule: { ( "a" | "b" ) }';
      const result = parseMetaSyntax(input) as any;
      expect(result[0].expr).toEqual({
        type: "Repetition",
        body: {
          type: "Group",
          body: {
            type: "Alternative",
            options: [
              { type: "Terminal", value: "a" },
              { type: "Terminal", value: "b" },
            ],
          },
        },
      });
    });

    it("should parse mixed complex structure", () => {
      const input = 'complex: A [ "b" ] { ( C | D ) }';
      const result = parseMetaSyntax(input) as any;
      expect(result[0].expr).toEqual({
        type: "Sequence",
        items: [
          { type: "Terminal", value: "A" },
          {
            type: "Optional",
            body: { type: "Terminal", value: "b" },
          },
          {
            type: "Repetition",
            body: {
              type: "Group",
              body: {
                type: "Alternative",
                options: [
                  { type: "Terminal", value: "C" },
                  { type: "Terminal", value: "D" },
                ],
              },
            },
          },
        ],
      });
    });
  });

  describe("Comments & Whitespace", () => {
    it("should ignore line comments", () => {
      const input = 'rule: "a" ; ignored comment\n "b"';
      const result = parseMetaSyntax(input) as any;
      expect(result[0].expr).toEqual({
        type: "Sequence",
        items: [
          { type: "Terminal", value: "a" },
          { type: "Terminal", value: "b" },
        ],
      });
    });

    it("should handle nested block comments", () => {
      const input = 'rule: "a" /; outer /; inner ;/ outer ;/ "b"';
      const result = parseMetaSyntax(input) as any;
      expect(result[0].expr).toEqual({
        type: "Sequence",
        items: [
          { type: "Terminal", value: "a" },
          { type: "Terminal", value: "b" },
        ],
      });
    });

    it("should handle deeply nested block comments", () => {
      const input = 'rule: "a" /; 1 /; 2 /; 3 ;/ 2 ;/ 1 ;/ "b"';
      const result = parseMetaSyntax(input) as any;
      expect(result[0].expr).toEqual({
        type: "Sequence",
        items: [
          { type: "Terminal", value: "a" },
          { type: "Terminal", value: "b" },
        ],
      });
    });

    it("should handle excessive whitespace", () => {
      const input = '\n\t rule  : \n\n "a" \t   "b" \n';
      const result = parseMetaSyntax(input) as any;
      expect(result[0].expr).toEqual({
        type: "Sequence",
        items: [
          { type: "Terminal", value: "a" },
          { type: "Terminal", value: "b" },
        ],
      });
    });
  });

  describe("Terminals & Identifiers", () => {
    it("should parse identifiers with accents and underscores", () => {
      const input = 'regla_español: "valor"';
      const result = parseMetaSyntax(input) as any;
      expect(result[0].name).toBe("regla_español");
    });

    it("should parse terminal identifiers", () => {
      const input = "rule: IDENTIFIER";
      const result = parseMetaSyntax(input) as any;
      expect(result[0].expr).toEqual({
        type: "Terminal",
        value: "IDENTIFIER",
      });
    });

    it("should parse string terminals with escaped quotes", () => {
      const input = 'rule: "quoted \\"value\\""';
      const result = parseMetaSyntax(input) as any;
      expect(result[0].expr).toEqual({
        type: "Terminal",
        value: 'quoted \\"value\\"',
      });
    });
  });

  describe("Error Handling", () => {
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

    it("should throw error on missing rule separator", () => {
      const input = 'rule "a"';
      expect(() => parseMetaSyntax(input)).toThrow();
    });
  });
});
