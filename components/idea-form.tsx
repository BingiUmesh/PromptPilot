"use client"

import { useState } from "react"
import { Sparkles, AlertCircle } from "lucide-react"
import { useSettings } from "@/contexts/settings-context"
import { useHistory } from "@/contexts/history-context"
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
  "Scripts",
  "SEO & Metadata",
  "Health & Wellness",
  "E-commerce",
  "Learning & Quizzes"
];



export function IdeaForm() {
  const [idea, setIdea] = useState("")
  const [category, setCategory] = useState("Marketing")
  const [variations, setVariations] = useState(3)
  const [isGenerating, setIsGenerating] = useState(false)

  const { settings, isConfigured } = useSettings()
  const { addToHistory } = useHistory()

  const handleExampleSelect = (exampleIdea: string, exampleCategory: string) => {
    setIdea(exampleIdea)
    setCategory(exampleCategory)
  }

  const handleGenerate = async () => {
    if (!idea.trim() || !isConfigured) return

    setIsGenerating(true)

    try {
      const response = await fetch("/api/generate-prompts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idea: idea.trim(),
          category,
          variations,
          settings,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate prompts")
      }

      const { prompts } = await response.json()

      // Add to history
      addToHistory({
        idea: idea.trim(),
        category,
        variations,
        provider: settings.provider,
        prompts: prompts.map((text: string, index: number) => ({
          id: `prompt-${Date.now()}-${index}`,
          text,
          systemPrompt: settings.systemPrompt,
        })),
        executions: [],
      })

      // Clear form
      setIdea("")
    } catch (error) {
      console.error("Error generating prompts:", error)
      alert("Failed to generate prompts. Please check your settings and try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-8">
      <ExampleCarousel onSelectExample={handleExampleSelect} />

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="space-y-6">
          {/* Configuration Warning */}
          {!isConfigured && (
            <div className="flex items-center space-x-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <p className="text-amber-800">Please configure your API key in Settings before generating prompts.</p>
            </div>
          )}

          {/* Idea Input */}
          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-900">Your Idea</label>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Describe what you want to create or accomplish..."
              rows={4}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Category and Variations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-lg font-semibold text-gray-900">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-lg font-semibold text-gray-900">Number of Variations</label>
              <input
                type="number"
                min="1"
                max="10"
                value={variations}
                onChange={(e) => setVariations(Math.max(1, Math.min(10, Number.parseInt(e.target.value) || 1)))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!idea.trim() || !isConfigured || isGenerating}
            className="w-full flex items-center justify-center space-x-2 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg"
          >
            <Sparkles className={`w-5 h-5 ${isGenerating ? "animate-spin" : ""}`} />
            <span>{isGenerating ? "Generating Prompts..." : "Generate Prompts"}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
