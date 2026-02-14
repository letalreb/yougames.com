'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Game } from '@/types/game'

export default function GalleryPage() {
  const [games, setGames] = useState<Game[]>([])

  useEffect(() => {
    // Load saved games from localStorage
    try {
      const savedGames = JSON.parse(localStorage.getItem('myGames') || '[]')
      setGames(savedGames)
    } catch (err) {
      console.error('Error loading games:', err)
    }
  }, [])

  const deleteGame = (gameId: string) => {
    const updatedGames = games.filter(g => g.id !== gameId)
    setGames(updatedGames)
    localStorage.setItem('myGames', JSON.stringify(updatedGames))
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <Link href="/" className="text-white font-bold text-xl hover:text-kid-yellow transition-colors">
            ← Home
          </Link>
          <h1 className="text-3xl md:text-5xl font-black text-white text-center">
            🎨 La Tua Galleria
          </h1>
          <Link href="/create">
            <button className="px-6 py-3 bg-kid-green rounded-2xl text-white font-bold hover:scale-105 transition-transform">
              + Nuovo
            </button>
          </Link>
        </div>

        {/* Games Grid */}
        {games.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-8xl mb-6">🎮</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Nessun gioco ancora!
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Crea il tuo primo gioco fantastico!
            </p>
            <Link href="/create">
              <button className="kid-button bg-gradient-to-r from-kid-orange to-kid-red">
                <span className="text-4xl mr-3">🎨</span>
                Inizia a Creare!
              </button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="kid-card group"
              >
                {/* Game Preview */}
                <div className="w-full h-40 bg-gradient-to-br from-kid-purple to-kid-blue rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-7xl">
                    {game.config.player.sprite || '🎮'}
                  </span>
                </div>

                {/* Game Info */}
                <h3 className="text-2xl font-black text-gray-800 mb-2">
                  {game.title}
                </h3>
                <p className="text-sm text-gray-600 font-semibold mb-1">
                  {game.prompt}
                </p>
                <div className="flex gap-2 mb-4">
                  <span className="px-3 py-1 bg-kid-purple/20 rounded-full text-xs font-bold text-kid-purple">
                    {game.category}
                  </span>
                  <span className="px-3 py-1 bg-kid-orange/20 rounded-full text-xs font-bold text-kid-orange">
                    {game.difficulty}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link href={`/play/${game.id}`} className="flex-1">
                    <button className="w-full px-4 py-3 bg-kid-green rounded-xl text-white font-bold hover:scale-105 transition-transform">
                      ▶ Gioca
                    </button>
                  </Link>
                  <button
                    onClick={() => deleteGame(game.id)}
                    className="px-4 py-3 bg-kid-red rounded-xl text-white font-bold hover:scale-105 transition-transform"
                  >
                    🗑️
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
