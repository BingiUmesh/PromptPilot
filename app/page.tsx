"use client"

import { useState } from "react"
import { SettingsProvider } from "@/contexts/settings-context"
import { HistoryProvider, useHistory } from "@/contexts/history-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PromptRefinerTab } from "@/components/prompt-refiner-tab"
import { HistoryTab } from "@/components/history-tab"
import { NetworkStatus } from "@/components/network-status"

function MainContent() {
  const [activeTab, setActiveTab] = useState<"refiner" | "history">("refiner")
  const { history } = useHistory()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors flex flex-col">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 flex-1">
        <div className="max-w-6xl mx-auto">
          {/* Tab Navigation - Responsive */}
          <div className="flex space-x-1 mb-4 sm:mb-6 lg:mb-8">
            <button
              onClick={() => setActiveTab("refiner")}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                activeTab === "refiner"
                  ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md border border-gray-200 dark:border-gray-700"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-800/50"
              }`}
            >
              Prompt Refiner
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                activeTab === "history"
                  ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md border border-gray-200 dark:border-gray-700"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-800/50"
              }`}
            >
              <span className="hidden sm:inline">History </span>
              <span className="sm:hidden">History </span>({history.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="w-full">{activeTab === "refiner" ? <PromptRefinerTab /> : <HistoryTab />}</div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Network Status Notification */}
      <NetworkStatus />
    </div>
  )
}

export default function Home() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <HistoryProvider>
          <MainContent />
        </HistoryProvider>
      </SettingsProvider>
    </ThemeProvider>
  )
}
