'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface BigButtonProps {
  children: React.ReactNode
  emoji?: string
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'purple' | 'blue'
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit'
  className?: string
}

const colorMap = {
  primary: 'from-kid-blue to-kid-purple',
  success: 'from-kid-green to-kid-blue',
  warning: 'from-kid-yellow to-kid-orange',
  danger: 'from-kid-orange to-kid-red',
  purple: 'from-kid-purple to-kid-pink',
  blue: 'from-kid-sky to-kid-blue',
}

/**
 * BigButton - Large, colorful, child-friendly button component
 * Features: large touch targets, emoji support, playful animations
 */
export function BigButton({
  children,
  emoji,
  color = 'primary',
  onClick,
  disabled = false,
  type = 'button',
  className = '',
}: BigButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`
        kid-button 
        bg-gradient-to-r ${colorMap[color]}
        inline-flex items-center justify-center gap-3
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {emoji && <span className="text-4xl">{emoji}</span>}
      <span>{children}</span>
    </motion.button>
  )
}
