# 🎮 YouGames - Setup Completo

## 📋 Requisiti Sistema

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **Git**: per version control
- **Browser moderno**: Chrome, Firefox, Safari, Edge (ultimi 2 anni)

---

## 🚀 Setup Locale - Step by Step

### 1️⃣ **Clona il Repository**

```bash
git clone https://github.com/your-username/yougames.com.git
cd yougames.com
```

### 2️⃣ **Installa le Dipendenze**

```bash
npm install
```

Questo installerà tutti i pacchetti necessari:
- Next.js 14
- React 18
- TypeScript
- TailwindCSS
- Framer Motion
- e altri...

### 3️⃣ **Configura Variabili d'Ambiente**

Crea un file `.env.local` nella root del progetto:

```bash
cp .env.example .env.local
```

Modifica `.env.local` con le tue configurazioni:

```env
# Obbligatorio per Auth (anche se non usi auth subito)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# Opzionale: GitHub OAuth (per login insegnanti/genitori)
GITHUB_ID=your-github-oauth-id
GITHUB_SECRET=your-github-oauth-secret

# Opzionale: OpenAI (per AI avanzata)
OPENAI_API_KEY=your-openai-key
```

**Genera un NEXTAUTH_SECRET sicuro:**
```bash
openssl rand -base64 32
```

### 4️⃣ **Avvia il Server di Sviluppo**

```bash
npm run dev
```

L'app sarà disponibile su: **http://localhost:3000**

### 5️⃣ **Verifica Installazione**

Apri il browser e vai su `http://localhost:3000`

Dovresti vedere:
- ✅ Homepage colorata con "Crea il Tuo Gioco!"
- ✅ Pulsante grande per iniziare
- ✅ Animazioni fluide
- ✅ Zero errori in console

---

## 🛠️ Comandi Disponibili

```bash
# Sviluppo
npm run dev              # Avvia dev server (hot reload)

# Build e Produzione
npm run build            # Build per produzione
npm run start            # Avvia server produzione

# Quality Check
npm run lint             # ESLint check
npm run type-check       # TypeScript check

# Pulizia
rm -rf .next node_modules
npm install              # Fresh install
```

---

## 📂 Struttura Progetto

```
yougames.com/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── page.tsx           # Homepage
│   │   ├── create/            # Wizard creazione gioco
│   │   ├── gallery/           # Galleria giochi salvati
│   │   ├── play/[id]/         # Player singolo gioco
│   │   ├── api/               # API Routes
│   │   │   ├── generate-game/ # Generazione giochi
│   │   │   ├── filter-content/# Content safety
│   │   │   └── publish-game/  # Publishing
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Stili globali
│   │
│   ├── components/            # React Components
│   │   ├── BigButton.tsx     # Pulsanti grandi child-friendly
│   │   ├── CategoryCard.tsx  # Card selezione categoria
│   │   ├── PromptBox.tsx     # Text input per prompt
│   │   ├── LoadingSpinner.tsx# Animazione caricamento
│   │   └── GameCanvas.tsx    # Canvas per eseguire giochi
│   │
│   ├── lib/                   # Business logic
│   │   ├── gameEngine.ts     # Motore 2D canvas
│   │   ├── gameGenerator.ts  # Prompt → Game logic
│   │   ├── contentFilter.ts  # Safety per bambini
│   │   └── templates/        # Template giochi
│   │       ├── index.ts
│   │       ├── platformer.ts
│   │       ├── memory.ts
│   │       └── mathQuiz.ts
│   │
│   └── types/
│       └── game.ts           # TypeScript interfaces
│
├── public/                   # Asset statici
├── .github/
│   └── workflows/
│       └── ci-cd.yml        # GitHub Actions
├── ARCHITECTURE.md          # Documentazione architettura
├── DEPLOYMENT.md            # Guida deployment
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

---

## 🎨 Esempi Prompt → Gioco

### Platformer
```
Prompt: "un gatto arancione che salta tra le nuvole e raccoglie stelle dorate"
Risultato:
  - Personaggio: 🐱
  - Ambientazione: Cielo azzurro
  - Collectible: ⭐
  - Meccanica: Jump & collect
