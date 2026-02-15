# 🤖 AI-Powered Game Generation - YouGames

## 📝 Panoramica

YouGames ora supporta due modalità di generazione giochi:

### 1. 🎨 **Template-Based Generation** (Default)
- Usa prompt brevi (< 100 caratteri)
- Genera giochi usando template predefiniti
- Rendering in Canvas 2D
- Non richiede API key
- Veloce e affidabile

### 2. 🤖 **AI-Powered Generation** (Avanzata)
- Usa prompt complessi (> 100 caratteri)  
- Genera giochi completi con GPT-4
- Rendering in Iframe con HTML/CSS/JS standalone
- Richiede OpenAI API key
- Giochi personalizzati e unici

---

## 🚀 Setup Rapido

### 1. Installa dipendenze
```bash
npm install
```

### 2. Configura OpenAI (Opzionale ma Consigliato)

Crea file `.env.local`:
```bash
cp .env.example .env.local
```

Ottieni la tua API key:
1. Vai su [platform.openai.com](https://platform.openai.com/)
2. Crea un account o accedi
3. Vai su **API Keys** → **Create new secret key**
4. Copia la chiave

Aggiungi al file `.env.local`:
```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
```

### 3. Avvia l'applicazione
```bash
npm run dev
```

---

## 💡 Come Funziona

### Generazione Template-Based
```
User Prompt (breve)
    ↓
gameGenerator.ts
    ↓
Template matching
    ↓
Canvas Game (JS code)
```

### Generazione AI-Powered
```
User Prompt (dettagliato)
    ↓
API: /api/generate-game
    ↓
aiGameGenerator.ts
    ↓
OpenAI GPT-4 API Call
    ↓
Complete HTML Game
    ↓
Iframe Rendering
```

---

## 📖 Esempi Prompt

### ❌ Prompt Breve (Template-Based)
```
"un gatto che raccoglie stelle"
```
→ Usa template platformer predefinito

### ✅ Prompt Complesso (AI-Generated)
```
"Crea un gioco platformer 2D dove un gatto astronauta 
spaziale esplora pianeti colorati. Il gatto può fare 
doppio salto e deve raccogliere cristalli magici evitando 
meteoriti. Ogni livello ha gravità diversa. Include un 
timer di 60 secondi, power-up temporanei di velocità, 
e un sistema di vite con 3 cuori. Usa colori pastello 
e animazioni fluide."
```
→ Genera gioco HTML completo personalizzato con GPT-4

---

## 🎮 Feature AI Games

I giochi generati da AI includono:

✅ **HTML/CSS/JS completo** in un unico file  
✅ **Canvas 2D** o **CSS Animations**  
✅ **Controlli responsive** (tastiera + touch)  
✅ **HUD** con punteggio, vite, timer  
✅ **Schermate** start/game-over  
✅ **Animazioni** fluide  
✅ **Suoni** (Web Audio API)  
✅ **Mobile-friendly**  
✅ **Sandbox sicuro** (iframe)

---

## 🔧 Personalizzazione

### Modificare il threshold AI
In `src/app/api/generate-game/route.ts`:
```typescript
// Usa AI solo per prompt > 100 caratteri
if (isAIAvailable() && prompt.length > 100) {
  // ... AI generation
}
```

### Cambiare modello OpenAI
In `src/lib/aiGameGenerator.ts`:
```typescript
const completion = await openai.chat.completions.create({
  model: 'gpt-4-turbo-preview', // o 'gpt-4', 'gpt-3.5-turbo'
  // ...
})
```

### Personalizzare il system prompt
Modifica `SYSTEM_PROMPT` in `aiGameGenerator.ts` per cambiare lo stile/comportamento dei giochi generati.

---

## 💰 Costi OpenAI

Costi stimati per generazione (GPT-4 Turbo):

| Tokens | Costo | Giochi generabili |
|--------|-------|-------------------|
| ~3,000 | ~$0.03 | 1 gioco |
| 100K | ~$1.00 | ~33 giochi |
| 1M | ~$10.00 | ~330 giochi |

**Nota**: GPT-3.5-turbo costa ~10x meno ma qualità inferiore

---

## 🛡️ Sicurezza

### Sandbox Iframe
I giochi AI sono eseguiti in iframe con:
```html
sandbox="allow-scripts allow-forms allow-pointer-lock"
```

Questo previene:
- ❌ Accesso al DOM principale
- ❌ Navigazione non autorizzata
- ❌ Accesso a cookies/localStorage del parent
- ❌ Download automatici

### Content Filtering
Tutti i prompt passano attraverso `contentFilter.ts` per bloccare:
- Linguaggio inappropriato
- Contenuti violenti
- Temi non adatti ai bambini

---

## 🐛 Troubleshooting

### "Configurazione OpenAI mancante"
→ Aggiungi `OPENAI_API_KEY` al file `.env.local`

### "AI generation failed, falling back to templates"
→ Verifica che la key API sia valida e abbia crediti

### "Rate limit exceeded"
→ Hai superato il limite di richieste OpenAI. Aspetta o upgrade il piano

### Gioco non si carica nell'iframe
→ Verifica la console browser per errori JavaScript nel gioco generato

---

## 📊 Monitoring

Controlla i log del server per vedere quale modalità viene usata:

```
🤖 Using AI-powered generation (GPT-4)
✅ Gioco generato con successo!
📏 Dimensione HTML: 3847 caratteri
```

oppure

```
🎨 Using template-based generation
```

---

## 🎯 Best Practices

### Per Ottenere Giochi AI Migliori:

1. **Sii specifico** - Descrivi meccaniche, controlli, obiettivi
2. **Menziona stile** - "pixel art", "cartoonesco", "minimalista"
3. **Specifica difficoltà** - Numero di vite, velocità, ostacoli
4. **Aggiungi contesto** - Ambientazione, personaggi, tema
5. **Lunghezza ideale** - 200-500 caratteri per risultati ottimali

### Esempio Ottimale:
```
Crea un puzzle game dove devi collegare tubi colorati 
per far scorrere l'acqua dalla fonte alla pianta. 
15 livelli di difficoltà crescente con timer di 2 minuti 
per livello. Usa colori vivaci blu/verde. Aggiungi 
particelle d'acqua animate quando risolvi il puzzle. 
Include suggerimenti dopo 30 secondi di inattività.
```

---

## 📚 Documentazione

- [OpenAI API Docs](https://platform.openai.com/docs)
- [GPT-4 Models](https://platform.openai.com/docs/models/gpt-4-and-gpt-4-turbo)
- [Rate Limits](https://platform.openai.com/docs/guides/rate-limits)
- [Best Practices](https://platform.openai.com/docs/guides/prompt-engineering)

---

## 🤝 Contribuire

Vuoi migliorare la generazione AI?

1. Modifica `SYSTEM_PROMPT` in `aiGameGenerator.ts`
2. Testa con vari prompt
3. Apri una PR con esempi

---

## 📝 Licenza

MIT - Vedi LICENSE file

---

**Made with ❤️ and 🤖 AI**
