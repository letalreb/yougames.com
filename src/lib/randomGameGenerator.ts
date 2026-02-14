import type { GameCategory, Difficulty } from '@/types/game'

/**
 * ============================================
 * RANDOM GAME IDEA GENERATOR
 * Genera idee di giochi casuali creativi
 * ============================================
 */

// Personaggi
const characters = [
  // Animali
  { emoji: '🐱', name: 'gatto', adjectives: ['coraggioso', 'veloce', 'furbo', 'ninja', 'spaziale'] },
  { emoji: '🐶', name: 'cane', adjectives: ['fedele', 'energico', 'detective', 'super', 'robot'] },
  { emoji: '🦊', name: 'volpe', adjectives: ['astuta', 'magica', 'volante', 'cyber', 'samurai'] },
  { emoji: '🐻', name: 'orso', adjectives: ['forte', 'gentile', 'polare', 'kung-fu', 'cosmico'] },
  { emoji: '🦁', name: 'leone', adjectives: ['re', 'dorato', 'leggendario', 'alato', 'elettrico'] },
  { emoji: '🐼', name: 'panda', adjectives: ['zen', 'guerriero', 'gigante', 'mistico', 'danzante'] },
  { emoji: '🦉', name: 'gufo', adjectives: ['saggio', 'notturno', 'magico', 'steampunk', 'temporale'] },
  { emoji: '🐧', name: 'pinguino', adjectives: ['elegante', 'sciatore', 'imperatore', 'jet', 'disco'] },
  { emoji: '🦄', name: 'unicorno', adjectives: ['arcobaleno', 'stellare', 'cristallino', 'volante', 'galattico'] },
  { emoji: '🐉', name: 'drago', adjectives: ['fuoco', 'ghiaccio', 'baby', 'antico', 'neon'] },
  
  // Robot e Fantascienza
  { emoji: '🤖', name: 'robot', adjectives: ['amichevole', 'piccolo', 'gigante', 'vintage', 'quantico'] },
  { emoji: '👾', name: 'alieno', adjectives: ['carino', 'verde', 'luminoso', 'amichevole', 'danzante'] },
  { emoji: '🚀', name: 'astronauta', adjectives: ['coraggioso', 'giovane', 'esploratore', 'lunare', 'stellare'] },
  
  // Fantasy
  { emoji: '🧙', name: 'mago', adjectives: ['giovane', 'potente', 'saggio', 'apprendista', 'elementale'] },
  { emoji: '🧚', name: 'fata', adjectives: ['luminosa', 'gentile', 'della natura', 'antica', 'cristallina'] },
  { emoji: '🦸', name: 'supereroe', adjectives: ['volante', 'veloce', 'forte', 'invisibile', 'bambino'] },
  
  // Oggetti viventi
  { emoji: '🍄', name: 'funghetto', adjectives: ['magico', 'saltellante', 'luminoso', 'gigante', 'parlante'] },
  { emoji: '⭐', name: 'stella', adjectives: ['cadente', 'danzante', 'brillante', 'fatata', 'cosmica'] },
  { emoji: '🎈', name: 'palloncino', adjectives: ['colorato', 'volante', 'magico', 'avventuroso', 'parlante'] },
]

// Ambientazioni per categoria
const settings = {
  platformer: [
    'salta tra le nuvole', 'esplora la foresta incantata', 'scala la montagna magica',
    'attraversa il deserto delle stelle', 'naviga nel mare di caramelle', 'vola tra i pianeti',
    'corre sui tetti della città', 'salta tra iceberg galleggianti', 'esplora rovine antiche',
    'si muove in una giungla preistorica', 'viaggia in un mondo di pixel',
  ],
  runner: [
    'corre nella foresta', 'scappa dal vulcano', 'fugge nella metropoli',
    'corre sulla luna', 'sfreccia nel deserto', 'insegue il tramonto',
    'corre in un mondo sottomarino', 'vola nel cielo stellato', 'corre nei sotterranei',
    'scivola sul ghiaccio', 'corre in una dimensione parallela',
  ],
  memory: [
    'con animali della fattoria', 'con creature marine', 'con frutti esotici',
    'con veicoli spaziali', 'con strumenti musicali', 'con dinosauri colorati',
    'con dolcetti magici', 'con creature mitiche', 'con pianeti e stelle',
    'con gemme preziose', 'con maschere tribali',
  ],
  math: [
    'con addizioni', 'con sottrazioni', 'con moltiplicazioni',
    'con indovinelli numerici', 'conta le stelle', 'risolve enigmi matematici',
    'calcola rapidamente', 'gioca con i numeri', 'fa calcoli mentali',
  ],
  quiz: [
    'risponde a domande di cultura', 'indovina gli animali', 'riconosce le bandiere',
    'scopre curiosità del mondo', 'impara i colori', 'identifica i suoni',
    'risponde su dinosauri', 'quiz sulla natura', 'domande sullo spazio',
  ],
  maze: [
    'trova l\'uscita del labirinto', 'esplora il castello dei misteri', 'naviga nel labirinto di siepi',
    'risolve il labirinto di specchi', 'esce dal tempio perduto', 'attraversa il labirinto di cristallo',
  ],
  'card-match': [
    'abbina le carte magiche', 'trova le coppie nascoste', 'combina elementi',
    'accoppia creature fantastiche', 'unisci le metà', 'trova gemelli cosmici',
  ],
  puzzle: [
    'risolve puzzle colorati', 'completa l\'immagine magica', 'assembla il mosaico',
    'ricostruisce il paesaggio', 'sistema il puzzle spaziale', 'compone l\'opera d\'arte',
  ],
  story: [
    'vive un\'avventura epica', 'esplora mondi sconosciuti', 'salva il regno',
    'scopre tesori nascosti', 'incontra personaggi strani', 'risolve un mistero',
  ],
  coloring: [
    'colora paesaggi fantastici', 'dipinge creature magiche', 'crea opere d\'arte',
    'colora mandala zen', 'decora il suo mondo', 'dipinge arcobaleni',
  ],
}