```

### Memory Game
```
Prompt: "gioco di memoria con animali della fattoria"
Risultato:
  - Carte: 🐷 🐮 🐔 🐴
  - Obiettivo: trova tutte le coppie
  - Feedback: animazioni quando trovi coppia
```

### Math Quiz
```
Prompt: "quiz di matematica con addizioni fino a 20 con una volpe"
Risultato:
  - Personaggio: 🦊
  - Domande: addizioni semplici
  - 10 domande totali
  - Feedback immediato
```

---

## 🔧 Troubleshooting

### Problema: Porta 3000 già in uso

```bash
# Usa porta diversa
PORT=3001 npm run dev
```

### Problema: Errori di installazione

```bash
# Pulisci cache npm
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Problema: TypeScript errors

```bash
# Rigenera types
rm -rf .next
npm run dev
```

### Problema: Canvas non si visualizza

- Verifica che il browser supporti HTML5 Canvas
- Controlla console per errori JavaScript
- Prova a ricaricare la pagina

---

## 🚀 Deploy su Vercel (Consigliato)

### Setup Rapido (5 minuti)

1. **Push su GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connetti Vercel**
   - Vai su [vercel.com](https://vercel.com)
   - Clicca "Import Project"
   - Seleziona il tuo repo GitHub
   - Vercel rileva automaticamente Next.js

3. **Configura Environment Variables**
   - Aggiungi `NEXTAUTH_URL` (il dominio Vercel)
   - Aggiungi `NEXTAUTH_SECRET`

4. **Deploy!**
   - Clicca "Deploy"
   - Attendi ~2 minuti
   - ✅ Live su `your-project.vercel.app`

### Auto-Deploy

Ogni push su `main` triggera deploy automatico!

---

## 🧪 Testing Funzionalità

### Test 1: Creazione Platformer Game

1. Vai su `/create`
2. Seleziona "Platformer"
3. Prompt: "un dinosauro che raccoglie gemme nella giungla"
4. Difficoltà: Facile
5. Clicca "Genera Gioco"
6. ✅ Dovresti vedere gioco giocabile con dinosauro 🦖

### Test 2: Memory Game

1. Categoria: "Memory"
2. Prompt: "memory game con frutti colorati"
3. ✅ Dovresti avere carte con emoji di frutta

### Test 3: Math Quiz

1. Categoria: "Matematica"
2. Prompt: "addizioni semplici con un orso"
3. ✅ Quiz con domande matematiche e orso 🐻

---

## 🎯 Prossimi Step

### Livello 1: Migliora Esistente
- [ ] Aggiungi più template giochi
- [ ] Migliora AI per parsing prompt
- [ ] Suoni e musica background
- [ ] Più temi grafici

### Livello 2: Features Avanzate
- [ ] Sistema di account (auth)
- [ ] Salvataggio su database (Vercel KV)
- [ ] Condivisione social
- [ ] Leaderboard globale

### Livello 3: Pro Features
- [ ] AI image generation per sprites custom
- [ ] Multiplayer locale
- [ ] Modalità insegnante
- [ ] Export giochi come PWA standalone

---

## 📊 Performance Tips

### Ottimizzazione Build

```bash
# Analizza bundle size
npm install -g @next/bundle-analyzer
ANALYZE=true npm run build
```

### Lazy Loading

I templates giochi sono già lazy-loaded per performance ottimali.

### Caching

Next.js caching è configurato per massima velocità.

---

## 🐛 Segnala Bug

Trovato un bug? Apri una issue su GitHub!

Includi:
- Browser e versione
- Screenshot
- Step per riprodurre
- Console log (se presente)

---

## 📚 Risorse Utili

- [Next.js Docs](https://nextjs.org/docs)
- [TailwindCSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

---

## 💡 Contribuire

1. Fork il progetto
2. Crea feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Apri Pull Request

---

## 📄 Licenza

MIT License - Vedi LICENSE file

---

## 🙏 Crediti

Creato con ❤️ per bambini creativi di tutto il mondo

**Tech Stack:**
- Next.js 14
- React 18
- TypeScript
- TailwindCSS
- Framer Motion
- HTML5 Canvas

---

## 📞 Supporto

Problemi? Domande?

- 📧 Email: support@yougames.com
- 💬 Discord: [Link]
- 🐦 Twitter: [@YouGames]

---

**🎉 Happy Coding & Game Creating! 🎮**
