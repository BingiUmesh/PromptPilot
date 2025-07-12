"use client"

import { Settings, Sun, Moon, Sparkles, BookOpen } from "lucide-react"
import { useState } from "react"
import { SettingsModal } from "./settings-modal"
import { DocsModal } from "./docs-modal"
import { useSettings } from "@/contexts/settings-context"
import { useTheme } from "@/contexts/theme-context"

export function Header() {
  const [showSettings, setShowSettings] = useState(false)
  const [showDocs, setShowDocs] = useState(false)
  const { settings } = useSettings()
  const { theme, toggleTheme } = useTheme()

  const getProviderDisplayName = (provider: string, model: string) => {
    switch (provider) {
      case "openai":
        return model.includes("gpt-4o") ? "GPT-4o" : "GPT-3.5"
      case "anthropic":
        return model.includes("sonnet") ? "Claude Sonnet" : "Claude Haiku"
      case "google":
        return model.includes("pro") ? "Gemini 1.5 Pro" : "Gemini 1.5 Flash"
      case "xai":
        return "Grok Beta"
      default:
        return "Select Model"
    }
  }

  return (
    <>
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                <span className="hidden sm:inline">PromptPilot</span>
                <span className="sm:hidden">PromptPilot</span>
              </h1>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium hidden xs:block">
                {getProviderDisplayName(settings.provider, settings.model)}
              </span>

              <button
                onClick={() => setShowDocs(true)}
                className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Documentation"
              >
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                onClick={() => setShowSettings(true)}
                className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Settings"
              >
                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                onClick={toggleTheme}
                className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <DocsModal isOpen={showDocs} onClose={() => setShowDocs(false)} />
    </>
  )
}
