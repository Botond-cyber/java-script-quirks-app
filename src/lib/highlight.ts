export type TokenType =
  | "comment"
  | "string"
  | "number"
  | "keyword"
  | "literal"
  | "func"
  | "ident"
  | "punct"
  | "space"

export interface Token {
  type: TokenType
  value: string
}

const KEYWORDS = new Set([
  "const",
  "let",
  "var",
  "function",
  "return",
  "if",
  "else",
  "for",
  "while",
  "do",
  "switch",
  "case",
  "break",
  "continue",
  "typeof",
  "instanceof",
  "new",
  "of",
  "in",
  "delete",
  "void",
])

const LITERALS = new Set(["true", "false", "null", "undefined", "NaN", "Infinity"])

const RULES: Array<[TokenType, RegExp]> = [
  ["comment", /\/\/[^\n]*/y],
  ["string", /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/y],
  ["number", /\b\d[\d_]*(?:\.\d+)?(?:e[+-]?\d+)?n?\b/iy],
  ["ident", /[A-Za-z_$][\w$]*/y],
  ["space", /\s+/y],
  ["punct", /[^\w\s]+/y],
]

/** A tiny JS tokenizer — good enough to color short predefined snippets. */
export function tokenize(line: string): Token[] {
  const tokens: Token[] = []
  let pos = 0

  while (pos < line.length) {
    let matched = false
    for (const [type, rule] of RULES) {
      rule.lastIndex = pos
      const m = rule.exec(line)
      if (m && m.index === pos) {
        let value = m[0]
        let finalType: TokenType = type
        if (type === "ident") {
          if (KEYWORDS.has(value)) {
            finalType = "keyword"
          } else if (LITERALS.has(value)) {
            finalType = "literal"
          } else {
            // Function call if the next non-space char is "("
            const rest = line.slice(pos + value.length)
            if (/^\s*\(/.test(rest)) finalType = "func"
          }
        }
        tokens.push({ type: finalType, value })
        pos += value.length
        matched = true
        break
      }
    }
    if (!matched) {
      tokens.push({ type: "punct", value: line[pos] })
      pos += 1
    }
  }

  return tokens
}

export const TOKEN_COLORS: Record<TokenType, string> = {
  comment: "#6b7394",
  string: "#c3e88d",
  number: "#f78c6c",
  keyword: "#c792ea",
  literal: "#82aaff",
  func: "#ffd479",
  ident: "#e9e7f5",
  punct: "#89ddff",
  space: "inherit",
}
