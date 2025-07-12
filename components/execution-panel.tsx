"use client"

import { DollarSign, Clock, Zap } from "lucide-react"
import { useHistory } from "@/contexts/history-context"

export function ExecutionPanel() {
  const { currentSession } = useHistory()

  if (!currentSession || currentSession.executions.length === 0) {
    return null
  }

  const totalCost = currentSession.executions.reduce((sum, exec) => sum + exec.cost, 0)
  const avgExecutionTime =
    currentSession.executions.reduce((sum, exec) => sum + exec.executionTime, 0) / currentSession.executions.length
  const totalExecutions = currentSession.executions.length

  return (
    <div className="mt-6 sm:mt-8 bg-gray-800 dark:bg-gray-700 rounded-xl border border-gray-600 p-4 sm:p-6">
      <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Execution Summary</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="flex items-center space-x-3 p-3 sm:p-4 bg-blue-900 bg-opacity-30 rounded-lg border border-blue-600">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-blue-400 font-medium">Total Executions</p>
            <p className="text-xl sm:text-2xl font-bold text-blue-300">{totalExecutions}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 sm:p-4 bg-green-900 bg-opacity-30 rounded-lg border border-green-600">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-green-400 font-medium">Avg Response Time</p>
            <p className="text-xl sm:text-2xl font-bold text-green-300">{Math.round(avgExecutionTime)}ms</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 sm:p-4 bg-purple-900 bg-opacity-30 rounded-lg border border-purple-600 sm:col-span-2 lg:col-span-1">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-purple-400 font-medium">Total Cost</p>
            <p className="text-xl sm:text-2xl font-bold text-purple-300">${totalCost.toFixed(4)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
