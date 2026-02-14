'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Hero Section */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="kid-heading mb-6 text-white drop-shadow-lg">
          🎮 Crea il Tuo Gioco! 🎮
        </h1>
        <p className="text-2xl md:text-3xl text-white font-bold drop-shadow-md mb-4">
          Descrivi il tuo gioco fantastico e guardalo prendere vita! ✨
        </p>
        <p className="text-xl text-white/90 font-semibold">
          È facile, veloce e super divertente! 🚀
        </p>
      </motion.div>

      {/* Main CTA Button */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex flex-col items-center gap-4"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/create"
            className="kid-button bg-gradient-to-r from-kid-orange to-kid-red animate-pulse-glow inline-flex items-center gap-4"
          >
            <span className="text-5xl">🎨</span>
            <span>INIZIA A CREARE!</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-white/70 font-bold"
        >
          o
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Link
            href="/create?surprise=true"
            className="px-8 py-4 bg-gradient-to-r from-kid-purple via-kid-pink to-kid-orange
                     rounded-2xl shadow-xl font-black text-xl text-white
                     inline-flex items-center gap-3 hover:shadow-2xl transition-all"
          >
            <span className="text-3xl">🎲</span>
            <span>SORPRENDIMI!</span>
            <span className="text-3xl">✨</span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-6xl">
        {[
          {
            emoji: '✏️',
            title: 'Scrivi',
            description: 'Descrivi il gioco che vuoi creare',
            color: 'from-kid-blue to-kid-purple',
          },
          {
            emoji: '✨',
            title: 'Genera',
            description: 'La magia trasforma le tue idee!',
            color: 'from-kid-pink to-kid-orange',
          },
          {
            emoji: '🎮',
            title: 'Gioca!',
            description: 'Gioca subito e condividi con amici',
            color: 'from-kid-green to-kid-blue',
          },
        ].map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 + index * 0.15, duration: 0.5 }}
            className="kid-card text-center"
          >
            <div className="text-7xl mb-4 animate-float">{feature.emoji}</div>
            <h3 className={`text-3xl font-black mb-3 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
              {feature.title}
            </h3>
            <p className="text-lg text-gray-700 font-semibold">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Game Gallery Teaser */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="mt-16 text-center"
      >
        <Link
          href="/gallery"
          className="text-2xl text-white font-bold underline hover:text-kid-yellow transition-colors"
        >
          🎨 Guarda i giochi creati da altri bambini! →
        </Link>
      </motion.div>

      {/* Footer */}
      <footer className="mt-20 text-white/70 text-center text-sm">
        <p>Fatto con 💜 per bambini creativi</p>
      </footer>
    </div>
  )
}
