"use client"

import { useState } from "react"
import { Calendar, Tag, Brain, Trash2, Eye } from "lucide-react"
import { useHistory, type HistoryItem } from "@/contexts/history-context"

export function HistoryPanel() {
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
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No History Yet</h3>
        <p className="text-gray-600">
          Your prompt generation sessions will appear here once you start creating prompts.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">History ({history.length} sessions)</h2>

        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className="grid gap-4">
        {history.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Tag className="w-3 h-3 mr-1" />
                    {item.category}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    <Brain className="w-3 h-3 mr-1" />
                    {item.provider}
                  </span>
                  <span className="text-sm text-gray-500">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    {formatDate(item.timestamp)}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.idea}</h3>

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{item.prompts.length} prompts generated</span>
                  <span>{item.executions.length} executions</span>
                  {item.executions.length > 0 && (
                    <span>${item.executions.reduce((sum, exec) => sum + exec.cost, 0).toFixed(4)} total cost</span>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleViewSession(item)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>View</span>
              </button>
            </div>

            {/* Preview of first prompt */}
            {item.prompts.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-700 line-clamp-2">{item.prompts[0].text}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Session Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedItem.idea}</h3>
                  <p className="text-gray-600 mt-1">
                    {formatDate(selectedItem.timestamp)} • {selectedItem.category} • {selectedItem.provider}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {selectedItem.prompts.map((prompt, index) => {
                const execution = selectedItem.executions.find((exec) => exec.promptId === prompt.id)

                return (
                  <div key={prompt.id} className="border border-gray-200 rounded-lg">
                    <div className="p-4 border-b border-gray-100">
                      <h4 className="font-semibold text-gray-900 mb-2">Prompt #{index + 1}</h4>
                      <p className="text-gray-800 whitespace-pre-wrap">{prompt.text}</p>
                    </div>

                    {execution && (
                      <div className="p-4 bg-green-50">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-green-800">Response</h5>
                          <div className="text-sm text-green-700">
                            {execution.executionTime}ms • ${execution.cost.toFixed(4)}
                          </div>
                        </div>
                        <p className="text-gray-800 whitespace-pre-wrap">{execution.response}</p>
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
