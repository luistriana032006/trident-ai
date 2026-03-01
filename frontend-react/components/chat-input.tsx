"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowUp, Paperclip, Mic, Square } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading?: boolean
  modelName: string
  modelAccent: string
}

export function ChatInput({ onSend, isLoading, modelName, modelAccent }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [message])

  const handleSubmit = () => {
    if (!message.trim() || isLoading) return
    onSend(message.trim())
    setMessage("")
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-6 pt-3">
      <div
        className={cn(
          "relative flex flex-col rounded-2xl border border-border bg-card",
          "shadow-[0_0_40px_-12px] shadow-primary/10",
          "transition-shadow duration-300 focus-within:shadow-[0_0_50px_-10px] focus-within:shadow-primary/20",
          "focus-within:border-primary/40"
        )}
      >
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Message ${modelName}...`}
          rows={1}
          className={cn(
            "w-full resize-none bg-transparent px-5 pt-4 pb-2 text-sm text-foreground",
            "placeholder:text-muted-foreground/60",
            "focus:outline-none",
            "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border"
          )}
          style={{ maxHeight: 200 }}
          disabled={isLoading}
        />

        {/* Bottom actions bar */}
        <div className="flex items-center justify-between px-3 pb-3 pt-1">
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Attach file"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Voice input"
            >
              <Mic className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground/50 sm:inline">
              Shift + Enter for new line
            </span>
            <button
              onClick={handleSubmit}
              disabled={!message.trim() && !isLoading}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200",
                message.trim() || isLoading
                  ? "text-primary-foreground shadow-lg"
                  : "cursor-not-allowed bg-secondary text-muted-foreground/40"
              )}
              style={
                message.trim() || isLoading
                  ? { backgroundColor: modelAccent, boxShadow: `0 0 20px ${modelAccent}40` }
                  : undefined
              }
              aria-label={isLoading ? "Stop generation" : "Send message"}
            >
              {isLoading ? (
                <Square className="h-4 w-4" />
              ) : (
                <ArrowUp className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-2 flex flex-col items-center gap-0.5">
        <p className="text-center text-[11px] text-muted-foreground/40">
          Trident AI runs models locally. Your data never leaves your device.
        </p>
        <p className="text-center text-[11px] text-muted-foreground/40">
          Trident AI can make mistakes. Review responses carefully before acting on them.
        </p>
      </div>
    </div>
  )
}
