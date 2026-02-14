import { NextRequest, NextResponse } from 'next/server'
import type { PublishGameRequest, PublishGameResponse } from '@/types/game'

/**
 * POST /api/publish-game
 * Publish a game (save to storage and deploy)
 * 
 * NOTE: In production, this would:
 * 1. Save game to Vercel KV or database
 * 2. Create static page
 * 3. Trigger rebuild for ISR
 * 
 * For now, we'll use localStorage client-side
 */
export async function POST(request: NextRequest) {
  try {
    const body: PublishGameRequest = await request.json()
    const { gameId } = body

    // TODO: Implement actual publishing logic
    // - Save to Vercel KV
    // - Create /play/[id] page
    // - Generate shareable URL

    // For demo, return a mock URL
    const publicUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/play/${gameId}`

    return NextResponse.json({
      success: true,
      publicUrl,
    } as PublishGameResponse)
  } catch (error) {
    console.error('Error publishing game:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Errore nella pubblicazione del gioco',
      } as PublishGameResponse,
      { status: 500 }
    )
  }
}
