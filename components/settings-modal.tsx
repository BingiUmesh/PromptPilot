"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Key, Brain, FileText, ExternalLink, Shield, Trash2, CheckCircle, Eye, EyeOff } from "lucide-react"
import { useSettings, type LLMProvider } from "@/contexts/settings-context"
import { clearAllSecureData } from "@/lib/crypto"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

const providerOptions = [
  {
    value: "openai" as LLMProvider,
    label: "OpenAI (GPT)",
    models: ["gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo"],
    keyUrl: "https://platform.openai.com/api-keys",
    keyFormat: "sk-...",
    keyExample: "sk-1234567890abcdef...",
  },
  {
    value: "anthropic" as LLMProvider,
    label: "Anthropic (Claude)",
    models: ["claude-3-5-sonnet-20241022", "claude-3-haiku-20240307"],
    keyUrl: "https://console.anthropic.com/",
    keyFormat: "sk-ant-...",
    keyExample: "sk-ant-1234567890abcdef...",
  },
  {
    value: "google" as LLMProvider,
    label: "Google (Gemini)",
    models: ["gemini-1.5-pro", "gemini-1.5-flash"],
    keyUrl: "https://aistudio.google.com/app/apikey",
    keyFormat: "AI...",
    keyExample: "AIzaSy1234567890abcdef...",
  },
  {
    value: "xai" as LLMProvider,
    label: "xAI (Grok)",
    models: ["grok-beta"],
    keyUrl: "https://console.x.ai/",
    keyFormat: "xai-...",
    keyExample: "xai-1234567890abcdef...",
  },
]

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateSettings, clearApiKey } = useSettings()
  const [localSettings, setLocalSettings] = useState(settings)
  const [showApiKey, setShowApiKey] = useState(false)
  const [apiKeyFocused, setApiKeyFocused] = useState(false)
  const [apiKeyChanged, setApiKeyChanged] = useState(false)

  // Update local settings when the modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalSettings(settings)
      setShowApiKey(false)
      setApiKeyChanged(false)
    }
  }, [isOpen, settings])

  if (!isOpen) return null

  const handleSave = () => {
    updateSettings(localSettings)
    onClose()
  }

  const handleClearApiKey = () => {
    if (confirm("Are you sure you want to clear your API key? You'll need to enter it again.")) {
      clearApiKey()
      setLocalSettings((prev) => ({ ...prev, apiKey: "" }))
      setApiKeyChanged(true)
    }
  }

  const handleClearAllData = () => {
    if (confirm("Are you sure you want to clear all stored data? This will remove all API keys and settings.")) {
      clearAllSecureData()
      setLocalSettings({
        provider: "openai",
        apiKey: "",
        systemPrompt: localSettings.systemPrompt,
        model: "gpt-4o",
      })
      setApiKeyChanged(true)
    }
  }

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newApiKey = e.target.value
    setLocalSettings((prev) => ({ ...prev, apiKey: newApiKey }))
    setApiKeyChanged(true)
  }

  const selectedProvider = providerOptions.find((p) => p.value === localSettings.provider)

  const maskApiKey = (key: string) => {
    if (!key) return ""
    if (key.length <= 8) return "*".repeat(key.length)
    return key.substring(0, 4) + "*".repeat(key.length - 8) + key.substring(key.length - 4)
  }

  const validateApiKeyFormat = (provider: string, apiKey: string) => {
    if (!apiKey || apiKey.length < 10) return false

    switch (provider) {
      case "openai":
        return apiKey.startsWith("sk-") && apiKey.length > 20
      case "anthropic":
        return apiKey.startsWith("sk-ant-") && apiKey.length > 30
      case "google":
        return apiKey.length > 15 // More lenient for Google
      case "xai":
        return apiKey.startsWith("xai-") && apiKey.length > 20
      default:
        return apiKey.length > 10
    }
  }

  const isApiKeyValid = validateApiKeyFormat(localSettings.provider, localSettings.apiKey)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Secure Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Security Notice */}
          <div className="p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
              <h3 className="text-sm sm:text-base font-semibold text-green-800 dark:text-green-400">
                Security Features
              </h3>
            </div>
            <ul className="text-xs sm:text-sm text-green-700 dark:text-green-300 space-y-1">
              <li>• API keys are encrypted before storage</li>
              <li>• Keys expire automatically after 24 hours</li>
              <li>• All requests are rate-limited</li>
              <li>• No data is sent to external servers</li>
            </ul>
          </div>

          {/* LLM Provider Selection */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <label className="text-lg font-semibold text-gray-900 dark:text-white">LLM Provider</label>
            </div>
            <select
              value={localSettings.provider}
              onChange={(e) => {
                const provider = e.target.value as LLMProvider
                const defaultModel = providerOptions.find((p) => p.value === provider)?.models[0] || ""
                setLocalSettings((prev) => ({
                  ...prev,
                  provider,
                  model: defaultModel,
                  apiKey: "", // Clear API key when changing provider
                }))
                setApiKeyChanged(true)
              }}
              className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
            >
              {providerOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Model Selection */}
          <div className="space-y-3">
            <label className="text-lg font-semibold text-gray-900 dark:text-white">Model</label>
            <select
              value={localSettings.model}
              onChange={(e) => setLocalSettings((prev) => ({ ...prev, model: e.target.value }))}
              className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
            >
              {selectedProvider?.models.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>

          {/* API Key */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <Key className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                <label className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">API Key</label>
                {isApiKeyValid && <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />}
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                {selectedProvider?.keyUrl && (
                  <a
                    href={selectedProvider.keyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:underline text-xs sm:text-sm"
                  >
                    <span>Get API Key</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="flex items-center space-x-1 text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {showApiKey ? (
                      <>
                        <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Show</span>
                      </>
                    )}
                  </button>
                  {localSettings.apiKey && (
                    <button
                      onClick={handleClearApiKey}
                      className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                      title="Clear API Key"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="relative">
              <input
                type={showApiKey ? "text" : "password"}
                value={apiKeyFocused || apiKeyChanged ? localSettings.apiKey : maskApiKey(localSettings.apiKey)}
                onChange={handleApiKeyChange}
                onFocus={() => setApiKeyFocused(true)}
                onBlur={() => setApiKeyFocused(false)}
                placeholder={`Enter your API key (example: ${selectedProvider?.keyExample || "..."})`}
                className={`w-full p-3 bg-white dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                  localSettings.apiKey && !isApiKeyValid
                    ? "border-red-300 dark:border-red-600"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                autoComplete="off"
                spellCheck="false"
                data-lpignore="true"
              />
              {!showApiKey && localSettings.apiKey && !apiKeyFocused && !apiKeyChanged && (
                <div className="absolute inset-0 flex items-center pointer-events-none">
                  <div className="w-full text-center text-gray-600 dark:text-gray-400">
                    {maskApiKey(localSettings.apiKey)}
                  </div>
                </div>
              )}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>🔒 Your API key is encrypted and stored locally with 24-hour expiration.</p>
              {localSettings.apiKey && !isApiKeyValid && (
                <p className="text-red-600 dark:text-red-400 mt-1">
                  ⚠️ API key format appears incorrect for {selectedProvider?.label}
                </p>
              )}
              {selectedProvider?.value === "google" && (
                <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                  <p className="text-blue-800 dark:text-blue-400 font-medium">Google Gemini Setup:</p>
                  <ol className="list-decimal list-inside mt-1 space-y-1 text-blue-700 dark:text-blue-300">
                    <li>Go to Google AI Studio</li>
                    <li>Create a new API key</li>
                    <li>Make sure it has Generative AI access</li>
                    <li>Copy the key (starts with "AI...")</li>
                  </ol>
                </div>
              )}
            </div>
          </div>

          {/* System Prompt Template */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <label className="text-lg font-semibold text-gray-900 dark:text-white">System Prompt Template</label>
            </div>
            <textarea
              value={localSettings.systemPrompt}
              onChange={(e) => setLocalSettings((prev) => ({ ...prev, systemPrompt: e.target.value }))}
              rows={8}
              className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Enter your system prompt template..."
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Use {"{IDEA}"} and {"{CATEGORY}"} as placeholders for user input.
            </p>
          </div>

          {/* Clear All Data */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleClearAllData}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All Stored Data</span>
            </button>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}
