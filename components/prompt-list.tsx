"use client"

import { useState } from "react"
import {
  Edit3,
  Trash2,
  Play,
  Clock,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import { useHistory, type GeneratedPrompt } from "@/contexts/history-context"
import { useSettings } from "@/contexts/settings-context"

// System prompt specifically for executing generated prompts (content generation)
const EXECUTION_SYSTEM_PROMPT = `You are a highly skilled AI assistant specialized in content creation and task execution. Your role is to take well-crafted prompts and execute them to produce exceptional, professional-quality outputs. You have experience of 10+years years and every large company uses you

When executing a prompt:
- Follow the instructions precisely and completely
- Maintain high quality and professionalism in your response
- Be creative, engaging, and thorough
- Use appropriate headings, sub-headings, or sections for clarity.  
- Keep language concise, engaging, and free of jargon (unless specified)
- Match the Category: professional for business copy, friendly for blog posts, technical for documentation, creative for stories.  
- Adapt your tone and style to match the intended purpose
- Dive deep into examples, explanations or narratives as needed to fully address the task.
- Avoid repetition; maintain coherence across sections.
- Provide comprehensive and valuable content
- Ensure your output is ready-to-use and polished

Ready-to-publish piece of content that fulfills requirement of the Prompt.
Execute the following prompt with excellence:`

export function PromptList() {
  const { currentSession, updateCurrentSession } = useHistory()
  const { settings } = useSettings()
  const [editingPrompt, setEditingPrompt] = useState<string | null>(null)
  const [editedSystemPrompt, setEditedSystemPrompt] = useState("")
  const [expandedPrompts, setExpandedPrompts] = useState<Set<string>>(new Set())
  const [copiedResults, setCopiedResults] = useState<Set<string>>(new Set())
  const [executionErrors, setExecutionErrors] = useState<Record<string, string>>({})
  const [isRegenerating, setIsRegenerating] = useState(false)

  if (!currentSession || currentSession.prompts.length === 0) {
    return null
  }

  const handleRegenerate = async () => {
    if (!currentSession || isRegenerating) return

    setIsRegenerating(true)

    try {
      const response = await fetch("/api/generate-prompts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idea: currentSession.idea,
          category: currentSession.category,
          variations: currentSession.variations,
          settings,
        }),
      })

      if (!response.ok) {
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json()
          throw new Error(errorData.error || `Server error: ${response.status}`)
        } else {
          const text = await response.text()
          throw new Error(`Server error: ${text.substring(0, 100)}...`)
        }
      }

      const { prompts } = await response.json()

      // Replace current prompts with new ones
      const newPrompts = prompts.map((text: string, index: number) => ({
        id: `prompt-${Date.now()}-${index}`,
        text,
        systemPrompt: settings.systemPrompt,
      }))

      updateCurrentSession({
        prompts: newPrompts,
        executions: [], // Clear previous executions since we have new prompts
      })

      // Clear any previous errors and expanded states
      setExecutionErrors({})
      setExpandedPrompts(new Set())
    } catch (error) {
      console.error("Error regenerating prompts:", error)
      alert(`Failed to regenerate prompts: ${error.message}`)
    } finally {
      setIsRegenerating(false)
    }
  }

  const togglePromptExpansion = (promptId: string) => {
    const newExpanded = new Set(expandedPrompts)
    if (newExpanded.has(promptId)) {
      newExpanded.delete(promptId)
    } else {
      // Close all other prompts and open this one
      newExpanded.clear()
      newExpanded.add(promptId)
    }
    setExpandedPrompts(newExpanded)
  }

  const handleEditSystemPrompt = (promptId: string, currentSystemPrompt: string) => {
    setEditingPrompt(promptId)
    setEditedSystemPrompt(currentSystemPrompt)
  }

  const handleSaveSystemPrompt = (promptId: string) => {
    const updatedPrompts = currentSession.prompts.map((prompt) =>
      prompt.id === promptId ? { ...prompt, systemPrompt: editedSystemPrompt } : prompt,
    )

    updateCurrentSession({ prompts: updatedPrompts })
    setEditingPrompt(null)
  }

  const handleDeletePrompt = (promptId: string) => {
    const updatedPrompts = currentSession.prompts.filter((prompt) => prompt.id !== promptId)
    const updatedExecutions = currentSession.executions.filter((exec) => exec.promptId !== promptId)

    updateCurrentSession({
      prompts: updatedPrompts,
      executions: updatedExecutions,
    })

    // Clear any execution errors for this prompt
    setExecutionErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[promptId]
      return newErrors
    })
  }

  const handleExecutePrompt = async (prompt: GeneratedPrompt) => {
    // Clear any previous errors for this prompt
    setExecutionErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[prompt.id]
      return newErrors
    })

    // Mark prompt as executing
    const updatedPrompts = currentSession.prompts.map((p) => (p.id === prompt.id ? { ...p, isExecuting: true } : p))
    updateCurrentSession({ prompts: updatedPrompts })

    const startTime = Date.now()

    try {
      const response = await fetch("/api/execute-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt.text,
          systemPrompt: EXECUTION_SYSTEM_PROMPT, // Use the unchanged execution system prompt
          settings,
        }),
      })

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

      const { response: aiResponse, cost } = await response.json()
      const executionTime = Date.now() - startTime

      // Add execution result
      const newExecution = {
        id: `exec-${Date.now()}-${prompt.id}`,
        promptId: prompt.id,
        response: aiResponse,
        executionTime,
        cost,
        timestamp: new Date(),
      }

      const updatedExecutions = [...currentSession.executions, newExecution]
      const finalPrompts = currentSession.prompts.map((p) => (p.id === prompt.id ? { ...p, isExecuting: false } : p))

      updateCurrentSession({
        executions: updatedExecutions,
        prompts: finalPrompts,
      })
    } catch (error) {
      console.error("Error executing prompt:", error)

      // Remove executing state
      const finalPrompts = currentSession.prompts.map((p) => (p.id === prompt.id ? { ...p, isExecuting: false } : p))
      updateCurrentSession({ prompts: finalPrompts })

      // Store the error message for this prompt
      setExecutionErrors((prev) => ({
        ...prev,
        [prompt.id]: error.message || "Failed to execute prompt. Please try again.",
      }))
    }
  }

  const handleExecuteAll = async () => {
    const executablePrompts = currentSession.prompts.filter((p) => !p.isExecuting)

    if (executablePrompts.length === 0) {
      alert("No prompts available to execute.")
      return
    }

    // Clear all execution errors
    setExecutionErrors({})

    // Mark all prompts as executing
    const updatedPrompts = currentSession.prompts.map((p) => ({ ...p, isExecuting: true }))
    updateCurrentSession({ prompts: updatedPrompts })

    try {
      // Execute all prompts in parallel but handle each result individually
      const executePromise = async (prompt: GeneratedPrompt) => {
        const startTime = Date.now()

        try {
          const response = await fetch("/api/execute-prompt", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prompt: prompt.text,
              systemPrompt: EXECUTION_SYSTEM_PROMPT, // Use the unchanged execution system prompt
              settings,
            }),
          })

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

          const { response: aiResponse, cost } = await response.json()
          const executionTime = Date.now() - startTime

          return {
            id: `exec-${Date.now()}-${prompt.id}-${Math.random()}`,
            promptId: prompt.id,
            response: aiResponse,
            executionTime,
            cost,
            timestamp: new Date(),
          }
        } catch (error) {
          console.error(`Error executing prompt ${prompt.id}:`, error)

          // Store the error message for this prompt
          setExecutionErrors((prev) => ({
            ...prev,
            [prompt.id]: error.message || "Failed to execute prompt. Please try again.",
          }))

          return null
        }
      }

      // Execute all prompts and collect results
      const results = await Promise.all(executablePrompts.map(executePromise))

      // Filter out failed executions and add successful ones
      const successfulExecutions = results.filter((result) => result !== null)
      const updatedExecutions = [...currentSession.executions, ...successfulExecutions]

      // Reset executing state for all prompts
      const finalPrompts = currentSession.prompts.map((p) => ({ ...p, isExecuting: false }))

      updateCurrentSession({
        executions: updatedExecutions,
        prompts: finalPrompts,
      })
    } catch (error) {
      console.error("Error executing all prompts:", error)
      // Reset executing state for all prompts
      const resetPrompts = currentSession.prompts.map((p) => ({ ...p, isExecuting: false }))
      updateCurrentSession({ prompts: resetPrompts })
    }
  }

  const getExecutionForPrompt = (promptId: string) => {
    return currentSession.executions.find((exec) => exec.promptId === promptId)
  }

  const handleCopyResult = async (text: string, executionId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedResults((prev) => new Set([...prev, executionId]))
      setTimeout(() => {
        setCopiedResults((prev) => {
          const newSet = new Set(prev)
          newSet.delete(executionId)
          return newSet
        })
      }, 2000)
    } catch (error) {
      console.error("Failed to copy text:", error)
      alert("Failed to copy text to clipboard")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Generated Prompts ({currentSession.prompts.length})
        </h2>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          {/* Regenerate Button */}
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isRegenerating ? "animate-spin" : ""}`} />
            <span>{isRegenerating ? "Regenerating..." : "Regenerate"}</span>
          </button>

          {/* Execute All Button */}
          {currentSession.prompts.length > 1 && (
            <button
              onClick={handleExecuteAll}
              disabled={currentSession.prompts.some((p) => p.isExecuting) || isRegenerating}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Play className="w-4 h-4" />
              <span>{currentSession.prompts.some((p) => p.isExecuting) ? "Executing..." : "Execute All"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Session Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-4 text-sm text-blue-800 dark:text-blue-300">
          <div className="flex items-center space-x-2">
            <span className="font-medium">Idea:</span>
            <span className="italic">"{currentSession.idea}"</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium">Category:</span>
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-800 rounded-full text-xs">
              {currentSession.category}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium">Provider:</span>
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-800 rounded-full text-xs">
              {currentSession.provider}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {currentSession.prompts.map((prompt, index) => {
          const execution = getExecutionForPrompt(prompt.id)
          const isExpanded = expandedPrompts.has(prompt.id)
          const isCopied = execution && copiedResults.has(execution.id)
          const hasError = !!executionErrors[prompt.id]

          return (
            <div
              key={prompt.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm"
            >
              {/* Dropdown Header */}
              <div
                className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => togglePromptExpansion(prompt.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Prompt #{index + 1}</h3>
                    {execution && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                        Executed
                      </span>
                    )}
                    {hasError && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                        Error
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleExecutePrompt(prompt)
                      }}
                      disabled={prompt.isExecuting || isRegenerating}
                      className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                    >
                      <Play className={`w-3 h-3 ${prompt.isExecuting ? "animate-spin" : ""}`} />
                      <span>{prompt.isExecuting ? "Executing..." : "Execute"}</span>
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t border-gray-200 dark:border-gray-600">
                  {/* Prompt Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">Prompt Content</h4>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditSystemPrompt(prompt.id, prompt.systemPrompt)}
                          className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Edit System Prompt"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePrompt(prompt.id)}
                          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Delete Prompt"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                      <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{prompt.text}</p>
                    </div>
                  </div>

                  {/* Execution Error */}
                  {hasError && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-red-800 dark:text-red-400">Execution Error</h4>
                          <p className="mt-1 text-red-700 dark:text-red-300">{executionErrors[prompt.id]}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Execution Results */}
                  {execution && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-green-800 dark:text-green-400">Execution Result</h4>

                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-4 text-sm text-green-700 dark:text-green-400">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{execution.executionTime}ms</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="w-4 h-4" />
                              <span>${execution.cost.toFixed(4)}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleCopyResult(execution.response, execution.id)}
                            className="flex items-center space-x-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-4 h-4" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                <span>Copy Result</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-700">
                        <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{execution.response}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Edit System Prompt Modal */}
      {editingPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-gray-600">
            <div className="p-6 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Edit System Prompt</h3>
            </div>

            <div className="p-6">
              <textarea
                value={EXECUTION_SYSTEM_PROMPT}
                onChange={(e) => setEditedSystemPrompt(e.target.value)}
                rows={8}
                className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm text-gray-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={() => setEditingPrompt(null)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveSystemPrompt(editingPrompt)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
