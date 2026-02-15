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
 * PromptBox - Large text area for complex game descriptions
 * Supports detailed prompts for AI-powered game generation
 */
export function PromptBox({
  value,
  onChange,
  placeholder = 'Descrivi il tuo gioco fantastico qui con tutti i dettagli che desideri!',
  maxLength = 2000,
  helpText,
  disabled = false,
}: PromptBoxProps) {
  const remaining = maxLength - value.length
  const percentage = (value.length / maxLength) * 100

  return (
    <div className="w-full">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        className="kid-input resize-none h-64 border-kid-purple focus:border-kid-pink focus:ring-kid-pink"
        style={{
          fontFamily: 'Arial Rounded MT Bold, Comic Sans MS, cursive',
        }}
      />
      
      {/* Character count with progress bar */}
      <div className="mt-3 px-2">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-semibold text-white/80">
            {remaining > 100 ? '✍️ Continua a scrivere!' : remaining > 0 ? `⚠️ Ancora ${remaining} caratteri` : '🎯 Limite raggiunto!'}
          </div>
          <div className={`text-lg font-bold ${percentage > 90 ? 'text-kid-yellow' : 'text-white'}`}>
            {value.length} / {maxLength}
          </div>
        </div>
        {/* Progress bar */}
        <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${
              percentage > 90 ? 'bg-kid-yellow' : percentage > 50 ? 'bg-kid-blue' : 'bg-kid-green'
            }`}
            style={{ width: `${percentage}%` }}
          />
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
