import { NextRequest, NextResponse } from 'next/server'
import { generateGame } from '@/lib/gameGenerator'
import { generateAIGame, isAIAvailable } from '@/lib/aiGameGenerator'
import { validatePrompt } from '@/lib/contentFilter'
import type { GenerateGameRequest, GenerateGameResponse } from '@/types/game'

/**
 * POST /api/generate-game
 * Generate a game from a prompt using AI (GPT-4) or template-based generation
 */
export async function POST(request: NextRequest) {
  try {
    const body: GenerateGameRequest = await request.json()
    const { prompt, category, difficulty } = body

    // Validate prompt
    const validation = validatePrompt(prompt)
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.message,
        } as GenerateGameResponse,
        { status: 400 }
      )
    }

    let game
    
    // Use AI generation if available and prompt is complex (>50 chars)
    if (isAIAvailable() && prompt.length > 50) {
      console.log('🤖 Using AI-powered generation (GPT-4) - prompt length:', prompt.length)
      try {
        game = await generateAIGame(body)
      } catch (aiError: any) {
        console.warn('⚠️ AI generation failed, falling back to templates:', aiError.message)
        // Fallback to template-based generation
        console.log('📝 Prompt received:', prompt)
        game = generateGame(body)
      }
    } else {
      console.log('🎨 Using template-based generation - prompt length:', prompt.length)
      console.log('📝 Prompt received:', prompt)
      game = generateGame(body)
    }

    return NextResponse.json({
      success: true,
      game,
    } as GenerateGameResponse)
  } catch (error) {
    console.error('Error generating game:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Errore nella generazione del gioco. Riprova!',
      } as GenerateGameResponse,
      { status: 500 }
    )
  }
}
