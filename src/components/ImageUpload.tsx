'use client'

import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { CustomImage } from '@/types/game'

interface ImageUploadProps {
  role: CustomImage['role']
  onImageUpload: (image: CustomImage) => void
  currentImage?: CustomImage
  label?: string
  maxSizeMB?: number
}

/**
 * ImageUpload - Upload component for custom game sprites
 * Allows kids/parents to upload their own images for game characters
 */
export function ImageUpload({
  role,
  onImageUpload,
  currentImage,
  label,
  maxSizeMB = 2,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(currentImage?.dataUrl || null)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const roleLabels: Record<CustomImage['role'], string> = {
    player: '🎮 Personaggio',
    collectible: '⭐ Oggetto da Raccogliere',
    obstacle: '🚧 Ostacolo',
    background: '🎨 Sfondo',
    platform: '🟫 Piattaforma',
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError(null)
    setIsProcessing(true)

    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Il file deve essere un\'immagine (PNG, JPG, GIF)')
      }

      // Validate file size
      const fileSizeMB = file.size / (1024 * 1024)
      if (fileSizeMB > maxSizeMB) {
        throw new Error(`L'immagine è troppo grande! Max ${maxSizeMB}MB`)
      }

      // Read file and create preview
      const reader = new FileReader()
      
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        
        // Create an image to get dimensions
        const img = new Image()
        img.onload = () => {
          // Validate dimensions (max 1024x1024)
          if (img.width > 1024 || img.height > 1024) {
            setError('Immagine troppo grande! Max 1024x1024 pixel')
            setIsProcessing(false)
            return
          }

          // Create custom image object
          const customImage: CustomImage = {
            id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            role,
            dataUrl,
            width: img.width,
            height: img.height,
            filename: file.name,
          }

          setPreview(dataUrl)
          onImageUpload(customImage)
          setIsProcessing(false)
        }
        
        img.onerror = () => {
          setError('Errore nel caricamento dell\'immagine')
          setIsProcessing(false)
        }
        
        img.src = dataUrl
      }

      reader.onerror = () => {
        setError('Errore nella lettura del file')
        setIsProcessing(false)
      }

      reader.readAsDataURL(file)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto')
      setIsProcessing(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full">
      <label className="block text-white font-bold text-lg mb-2">
        {label || roleLabels[role]}
      </label>

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isProcessing}
        />

        {!preview ? (
          // Upload button
          <button
            onClick={handleClick}
            disabled={isProcessing}
            className="w-full h-32 border-4 border-dashed border-white/50 rounded-2xl 
                     bg-white/10 hover:bg-white/20 transition-all
                     flex flex-col items-center justify-center gap-2
                     text-white font-bold text-xl cursor-pointer
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin text-4xl">⏳</div>
                <span>Caricamento...</span>
              </>
            ) : (
              <>
                <div className="text-5xl">📤</div>
                <span>Carica Immagine</span>
                <span className="text-sm opacity-75">PNG, JPG, GIF • Max {maxSizeMB}MB</span>
              </>
            )}
          </button>
        ) : (
          // Image preview
          <div className="relative bg-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-white/20 rounded-xl overflow-hidden flex items-center justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              
              <div className="flex-1 text-white">
                <p className="font-bold text-lg">✅ Immagine caricata!</p>
                <p className="text-sm opacity-75">
                  {currentImage?.filename || 'custom-sprite.png'}
                </p>
                {currentImage && (
                  <p className="text-xs opacity-60 mt-1">
                    {currentImage.width}x{currentImage.height} px
                  </p>
                )}
              </div>

              <button
                onClick={handleRemove}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-xl
                         text-white font-bold transition-colors"
              >
                🗑️ Rimuovi
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-4 bg-red-500/80 rounded-xl text-white font-bold"
        >
          ⚠️ {error}
        </motion.div>
      )}

      <div className="mt-3 text-white/70 text-sm">
        💡 <strong>Suggerimento:</strong> Usa immagini con sfondo trasparente (PNG) per un risultato migliore!
      </div>
    </div>
  )
}
