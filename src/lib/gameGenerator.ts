import type { Game, GameConfig, GameCategory, Difficulty, GenerateGameRequest } from '@/types/game'
import { getTemplate } from './templates'
import { sanitizeText } from './contentFilter'
import { v4 as uuidv4 } from 'uuid'

/**
 * ============================================
 * PROMPT TO GAME GENERATOR
 * Transforms user prompts into playable games
 * ============================================
 */

interface ParsedPrompt {
  character?: string
  action?: string
  setting?: string
  theme?: string
  objects?: string[]
}

/**
 * Parse prompt to extract key elements
 */
function parsePrompt(prompt: string): ParsedPrompt {
  const lower = prompt.toLowerCase()
  const parsed: ParsedPrompt = {
    objects: [],
  }
  
  console.log('🔍 Parsing prompt:', prompt)

  // Extract character (massively expanded list)
  const characters = [
    'gatto', 'cat', 'cane', 'dog', 'dinosauro', 'dinosaur', 'dino', 'robot', 'alieno', 'alien', 
    'rana', 'frog', 'uccello', 'bird', 'pesce', 'fish', 'coniglio', 'rabbit', 'bunny', 'volpe', 'fox',
    'orso', 'bear', 'leone', 'lion', 'tigre', 'tiger', 'panda', 'elefante', 'elephant',
    'scimmia', 'monkey', 'gorilla', 'koala', 'unicorno', 'unicorn', 'drago', 'dragon',
    'cavaliere', 'knight', 'mago', 'wizard', 'ninja', 'pirata', 'pirate', 'astronauta', 'astronaut',
    'auto', 'car', 'razzo', 'rocket', 'nave', 'ship', 'aereo', 'plane',
    'principessa', 'princess', 'principe', 'prince', 'eroe', 'hero', 'guerriero', 'warrior',
    'tartaruga', 'turtle', 'serpente', 'snake', 'coccodrillo', 'crocodile', 'pinguino', 'penguin',
    'mucca', 'cow', 'cavallo', 'horse', 'pecora', 'sheep', 'maiale', 'pig', 'pollo', 'chicken'
  ]
  for (const char of characters) {
    if (lower.includes(char)) {
      parsed.character = char
      break
    }
  }

  // Extract action
  const actions = ['salta', 'jump', 'corre', 'run', 'vola', 'fly', 'nuota', 'swim', 'raccoglie', 'collect', 'evita', 'avoid', 'schiva', 'dodge', 'spara', 'shoot']
  for (const action of actions) {
    if (lower.includes(action)) {
      parsed.action = action
      break
    }
  }

  // Extract setting
  const settings = [
    'nuvole', 'cloud', 'spazio', 'space', 'mare', 'ocean', 'foresta', 'forest', 'cielo', 'sky', 
    'città', 'city', 'giungla', 'jungle', 'deserto', 'desert', 'montagna', 'mountain',
    'castello', 'castle', 'dungeon', 'grotta', 'cave', 'vulcano', 'volcano',
    'pianeta', 'planet', 'luna', 'moon', 'stelle', 'stars', 'galassia', 'galaxy',
    'spiaggia', 'beach', 'isola', 'island', 'neve', 'snow', 'ghiaccio', 'ice'
  ]
  for (const setting of settings) {
    if (lower.includes(setting)) {
      parsed.setting = setting
      break
    }
  }

  // Extract collectible objects (expanded)
  const objects = [
    'stelle', 'star', 'monete', 'coin', 'gemme', 'gem', 'frutti', 'fruit', 'fiori', 'flower',
    'diamanti', 'diamond', 'oro', 'gold', 'cristalli', 'crystal', 'chiavi', 'key',
    'cuori', 'heart', 'pozioni', 'potion', 'tesoro', 'treasure', 'bandiera', 'flag',
    'anelli', 'ring', 'corone', 'crown', 'spade', 'sword', 'scudi', 'shield',
    'batterie', 'battery', 'energia', 'energy', 'carburante', 'fuel'
  ]
  for (const obj of objects) {
    if (lower.includes(obj)) {
      parsed.objects?.push(obj)
    }
  }
  
  console.log('✅ Parsed result:', parsed)

  return parsed
}

/**
 * Map parsed elements to sprites (emoji) - EXPANDED
 */
