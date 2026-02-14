# 🎮 YouGames - AI-Powered Game Creation for Kids

> **Una piattaforma web dove i bambini possono creare i propri giochi semplicemente descrivendoli!**

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## ✨ Cosa fa YouGames?

YouGames è una piattaforma **SaaS AI-powered** progettata specificamente per bambini (6-12 anni) che permette di:

- 📝 **Scrivere un prompt** che descrive un gioco
- 🎨 **Scegliere una categoria** (platformer, quiz, memory, etc.)
- ✨ **Generare automaticamente** un mini-gioco giocabile
- 🎮 **Giocare subito** in preview
- 🚀 **Pubblicare e condividere** con 1 click
- 🎯 **Tutto child-friendly, sicuro e divertente!**

---

## 🎥 Demo

```
Prompt: "un gatto che salta tra le nuvole e raccoglie stelle"
        ↓
   🐱 + ☁️ + ⭐
        ↓
   GIOCO PRONTO! 🎮
```

---

## 🚀 Quick Start

### Installazione Rapida (5 minuti)

```bash
# 1. Clona il progetto
git clone https://github.com/your-username/yougames.com.git
cd yougames.com

# 2. Installa dipendenze
npm install

# 3. Crea .env.local
cp .env.example .env.local

# 4. Avvia dev server
npm run dev

# 5. Apri browser
open http://localhost:3000
```

✅ **Done!** Dovresti vedere l'homepage colorata.

---

## 🎯 Features Principali

### 🧒 Child-Friendly UX
- Colori vivaci e palette vibrante
- Pulsanti enormi (min 80x80px)
- Font grandi e leggibili
- Icone + Testo sempre
- Feedback visivo immediato
- Animazioni giocose (Framer Motion)
- Massimo 3 step per creare un gioco

### 🎮 Game Engine
- Motore 2D Canvas custom
- Game loop 60 FPS
- Input handling (keyboard, mouse, touch)
- Sistema di collisioni AABB
- Supporto mobile-first

### 🎨 Categorie Giochi

| Categoria | Emoji | Descrizione |
|-----------|-------|-------------|
| Platformer | 🏃 | Salta e raccogli oggetti |
| Runner | 🏃‍♂️ | Corsa infinita |
| Memory | 🧠 | Trova le coppie |
| Math Quiz | ➕ | Risolvi problemi matematici |
| Quiz | ❓ | Domande e risposte |
| Maze | 🌀 | Trova l'uscita |
| Card Match | 🃏 | Abbina le carte |
| Puzzle | 🧩 | Risolvi il puzzle |
| Story | 📖 | Avventura interattiva |
| Coloring | 🎨 | Colora e crea |

### 🛡️ Content Safety
- Filtro parole inappropriate automatico
- Blocco temi violenti/spaventosi
- Linguaggio positivo enforcement
- Content moderation pre-generazione
- Sandboxed game execution

### 🚀 Tech Stack

**Frontend**
- Next.js 14 (App Router)
- React 18
- TypeScript 5.3
- TailwindCSS 3.4
- Framer Motion

**Game Layer**
- HTML5 Canvas API
- Custom 2D Engine
- Template-based generation

**Backend**
- Next.js API Routes (Serverless)
- Content safety filter
- Prompt → Game generator

**Deploy & Infrastructure**
- Vercel (hosting + edge functions)
- GitHub Actions (CI/CD)
- Vercel KV (optional, for storage)

---

## 📖 Documentazione

- 📐 **[ARCHITECTURE.md](ARCHITECTURE.md)** - Architettura sistema completa
- 🛠️ **[SETUP.md](SETUP.md)** - Setup locale step-by-step
- 🚀 **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deploy su Vercel
- 💡 **[EXAMPLES.md](EXAMPLES.md)** - Esempi prompt → gioco

---

## 🎮 Come Funziona

### 1. L'utente descrive il gioco

```typescript
Prompt: "un dinosauro che raccoglie gemme nella foresta"
Category: Platformer
Difficulty: Easy
```

### 2. Il sistema parse il prompt

```typescript
{
  character: "dinosauro" → 🦖
  action: "raccoglie" → collect mechanic
  objects: "gemme" → 💎
  setting: "foresta" → green background
}
```

### 3. Seleziona template e genera config

```typescript
Template: platformer.ts
Config: {
  player: { sprite: "🦖", speed: 5, jumpPower: 15 },
  world: { backgroundColor: "#2d5016" },
  goal: { type: "reach_score", target: 10 }
}
```

### 4. Genera codice eseguibile

```typescript
const code = fillTemplate(template, config);
// Returns executable JavaScript game code
```

### 5. Render su Canvas

```typescript
<GameCanvas game={generatedGame} />
// Game eseguito in sandboxed canvas
```

