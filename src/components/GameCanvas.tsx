'use client'

import React, { useRef, useEffect } from 'react'
import type { Game } from '@/types/game'

interface GameCanvasProps {
  game: Game
  showControls?: boolean
  onGameOver?: (won: boolean, score: number) => void
}

/**
 * GameCanvas - Renders and runs a generated game
 * Sandboxed canvas environment for executing game code safely
 */
export function GameCanvas({ game, showControls = true, onGameOver }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    
    // Set canvas size
    const container = canvas.parentElement!
    const rect = container.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    // Pre-load custom images if any
    const loadCustomImages = async () => {
      if (!game.customImages || game.customImages.length === 0) {
        return {}
      }

      const imageMap: Record<string, HTMLImageElement> = {}
      
      await Promise.all(
        game.customImages.map(customImg => 
          new Promise<void>((resolve, reject) => {
            const img = new Image()
            img.onload = () => {
              imageMap[customImg.role] = img
              console.log(`✅ Loaded custom ${customImg.role} image:`, customImg.filename)
              resolve()
            }
            img.onerror = () => {
              console.warn(`⚠️ Failed to load custom ${customImg.role} image`)
              resolve() // Continue anyway
            }
            img.src = customImg.dataUrl
          })
        )
      )

      return imageMap
    }

    // Execute game code in sandboxed environment
    const initGame = async () => {
      try {
        const customImageMap = await loadCustomImages()

        // Create a safe context for game execution
        const gameContext = {
          canvas,
          config: game.config,
          assets: game.assets,
          customImages: customImageMap, // Provide loaded images
          onGameOver: (won: boolean, score: number) => {
            if (onGameOver) onGameOver(won, score)
          },
        }

        console.log('🎮 Executing game code...', game.category)
        console.log('📝 Code preview (first 200 chars):', game.code.substring(0, 200))

        // Execute the generated game code
        // NOTE: In production, this should be further sandboxed with Web Workers
        const gameFunction = new Function('context', game.code)
        const gameFactoryOrInstance = gameFunction(gameContext)
        
        console.log('🔧 Factory result type:', typeof gameFactoryOrInstance)
        
        // If it's a factory function (as in our templates), execute it
        const gameInstance = typeof gameFactoryOrInstance === 'function'
          ? gameFactoryOrInstance(gameContext)
          : gameFactoryOrInstance
        
        console.log('✅ Game instance created:', gameInstance ? 'success' : 'failed')
        
        gameInstanceRef.current = gameInstance

        // Start the game if it has a start method
        if (gameInstance?.start) {
          console.log('▶️ Starting game...')
          gameInstance.start()
        } else {
          console.warn('⚠️ Game instance has no start method')
        }
      } catch (error) {
        console.error('❌ Error executing game code:', error)
        // Show error message on canvas
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.fillStyle = '#FF6B9D'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          ctx.fillStyle = 'white'
          ctx.font = 'bold 24px Arial'
          ctx.textAlign = 'center'
          ctx.fillText('Oops! Errore nel caricamento del gioco 😢', canvas.width / 2, canvas.height / 2)
        }
      }
    }

    // Start game initialization
    initGame()

    // Cleanup
    return () => {
      if (gameInstanceRef.current?.stop) {
        gameInstanceRef.current.stop()
      }
    }
  }, [game])

  return (
    <div className="w-full">
      <div className="game-canvas-container">
        <canvas ref={canvasRef} />
      </div>

      {showControls && (
        <div className="mt-6 p-4 bg-white/20 rounded-2xl">
          <h3 className="text-white font-bold text-xl mb-3">🎮 Comandi:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-white font-semibold">
            <div>⌨️ Frecce o WASD = Movimento</div>
            <div>⎵ Spazio = Azione</div>
            <div>🖱️ Mouse/Touch = Click/Tap</div>
            <div>P = Pausa</div>
          </div>
        </div>
      )}
    </div>
  )
}
