// Client-side encryption utilities
const ENCRYPTION_KEY_NAME = "promptpilot_key"
const ENCRYPTION_IV_NAME = "promptpilot_iv"

// Generate or retrieve encryption key
function getOrCreateEncryptionKey(): string {
  let key = localStorage.getItem(ENCRYPTION_KEY_NAME)
  if (!key) {
    // Generate a random key for this session
    key = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
    localStorage.setItem(ENCRYPTION_KEY_NAME, key)
  }
  return key
}

// Generate or retrieve initialization vector
function getOrCreateIV(): string {
  let iv = localStorage.getItem(ENCRYPTION_IV_NAME)
  if (!iv) {
    // Generate a random IV for this session
    iv = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
    localStorage.setItem(ENCRYPTION_IV_NAME, iv)
  }
  return iv
}

// Enhanced XOR encryption with IV for better security
function xorEncrypt(text: string, key: string): string {
  if (!text) return ""

  const iv = getOrCreateIV()
  let result = ""

  // Use IV to add randomness
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length) ^ iv.charCodeAt(i % iv.length)
    result += String.fromCharCode(charCode)
  }

  return btoa(result) // Base64 encode
}

function xorDecrypt(encryptedText: string, key: string): string {
  try {
    if (!encryptedText) return ""

    const iv = getOrCreateIV()
    const decoded = atob(encryptedText) // Base64 decode
    let result = ""

    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length) ^ iv.charCodeAt(i % iv.length)
      result += String.fromCharCode(charCode)
    }

    return result
  } catch {
    return ""
  }
}

export function encryptApiKey(apiKey: string): string {
  if (!apiKey) return ""
  const key = getOrCreateEncryptionKey()
  return xorEncrypt(apiKey, key)
}

export function decryptApiKey(encryptedApiKey: string): string {
  if (!encryptedApiKey) return ""
  const key = getOrCreateEncryptionKey()
  return xorDecrypt(encryptedApiKey, key)
}

// Secure storage with expiration
export function secureStore(key: string, value: string, expirationHours = 24): void {
  try {
    const expiration = Date.now() + expirationHours * 60 * 60 * 1000
    const encryptedValue = encryptApiKey(value)
    const data = {
      value: encryptedValue,
      expiration,
    }
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error("Error storing secure data:", error)
  }
}

export function secureRetrieve(key: string): string {
  try {
    const stored = localStorage.getItem(key)
    if (!stored) return ""

    const data = JSON.parse(stored)

    // Check expiration
    if (Date.now() > data.expiration) {
      localStorage.removeItem(key)
      return ""
    }

    return decryptApiKey(data.value)
  } catch (error) {
    console.error("Error retrieving secure data:", error)
    return ""
  }
}

export function secureDelete(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error("Error deleting secure data:", error)
  }
}

// Clear all sensitive data
export function clearAllSecureData(): void {
  try {
    const keysToRemove = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (key.includes("api") || key.includes("promptpilot"))) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key))
  } catch (error) {
    console.error("Error clearing secure data:", error)
  }
}
