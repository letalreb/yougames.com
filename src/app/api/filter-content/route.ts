import { NextRequest, NextResponse } from 'next/server'
import { checkContentSafety, sanitizeText } from '@/lib/contentFilter'
import type { ContentFilterRequest, ContentFilterResponse } from '@/types/game'

/**
 * POST /api/filter-content
 * Check if content is safe for children
 */
export async function POST(request: NextRequest) {
  try {
    const body: ContentFilterRequest = await request.json()
    const { text } = body

    const safetyCheck = checkContentSafety(text)
    const sanitized = sanitizeText(text)

    return NextResponse.json({
      safe: safetyCheck.safe,
      reason: safetyCheck.reason,
      sanitized,
      flaggedWords: safetyCheck.flaggedWords,
    } as ContentFilterResponse)
  } catch (error) {
    console.error('Error filtering content:', error)
    return NextResponse.json(
      {
        safe: false,
        reason: 'Errore nel controllo del contenuto',
        sanitized: '',
      } as ContentFilterResponse,
      { status: 500 }
    )
  }
}
