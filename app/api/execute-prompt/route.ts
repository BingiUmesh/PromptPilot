import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { xai } from "@ai-sdk/xai"

// Rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(clientId: string, maxRequests = 20, windowMs = 60000): boolean {
  const now = Date.now()
  const clientData = rateLimitStore.get(clientId)

  if (!clientData || now > clientData.resetTime) {
    rateLimitStore.set(clientId, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (clientData.count >= maxRequests) {
    return false
  }

  clientData.count++
  return true
}

function sanitizeApiKey(apiKey: string): string {
  return apiKey.trim().replace(/[\r\n\t<>'";]/g, "")
}

function validateApiKeyFormat(provider: string, apiKey: string): boolean {
  if (!apiKey || apiKey.length < 10) return false

  // More lenient validation to accommodate different key formats
  switch (provider) {
    case "openai":
      return apiKey.startsWith("sk-") && apiKey.length > 20
    case "anthropic":
      return apiKey.startsWith("sk-ant-") && apiKey.length > 30
    case "google":
      return apiKey.length > 15 // Google keys can have different formats
    case "xai":
      return apiKey.startsWith("xai-") && apiKey.length > 20
    default:
      return apiKey.length > 10
  }
}

// Cost estimation
const costPerToken = {
  "gpt-4o": { input: 0.0025 / 1000, output: 0.01 / 1000 },
  "gpt-4o-mini": { input: 0.00015 / 1000, output: 0.0006 / 1000 },
  "gpt-3.5-turbo": { input: 0.0005 / 1000, output: 0.0015 / 1000 },
  "claude-3-5-sonnet-20241022": { input: 0.003 / 1000, output: 0.015 / 1000 },
  "claude-3-haiku-20240307": { input: 0.00025 / 1000, output: 0.00125 / 1000 },
  "gemini-1.5-pro": { input: 0.00125 / 1000, output: 0.005 / 1000 },
  "gemini-1.5-flash": { input: 0.000075 / 1000, output: 0.0003 / 1000 },
  "grok-beta": { input: 0.005 / 1000, output: 0.015 / 1000 },
}

function estimateCost(model: string, inputTokens: number, outputTokens: number): number {
  const costs = costPerToken[model as keyof typeof costPerToken]
  if (!costs) return 0.001
  return inputTokens * costs.input + outputTokens * costs.output
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    if (!checkRateLimit(clientIp)) {
      return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 })
    }

    // Parse request body safely
    let body
    try {
      body = await request.json()
    } catch (error) {
      console.error("Error parsing request body:", error)
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const { prompt, systemPrompt, settings } = body

    // Validate inputs
    if (!settings?.apiKey) {
      return NextResponse.json({ error: "API key is required" }, { status: 400 })
    }

    if (!prompt || typeof prompt !== "string" || prompt.length > 10000) {
      return NextResponse.json({ error: "Invalid prompt input" }, { status: 400 })
    }

    if (!systemPrompt || typeof systemPrompt !== "string" || systemPrompt.length > 5000) {
      return NextResponse.json({ error: "Invalid system prompt" }, { status: 400 })
    }

    // Sanitize API key
    const sanitizedApiKey = sanitizeApiKey(settings.apiKey)

    if (!validateApiKeyFormat(settings.provider, sanitizedApiKey)) {
      return NextResponse.json(
        {
          error: `Invalid API key format for ${settings.provider}. Please check your API key.`,
        },
        { status: 400 },
      )
    }

    // Get the appropriate model
    let model
    try {
      switch (settings.provider) {
        case "openai":
          model = openai(settings.model, { apiKey: sanitizedApiKey })
          break
        case "anthropic":
          model = anthropic(settings.model, { apiKey: sanitizedApiKey })
          break
        case "google":
          // Properly initialize Google AI with the API key
          const googleAI = createGoogleGenerativeAI({
            apiKey: sanitizedApiKey,
          })
          model = googleAI(settings.model)
          break
        case "xai":
          model = xai(settings.model, { apiKey: sanitizedApiKey })
          break
        default:
          return NextResponse.json({ error: "Unsupported provider" }, { status: 400 })
      }
    } catch (error) {
      console.error("Model initialization error:", error)
      return NextResponse.json(
        {
          error: "Failed to initialize AI model. Please check your API key and provider settings.",
          details: error.message,
        },
        { status: 400 },
      )
    }

    // Execute with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 45000) // 45 seconds

    try {
      const result = await generateText({
        model,
        system: systemPrompt.substring(0, 5000),
        prompt: prompt.substring(0, 10000),
        temperature: 0.7,
        maxTokens: 2000,
      })

      clearTimeout(timeoutId)

      const inputTokens = result.usage?.promptTokens || 0
      const outputTokens = result.usage?.completionTokens || 0
      const cost = estimateCost(settings.model, inputTokens, outputTokens)

      return NextResponse.json({
        response: result.text.substring(0, 5000), // Limit response length
        cost,
        usage: result.usage,
      })
    } catch (error) {
      clearTimeout(timeoutId)
      console.error("Execution error:", error)

      if (error.name === "AbortError") {
        throw new Error("Request timeout")
      }

      if (
        error.message?.includes("API key") ||
        error.message?.includes("authentication") ||
        error.message?.includes("unauthorized")
      ) {
        throw new Error(`Invalid or expired API key: ${error.message}`)
      }

      if (error.message?.includes("quota") || error.message?.includes("billing") || error.message?.includes("limit")) {
        throw new Error(`API quota exceeded or billing issue: ${error.message}`)
      }

      throw error
    }
  } catch (error) {
    console.error("Error executing prompt:", error)

    let errorMessage = "Failed to execute prompt"

    if (error.message?.includes("Invalid or expired API key")) {
      errorMessage = "Invalid or expired API key. Please check your API key in Settings."
    } else if (error.message?.includes("API quota exceeded")) {
      errorMessage = "API quota exceeded. Please check your billing with the provider."
    } else if (error.message?.includes("timeout")) {
      errorMessage = "Request timeout. Please try again."
    } else if (error.message?.includes("authentication") || error.message?.includes("unauthorized")) {
      errorMessage = "Authentication failed. Please verify your API key."
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
