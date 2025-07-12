import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { xai } from "@ai-sdk/xai"

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(clientId: string, maxRequests = 10, windowMs = 60000): boolean {
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
  // Only remove obvious injection characters, keep valid API key characters
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
      return apiKey.length > 10 // Fallback for unknown providers
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIp = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    // Check rate limit
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

    const { idea, category, variations, settings } = body

    // Validate input
    if (!settings?.apiKey) {
      return NextResponse.json({ error: "API key is required" }, { status: 400 })
    }

    if (!idea || typeof idea !== "string" || idea.length > 5000) {
      return NextResponse.json({ error: "Invalid idea input" }, { status: 400 })
    }

    if (!category || typeof category !== "string") {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 })
    }

    if (!variations || variations < 1 || variations > 10) {
      return NextResponse.json({ error: "Variations must be between 1 and 10" }, { status: 400 })
    }

    // Sanitize API key
    const sanitizedApiKey = sanitizeApiKey(settings.apiKey)

    // Basic validation - more lenient than before
    if (!validateApiKeyFormat(settings.provider, sanitizedApiKey)) {
      return NextResponse.json(
        {
          error: `Invalid API key format for ${settings.provider}. Please check your API key.`,
        },
        { status: 400 },
      )
    }

    // Get the appropriate model based on provider
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

    // Sanitize system prompt
    const systemPrompt = settings.systemPrompt
      .replace("{IDEA}", idea.substring(0, 1000)) // Limit length
      .replace("{CATEGORY}", category.substring(0, 100))

    // Generate prompts with timeout
    const prompts = []
    const timeout = 30000 // 30 seconds timeout

    for (let i = 0; i < variations; i++) {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      try {
        const { text } = await generateText({
          model,
          system: systemPrompt,
          prompt: `Generate variation ${i + 1} of ${variations}. Make each variation unique and optimized for different aspects or approaches.`,
          temperature: 0.7,
          maxTokens: 1000, // Limit response length
        })

        clearTimeout(timeoutId)
        prompts.push(text.substring(0, 2000)) // Limit response length
      } catch (error) {
        clearTimeout(timeoutId)
        console.error(`Error generating prompt ${i + 1}:`, error)

        if (error.name === "AbortError") {
          throw new Error("Request timeout")
        }

        // Check for specific API errors
        if (
          error.message?.includes("API key") ||
          error.message?.includes("authentication") ||
          error.message?.includes("unauthorized")
        ) {
          throw new Error(`Invalid or expired API key: ${error.message}`)
        }

        if (
          error.message?.includes("quota") ||
          error.message?.includes("billing") ||
          error.message?.includes("limit")
        ) {
          throw new Error(`API quota exceeded or billing issue: ${error.message}`)
        }

        throw error
      }
    }

    return NextResponse.json({ prompts })
  } catch (error) {
    console.error("Error generating prompts:", error)

    // Provide more specific error messages
    let errorMessage = "Failed to generate prompts"

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
