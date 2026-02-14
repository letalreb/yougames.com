import { NextRequest, NextResponse } from 'next/server'
import { generateGame } from '@/lib/gameGenerator'
import { validatePrompt } from '@/lib/contentFilter'
import type { GenerateGameRequest, GenerateGameResponse } from '@/types/game'

/**
 * POST /api/generate-game
 * Generate a game from a prompt
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

    // Generate game
    const game = generateGame(body)

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
