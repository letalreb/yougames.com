'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BigButton } from '@/components/BigButton'
import { CategoryCard } from '@/components/CategoryCard'
import { PromptBox } from '@/components/PromptBox'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { GameCanvas } from '@/components/GameCanvas'
import { getAllCategories } from '@/lib/templates'
import type { Game, GameCategory, Difficulty } from '@/types/game'
import Link from 'next/link'

type Step = 'category' | 'prompt' | 'difficulty' | 'generating' | 'preview'

export default function CreatePage() {
  const [step, setStep] = useState<Step>('category')
  const [selectedCategory, setSelectedCategory] = useState<GameCategory | null>(null)
  const [prompt, setPrompt] = useState('')
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [generatedGame, setGeneratedGame] = useState<Game | null>(null)
  const [error, setError] = useState<string | null>(null)

  const categories = getAllCategories()

  // Handle category selection
  const handleCategorySelect = (category: GameCategory) => {
    setSelectedCategory(category)
  }

  // Handle generate game
  const handleGenerate = async () => {
    if (!selectedCategory || !prompt) return

    setStep('generating')
    setError(null)

    try {
      const response = await fetch('/api/generate-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          category: selectedCategory,
          difficulty,
        }),
      })

      const data = await response.json()

      if (data.success && data.game) {
        setGeneratedGame(data.game)
        setStep('preview')
      } else {
        setError(data.error || 'Errore nella generazione del gioco')
        setStep('prompt')
      }
    } catch (err) {
      setError('Errore di connessione. Riprova!')
      setStep('prompt')
    }
  }

  // Handle publish
  const handlePublish = async () => {
    if (!generatedGame) return

    try {
      // Save to localStorage for demo
      const savedGames = JSON.parse(localStorage.getItem('myGames') || '[]')
      savedGames.push(generatedGame)
      localStorage.setItem('myGames', JSON.stringify(savedGames))

      alert('🎉 Gioco salvato! Trovi i tuoi giochi nella galleria.')
    } catch (err) {
      alert('Errore nel salvataggio del gioco')
    }
  }

  // Restart creation
  const handleRestart = () => {
    setStep('category')
    setSelectedCategory(null)
    setPrompt('')
    setDifficulty('easy')
    setGeneratedGame(null)
    setError(null)
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-white font-bold text-xl hover:text-kid-yellow transition-colors">
            ← Home
          </Link>
          <h1 className="text-3xl md:text-5xl font-black text-white text-center">
            🎨 Crea il Tuo Gioco
          </h1>
          <div className="w-20"></div> {/* Spacer for alignment */}
        </div>

        {/* Progress Steps */}
        {step !== 'preview' && (
          <div className="flex justify-center gap-4 mb-8">
            {['category', 'prompt', 'difficulty', 'generating'].map((s, i) => (
              <div
                key={s}
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
                  step === s
                    ? 'bg-kid-yellow text-purple-900'
                    : ['category', 'prompt', 'difficulty'].indexOf(step) > i
                    ? 'bg-kid-green text-white'
                    : 'bg-white/30 text-white/60'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1: Category Selection */}
          {step === 'category' && (
            <motion.div
              key="category"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="text-4xl font-black text-white mb-4">
                  Che tipo di gioco vuoi creare?
                </h2>
                <p className="text-xl text-white/90">
                  Scegli una categoria che ti piace!
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {categories.map((cat) => (
                  <CategoryCard
                    key={cat.category}
                    icon={cat.icon}
                    title={cat.title}
                    description={cat.description}
                    color={cat.color}
                    category={cat.category}
                    selected={selectedCategory === cat.category}
                    onClick={setSelectedCategory}
                  />
                ))}
              </div>

              {selectedCategory && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center"
                >
                  <BigButton
                    emoji="➡️"
                    color="success"
                    onClick={() => setStep('prompt')}
                  >
                    Avanti
                  </BigButton>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* STEP 2: Prompt Input */}
          {step === 'prompt' && (
            <motion.div
              key="prompt"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="text-4xl font-black text-white mb-4">
                  Descrivi il tuo gioco fantastico!
                </h2>
                <p className="text-xl text-white/90">
                  Più dettagli dai, più divertente sarà! ✨
                </p>
              </div>

              <div className="max-w-2xl mx-auto">
                <PromptBox
                  value={prompt}
                  onChange={setPrompt}
                  placeholder="Esempio: un gatto che salta tra le nuvole e raccoglie stelle dorate!"
                  maxLength={200}
                  helpText={`Suggerimento: descrivi il personaggio, cosa fa, e dove si trova!`}
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="max-w-2xl mx-auto p-4 bg-kid-red/20 border-4 border-kid-red rounded-2xl"
                >
                  <p className="text-white font-bold text-center">
                    ⚠️ {error}
                  </p>
                </motion.div>
              )}

              <div className="flex justify-center gap-4">
                <BigButton
                  emoji="←"
                  color="warning"
                  onClick={() => setStep('category')}
                >
                  Indietro
                </BigButton>
                <BigButton
                  emoji="➡️"
                  color="success"
                  onClick={() => setStep('difficulty')}
                  disabled={prompt.length < 10}
                >
                  Avanti
                </BigButton>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Difficulty Selection */}
          {step === 'difficulty' && (
            <motion.div
              key="difficulty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="text-4xl font-black text-white mb-4">
                  Quanto difficile vuoi che sia?
                </h2>
                <p className="text-xl text-white/90">
                  Scegli il livello perfetto per te!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {[
                  { value: 'easy' as Difficulty, emoji: '😊', title: 'Facile', description: 'Perfetto per iniziare!', color: '#2ECC71' },
                  { value: 'medium' as Difficulty, emoji: '😎', title: 'Medio', description: 'Una bella sfida!', color: '#F1C40F' },
                  { value: 'hard' as Difficulty, emoji: '🔥', title: 'Difficile', description: 'Per veri campioni!', color: '#E74C3C' },
                ].map((diff) => (
                  <motion.button
                    key={diff.value}
                    onClick={() => setDifficulty(diff.value)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`kid-card p-8 ${
                      difficulty === diff.value ? 'ring-8 ring-kid-yellow' : ''
                    }`}
                    style={{
                      backgroundColor: difficulty === diff.value ? diff.color : 'white',
                    }}
                  >
                    <div className="text-7xl mb-4">{diff.emoji}</div>
                    <h3 className={`text-3xl font-black mb-2 ${difficulty === diff.value ? 'text-white' : 'text-gray-800'}`}>
                      {diff.title}
                    </h3>
                    <p className={`text-lg font-semibold ${difficulty === diff.value ? 'text-white/90' : 'text-gray-600'}`}>
                      {diff.description}
                    </p>
                  </motion.button>
                ))}
              </div>

              <div className="flex justify-center gap-4">
                <BigButton
                  emoji="←"
                  color="warning"
                  onClick={() => setStep('prompt')}
                >
                  Indietro
                </BigButton>
                <BigButton
                  emoji="✨"
                  color="purple"
                  onClick={handleGenerate}
                >
                  GENERA GIOCO!
                </BigButton>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Generating */}
          {step === 'generating' && (
            <motion.div
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center min-h-[60vh]"
            >
              <LoadingSpinner />
            </motion.div>
          )}

          {/* STEP 5: Preview & Play */}
          {step === 'preview' && generatedGame && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="text-4xl md:text-6xl font-black text-white mb-4">
                  🎉 Il Tuo Gioco è Pronto! 🎉
                </h2>
                <h3 className="text-3xl font-bold text-kid-yellow mb-2">
                  {generatedGame.title}
                </h3>
                <p className="text-xl text-white/90">
                  Gioca subito e divertiti! 🚀
                </p>
              </div>

              <div className="max-w-4xl mx-auto">
                <GameCanvas
                  game={generatedGame}
                  showControls={true}
                  onGameOver={(won, score) => {
                    console.log('Game over:', won, score)
                  }}
                />
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <BigButton
                  emoji="💾"
                  color="success"
                  onClick={handlePublish}
                >
                  Salva Gioco
                </BigButton>
                <BigButton
                  emoji="🔄"
                  color="warning"
                  onClick={handleRestart}
                >
                  Crea Altro
                </BigButton>
                <Link href="/gallery">
                  <BigButton emoji="🎨" color="purple">
                    Vedi Galleria
                  </BigButton>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
