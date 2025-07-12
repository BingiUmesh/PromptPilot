"use client"

import { Calendar, Tag, Brain, Trash2, Eye, X } from "lucide-react"
import { useState } from "react"
import { useHistory, type HistoryItem } from "@/contexts/history-context"

export function HistoryTab() {
  const { history, clearHistory, setCurrentSession } = useHistory()
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null)

  const handleViewSession = (item: HistoryItem) => {
    setCurrentSession(item)
    setSelectedItem(item)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-700 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No History Yet</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Your prompt generation sessions will appear here once you start creating prompts.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">History ({history.length} sessions)</h2>

        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center space-x-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className="grid gap-3 sm:gap-4">
        {history.map((item) => (
          <div key={item.id} className="bg-gray-800 dark:bg-gray-700 border border-gray-600 rounded-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 space-y-3 sm:space-y-0">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                  <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-600 text-white">
                    <Tag className="w-3 h-3 mr-1" />
                    {item.category}
                  </span>
                  <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-600 text-gray-200">
                    <Brain className="w-3 h-3 mr-1" />
                    {item.provider}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-400 flex items-center">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                    {formatDate(item.timestamp)}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-semibold text-white mb-2 break-words">{item.idea}</h3>

                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400">
                  <span>{item.prompts.length} prompts generated</span>
                  <span>{item.executions.length} executions</span>
                  {item.executions.length > 0 && (
                    <span>${item.executions.reduce((sum, exec) => sum + exec.cost, 0).toFixed(4)} total cost</span>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleViewSession(item)}
                className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm w-full sm:w-auto"
              >
                <Eye className="w-4 h-4" />
                <span>View</span>
              </button>
            </div>

            {/* Preview of first prompt */}
            {item.prompts.length > 0 && (
              <div className="bg-gray-700 dark:bg-gray-600 rounded-lg p-3">
                <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 break-words">{item.prompts[0].text}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Session Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-gray-800 dark:bg-gray-700 rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto border border-gray-600">
            <div className="p-4 sm:p-6 border-b border-gray-600">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-white break-words">{selectedItem.idea}</h3>
                  <p className="text-gray-400 mt-1 text-sm sm:text-base">
                    {formatDate(selectedItem.timestamp)} • {selectedItem.category} • {selectedItem.provider}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-2 hover:bg-gray-600 rounded-lg transition-colors text-gray-400 hover:text-white self-end sm:self-auto"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {selectedItem.prompts.map((prompt, index) => {
                const execution = selectedItem.executions.find((exec) => exec.promptId === prompt.id)

                return (
                  <div key={prompt.id} className="border border-gray-600 rounded-lg">
                    <div className="p-3 sm:p-4 border-b border-gray-600">
                      <h4 className="font-semibold text-white mb-2 text-sm sm:text-base">Prompt #{index + 1}</h4>
                      <p className="text-gray-300 whitespace-pre-wrap text-xs sm:text-sm break-words">{prompt.text}</p>
                    </div>

                    {execution && (
                      <div className="p-3 sm:p-4 bg-green-900 bg-opacity-30">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 space-y-2 sm:space-y-0">
                          <h5 className="font-medium text-green-400 text-sm sm:text-base">Response</h5>
                          <div className="text-xs sm:text-sm text-green-400 flex items-center space-x-2 sm:space-x-4">
                            <span>{execution.executionTime}ms</span>
                            <span>${execution.cost.toFixed(4)}</span>
                          </div>
                        </div>
                        <p className="text-gray-300 whitespace-pre-wrap text-xs sm:text-sm break-words">
                          {execution.response}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