// Oggetti da raccogliere
const collectibles = [
  { emoji: '⭐', name: 'stelle dorate' },
  { emoji: '💎', name: 'diamanti brillanti' },
  { emoji: '🍎', name: 'mele magiche' },
  { emoji: '🍪', name: 'biscotti magici' },
  { emoji: '🌟', name: 'cristalli luminosi' },
  { emoji: '🎁', name: 'regali misteriosi' },
  { emoji: '🏆', name: 'trofei dorati' },
  { emoji: '💰', name: 'monete antiche' },
  { emoji: '🌈', name: 'arcobaleni' },
  { emoji: '🔮', name: 'sfere magiche' },
  { emoji: '🎨', name: 'pennelli fatati' },
  { emoji: '🎵', name: 'note musicali' },
  { emoji: '🦴', name: 'ossa giganti' },
  { emoji: '🍭', name: 'lecca-lecca' },
  { emoji: '🎪', name: 'biglietti del circo' },
]

// Modificatori speciali
const modifiers = [
  'di notte', 'al tramonto', 'sotto la pioggia di meteoriti',
  'in un mondo invertito', 'in bianco e nero', 'con gravità ridotta',
  'contro il tempo', 'con un amico invisibile', 'seguendo le lucciole',
  'durante un\'eclissi', 'in un sogno lucido', 'in slow motion',
]

/**
 * Genera un prompt casuale creativo
 */
export function generateRandomPrompt(category: GameCategory): string {
  // Scegli un personaggio casuale
  const character = characters[Math.floor(Math.random() * characters.length)]
  const adjective = character.adjectives[Math.floor(Math.random() * character.adjectives.length)]
  
  // Scegli setting basato sulla categoria
  const categorySetting = settings[category] || settings.platformer
  const setting = categorySetting[Math.floor(Math.random() * categorySetting.length)]
  
  // Aggiungi collectible se rilevante
  const needsCollectible = ['platformer', 'runner'].includes(category)
  let collectiblePart = ''
  
  if (needsCollectible && Math.random() > 0.3) {
    const collectible = collectibles[Math.floor(Math.random() * collectibles.length)]
    collectiblePart = ` e raccoglie ${collectible.name}`
  }
  
  // Aggiungi modificatore speciale raramente
  let modifierPart = ''
  if (Math.random() > 0.7) {
    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)]
    modifierPart = ` ${modifier}`
  }
  
  // Costruisci il prompt
  const prompt = `un ${character.name} ${adjective} ${setting}${collectiblePart}${modifierPart}`
  
  return prompt
}

/**
 * Genera categoria casuale
 */
export function generateRandomCategory(): GameCategory {
  const availableCategories: GameCategory[] = [
    'platformer',
    'runner',
    'memory',
    'math',
    'quiz',
    'maze',
    'card-match',
    'puzzle',
  ]
  
  return availableCategories[Math.floor(Math.random() * availableCategories.length)]
}

/**
 * Genera difficoltà casuale (con bias verso easy/medium)
 */
export function generateRandomDifficulty(): Difficulty {
  const random = Math.random()
  
  if (random < 0.5) return 'easy'      // 50% easy
  if (random < 0.85) return 'medium'   // 35% medium
  return 'hard'                         // 15% hard
}

/**
 * Genera un'idea di gioco completa casuale
 */
export interface RandomGameIdea {
  category: GameCategory
  prompt: string
  difficulty: Difficulty
  emoji: string
}

export function generateRandomGameIdea(): RandomGameIdea {
  const category = generateRandomCategory()
  const prompt = generateRandomPrompt(category)
  const difficulty = generateRandomDifficulty()
  
  // Trova emoji del personaggio nel prompt
  const character = characters.find(c => prompt.includes(c.name))
  const emoji = character?.emoji || '🎮'
  
  return {
    category,
    prompt,
    difficulty,
    emoji,
  }
}

/**
 * Genera multiple idee per scelta
 */
export function generateRandomGameIdeas(count: number = 3): RandomGameIdea[] {
  const ideas: RandomGameIdea[] = []
  
  for (let i = 0; i < count; i++) {
    ideas.push(generateRandomGameIdea())
  }
  
  return ideas
}
