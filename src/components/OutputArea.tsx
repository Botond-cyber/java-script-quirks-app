import { useEffect, useRef, useState } from "react"
import type { OutputLine } from "../lib/runCode"
import { cn } from "../lib/cn"

interface OutputAreaProps {
  codeEcho: string
  lines: OutputLine[]
  presentation?: boolean
  /** A key that changes on each run so the typing animation restarts. */
  runKey: number
}

const KIND_COLOR: Record<OutputLine["kind"], string> = {
  log: "#e9e7f5",
  return: "#82aaff",
  warn: "#ffd479",
  error: "#ff6b6b",
}

export function OutputArea({ codeEcho, lines, presentation = false, runKey }: OutputAreaProps) {
  const fullText = lines.map((l) => l.text).join("\n")
  const total = fullText.length
  const [revealed, setRevealed] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    setRevealed(0)
    const start = performance.now()
    const perChar = Math.min(28, Math.max(10, 600 / Math.max(total, 1)))
    const duration = total * perChar

    function tick(now: number) {
      const progress = duration === 0 ? 1 : Math.min(1, (now - start) / duration)
      setRevealed(Math.round(progress * total))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [runKey, total])

  const done = revealed >= total

  // Figure out how many characters each line gets to show.
  let budget = revealed
  const shown = lines.map((line, i) => {
    if (i > 0) budget -= 1 // account for the "\n" join char
    const take = Math.max(0, Math.min(line.text.length, budget))
    budget -= line.text.length
    return line.text.slice(0, take)
  })

  const promptText = presentation ? "text-2xl md:text-3xl" : "text-base md:text-lg"

  return (
    <div className="animate-[var(--animate-slide-up)] overflow-hidden rounded-xl border border-black/40 bg-[#16151f] shadow-[0_10px_40px_-18px_rgba(20,18,40,0.7)]">
      <div className="flex items-center gap-2 border-b border-white/5 px-4 py-2">
        <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-[var(--color-code-line)]">
          OUTPUT
        </span>
      </div>
      <div className={cn("scroll-thin overflow-x-auto px-4 py-4 font-mono", promptText)}>
        {/* Echo the command being run */}
        <div className="mb-2 flex gap-2 whitespace-pre text-[var(--color-code-line)]">
          <span className="select-none text-[var(--color-js)]">{">"}</span>
          <span>{codeEcho}</span>
        </div>
        {shown.map((text, i) => (
          <div key={i} className="whitespace-pre-wrap break-words" style={{ color: KIND_COLOR[lines[i].kind] }}>
            {lines[i].kind === "error" ? "⚠ " : null}
            {text}
            {!done && text.length > 0 && i === shown.length - 1 ? (
              <span className="term-cursor bg-current text-transparent">_</span>
            ) : null}
          </div>
        ))}
        {done && lines.length === 0 ? <div className="text-[var(--color-code-line)]">undefined</div> : null}
      </div>
    </div>
  )
}
