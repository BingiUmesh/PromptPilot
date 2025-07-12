"use client"

import { useState, useEffect } from "react"
import { WifiOff, X } from "lucide-react"

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowNotification(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowNotification(true)
    }

    // Check initial status
    setIsOnline(navigator.onLine)

    // Add event listeners
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Also monitor fetch failures as a backup
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args)
        if (!response.ok && response.status >= 500) {
          // Server errors might indicate network issues
          setShowNotification(true)
        }
        return response
      } catch (error) {
        // Network error
        if (error.message?.includes("Failed to fetch") || error.message?.includes("NetworkError")) {
          setIsOnline(false)
          setShowNotification(true)
        }
        throw error
      }
    }

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      window.fetch = originalFetch
    }
  }, [])

  if (!showNotification || isOnline) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-red-600 text-white rounded-lg shadow-lg p-4 border border-red-700">
        <div className="flex items-start space-x-3">
          <WifiOff className="w-5 h-5 text-red-200 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-sm">Network Issue</h4>
            <p className="text-sm text-red-100 mt-1">
              {!navigator.onLine
                ? "You're currently offline. Please check your internet connection."
                : "Having trouble connecting to our servers. Please try again."}
            </p>
          </div>
          <button
            onClick={() => setShowNotification(false)}
            className="p-1 hover:bg-red-700 rounded transition-colors flex-shrink-0"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!navigator.onLine && (
          <div className="mt-3 pt-3 border-t border-red-500">
            <button
              onClick={() => window.location.reload()}
              className="text-sm bg-red-700 hover:bg-red-800 px-3 py-1.5 rounded transition-colors"
            >
              Retry Connection
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
