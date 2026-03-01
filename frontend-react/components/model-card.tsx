"use client"

import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface ModelCardProps {
  name: string
  modelName: string
  description: string
  icon: LucideIcon
  params: string
  status: "online" | "offline" | "loading"
  selected: boolean
  onClick: () => void
  accentColor: string
  tags: string[]
}

export function ModelCard({
  name,
  modelName,
  description,
  icon: Icon,
  params,
  status,
  selected,
  onClick,
  accentColor,
  tags,
}: ModelCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex w-full flex-col items-start gap-4 rounded-xl border p-6 text-left transition-all duration-300",
        "hover:scale-[1.02] hover:shadow-lg",
        selected
          ? "border-primary/60 bg-primary/5 shadow-[0_0_30px_-5px] shadow-primary/20"
          : "border-border bg-card hover:border-primary/30"
      )}
    >
      {/* Status indicator */}
      <div className="absolute right-4 top-4 flex items-center gap-2">
        <span
          className={cn(
            "inline-block h-2 w-2 rounded-full",
            status === "online" && "bg-emerald-400 shadow-[0_0_8px] shadow-emerald-400/60",
            status === "offline" && "bg-muted-foreground/40",
            status === "loading" && "animate-pulse bg-amber-400"
          )}
        />
        <span className="text-xs font-mono text-muted-foreground capitalize">
          {status}
        </span>
      </div>

      {/* Icon */}
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-lg transition-colors duration-300",
          selected ? "bg-primary/15" : "bg-secondary"
        )}
        style={selected ? { backgroundColor: `${accentColor}15` } : undefined}
      >
        <Icon
          className={cn(
            "h-6 w-6 transition-colors duration-300",
            selected ? "text-primary" : "text-muted-foreground"
          )}
          style={selected ? { color: accentColor } : undefined}
        />
      </div>

      {/* Text content */}
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-foreground">{name}</h3>
        <p className="font-mono text-sm text-primary/80">{modelName}</p>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className={cn(
              "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              selected
                ? "bg-primary/10 text-primary"
                : "bg-secondary text-muted-foreground"
            )}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-auto flex w-full items-center justify-between border-t border-border/50 pt-4">
        <span className="font-mono text-xs text-muted-foreground">{params}</span>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold transition-all duration-300",
            selected
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
          )}
        >
          {selected ? "Active" : "Select"}
        </span>
      </div>

      {/* Selected glow line */}
      {selected && (
        <div
          className="absolute inset-x-0 bottom-0 h-[2px] rounded-b-xl"
          style={{
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
          }}
        />
      )}
    </button>
  )
}
