"use client"

import { cn } from "@/lib/utils"
import { User } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
  modelName?: string
  modelIcon?: LucideIcon
  modelAccent?: string
  isStreaming?: boolean
}

export function ChatMessage({
  role,
  content,
  modelName,
  modelIcon: ModelIcon,
  modelAccent,
  isStreaming,
}: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex gap-4 px-4 py-5",
        role === "user" ? "justify-end" : "justify-start"
      )}
    >
      {role === "assistant" && (
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${modelAccent}20` }}
        >
          {ModelIcon && (
            <ModelIcon className="h-4 w-4" style={{ color: modelAccent }} />
          )}
        </div>
      )}

      <div
        className={cn(
          "flex max-w-[75%] flex-col gap-1",
          role === "user" ? "items-end" : "items-start"
        )}
      >
        {role === "assistant" && modelName && (
          <span
            className="mb-1 text-xs font-medium"
            style={{ color: modelAccent }}
          >
            {modelName}
          </span>
        )}

        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed",
            role === "user"
              ? "bg-primary/15 text-foreground"
              : "bg-secondary text-secondary-foreground"
          )}
        >
          <p className="whitespace-pre-wrap">{content}</p>
          {isStreaming && (
            <span className="ml-1 inline-block h-4 w-1.5 animate-pulse rounded-full bg-primary" />
          )}
        </div>
      </div>

      {role === "user" && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15">
          <User className="h-4 w-4 text-primary" />
        </div>
      )}
    </div>
  )
}
