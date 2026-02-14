'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LoadingSpinnerProps {
  message?: string
  emoji?: string
}

/**
 * LoadingSpinner - Playful loading indicator for kids
 * With animated emoji and encouraging messages
 */
export function LoadingSpinner({ 
  message = 'Creando la tua magia...', 
  emoji = '✨' 
}: LoadingSpinnerProps) {
  const loadingMessages = [
    'Mescolando i colori... 🎨',
    'Aggiungendo magia... ✨',
    'Costruendo il tuo mondo... 🌍',
    'Quasi pronto... 🚀',
  ]

  const [currentMessage, setCurrentMessage] = React.useState(message)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)])
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Spinning loader */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="text-8xl mb-6"
      >
        {emoji}
      </motion.div>

      {/* Animated message */}
      <AnimatePresence mode="wait">
        <motion.p
          key={currentMessage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="text-2xl font-bold text-white text-center"
        >
          {currentMessage}
        </motion.p>
      </AnimatePresence>

      {/* Progress dots */}
      <div className="flex gap-3 mt-6">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className="w-4 h-4 bg-white rounded-full"
          />
        ))}
      </div>
    </div>
  )
}
