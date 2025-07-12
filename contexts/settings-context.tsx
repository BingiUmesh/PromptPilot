"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { secureStore, secureRetrieve, secureDelete } from "@/lib/crypto"

export type LLMProvider = "openai" | "anthropic" | "google" | "xai"

export interface Settings {
  provider: LLMProvider
  apiKey: string
  systemPrompt: string
  model: string
}

interface SettingsContextType {
  settings: Settings
  updateSettings: (newSettings: Partial<Settings>) => void
  isConfigured: boolean
  clearApiKey: () => void
}

const defaultSettings: Settings = {
  provider: "openai",
  apiKey: "",
  systemPrompt: `"You are an expert prompt engineer. Your task is to take a user's idea and transform it into a well-structured, effective prompt that will produce high-quality results from an AI language model.

Guidelines:
- Make the prompt clear, specific, and actionable
- Include relevant context and constraints
- Use appropriate formatting and structure
- Optimize for the intended use case

User's idea: {IDEA}
Category: {CATEGORY}

Create a professional, effective prompt based on this idea:"`,
  model: "gpt-4o",
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Load settings from secure storage
    try {
      const savedProvider = localStorage.getItem("promptpilot_provider") as LLMProvider
      const savedModel = localStorage.getItem("promptpilot_model")
      const savedSystemPrompt = localStorage.getItem("promptpilot_system_prompt")
      const savedApiKey = secureRetrieve("promptpilot_api_key")

      if (savedProvider || savedModel || savedSystemPrompt || savedApiKey) {
        setSettings((prev) => ({
          ...prev,
          provider: savedProvider || prev.provider,
          model: savedModel || prev.model,
          systemPrompt: savedSystemPrompt || prev.systemPrompt,
          apiKey: savedApiKey || prev.apiKey,
        }))
      }
    } catch (error) {
      console.error("Error loading settings:", error)
      // If there's an error with stored settings, use defaults
    } finally {
      setIsInitialized(true)
    }
  }, [])

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings }

      try {
        // Save non-sensitive settings to regular localStorage
        if (newSettings.provider) {
          localStorage.setItem("promptpilot_provider", newSettings.provider)
        }
        if (newSettings.model) {
          localStorage.setItem("promptpilot_model", newSettings.model)
        }
        if (newSettings.systemPrompt) {
          localStorage.setItem("promptpilot_system_prompt", newSettings.systemPrompt)
        }

        // Save API key to secure storage with 24-hour expiration
        if (newSettings.apiKey !== undefined) {
          if (newSettings.apiKey) {
            secureStore("promptpilot_api_key", newSettings.apiKey, 24)
          } else {
            secureDelete("promptpilot_api_key")
          }
        }
      } catch (error) {
        console.error("Error saving settings:", error)
        // Continue with updated settings even if storage fails
      }

      return updated
    })
  }

  const clearApiKey = () => {
    try {
      secureDelete("promptpilot_api_key")
      setSettings((prev) => ({ ...prev, apiKey: "" }))
    } catch (error) {
      console.error("Error clearing API key:", error)
    }
  }

  const isConfigured = settings.apiKey.length > 0

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, isConfigured, clearApiKey }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
