"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface HistoryItem {
  id: string
  timestamp: Date
  idea: string
  category: string
  variations: number
  provider: string
  prompts: GeneratedPrompt[]
  executions: ExecutionResult[]
}

export interface GeneratedPrompt {
  id: string
  text: string
  systemPrompt: string
  isExecuting?: boolean
}

export interface ExecutionResult {
  id: string
  promptId: string
  response: string
  executionTime: number
  cost: number
  timestamp: Date
}

interface HistoryContextType {
  history: HistoryItem[]
  currentSession: HistoryItem | null
  addToHistory: (item: Omit<HistoryItem, "id" | "timestamp">) => void
  updateCurrentSession: (updates: Partial<HistoryItem>) => void
  clearHistory: () => void
  setCurrentSession: (session: HistoryItem | null) => void
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined)

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [currentSession, setCurrentSession] = useState<HistoryItem | null>(null)

  const addToHistory = (item: Omit<HistoryItem, "id" | "timestamp">) => {
    const newItem: HistoryItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: new Date(),
    }
    setHistory((prev) => [newItem, ...prev])
    setCurrentSession(newItem)
  }

  const updateCurrentSession = (updates: Partial<HistoryItem>) => {
    if (!currentSession) return

    const updatedSession = { ...currentSession, ...updates }
    setCurrentSession(updatedSession)

    setHistory((prev) => prev.map((item) => (item.id === currentSession.id ? updatedSession : item)))
  }

  const clearHistory = () => {
    setHistory([])
    setCurrentSession(null)
  }

  return (
    <HistoryContext.Provider
      value={{
        history,
        currentSession,
        addToHistory,
        updateCurrentSession,
        clearHistory,
        setCurrentSession,
      }}
    >
      {children}
    </HistoryContext.Provider>
  )
}

export function useHistory() {
  const context = useContext(HistoryContext)
  if (context === undefined) {
    throw new Error("useHistory must be used within a HistoryProvider")
  }
  return context
}
