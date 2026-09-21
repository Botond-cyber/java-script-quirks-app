export type OutputKind = "log" | "warn" | "error" | "return"

export interface OutputLine {
  kind: OutputKind
  text: string
}

export interface RunResult {
  lines: OutputLine[]
}

/**
 * Formats a value the way a REPL would display it.
 * Strings are shown WITH quotes (e.g. "52") so the audience can tell a
 * string result apart from a number result — that distinction is the whole
 * point of many of these examples.
 */
function formatValue(value: unknown, seen = new WeakSet<object>()): string {
  switch (typeof value) {
    case "string":
      return JSON.stringify(value)
    case "number":
      return Object.is(value, -0) ? "-0" : String(value)
    case "bigint":
      return `${value}n`
    case "boolean":
      return String(value)
    case "undefined":
      return "undefined"
    case "symbol":
      return String(value)
    case "function": {
      const name = (value as { name?: string }).name
      return name ? `[Function: ${name}]` : "[Function (anonymous)]"
    }
    case "object": {
      if (value === null) return "null"
      if (seen.has(value)) return "[Circular]"
      seen.add(value)
      if (Array.isArray(value)) {
        const items = value.map((item) => formatValue(item, seen))
        return `[${items.join(", ")}]`
      }
      const entries = Object.entries(value as Record<string, unknown>).map(
        ([key, val]) => `${key}: ${formatValue(val, seen)}`,
      )
      return entries.length ? `{ ${entries.join(", ")} }` : "{}"
    }
    default:
      return String(value)
  }
}

function joinArgs(args: unknown[]): string {
  return args.map((arg) => formatValue(arg)).join(" ")
}

/**
 * Executes a predefined code snippet, capturing console output and the
 * completion value. The snippets are authored by the app (see questions.ts) —
 * this never runs arbitrary user-entered code.
 */
export function runCode(code: string): RunResult {
  const lines: OutputLine[] = []

  const sandboxConsole = {
    log: (...args: unknown[]) => lines.push({ kind: "log", text: joinArgs(args) }),
    warn: (...args: unknown[]) => lines.push({ kind: "warn", text: joinArgs(args) }),
    error: (...args: unknown[]) => lines.push({ kind: "error", text: joinArgs(args) }),
    info: (...args: unknown[]) => lines.push({ kind: "log", text: joinArgs(args) }),
  }

  try {
    // Wrap so that a bare expression (like the title puzzle) returns its value.
    const trimmed = code.trim()
    const isSingleExpression = !/[;{]/.test(trimmed) && !/^(const|let|var|function|return|if|for|while)\b/.test(trimmed)
    const body = isSingleExpression ? `return (${trimmed});` : code

    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const fn = new Function("console", `"use strict";\n${body}`)
    const result = fn(sandboxConsole)
    if (result !== undefined) {
      lines.push({ kind: "return", text: formatValue(result) })
    }
  } catch (err) {
    const message = err instanceof Error ? `${err.name}: ${err.message}` : String(err)
    lines.push({ kind: "error", text: message })
  }

  return { lines }
}

/**
 * Convenience helper for the title puzzle, which is a single expression.
 * Forces expression evaluation (wraps in `return`) and returns the raw string
 * value, so the reveal shows the plain text without surrounding quotes.
 */
export function evalExpression(code: string): string {
  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const fn = new Function(`"use strict";\nreturn (${code});`)
    const result = fn()
    return typeof result === "string" ? result : formatValue(result)
  } catch {
    return ""
  }
}
