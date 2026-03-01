"use client"

import { useState } from "react"
import { ExternalLink, Globe, X, ChevronRight, Search } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SearchReference {
  id: string
  title: string
  url: string
  domain: string
  snippet: string
  favicon?: string
}

interface ReferencesPanelProps {
  references: SearchReference[]
  isVisible: boolean
  onClose: () => void
  modelAccent: string
}

export function ReferencesPanel({
  references,
  isVisible,
  onClose,
  modelAccent,
}: ReferencesPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (!isVisible) return null

  return (
    <aside
      className={cn(
        "flex h-full w-80 shrink-0 flex-col border-l border-border/50 bg-card/60 backdrop-blur-sm",
        "animate-in slide-in-from-right-4 duration-300 lg:w-96"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${modelAccent}15` }}
          >
            <Search className="h-3.5 w-3.5" style={{ color: modelAccent }} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-foreground">
              References
            </span>
            <span className="text-[10px] text-muted-foreground">
              {references.length} source{references.length !== 1 ? "s" : ""} found
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          aria-label="Close references panel"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* References list */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="flex flex-col gap-2">
          {references.map((ref, index) => {
            const isExpanded = expandedId === ref.id
            return (
              <div
                key={ref.id}
                className={cn(
                  "group rounded-xl border border-border/50 bg-secondary/30 transition-all duration-200",
                  "hover:border-border hover:bg-secondary/60",
                  isExpanded && "border-border bg-secondary/60"
                )}
              >
                <button
                  onClick={() =>
                    setExpandedId(isExpanded ? null : ref.id)
                  }
                  className="flex w-full items-start gap-3 px-3 py-3 text-left"
                >
                  {/* Number badge */}
                  <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-bold"
                    style={{
                      backgroundColor: `${modelAccent}15`,
                      color: modelAccent,
                    }}
                  >
                    {index + 1}
                  </span>

                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="line-clamp-2 text-xs font-medium text-foreground leading-relaxed">
                      {ref.title}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Globe className="h-3 w-3 shrink-0 text-muted-foreground/60" />
                      <span className="truncate text-[10px] text-muted-foreground/70">
                        {ref.domain}
                      </span>
                    </div>
                  </div>

                  <ChevronRight
                    className={cn(
                      "mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/40 transition-transform duration-200",
                      isExpanded && "rotate-90"
                    )}
                  />
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="border-t border-border/30 px-3 pb-3 pt-2">
                    <p className="mb-3 text-[11px] text-muted-foreground leading-relaxed">
                      {ref.snippet}
                    </p>
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-medium transition-colors hover:bg-secondary"
                      style={{ color: modelAccent }}
                    >
                      <ExternalLink className="h-3 w-3" />
                      Open link
                    </a>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Bing attribution footer */}
      <div className="border-t border-border/50 px-4 py-3">
        <div className="flex items-center gap-2.5 rounded-lg bg-secondary/40 px-3 py-2.5">
          <svg
            className="h-4 w-4 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 3v16.5l4.67-2.25 5.33 3.25 4-2V5.5L15 8.5l-5.33-3.25L5 3z"
              fill={modelAccent}
              opacity="0.8"
            />
            <path
              d="M5 3l4.67 2.25v11L5 19.5V3z"
              fill={modelAccent}
            />
            <path
              d="M9.67 5.25L15 8.5v11l-5.33-3.25v-11z"
              fill={modelAccent}
              opacity="0.6"
            />
          </svg>
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-foreground/80">
              Powered by Microsoft Bing
            </span>
            <span className="text-[9px] text-muted-foreground/60">
              Search results generated with Bing Search API
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}
