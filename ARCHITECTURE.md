# 🎮 YouGames - Architettura Sistema

## 📋 Panoramica

Piattaforma web SaaS per permettere a bambini (6-12 anni) di creare mini-giochi tramite prompt testuali, giocarli subito, e pubblicarli online con 1 click.

---

## 🏗️ Architettura Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER (Next.js)                  │
├─────────────────────────────────────────────────────────────┤
│  • Homepage child-friendly                                   │
│  • Prompt Builder (step wizard)                              │
│  • Game Canvas Preview                                       │
│  • Game Library (saved games)                                │
│  • Share Portal                                              │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                  API LAYER (Serverless)                      │
├─────────────────────────────────────────────────────────────┤
│  • /api/generate-game      → Prompt → Game Config           │
│  • /api/save-game          → Persist game to DB/GitHub      │
│  • /api/publish-game       → Deploy to Vercel               │
│  • /api/filter-content     → Safety check                   │
│  • /api/auth/*             → GitHub OAuth                    │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    GAME ENGINE LAYER                         │
├─────────────────────────────────────────────────────────────┤
│  • Custom 2D Canvas Engine                                   │
│  • Game Loop (60 FPS)                                        │
│  • Input Handler                                             │
│  • Collision System                                          │
│  • Asset Manager (shapes, colors, sprites)                   │
│  • Template System (per categoria)                           │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                     DATA LAYER                               │
├─────────────────────────────────────────────────────────────┤
│  • Vercel KV (Redis) → Game metadata                         │
│  • GitHub Repo → Game source files                           │
│  • Local Storage → Guest mode games                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Completo

### 1️⃣ CREAZIONE GIOCO

```
Bambino scrive prompt
        ↓
[UI Wizard] raccolta info:
  - Prompt testo
  - Categoria selezionata
  - Difficoltà (facile/medio/difficile)
        ↓
POST /api/generate-game
{
  prompt: "un gatto che salta tra le nuvole",
  category: "platformer",
  difficulty: "easy"
}
        ↓
[AI/Logic Processing]
  1. Content Safety Filter
  2. Parse Intent
  3. Extract entities (character, obstacles, goal)
  4. Select Template
  5. Configure Parameters
        ↓
Response: GameConfig JSON
{
  id: "game_xyz123",
  title: "Cloud Cat Jump",
  category: "platformer",
  config: {
    player: { sprite: "cat", speed: 5, jumpPower: 12 },
    obstacles: ["cloud", "bird"],
    goal: "reach_score",
    targetScore: 100,
    backgroundColor: "#87CEEB"
  },
  code: "// Generated game code..."
}
        ↓
[Canvas Renderer] carica gioco
        ↓
PREVIEW MODE attivata
Bambino gioca subito!
```

### 2️⃣ PUBBLICAZIONE GIOCO

```
Bambino clicca "Pubblica"
        ↓
POST /api/save-game
{
  gameId: "game_xyz123",
  config: {...},
  userId: "user_abc" // o "guest"
}
        ↓
[GitHub Integration]
  - Crea file /games/{gameId}.json
  - Crea pagina /play/{gameId}
  - Commit + Push automatico
        ↓
[Vercel Webhook]
  - Auto-deploy triggered
  - Build in ~30s
        ↓
Response: Public URL
{
  url: "https://yougames.com/play/game_xyz123"
}
        ↓
[Share UI] mostra link + QR code
```

### 3️⃣ CONDIVISIONE

```
Link pubblico condiviso
        ↓
Amico/Studente apre URL
        ↓
Next.js SSG page caricata
        ↓
Game Config parsed
        ↓
Canvas Engine inizializzato
        ↓
Gioco pronto!
```

---

## 🎨 Modello Generazione Giochi

### Template-Based Generation

Ogni categoria ha un **template** con:

```typescript
interface GameTemplate {
  category: string;
  baseCode: string; // Game loop base
  configurableParams: string[]; // Es: ["playerSpeed", "gravity"]
  assets: AssetRequirements; // Cosa serve (forme, colori)
  mechanics: Mechanic[]; // Meccaniche disponibili
  difficultyScales: DifficultyConfig; // Come scalare difficoltà
}
```

### Prompt → Config Pipeline

```
1. PARSE PROMPT
   - Extract: character, action, setting, goal
   - NLP semplice + pattern matching
   - Esempio: "un gatto che salta tra le nuvole"
     → character: cat
     → action: jump
     → setting: clouds/sky
     → goal: implied (score/survival)

2. SAFETY CHECK
   - Blocked words list
   - Sentiment analysis → solo contenuto positivo
   - Age-appropriate filter

3. SELECT TEMPLATE
   - Match categoria + azione
   - Platformer template se "salta"
   - Quiz template se "domande"

4. MAP ENTITIES
   - cat → playerSprite: "🐱" o canvas drawing
   - clouds → platforms array
   - sky → backgroundColor: "#87CEEB"

5. CONFIGURE MECHANICS
   - Difficoltà → adjust speed/spawn rate
   - Goal → set win condition

6. GENERATE CODE
   - Fill template con parametri
   - Inject configurazioni
   - Validate syntax

7. RETURN GAME
   - Executable JS code
   - Config JSON
   - Asset manifest
```

---

## 🚀 Pipeline Deploy

### GitHub + Vercel Flow

```
LOCAL DEVELOPMENT
    ↓
git push origin main
    ↓
[GitHub Actions] (optional CI tests)
    ↓
[Vercel Integration]
  - Auto-detect Next.js
  - npm install
  - npm run build
  - Deploy to Edge Network
    ↓
PRODUCTION
  - Main app: yougames.com
  - Games: yougames.com/play/{id}
    ↓
[Post-Deploy]
  - Invalidate CDN cache
  - Update game index
```

### Game Publish Flow

```
User clicks "Publish"
    ↓
POST /api/publish-game
    ↓
[Server Action]
  1. Save game to /public/games/{id}.json
  2. Generate static page /pages/play/[id].tsx
  3. Commit to GitHub (via Octokit)
  4. Push to main branch
    ↓
[Vercel Webhook]
  - Incremental Static Regeneration
  - New page goes live in ~10s
    ↓
Return public URL
```

---

## 🎯 Linee Guida UX per Bambini

### Principi Design

1. **GRANDI E CHIARI**
   - Pulsanti min 80x80px
   - Testo min 18px
   - Icone + Testo sempre

2. **COLORI VIVACI**
   - Palette primari luminosi
   - Alto contrasto
   - Gradients giocosi

3. **FEEDBACK IMMEDIATO**
   - Click → animation
   - Success → celebration
   - Error → gentle guidance

4. **SEMPLICITÀ**
   - Max 3 step per task
   - 1 concetto per schermata
   - Progress bar visibile

5. **DIVERTIMENTO**
   - Micro-animazioni
   - Sound effects
   - Emoji / Characters guide

### Navigation Pattern

```
HOME
  ↓
[Giant Button: "CREA IL TUO GIOCO! 🎮"]
  ↓
STEP 1: Scegli Categoria
  [6 grandi card con icone]
  ↓
STEP 2: Racconta il tuo gioco
  [Textarea con placeholder divertente]
  [Suggerimenti visivi]
  ↓
STEP 3: Genera!
  [Grande pulsante con animation]
  [Loading con animazione divertente]
  ↓
PREVIEW
  [Canvas fullscreen]
  [Pulsanti: Rigioca | Modifica | Pubblica]
  ↓
PUBBLICA
  [Celebration animation]
  [Link + QR code grandi]
  [Pulsante: Condividi]
```

### Component Library Child-Friendly

```typescript
<BigButton emoji="🚀" color="primary">
  Crea Gioco!
</BigButton>

<CategoryCard 
  icon="🏃" 
  title="Corsa Infinita" 
  color="orange"
/>

<PromptBox
  placeholder="Descrivi il tuo gioco fantastico!"
  maxLength={200}
  showCharacterCount
  helpText="Esempio: un dinosauro che corre nella giungla"
/>

<GameCanvas gameId="..." showControls />

<CelebrationModal
  title="🎉 Gioco Pubblicato!"
  shareUrl="..."
  showConfetti
/>
```

---

## 🔒 Sicurezza Bambini

### Content Safety Layers

```
1. INPUT FILTERING
   - Blocklist parole inappropriate
   - Max prompt length: 200 chars
   - Solo caratteri standard (no emoji strani)

2. AI MODERATION (before generation)
   - Check sentiment → rifiuta contenuto negativo
   - Block violence/scary themes
   - Ensure positive language

3. OUTPUT VALIDATION
   - Game code sandboxed
   - No external network calls
   - No localStorage abuse
   - No eval() o code injection

4. RUNTIME PROTECTION
   - Canvas isolated
   - No access a DOM esterno
   - Timeout su game loop (prevent freeze)

5. SOCIAL SAFETY
   - No chat tra utenti
   - Share link only (no comments)
   - Solo adulti possono creare account
   - Guest mode completamente anonimo
```

### Moderation API

```typescript
// /api/filter-content
POST {
  text: "prompt dell'utente"
}

Response {
  safe: boolean,
  reason?: string, // Se unsafe
  sanitized: string // Versione pulita
}
```

---

## 📊 Data Model

### Game Schema

```typescript
interface Game {
  id: string; // game_<uuid>
  title: string;
  prompt: string;
  category: GameCategory;
  difficulty: 'easy' | 'medium' | 'hard';
  
  config: {
    player: PlayerConfig;
    world: WorldConfig;
    mechanics: MechanicConfig[];
    goal: GoalConfig;
  };
  
  code: string; // Generated JS
  assets: AssetManifest;
  
  createdAt: Date;
  createdBy: string; // userId or "guest"
  published: boolean;
  publicUrl?: string;
  
  stats?: {
    plays: number;
    shares: number;
  };
}
```

### Category Types

```typescript
type GameCategory = 
  | 'platformer'
  | 'runner'
  | 'maze'
  | 'quiz'
  | 'math'
  | 'memory'
  | 'card-match'
  | 'story'
  | 'coloring'
  | 'puzzle';
```

---

## ⚡ Performance Considerations

1. **Canvas Optimization**
   - RequestAnimationFrame game loop
   - Object pooling per sprites
   - Offscreen canvas per complex rendering

2. **Code Splitting**
   - Lazy load game engine
   - Category templates loaded on-demand
   - Images/assets lazy loaded

3. **Caching Strategy**
   - Game configs cached in KV store
   - Static game pages pre-rendered
   - CDN per assets

4. **Mobile First**
   - Touch-optimized controls
   - Responsive canvas
   - PWA support

---

## 🧩 Extension Points (Future)

- AI image generation per sprites personalizzati
- Multiplayer locale (2 players, shared keyboard)
- Remix system (modifica giochi di altri)
- Teacher dashboard (class management)
- Progression system (unlock categories)
- Game analytics (heatmaps, completion rate)

---

## 📦 Tech Stack Finale

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 14 (App Router) | SSR + SSG, API routes, performance |
| Language | TypeScript | Type safety, dev experience |
| Styling | TailwindCSS | Rapid UI, child-friendly utilities |
| Canvas | Custom 2D Engine | Full control, lightweight |
| Auth | NextAuth + GitHub | Simple, secure |
| Database | Vercel KV (Redis) | Fast, serverless-friendly |
| Storage | GitHub + Public folder | Version control + free hosting |
| Deploy | Vercel | Zero-config, auto-preview |
| AI/LLM | OpenAI API / Local NLP | Prompt processing (fallback to rules) |

---

**Prossimo Step**: Implementazione codice 🚀
