import { cn } from "../lib/cn"

interface SectionProps {
  presentation: boolean
}

function Cell({
  heading,
  presentation,
  children,
}: {
  heading: string
  presentation: boolean
  children: React.ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)]">
      <div className="flex items-center gap-2 border-b border-[var(--color-card-border)] px-5 py-2">
        <span className="rounded bg-[var(--color-ink)]/8 px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-widest text-[var(--color-ink-faint)]">
          MARKDOWN
        </span>
      </div>
      <div className="px-5 py-5">
        <h3
          className={cn(
            "mb-3 font-bold tracking-tight text-[var(--color-ink)]",
            presentation ? "text-3xl md:text-4xl" : "text-xl md:text-2xl",
          )}
        >
          <span className="mr-2 text-[var(--color-js-strong)]">#</span>
          {heading}
        </h3>
        <div
          className={cn(
            "leading-relaxed text-[var(--color-ink-soft)]",
            presentation ? "text-2xl leading-relaxed" : "text-base md:text-lg",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export function IntroSection({ presentation }: SectionProps) {
  return (
    <div className="flex flex-col gap-5">
      <Cell heading="What is JavaScript?" presentation={presentation}>
        <p>
          JavaScript is a programming language best known for making websites interactive — buttons,
          animations, forms, games. But it long ago escaped the browser and now runs servers,
          tools, and apps too.
        </p>
      </Cell>

      <Cell heading="Where is it used?" presentation={presentation}>
        <ul className="flex flex-col gap-1.5">
          {[
            "Websites & web apps",
            "Servers, with Node.js",
            "Browser games",
            "Desktop & mobile apps",
            "Automation & tooling",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--color-js-strong)]" />
              {item}
            </li>
          ))}
        </ul>
      </Cell>

      <Cell heading="A tiny bit of history" presentation={presentation}>
        <ul className="flex flex-col gap-1.5">
          {[
            "Created by Brendan Eich at Netscape.",
            "First appeared in 1995.",
            "Originally made for quick scripting in the browser.",
            "Standardized as ECMAScript.",
            "JavaScript and Java are completely different languages.",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-[var(--color-js-strong)]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Cell>
    </div>
  )
}
