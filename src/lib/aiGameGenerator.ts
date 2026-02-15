import OpenAI from 'openai'
import type { Game, GenerateGameRequest } from '@/types/game'
import { v4 as uuidv4 } from 'uuid'

/**
 * ============================================
 * AI-POWERED GAME GENERATOR
 * Uses GPT-4 to generate complete HTML/CSS/JS games
 * ============================================
 */

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const SYSTEM_PROMPT = `Sei un esperto sviluppatore di giochi web per bambini. 
Genera giochi HTML/CSS/JavaScript completi, standalone e sicuri che:
- Sono contenuti in un unico file HTML con CSS e JS inline
- Funzionano perfettamente in un iframe sandbox
- Hanno controlli intuitivi (tastiera/mouse/touch)
- Sono colorati, divertenti e adatti ai bambini
- Includono punteggio, timer e feedback visivo/sonoro
- Hanno istruzioni chiare in italiano
- Non richiedono risorse esterne (tutto inline/data URLs)
- Usano canvas 2D o CSS animations per la grafica
- Sono responsive e funzionano su mobile e desktop

Rispondi SOLO con il codice HTML completo, nessun testo aggiuntivo.`

/**
 * Genera un prompt dettagliato per l'AI basato sulla richiesta dell'utente
 */
function buildAIPrompt(request: GenerateGameRequest): string {
  const { prompt, category, difficulty } = request
  
  const difficultyMap = {
    easy: 'facile (velocità lenta, pochi ostacoli, controlli semplici)',
    medium: 'medio (velocità moderata, più elementi, meccaniche variegate)',
    hard: 'difficile (velocità alta, molti ostacoli, meccaniche complesse)',
  }
  
  const categoryDescriptions: Partial<Record<GameCategory, string>> = {
    platformer: 'un platformer 2D con salti, piattaforme, e collezionabili',
    runner: 'un endless runner con schivata di ostacoli',
    memory: 'un memory game con carte da abbinare',
    puzzle: 'un puzzle game con logica e risoluzione di problemi',
    maze: 'un labirinto da esplorare e completare',
    clicker: 'un clicker/idle game con upgrade',
    quiz: 'un quiz con domande e risposte',
    matching: 'un gioco di abbinamento',
    math: 'un gioco matematico educativo',
    'card-match': 'un gioco di abbinamento carte',
    story: 'un gioco narrativo interattivo',
    coloring: 'un gioco di colorazione creativa',
  }
  
  return `Crea ${categoryDescriptions[category] || 'un gioco interattivo'} con difficoltà ${difficultyMap[difficulty]}.

Descrizione del gioco richiesta dall'utente:
${prompt}

REQUISITI TECNICI:
- Usa canvas 2D o CSS per la grafica
- Implementa loop di gioco fluido (requestAnimationFrame)
- Aggiungi controlli responsive (tastiera + touch)
- Includi HUD con punteggio, vite, timer
- Usa emoji o forme colorate per gli sprite
- Animazioni fluide e feedback visivo
- Schermata iniziale con istruzioni
- Schermata game over con possibilità di riavvio
- Colori vivaci e child-friendly
- Suoni opzionali (Web Audio API con oscillatori)

Il gioco deve essere contenuto in un singolo HTML completo.`
}

/**
 * Genera un gioco usando GPT-4
 */
export async function generateAIGame(request: GenerateGameRequest): Promise<Game> {
  try {
    console.log('🤖 Chiamata a OpenAI GPT-4 per generazione gioco...')
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildAIPrompt(request) },
      ],
      temperature: 0.8,
      max_tokens: 4000,
    })
    
    const htmlCode = completion.choices[0]?.message?.content || ''
    
    if (!htmlCode?.includes('<html')) {
      throw new Error('AI non ha generato HTML valido')
    }
    
    console.log('✅ Gioco generato con successo!')
    console.log('📏 Dimensione HTML:', htmlCode.length, 'caratteri')
    
    // Crea l'oggetto Game
    const game: Game = {
      id: uuidv4(),
      title: extractTitle(request.prompt) || 'Il Mio Gioco',
      category: request.category,
      difficulty: request.difficulty,
      createdAt: new Date().toISOString(),
      code: htmlCode, // HTML completo
      config: {
        width: 800,
        height: 600,
        backgroundColor: '#87CEEB',
        isAIGenerated: true,
      },
      assets: {
        playerSprite: '🎮',
        collectibleSprite: '⭐',
        obstacleSprite: '❌',
      },
      prompt: request.prompt,
      aiGenerated: true,
    }
    
    return game
  } catch (error: any) {
    console.error('❌ Errore nella generazione AI:', error)
    
    // Se l'API key non è configurata o errore API, ritorna un fallback
    if (error?.status === 401 || !process.env.OPENAI_API_KEY) {
      throw new Error('Configurazione OpenAI mancante. Aggiungi OPENAI_API_KEY al file .env.local')
    }
    
    throw new Error(`Errore AI: ${error.message}`)
  }
}

/**
 * Estrae un titolo dal prompt dell'utente
 */
function extractTitle(prompt: string): string {
  const words = prompt.split(' ').filter(w => w.length > 3)
  if (words.length === 0) return 'Il Mio Gioco'
  
  // Prendi le prime 3-4 parole significative
  return words
    .slice(0, 4)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Verifica se l'AI è disponibile
 */
export function isAIAvailable(): boolean {
  return Boolean(process.env.OPENAI_API_KEY)
}
