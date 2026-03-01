"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Cpu, Globe, HardDrive, Settings2, PanelRight } from "lucide-react"
import { TridentLogo } from "@/components/trident-logo"
import { ModelDropdown, type ModelOption } from "@/components/model-dropdown"
import { ChatInput } from "@/components/chat-input"
import { ChatMessage } from "@/components/chat-message"
import { ReferencesPanel, type SearchReference } from "@/components/references-panel"
import { cn } from "@/lib/utils"

const models: ModelOption[] = [
  {
    id: "entity",
    name: "Entity",
    modelName: "Qwen 2.5 1.5B",
    icon: Cpu,
    params: "1.5B",
    accentColor: "#06b6d4",
    status: "online",
  },
  {
    id: "search",
    name: "Search",
    modelName: "Qwen 2.5 7B",
    icon: Globe,
    params: "7B",
    accentColor: "#0ea5e9",
    status: "online",
  },
  {
    id: "local",
    name: "Local",
    modelName: "DeepSeek R1 8B",
    icon: HardDrive,
    params: "8B",
    accentColor: "#14b8a6",
    status: "online",
  },
]

// Simulated Bing search references for Search mode
const searchReferences: Record<string, SearchReference[]> = {
  default: [
    {
      id: "ref-1",
      title: "Understanding Large Language Models: A Comprehensive Guide",
      url: "https://learn.microsoft.com/en-us/ai/large-language-models",
      domain: "learn.microsoft.com",
      snippet:
        "Large Language Models (LLMs) are deep learning models trained on massive text datasets. They can generate, classify, and summarize text with remarkable accuracy.",
    },
    {
      id: "ref-2",
      title: "Qwen 2.5 Technical Report - Model Architecture and Training",
      url: "https://arxiv.org/abs/2024.qwen25",
      domain: "arxiv.org",
      snippet:
        "Qwen 2.5 introduces improved attention mechanisms and a more efficient tokenizer, resulting in better performance on benchmark tasks while reducing computational overhead.",
    },
    {
      id: "ref-3",
      title: "Local AI Deployment Best Practices - Microsoft Azure",
      url: "https://azure.microsoft.com/en-us/solutions/local-ai",
      domain: "azure.microsoft.com",
      snippet:
        "Learn how to deploy AI models locally for improved privacy, reduced latency, and better control over your data with on-premise solutions.",
    },
    {
      id: "ref-4",
      title: "Semantic Search Implementation with Transformer Models",
      url: "https://www.microsoft.com/en-us/research/semantic-search",
      domain: "microsoft.com",
      snippet:
        "Semantic search leverages transformer-based embeddings to understand query intent, delivering more relevant results compared to traditional keyword matching.",
    },
    {
      id: "ref-5",
      title: "Vector Database Comparison: Qdrant vs Pinecone vs Weaviate",
      url: "https://techcommunity.microsoft.com/vector-databases-comparison",
      domain: "techcommunity.microsoft.com",
      snippet:
        "A detailed comparison of popular vector databases for AI applications, including performance benchmarks, pricing, and integration capabilities.",
    },
  ],
}

// Simulated Entity references
const entityReferences: Record<string, SearchReference[]> = {
  default: [
    {
      id: "ent-1",
      title: "Named Entity Recognition with Modern LLMs - Bing Research",
      url: "https://www.microsoft.com/en-us/research/ner-llms",
      domain: "microsoft.com",
      snippet:
        "Modern approaches to NER using large language models, including zero-shot and few-shot entity extraction techniques for production systems.",
    },
    {
      id: "ent-2",
      title: "Entity Extraction API - Microsoft Cognitive Services",
      url: "https://learn.microsoft.com/en-us/azure/cognitive-services/entity-extraction",
      domain: "learn.microsoft.com",
      snippet:
        "Extract named entities from unstructured text, including people, places, organizations, quantities, and more using Azure AI Language services.",
    },
    {
      id: "ent-3",
      title: "Knowledge Graph Construction from Text Documents",
      url: "https://arxiv.org/abs/2024.knowledge-graphs",
      domain: "arxiv.org",
      snippet:
        "Techniques for building knowledge graphs from text using entity recognition and relation extraction, enabling structured knowledge representation.",
    },
  ],
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  modelId: string
  references?: SearchReference[]
}

const welcomeSuggestions = [
  "Explain how transformers work in neural networks",
  "Extract all entities from a paragraph of text",
  "Search for documentation on vector databases",
  "Write a Python function to sort a linked list",
]