---

## 🎯 Architettura Sistema

```
┌─────────────┐
│   Browser   │
│  (Canvas)   │
└──────┬──────┘
       │
       ↓
┌─────────────────────┐
│   Next.js Frontend  │
│  • Wizard UI        │
│  • Game Canvas      │
│  • Child-friendly   │
└──────┬──────────────┘
       │
       ↓
┌─────────────────────┐
│   API Routes        │
│  /api/generate-game │
│  /api/filter-content│
└──────┬──────────────┘
       │
       ↓
┌─────────────────────┐
│   Game Generator    │
│  • Parse prompt     │
│  • Select template  │
│  • Generate code    │
└──────┬──────────────┘
       │
       ↓
┌─────────────────────┐
│   Game Templates    │
│  • Platformer       │
│  • Memory           │
│  • Math Quiz        │
└─────────────────────┘
```

---

## 🔒 Sicurezza per Bambini

### 3-Layer Safety System

1. **Input Validation**
   - Max 200 caratteri
   - Blocklist parole inappropriate
   - Sentiment analysis

2. **Content Moderation**
   - Pre-generation filtering
   - Positive language enforcement
   - Theme safety check

3. **Runtime Protection**
   - Sandboxed canvas execution
   - No external network calls
   - Code execution timeout
   - No eval() abuse

---

## 📊 Project Structure

```
yougames.com/
├── src/
│   ├── app/              # Next.js pages & API
│   ├── components/       # React components
│   ├── lib/             # Core logic
│   │   ├── gameEngine.ts
│   │   ├── gameGenerator.ts
│   │   ├── contentFilter.ts
│   │   └── templates/
│   └── types/           # TypeScript types
├── public/             # Static assets
├── .github/            # CI/CD workflows
└── docs/              # Documentation
```

---

## 🎨 Design System

### Colors (Child-Friendly Palette)

```css
--kid-purple: #9B59B6
--kid-blue: #3498DB
--kid-green: #2ECC71
--kid-yellow: #F1C40F
--kid-orange: #E67E22
--kid-red: #E74C3C
--kid-pink: #FF6B9D
--kid-sky: #87CEEB
```

### Component Library

- `<BigButton>` - Large, colorful buttons
- `<CategoryCard>` - Game category selection
- `<PromptBox>` - Text input with character count
- `<LoadingSpinner>` - Playful loading animation
- `<GameCanvas>` - Game execution container

---

## 🚀 Deploy to Production

### Vercel (Recommended, 1-click deploy)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/yougames.com)

### Manual Deploy

```bash
# Build
npm run build

# Start production server
npm start
```

---

## 🧪 Development

```bash
# Sviluppo
npm run dev

# Build
npm run build

# Lint
npm run lint

# Type check
npm run type-check
```

---

## 🎯 Roadmap

### ✅ MVP (Completato)
- [x] Architettura sistema
- [x] Game engine 2D
- [x] 3 template giochi (platformer, memory, math)
- [x] Prompt → game generator
- [x] Child-friendly UI
- [x] Content safety filter
- [x] Deploy pipeline

### 🚧 Next Phase
- [ ] Altri 7 template giochi
- [ ] AI migliorata (OpenAI integration)
- [ ] Sistema di account (auth)
- [ ] Database persistente (Vercel KV)
- [ ] Condivisione social
- [ ] Sistema di badge/ricompense

### 🔮 Future
- [ ] AI image generation per sprites
- [ ] Multiplayer locale
- [ ] Modalità insegnante/classe
- [ ] Export giochi come PWA
- [ ] Mobile app (React Native)
- [ ] Marketplace template community

---

## 🤝 Contributing

Contributi sono benvenuti! Per favore:

1. Fork il progetto
2. Crea feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Apri Pull Request

Leggi [CONTRIBUTING.md](CONTRIBUTING.md) per dettagli.

---

## 📄 License

Questo progetto è sotto licenza MIT - vedi [LICENSE](LICENSE) per dettagli.

---

## 🙏 Acknowledgments

- **Next.js team** - Framework fantastico
- **Vercel** - Hosting e infrastructure
- **TailwindCSS** - Utility-first CSS
- **Framer Motion** - Animazioni smooth
- **Tutti i bambini creativi** - La nostra ispirazione! 🌈

---

## 📞 Contact & Support

- 📧 Email: support@yougames.com
- 🐦 Twitter: [@YouGames](https://twitter.com/yougames)
- 💬 Discord: [YouGames Community](https://discord.gg/yougames)
- 🌐 Website: [yougames.com](https://yougames.com)

---

## ⭐ Star History

Se ti piace il progetto, lascia una ⭐ su GitHub!

---

**Made with 💜 for creative kids worldwide**

🎮 **Happy Game Creating!** 🎨
