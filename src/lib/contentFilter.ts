/**
 * ============================================
 * CONTENT SAFETY FILTER
 * Protects children from inappropriate content
 * ============================================
 */

// Blocked words list (Italian + English)
const BLOCKED_WORDS = [
  'violenza', 'violence', 'sangue', 'blood',
  'morte', 'death', 'uccidere', 'kill',
  'arma', 'weapon', 'pistola', 'gun',
  'guerra', 'war', 'male', 'evil',
  // Add more as needed
]

// Negative sentiment words
const NEGATIVE_WORDS = [
  'triste', 'sad', 'piangere', 'cry',
  'paura', 'fear', 'spaventoso', 'scary',
]

/**
 * Check if text contains inappropriate content
 */
export function checkContentSafety(text: string): {
  safe: boolean
  reason?: string
  flaggedWords: string[]
} {
  const lowerText = text.toLowerCase()
  const flaggedWords: string[] = []

  // Check blocked words
  for (const word of BLOCKED_WORDS) {
    if (lowerText.includes(word.toLowerCase())) {
      flaggedWords.push(word)
    }
  }

  if (flaggedWords.length > 0) {
    return {
      safe: false,
      reason: 'Il testo contiene parole non adatte ai bambini',
      flaggedWords,
    }
  }

  // Check excessive negative sentiment
  let negativeCount = 0
  for (const word of NEGATIVE_WORDS) {
    if (lowerText.includes(word.toLowerCase())) {
      negativeCount++
    }
  }

  if (negativeCount > 2) {
    return {
      safe: false,
      reason: 'Il contenuto sembra troppo negativo o triste',
      flaggedWords: NEGATIVE_WORDS.filter(w => lowerText.includes(w.toLowerCase())),
    }
  }

  return {
    safe: true,
    flaggedWords: [],
  }
}

/**
 * Sanitize text by removing/replacing inappropriate content
 */
export function sanitizeText(text: string): string {
  let sanitized = text

  // Replace blocked words with friendly alternatives
  const replacements: Record<string, string> = {
    'violenza': 'avventura',
    'violence': 'adventure',
    'sangue': 'energia',
    'morte': 'sonno',
    'uccidere': 'catturare',
    'arma': 'strumento magico',
    'guerra': 'competizione amichevole',
  }

  for (const [bad, good] of Object.entries(replacements)) {
    const regex = new RegExp(bad, 'gi')
    sanitized = sanitized.replace(regex, good)
  }

  return sanitized
}

/**
 * Validate prompt meets kid-friendly criteria
 */
export function validatePrompt(prompt: string): {
  valid: boolean
  message?: string
} {
  // Check length
  if (prompt.length < 10) {
    return {
      valid: false,
      message: 'Il prompt è troppo corto! Descrivi meglio il tuo gioco.',
    }
  }

  if (prompt.length > 200) {
    return {
      valid: false,
      message: 'Il prompt è troppo lungo! Massimo 200 caratteri.',
    }
  }

  // Check safety
  const safetyCheck = checkContentSafety(prompt)
  if (!safetyCheck.safe) {
    return {
      valid: false,
      message: safetyCheck.reason,
    }
  }

  return { valid: true }
}
