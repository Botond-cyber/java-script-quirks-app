import { useState } from "react"
import { cn } from "../lib/cn"
import { tokenize, TOKEN_COLORS } from "../lib/highlight"
import { CopyIcon, CheckIcon, PlayIcon } from "./icons"

interface CodeBlockProps {
  code: string
  onRun?: () => void
  hasRun?: boolean
  runLabel?: string
  presentation?: boolean
  /** Compact styling for secondary / bonus snippets. */
  compact?: boolean
}

export function CodeBlock({
  code,
  onRun,
  hasRun,
  runLabel = "RUN",
  presentation = false,
  compact = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const lines = code.replace(/\n$/, "").split("\n")

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      // clipboard may be unavailable; ignore silently
    }
  }

  const codeText = presentation
    ? compact
      ? "text-xl md:text-2xl"
      : "text-2xl md:text-4xl leading-relaxed"
    : compact
      ? "text-sm md:text-base"
      : "text-base md:text-lg"

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-black/40 bg-[var(--color-code-bg)] shadow-[0_10px_40px_-15px_rgba(20,18,40,0.6)]",
        "ring-1 ring-white/5",
      )}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-white/5 bg-[var(--color-code-bar)] px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
        </span>
        <span className="ml-2 font-mono text-xs text-[var(--color-code-line)]">script.js</span>
        <span className="ml-auto flex items-center gap-3">
          <span className="rounded bg-[var(--color-js)] px-1.5 py-0.5 font-mono text-[10px] font-bold text-black">
            JS
          </span>
          <button
            type="button"
            onClick={copy}
            className="flex items-center gap-1 font-mono text-xs text-[var(--color-code-line)] transition-colors hover:text-[var(--color-code-ink)]"
          >
            {copied ? <CheckIcon className="h-3.5 w-3.5" /> : <CopyIcon className="h-3.5 w-3.5" />}
            {copied ? "copied" : "copy"}
          </button>
        </span>
      </div>

      {/* Code */}
      <div className={cn("scroll-thin overflow-x-auto px-2 py-4", presentation && !compact && "py-6")}>
        <pre className={cn("font-mono", codeText)}>
          <code>
            {lines.map((line, i) => (
              <div key={i} className="flex">
                <span
                  className={cn(
                    "select-none pr-4 pl-2 text-right tabular-nums text-[var(--color-code-line)]",
                    presentation ? "min-w-[2.5rem]" : "min-w-[2rem]",
                  )}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <span className="whitespace-pre pr-4 text-[var(--color-code-ink)]">
                  {tokenize(line).map((tok, j) => (
                    <span key={j} style={{ color: TOKEN_COLORS[tok.type] }}>
                      {tok.value}
                    </span>
                  ))}
                  {line.length === 0 ? "\u00A0" : null}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>

      {/* Run bar */}
      {onRun ? (
        <div className="flex items-center justify-end border-t border-white/5 bg-[var(--color-code-bar)] px-4 py-3">
          <button
            type="button"
            onClick={onRun}
            className={cn(
              "group flex items-center gap-2 rounded-lg bg-[var(--color-js)] font-mono font-bold text-black transition-all",
              "hover:bg-[var(--color-js-strong)] hover:shadow-[0_0_0_3px_rgba(230,180,0,0.25)] active:scale-95",
              presentation ? "px-6 py-3 text-xl" : "px-4 py-2 text-sm",
            )}
          >
            <PlayIcon className={cn("transition-transform group-hover:scale-110", presentation ? "h-5 w-5" : "h-4 w-4")} />
            {hasRun ? "RUN AGAIN" : runLabel}
          </button>
        </div>
      ) : null}
    </div>
  )
}
