'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { GameCanvas } from '@/components/GameCanvas'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import type { Game } from '@/types/game'

export default function PlayGamePage() {
  const params = useParams()
  const gameId = params.id as string
  
  const [game, setGame] = useState<Game | null>(null)
  const [loading, setLoading] = useState(true)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    // Load game from localStorage
    try {
      const savedGames = JSON.parse(localStorage.getItem('myGames') || '[]')
      const foundGame = savedGames.find((g: Game) => g.id === gameId)
      
      if (foundGame) {
        setGame(foundGame)
      }
    } catch (err) {
      console.error('Error loading game:', err)
    } finally {
      setLoading(false)
    }
  }, [gameId])

  const handleGameOver = (didWin: boolean, finalScore: number) => {
    setGameOver(true)
    setWon(didWin)
    setScore(finalScore)
  }

  const handleReplay = () => {
    setGameOver(false)
    setWon(false)
    setScore(0)
    // Force re-render of game canvas
    setGame(null)
    setTimeout(() => {
      const savedGames = JSON.parse(localStorage.getItem('myGames') || '[]')
      const foundGame = savedGames.find((g: Game) => g.id === gameId)
      if (foundGame) setGame(foundGame)
    }, 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-8xl mb-6">😢</div>
          <h1 className="text-4xl font-black text-white mb-4">
            Gioco Non Trovato
          </h1>
          <p className="text-xl text-white/80 mb-8">
            Questo gioco non esiste o è stato eliminato.
          </p>
          <Link href="/gallery">
            <button className="kid-button bg-gradient-to-r from-kid-blue to-kid-purple">
              ← Torna alla Galleria
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/gallery" className="text-white font-bold text-xl hover:text-kid-yellow transition-colors">
            ← Galleria
          </Link>
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-black text-white">
              {game.title}
            </h1>
            <p className="text-lg text-white/80 mt-2">{game.prompt}</p>
          </div>
          <div className="w-24"></div>
        </div>

        {/* Game Container */}
        <div className="max-w-4xl mx-auto">
          <GameCanvas
            game={game}
            showControls={true}
            onGameOver={handleGameOver}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={handleReplay}
            className="px-8 py-4 bg-kid-green rounded-2xl text-white font-bold text-xl hover:scale-105 transition-transform"
          >
            🔄 Rigioca
          </button>
          <button
            onClick={() => {
              const url = window.location.href
              navigator.clipboard.writeText(url)
              alert('Link copiato! Condividilo con i tuoi amici! 🎉')
            }}
            className="px-8 py-4 bg-kid-purple rounded-2xl text-white font-bold text-xl hover:scale-105 transition-transform"
          >
            🔗 Condividi
          </button>
        </div>

        {/* Game Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="kid-card text-center">
            <div className="text-5xl mb-3">🎮</div>
            <h3 className="text-xl font-bold text-gray-800">Categoria</h3>
            <p className="text-lg text-gray-600 font-semibold capitalize">
              {game.category}
            </p>
          </div>
          <div className="kid-card text-center">
            <div className="text-5xl mb-3">⚡</div>
            <h3 className="text-xl font-bold text-gray-800">Difficoltà</h3>
            <p className="text-lg text-gray-600 font-semibold capitalize">
              {game.difficulty}
            </p>
          </div>
          <div className="kid-card text-center">
            <div className="text-5xl mb-3">📅</div>
            <h3 className="text-xl font-bold text-gray-800">Creato</h3>
            <p className="text-lg text-gray-600 font-semibold">
              {new Date(game.createdAt).toLocaleDateString('it-IT')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
