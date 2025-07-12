"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Sparkles, AlertCircle, Info, Loader2 } from "lucide-react"
import { useSettings } from "@/contexts/settings-context"
import { useHistory } from "@/contexts/history-context"
import { PromptList } from "./prompt-list"
import { ExecutionPanel } from "./execution-panel"
import { ExampleCarousel } from "./example-carousel"

const categories = [
  // Categories used in ideas (in order)
  "Marketing",
  "Social Media",
  "Resume & Career",
  "Blog",
  "Storytelling & Character Building",
  "Legal & Policies",
  "Customer Support",
  "Social Media",
  "Education",
  "Product",
  "Creative Writing",
  "Business",
  "Research",
  "UX/UI Design",
  "Scripts",
  "SEO & Metadata",
  "Health & Wellness",
  "E-commerce",
  "Learning & Quizzes",
]

export function PromptRefinerTab() {
  const [basePrompt, setBasePrompt] = useState("")
  const [category, setCategory] = useState("Marketing")
  const [variations, setVariations] = useState(3)
  const [variationsInput, setVariationsInput] = useState("3") // Separate state for input
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const { settings, isConfigured } = useSettings()
  const { addToHistory, currentSession } = useHistory()

  const validateApiKey = (provider: string, apiKey: string) => {
    if (!apiKey || apiKey.length < 10) return false

    switch (provider) {
      case "openai":
        return apiKey.startsWith("sk-") && apiKey.length > 20
      case "anthropic":
        return apiKey.startsWith("sk-ant-") && apiKey.length > 30
      case "google":
        return apiKey.startsWith("AI") && apiKey.length > 15
      case "xai":
        return apiKey.startsWith("xai-") && apiKey.length > 20
      default:
        return apiKey.length > 10
    }
  }

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsGenerating(false)
    setGenerationProgress(0)
    setError("Generation stopped by user")
  }

  const handleRefinePrompts = async () => {
    if (!basePrompt.trim() || !isConfigured) return

    if (isGenerating) {
      handleStopGeneration()
      return
    }

    // Clear previous errors
    setError(null)
    setGenerationProgress(0)

    // Basic validation - more lenient
    if (!validateApiKey(settings.provider, settings.apiKey)) {
      setError(
        `Please check your API key format for ${settings.provider}. Make sure it's complete and correctly formatted.`,
      )
      return
    }

    setIsGenerating(true)

    // Create abort controller for this generation
    abortControllerRef.current = new AbortController()

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 90) return prev
        return prev + Math.random() * 10
      })
    }, 500)

    try {
      const response = await fetch("/api/generate-prompts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idea: basePrompt.trim(),
          category,
          variations,
          settings,
        }),
        signal: abortControllerRef.current.signal,
      })

      // Check if the request was aborted
      if (abortControllerRef.current.signal.aborted) {
        clearInterval(progressInterval)
        return
      }

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        const contentType = response.headers.get("content-type")

        // Try to parse as JSON if the content type is JSON
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json()
          throw new Error(errorData.error || `Server error: ${response.status}`)
        } else {
          // Handle non-JSON responses
          const text = await response.text()
          throw new Error(`Server error: ${text.substring(0, 100)}...`)
        }
      }

      const data = await response.json()

      // Check again if aborted after receiving response
      if (abortControllerRef.current.signal.aborted) {
        clearInterval(progressInterval)
        return
      }

      // Complete progress
      setGenerationProgress(100)

      // Add to history
      addToHistory({
        idea: basePrompt.trim(),
        category,
        variations,
        provider: settings.provider,
        prompts: data.prompts.map((text: string, index: number) => ({
          id: `prompt-${Date.now()}-${index}`,
          text,
          systemPrompt: settings.systemPrompt,
        })),
        executions: [],
      })

      // Clear the form after successful generation
      setBasePrompt("")
    } catch (error) {
      // Don't show error if it was aborted by user
      if (error.name === "AbortError" || abortControllerRef.current?.signal.aborted) {
        clearInterval(progressInterval)
        return
      }

      console.error("Error generating prompts:", error)

      let errorMessage = "Failed to generate prompts. Please try again."

      // Check for network errors
      if (error.message?.includes("Failed to fetch") || error.message?.includes("NetworkError")) {
        errorMessage = "Network error: Please check your internet connection and try again."
      } else if (error.message?.includes("API key") || error.message?.includes("authentication")) {
        errorMessage = `API Key Error: ${error.message}\n\nPlease verify your API key in Settings. Make sure it's valid and has the correct permissions.`
      } else if (error.message?.includes("quota") || error.message?.includes("billing")) {
        errorMessage = "Quota or billing issue. Please check your account with the AI provider."
      } else if (error.message?.includes("timeout")) {
        errorMessage = "Request timed out. Please try again with fewer variations or a shorter prompt."
      } else if (error.message?.includes("rate limit")) {
        errorMessage = "Too many requests. Please wait a moment and try again."
      } else if (error.message?.includes("Server error")) {
        errorMessage = error.message
      }

      setError(errorMessage)
    } finally {
      clearInterval(progressInterval)
      setIsGenerating(false)
      setGenerationProgress(0)
      abortControllerRef.current = null
    }
  }

  const handleExampleSelect = (exampleIdea: string, exampleCategory: string) => {
    setBasePrompt(exampleIdea)
    setCategory(exampleCategory)
  }

  const handleVariationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setVariationsInput(value) // Always update the input display

    // Validate and set the actual variations value
    if (value === "") {
      setVariations(1)
      return
    }

    const numValue = Number.parseInt(value)
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 10) {
      setVariations(numValue)
    }
  }

  const handleVariationsBlur = () => {
    // On blur, ensure the input shows a valid value
    if (variationsInput === "" || isNaN(Number.parseInt(variationsInput))) {
      setVariationsInput("1")
      setVariations(1)
    } else {
      const numValue = Math.max(1, Math.min(10, Number.parseInt(variationsInput)))
      setVariationsInput(numValue.toString())
      setVariations(numValue)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Compact Example Carousel */}
      <div className="mb-4 sm:mb-6">
        <ExampleCarousel onSelectExample={handleExampleSelect} />
      </div>

      {/* API Key Warning - More compact */}
      {!isConfigured && (
        <div className="flex items-start space-x-3 p-3 sm:p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm sm:text-base text-amber-800 dark:text-amber-400">
            Please configure your API key in Settings before generating prompts.
          </p>
        </div>
      )}

      {/* Error Message - More compact */}
      {error && (
        <div className="flex items-start space-x-3 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm sm:text-base text-red-800 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Main Input Form - Optimized for single screen view */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4 lg:p-6">
        <div className="space-y-3 sm:space-y-4 lg:space-y-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Your Idea</h2>

          {/* Textarea - More compact */}
          <div className="space-y-2">
            <textarea
              value={basePrompt}
              onChange={(e) => setBasePrompt(e.target.value)}
              placeholder="Describe what you want to create or accomplish..."
              rows={3}
              className="w-full p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
            />
          </div>

          {/* Category and Variations - Responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            <div className="space-y-2">
              <label className="block text-sm sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-white">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-white">
                Number of Variations
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={variationsInput}
                onChange={handleVariationsChange}
                onBlur={handleVariationsBlur}
                className="w-full p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                placeholder="1-10"
              />
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <Info className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span>You can generate up to 10 prompt variations</span>
              </div>
            </div>
          </div>

          {/* Generation Progress Bar */}
          {isGenerating && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Generating prompts...</span>
                <span>{Math.round(generationProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Generate/Stop Button - Responsive */}
          <button
            onClick={handleRefinePrompts}
            disabled={!basePrompt.trim() || !isConfigured}
            className={`w-full flex items-center justify-center space-x-2 py-3 sm:py-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-sm sm:text-base lg:text-lg shadow-lg ${
              isGenerating
                ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            }`}
          >
            {isGenerating ? (
              <>
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                </div>
                <span>Stop Generating</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Generate Prompts</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Section - Scrollable */}
      {currentSession && (
        <div className="space-y-6 sm:space-y-8">
          <PromptList />
          <ExecutionPanel />
        </div>
      )}
    </div>
  )
}
