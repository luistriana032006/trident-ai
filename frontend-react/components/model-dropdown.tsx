"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

export interface ModelOption {
  id: string
  name: string
  modelName: string
  icon: LucideIcon
  params: string
  accentColor: string
  status: "online" | "offline" | "loading"
}

interface ModelDropdownProps {
  models: ModelOption[]
  selectedId: string
  onSelect: (id: string) => void
}

export function ModelDropdown({ models, selectedId, onSelect }: ModelDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = models.find((m) => m.id === selectedId)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (!selected) return null

  const SelectedIcon = selected.icon

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-2 transition-all",
          "hover:border-primary/40 hover:bg-card/80",
          open && "border-primary/40 shadow-[0_0_20px_-5px] shadow-primary/15"
        )}
      >
        <div
          className="flex h-6 w-6 items-center justify-center rounded-md"
          style={{ backgroundColor: `${selected.accentColor}20` }}
        >
          <SelectedIcon
            className="h-3.5 w-3.5"
            style={{ color: selected.accentColor }}
          />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xs font-semibold text-foreground leading-none">
            {selected.name}
          </span>
          <span className="font-mono text-[10px] text-muted-foreground leading-tight">
            {selected.modelName}
          </span>
        </div>
        <ChevronDown
          className={cn(
            "ml-1 h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className={cn(
            "absolute left-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border border-border bg-card",
            "shadow-[0_8px_40px_-8px] shadow-primary/15",
            "animate-in fade-in slide-in-from-top-2 duration-200"
          )}
        >
          <div className="px-3 py-2.5 border-b border-border/50">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Available Models
            </span>
          </div>

          <div className="p-1.5">
            {models.map((model) => {
              const Icon = model.icon
              const isSelected = model.id === selectedId
              return (
                <button
                  key={model.id}
                  onClick={() => {
                    onSelect(model.id)
                    setOpen(false)
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                    isSelected
                      ? "bg-primary/8"
                      : "hover:bg-secondary"
                  )}
                >
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${model.accentColor}15` }}
                  >
                    <Icon
                      className="h-4 w-4"
                      style={{ color: model.accentColor }}
                    />
                  </div>

                  <div className="flex flex-1 flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {model.name}
                      </span>
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          model.status === "online" && "bg-emerald-400",
                          model.status === "offline" && "bg-muted-foreground/40",
                          model.status === "loading" && "animate-pulse bg-amber-400"
                        )}
                      />
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">
                      {model.modelName} &middot; {model.params}
                    </span>
                  </div>

                  {isSelected && (
                    <Check
                      className="h-4 w-4 shrink-0"
                      style={{ color: model.accentColor }}
                    />
                  )}
                </button>
              )
            })}
          </div>

          <div className="border-t border-border/50 px-3 py-2">
            <span className="text-[10px] text-muted-foreground/50">
              All models run locally on your device
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