function mapToSprites(parsed: ParsedPrompt): { player: string; collectible: string } {
  const characterMap: Record<string, string> = {
    // Original animals
    'gatto': '🐱', 'cat': '🐱',
    'cane': '🐶', 'dog': '🐶',
    'dinosauro': '🦖', 'dinosaur': '🦖', 'dino': '🦖',
    'robot': '🤖',
    'alieno': '👽', 'alien': '👽',
    'rana': '🐸', 'frog': '🐸',
    'uccello': '🐦', 'bird': '🐦',
    'pesce': '🐟', 'fish': '🐟',
    'coniglio': '🐰', 'rabbit': '🐰', 'bunny': '🐰',
    // Expanded animals
    'volpe': '🦊', 'fox': '🦊',
    'orso': '🐻', 'bear': '🐻',
    'leone': '🦁', 'lion': '🦁',
    'tigre': '🐯', 'tiger': '🐯',
    'panda': '🐼',
    'elefante': '🐘', 'elephant': '🐘',
    'scimmia': '🐵', 'monkey': '🐵',
    'gorilla': '🦍',
    'koala': '🐨',
    'unicorno': '🦄', 'unicorn': '🦄',
    'drago': '🐉', 'dragon': '🐉',
    // Characters
    'cavaliere': '🤺', 'knight': '🤺',
    'mago': '🧙', 'wizard': '🧙',
    'ninja': '🥷',
    'pirata': '🏴‍☠️', 'pirate': '🏴‍☠️',
    'astronauta': '🧑‍🚀', 'astronaut': '🧑‍🚀',
    'principessa': '👸', 'princess': '👸',
    'principe': '🤴', 'prince': '🤴',
    'eroe': '🦸', 'hero': '🦸',
    'guerriero': '⚔️', 'warrior': '⚔️',
    // Vehicles
    'auto': '🚗', 'car': '🚗',
    'razzo': '🚀', 'rocket': '🚀',
    'nave': '🚢', 'ship': '🚢',
    'aereo': '✈️', 'plane': '✈️',
    // More animals
    'tartaruga': '🐢', 'turtle': '🐢',
    'serpente': '🐍', 'snake': '🐍',
    'coccodrillo': '🐊', 'crocodile': '🐊',
    'pinguino': '🐧', 'penguin': '🐧',
    'mucca': '🐮', 'cow': '🐮',
    'cavallo': '🐴', 'horse': '🐴',
    'pecora': '🐑', 'sheep': '🐑',
    'maiale': '🐷', 'pig': '🐷',
    'pollo': '🐔', 'chicken': '🐔'
  }

  const objectMap: Record<string, string> = {
    // Original
    'stelle': '⭐', 'star': '⭐',
    'monete': '🪙', 'coin': '🪙',
    'gemme': '💎', 'gem': '💎',
    'frutti': '🍎', 'fruit': '🍎',
    'fiori': '🌸', 'flower': '🌸',
    // Expanded
    'diamanti': '💎', 'diamond': '💎',
    'oro': '🏆', 'gold': '🏆',
    'cristalli': '🔮', 'crystal': '🔮',
    'chiavi': '🔑', 'key': '🔑',
    'cuori': '❤️', 'heart': '❤️',
    'pozioni': '🧪', 'potion': '🧪',
    'tesoro': '💰', 'treasure': '💰',
    'bandiera': '🚩', 'flag': '🚩',
    'anelli': '💍', 'ring': '💍',
    'corone': '👑', 'crown': '👑',
    'spade': '⚔️', 'sword': '⚔️',
    'scudi': '🛡️', 'shield': '🛡️',
    'batterie': '🔋', 'battery': '🔋',
    'energia': '⚡', 'energy': '⚡',
    'carburante': '⛽', 'fuel': '⛽'
  }

  const settingColors: Record<string, string> = {
    'nuvole': '#87CEEB', 'cloud': '#87CEEB',
    'spazio': '#1a1a2e', 'space': '#1a1a2e',
    'mare': '#006994', 'ocean': '#006994',
    'foresta': '#2d5016', 'forest': '#2d5016',
    'cielo': '#87CEEB', 'sky': '#87CEEB',
    'città': '#808080', 'city': '#808080',
    'giungla': '#228B22', 'jungle': '#228B22',
    'deserto': '#EDC9AF', 'desert': '#EDC9AF',
    'montagna': '#8B7355', 'mountain': '#8B7355',
    'castello': '#B8860B', 'castle': '#B8860B',
    'grotta': '#36454F', 'cave': '#36454F', 'dungeon': '#36454F',
    'vulcano': '#DC143C', 'volcano': '#DC143C',
    'pianeta': '#1a1a2e', 'planet': '#1a1a2e',
    'luna': '#F5F5DC', 'moon': '#F5F5DC',
    'galassia': '#191970', 'galaxy': '#191970',
    'spiaggia': '#F4A460', 'beach': '#F4A460',
    'isola': '#20B2AA', 'island': '#20B2AA',
    'neve': '#FFFAFA', 'snow': '#FFFAFA',
    'ghiaccio': '#E0FFFF', 'ice': '#E0FFFF'
  }

  const result = {
    player: characterMap[parsed.character || ''] || '🐱',
    collectible: parsed.objects && parsed.objects[0] ? (objectMap[parsed.objects[0]] || '⭐') : '⭐',
  }
  
  console.log('🎮 Mapped sprites:', result)
  
  return result
}

