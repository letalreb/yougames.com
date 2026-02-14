'use client'

import React from 'react'
import { motion } from 'framer-motion'
import type { GameCategory } from '@/types/game'

interface CategoryCardProps {
  icon: string
  title: string
  description: string
  color: string
  category: GameCategory
  selected?: boolean
  onClick: (category: GameCategory) => void
}

/**
 * CategoryCard - Visual card for selecting game categories
 * Child-friendly with large icons and clear labels
 */
export function CategoryCard({
  icon,
  title,
  description,
  color,
  category,
  selected = false,
  onClick,
}: CategoryCardProps) {
  return (
    <motion.button
      onClick={() => onClick(category)}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      className={`
        kid-card cursor-pointer text-center p-8
        ${selected ? 'ring-8 ring-kid-yellow shadow-2xl' : ''}
        transition-all duration-200
      `}
      style={{
        backgroundColor: selected ? color : 'white',
      }}
    >
      <div className={`text-7xl mb-4 ${selected ? 'animate-bounce' : 'animate-float'}`}>
        {icon}
      </div>
      <h3 className={`text-2xl font-black mb-2 ${selected ? 'text-white' : 'text-gray-800'}`}>
        {title}
      </h3>
      <p className={`text-base font-semibold ${selected ? 'text-white/90' : 'text-gray-600'}`}>
        {description}
      </p>
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mt-4 text-4xl"
        >
          ✓
        </motion.div>
      )}
    </motion.button>
  )
}