export function ModelSelector() {
  const [selectedModel, setSelectedModel] = useState("entity")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showReferences, setShowReferences] = useState(false)
  const [activeReferences, setActiveReferences] = useState<SearchReference[]>(
    []
  )
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const selected = models.find((m) => m.id === selectedModel)!

  const showsReferences = selectedModel === "search" || selectedModel === "entity"

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleSend = (content: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      modelId: selectedModel,
    }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    setTimeout(() => {
      let refs: SearchReference[] = []
      let response = ""

      if (selectedModel === "search") {
        refs = searchReferences.default
        response = `[Search Mode - Qwen 2.5 7B]\n\nI searched the web for relevant information about your query. Here's what I found:\n\nBased on ${refs.length} sources retrieved via Bing Search, I can provide you with comprehensive information about "${content.slice(0, 60)}${content.length > 60 ? "..." : ""}".\n\nThe search results indicate several key findings from authoritative sources including Microsoft Learn, ArXiv, and Azure documentation. You can review all referenced sources in the panel on the right.`
        setActiveReferences(refs)
        setShowReferences(true)
      } else if (selectedModel === "entity") {
        refs = entityReferences.default
        response = `[Entity Mode - Qwen 2.5 2B]\n\nI've analyzed your input and extracted the following entities using contextual references:\n\nProcessing with the Entity model, I identified relevant entities and cross-referenced them with ${refs.length} knowledge sources via Bing Search.\n\nQuery analyzed: "${content.slice(0, 60)}${content.length > 60 ? "..." : ""}"\n\nRelevant entity sources are available in the references panel.`
        setActiveReferences(refs)
        setShowReferences(true)
      } else {
        response = `[Local Mode - DeepSeek R1 8B]\n\nThinking through this step by step...\n\nThe DeepSeek R1 8B model excels at complex reasoning and code generation. All processing happens entirely on-device with zero data transmission.\n\nAnalyzing: "${content.slice(0, 80)}${content.length > 80 ? "..." : ""}"`
        setShowReferences(false)
        setActiveReferences([])
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response,
        modelId: selectedModel,
        references: refs.length > 0 ? refs : undefined,
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const hasMessages = messages.length > 0

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="shrink-0 border-b border-border/50 bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <TridentLogo className="h-8 w-8" />
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-foreground">
                Trident AI
              </span>
              <span className="hidden text-[10px] text-muted-foreground sm:inline">
                Local Model Interface
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ModelDropdown
              models={models}
              selectedId={selectedModel}
              onSelect={(id) => {
                setSelectedModel(id)
                if (id === "local") {
                  setShowReferences(false)
                }
              }}
            />

            <div className="hidden h-6 w-px bg-border/50 sm:block" />

            {/* Toggle references button - only for search/entity */}
            {showsReferences && hasMessages && activeReferences.length > 0 && (
              <button
                onClick={() => setShowReferences(!showReferences)}
                className={cn(
                  "hidden items-center gap-1.5 rounded-lg border border-border/50 px-2.5 py-1.5 text-xs font-medium transition-all sm:flex",
                  showReferences
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <PanelRight className="h-3.5 w-3.5" />
                <span>Sources</span>
                <span
                  className="flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold"
                  style={{
                    backgroundColor: `${selected.accentColor}20`,
                    color: selected.accentColor,
                  }}
                >
                  {activeReferences.length}
                </span>
              </button>
            )}

            <div className="hidden items-center gap-1.5 rounded-lg bg-secondary/60 px-2.5 py-1.5 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px] shadow-emerald-400/60" />
              <span className="text-[10px] font-medium text-muted-foreground">
                Online
              </span>
            </div>

            <button
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/50 bg-secondary/40 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Settings"
            >
              <Settings2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main content area with optional side panel */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat area */}
        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            {!hasMessages ? (
              <div className="mx-auto flex h-full max-w-3xl flex-col items-center justify-center gap-8 px-4 py-12">
                <div className="flex flex-col items-center gap-4">
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-2xl"
                    style={{
                      backgroundColor: `${selected.accentColor}12`,
                    }}
                  >
                    <selected.icon
                      className="h-8 w-8"
                      style={{ color: selected.accentColor }}
                    />
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <h1 className="text-center text-2xl font-bold text-foreground text-balance">
                      {selected.name} Mode
                    </h1>
                    <p className="font-mono text-sm text-muted-foreground">
                      {selected.modelName} &middot; {selected.params}{" "}
                      parameters
                    </p>
                  </div>
                  <p className="max-w-md text-center text-sm leading-relaxed text-muted-foreground">
                    {selected.id === "entity" &&
                      "Optimized for entity recognition, classification, and structured data extraction. References powered by Bing Search."}
                    {selected.id === "search" &&
                      "Designed for semantic search, document retrieval, and contextual understanding. References powered by Bing Search."}
                    {selected.id === "local" &&
                      "High-capacity reasoning for complex tasks, code generation, and advanced inference. Fully offline."}
                  </p>

                  {/* Bing badge for search/entity */}
                  {showsReferences && (
                    <div className="flex items-center gap-2 rounded-full border border-border/50 bg-secondary/40 px-3 py-1.5">
                      <svg
                        className="h-3.5 w-3.5 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M5 3v16.5l4.67-2.25 5.33 3.25 4-2V5.5L15 8.5l-5.33-3.25L5 3z"
                          fill={selected.accentColor}
                          opacity="0.8"
                        />
                        <path
                          d="M5 3l4.67 2.25v11L5 19.5V3z"
                          fill={selected.accentColor}
                        />
                      </svg>
                      <span className="text-[10px] font-medium text-muted-foreground">
                        Powered by Microsoft Bing Search
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid w-full max-w-lg gap-2.5 sm:grid-cols-2">
                  {welcomeSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSend(suggestion)}
                      className={cn(
                        "rounded-xl border border-border/60 bg-card/50 px-4 py-3.5 text-left text-sm text-muted-foreground",
                        "transition-all hover:border-primary/30 hover:bg-card hover:text-foreground",
                        "hover:shadow-[0_0_20px_-5px] hover:shadow-primary/10"
                      )}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mx-auto max-w-3xl py-4">
                {messages.map((msg) => {
                  const msgModel = models.find(
                    (m) => m.id === msg.modelId
                  )
                  return (
                    <div key={msg.id}>
                      <ChatMessage
                        role={msg.role}
                        content={msg.content}
                        modelName={msgModel?.name}
                        modelIcon={msgModel?.icon}
                        modelAccent={msgModel?.accentColor}
                      />
                      {/* Inline references badge for assistant messages with refs */}
                      {msg.role === "assistant" && msg.references && msg.references.length > 0 && (
                        <div className="flex gap-4 px-4 pb-2">
                          <div className="w-8 shrink-0" />
                          <button
                            onClick={() => {
                              setActiveReferences(msg.references!)
                              setShowReferences(true)
                            }}
                            className="flex items-center gap-2 rounded-lg border border-border/40 bg-secondary/30 px-3 py-2 text-[11px] text-muted-foreground transition-all hover:border-primary/30 hover:bg-secondary/60 hover:text-foreground"
                          >
                            <Globe
                              className="h-3.5 w-3.5"
                              style={{
                                color: msgModel?.accentColor,
                              }}
                            />
                            <span>
                              {msg.references.length} sources from Bing
                              Search
                            </span>
                            <svg
                              className="h-3 w-3 shrink-0 opacity-60"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M5 3v16.5l4.67-2.25 5.33 3.25 4-2V5.5L15 8.5l-5.33-3.25L5 3z"
                                fill={msgModel?.accentColor}
                                opacity="0.8"
                              />
                              <path
                                d="M5 3l4.67 2.25v11L5 19.5V3z"
                                fill={msgModel?.accentColor}
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
                {isLoading && (
                  <div className="flex gap-4 px-4 py-5">
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{
                        backgroundColor: `${selected.accentColor}20`,
                      }}
                    >
                      <selected.icon
                        className="h-4 w-4"
                        style={{ color: selected.accentColor }}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span
                        className="mb-1 text-xs font-medium"
                        style={{ color: selected.accentColor }}
                      >
                        {selected.name}
                        {showsReferences && (
                          <span className="ml-2 text-muted-foreground/60">
                            Searching Bing...
                          </span>
                        )}
                      </span>
                      <div className="flex items-center gap-1.5 rounded-2xl bg-secondary px-4 py-3">
                        <span
                          className="h-2 w-2 animate-bounce rounded-full"
                          style={{
                            backgroundColor: selected.accentColor,
                            animationDelay: "0ms",
                          }}
                        />
                        <span
                          className="h-2 w-2 animate-bounce rounded-full"
                          style={{
                            backgroundColor: selected.accentColor,
                            animationDelay: "150ms",
                          }}
                        />
                        <span
                          className="h-2 w-2 animate-bounce rounded-full"
                          style={{
                            backgroundColor: selected.accentColor,
                            animationDelay: "300ms",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input bar */}
          <div className="shrink-0 border-t border-border/30 bg-background/80 backdrop-blur-md">
            <ChatInput
              onSend={handleSend}
              isLoading={isLoading}
              modelName={selected.modelName}
              modelAccent={selected.accentColor}
            />
          </div>
        </main>

        {/* References side panel */}
        <ReferencesPanel
          references={activeReferences}
          isVisible={showReferences && showsReferences}
          onClose={() => setShowReferences(false)}
          modelAccent={selected.accentColor}
        />
      </div>
    </div>
  )
}