/**
 * Generate game configuration from prompt
 */
export function generateGameConfig(
  prompt: string,
  category: GameCategory,
  difficulty: Difficulty
): GameConfig {
  const template = getTemplate(category)
  const parsed = parsePrompt(prompt)
  const sprites = mapToSprites(parsed)

  // Base config from template
  const config: GameConfig = { ...template.defaultConfig }

  // Customize based on prompt
  config.player.sprite = sprites.player

  // Adjust difficulty
  switch (difficulty) {
    case 'easy':
      if (category === 'platformer') {
        config.player.speed = 5
        config.player.jumpPower = 15
        config.world.gravity = 0.8
      } else if (category === 'math') {
        // Lower numbers for easy mode
      }
      break
    case 'medium':
      if (category === 'platformer') {
        config.player.speed = 7
        config.player.jumpPower = 13
        config.world.gravity = 1.0
      }
      break
    case 'hard':
      if (category === 'platformer') {
        config.player.speed = 9
        config.player.jumpPower = 11
        config.world.gravity = 1.2
      }
      break
  }

  // Set background based on setting
  if (parsed.setting) {
    const settingColors: Record<string, string> = {
      'nuvole': '#87CEEB',
      'spazio': '#1a1a2e',
      'mare': '#006994',
      'foresta': '#2d5016',
    }
    config.world.backgroundColor = settingColors[parsed.setting] || '#87CEEB'
  }

  return config
}

/**
 * Generate complete game code from template and config
 */
function generateGameCode(
  category: GameCategory,
  config: GameConfig,
  sprites: { player: string; collectible: string }
): string {
  const template = getTemplate(category)
  let code = template.baseCode

  // Replace placeholders
  const replacements: Record<string, string> = {
    '{{PLAYER_SPRITE}}': sprites.player,
    '{{PLAYER_SIZE}}': config.player.size.toString(),
    '{{PLAYER_SPEED}}': config.player.speed.toString(),
    '{{PLAYER_COLOR}}': config.player.color,
    '{{JUMP_POWER}}': (config.player.jumpPower || 15).toString(),
    '{{GRAVITY}}': (config.world.gravity || 0.8).toString(),
    '{{BACKGROUND_COLOR}}': config.world.backgroundColor,
    '{{PLATFORM_COLOR}}': '#8B4513',
    '{{COLLECTIBLE_SPRITE}}': sprites.collectible,
    '{{OBSTACLE_SPRITE}}': '🌳', // Default obstacle
    '{{TARGET_SCORE}}': config.goal.target.toString(),
    '{{SCROLL_SPEED}}': (config.player.speed || 6).toString(),
    '{{LIVES}}': (category === 'runner' ? 3 : 1).toString(),
    '{{OPERATION}}': category === 'math' ? 'add' : 'add',
    '{{MAX_NUMBER}}': '20',
    '{{QUESTION_COUNT}}': config.goal.target.toString(),
    '{{CHARACTER_SPRITE}}': sprites.player,
    '{{CARD_SPRITES}}': "['🐱', '🐶', '🐸', '🐦', '🐟', '🐰', '🦊', '🐻']",
    '{{NUM_PAIRS}}': '6',
    '{{CARD_BACK_COLOR}}': '#9B59B6',
  }

  for (const [key, value] of Object.entries(replacements)) {
    code = code.replace(new RegExp(key, 'g'), value)
  }

  return code
}

/**
 * Generate a complete game from a prompt
 */
export function generateGame(request: GenerateGameRequest): Game {
  const { prompt, category, difficulty, userId, customImages } = request

  // Sanitize prompt
  const sanitizedPrompt = sanitizeText(prompt)
  
  // Parse and generate config
  const config = generateGameConfig(sanitizedPrompt, category, difficulty)
  const parsed = parsePrompt(sanitizedPrompt)
  const sprites = mapToSprites(parsed)
  
  // Generate code
  const code = generateGameCode(category, config, sprites)
  
  // Generate title from prompt (capitalize first word)
  const words = sanitizedPrompt.split(' ')
  const title = words.slice(0, 4).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  
  // Create game object
  const game: Game = {
    id: `game_${uuidv4()}`,
    title: title || 'Il Mio Gioco',
    prompt: sanitizedPrompt,
    category,
    difficulty,
    config,
    code,
    assets: {
      sprites: {
        player: {
          type: customImages?.find(img => img.role === 'player') ? 'image' : 'emoji',
          value: sprites.player,
          width: config.player.size,
          height: config.player.size,
        },
        collectible: {
          type: customImages?.find(img => img.role === 'collectible') ? 'image' : 'emoji',
          value: sprites.collectible,
          width: 30,
          height: 30,
        },
      },
    },
    customImages: customImages || undefined,
    createdAt: new Date().toISOString(),
    createdBy: userId || 'guest',
    published: false,
  }

  return game
}
