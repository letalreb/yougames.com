import { platformerTemplate } from './platformer'
import { memoryTemplate } from './memory'
import { mathQuizTemplate } from './mathQuiz'
import { runnerTemplate } from './runner'
import type { GameTemplate, GameCategory } from '@/types/game'

/**
 * Central registry of all game templates
 */
export const gameTemplates: Record<GameCategory, GameTemplate> = {
  platformer: platformerTemplate,
  runner: runnerTemplate,
  memory: memoryTemplate,
  math: mathQuizTemplate,
  
  // Placeholder templates (to be implemented)
  maze: platformerTemplate,
  quiz: mathQuizTemplate, // Similar to math
  'card-match': memoryTemplate, // Similar to memory
  story: platformerTemplate,
  coloring: platformerTemplate,
  puzzle: memoryTemplate,
}

/**
 * Get template by category
 */
export function getTemplate(category: GameCategory): GameTemplate {
  return gameTemplates[category] || platformerTemplate
}

/**
 * Get all available categories
 */
export function getAllCategories() {
  return [
    { category: 'platformer' as GameCategory, icon: '🏃', title: 'Platformer', description: 'Salta e raccogli!', color: '#3498DB' },
    { category: 'runner' as GameCategory, icon: '🏃‍♂️', title: 'Runner', description: 'Corri senza fermarti!', color: '#E67E22' },
    { category: 'memory' as GameCategory, icon: '🧠', title: 'Memory', description: 'Trova le coppie!', color: '#9B59B6' },
    { category: 'math' as GameCategory, icon: '➕', title: 'Matematica', description: 'Risolvi i calcoli!', color: '#2ECC71' },
    { category: 'quiz' as GameCategory, icon: '❓', title: 'Quiz', description: 'Domande e risposte!', color: '#F1C40F' },
    { category: 'maze' as GameCategory, icon: '🌀', title: 'Labirinto', description: 'Trova l\'uscita!', color: '#E74C3C' },
    { category: 'card-match' as GameCategory, icon: '🃏', title: 'Carte', description: 'Abbina le carte!', color: '#FF6B9D' },
    { category: 'puzzle' as GameCategory, icon: '🧩', title: 'Puzzle', description: 'Risolvi il puzzle!', color: '#1ABC9C' },
    { category: 'story' as GameCategory, icon: '📖', title: 'Storia', description: 'Avventura interattiva!', color: '#34495E' },
    { category: 'coloring' as GameCategory, icon: '🎨', title: 'Colora', description: 'Colora e crea!', color: '#FF1493' },
  ]
}
