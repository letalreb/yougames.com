'use client'

import React from 'react'

interface PromptBoxProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  maxLength?: number
  helpText?: string
  disabled?: boolean
}

/**
 * PromptBox - Large text area for kids to describe their game
 * With character count, helpful placeholder, and guidance
 */
export function PromptBox({
  value,
  onChange,
  placeholder = 'Descrivi il tuo gioco fantastico qui!',
  maxLength = 200,
  helpText,
  disabled = false,
}: PromptBoxProps) {
  const remaining = maxLength - value.length

  return (
    <div className="w-full">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        className="kid-input resize-none h-40 border-kid-purple focus:border-kid-pink focus:ring-kid-pink"
        style={{
          fontFamily: 'Arial Rounded MT Bold, Comic Sans MS, cursive',
        }}
      />
      
      {/* Character count */}
      <div className="flex justify-between items-center mt-3 px-2">
        <div className="text-sm font-semibold text-white/80">
          {remaining > 0 ? `Ancora ${remaining} caratteri disponibili!` : 'Limite raggiunto! 🎯'}
        </div>
        <div className={`text-lg font-bold ${remaining < 20 ? 'text-kid-yellow' : 'text-white'}`}>
          {value.length} / {maxLength}
        </div>
      </div>

      {/* Help text */}
      {helpText && (
        <div className="mt-3 p-4 bg-white/20 rounded-xl">
          <p className="text-white font-semibold text-base">
            💡 {helpText}
          </p>
        </div>
      )}
    </div>
  )
}
