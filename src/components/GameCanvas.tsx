'use client'

import React, { useRef, useEffect, useState } from 'react'
import type { Game } from '@/types/game'

interface GameCanvasProps {
  game: Game
  showControls?: boolean
  onGameOver?: (won: boolean, score: number) => void
}

/**
 * GameCanvas - Renders and runs a generated game
 * Supports both canvas-based games (templates) and iframe-based games (AI-generated HTML)
 */
export function GameCanvas({ game, showControls = true, onGameOver }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const gameInstanceRef = useRef<any>(null)
  const [isAIGame, setIsAIGame] = useState(false)

  useEffect(() => {
    // Determine if this is an AI-generated HTML game or a canvas-based template game
    const isHTMLGame = game.aiGenerated || game.code.includes('<html') || game.code.includes('<!DOCTYPE')
    setIsAIGame(isHTMLGame)

    if (isHTMLGame) {
      // AI-generated HTML game - use iframe
      initIframeGame()
    } else {
      // Template-based canvas game - use canvas
      initCanvasGame()
    }

    return () => {
      if (gameInstanceRef.current?.stop) {
        gameInstanceRef.current.stop()
      }
    }
  }, [game])

  /**
   * Initialize AI-generated HTML game in iframe
   */
  const initIframeGame = () => {
    if (!iframeRef.current) return

    console.log('🤖 Loading AI-generated HTML game in iframe')
    
    // Create a blob URL for the HTML content
    const blob = new Blob([game.code], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    
    // Set iframe source
    iframeRef.current.src = url
    
    console.log('✅ AI game loaded in iframe')
  }

  /**
   * Initialize template-based canvas game
   */
  const initCanvasGame = async () => {
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
          new Promise<void>((resolve) => {
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
          customImages: customImageMap,
          onGameOver: (won: boolean, score: number) => {
            if (onGameOver) onGameOver(won, score)
          },
        }

        console.log('🎮 Executing canvas game code...', game.category)
        console.log('📝 Code preview (first 200 chars):', game.code.substring(0, 200))

        // Execute the generated game code
        const gameFunction = new Function('context', game.code)
        const gameFactoryOrInstance = gameFunction(gameContext)
        
        // If it's a factory function, execute it
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
  }

  return (
    <div className="w-full">
      <div className="game-canvas-container relative" style={{ minHeight: '600px' }}>
        {isAIGame ? (
          <iframe
            ref={iframeRef}
            className="w-full h-full rounded-2xl"
            style={{ minHeight: '600px', border: 'none' }}
            sandbox="allow-scripts allow-forms allow-pointer-lock"
            title={game.title}
          />
        ) : (
          <canvas ref={canvasRef} className="rounded-2xl" />
        )}
      </div>

      {showControls && !isAIGame && (
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
      
      {isAIGame && (
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl border-2 border-white/30">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🤖</span>
            <div>
              <h3 className="text-white font-bold text-lg">Gioco Generato da AI</h3>
              <p className="text-white/80 text-sm">Creato con GPT-4 basato sulla tua descrizione dettagliata</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
