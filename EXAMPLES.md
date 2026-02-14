# 💡 Esempi Prompt → Gioco

Questa guida mostra esempi concreti di come i prompt vengono trasformati in giochi giocabili.

---

## 🏃 Platformer Examples

### Esempio 1: Gatto Spaziale

**Input:**
```
Prompt: "un gatto arancione che salta tra le stelle nello spazio"
Categoria: Platformer
Difficoltà: Facile
```

**Output Generato:**
```typescript
{
  player: {
    sprite: "🐱",
    speed: 5,
    jumpPower: 15,
    color: "#FF8C00"
  },
  world: {
    backgroundColor: "#1a1a2e", // spazio scuro
    gravity: 0.8,
    theme: "space"
  },
  collectibles: {
    sprite: "⭐",
    count: 15,
    points: 1
  },
  goal: {
    type: "reach_score",
    target: 10,
    description: "Raccogli 10 stelle!"
  }
}
```

**Risultato:** Gioco platformer con gatto che salta su piattaforme spaziali, raccogliendo stelle dorate.

---

### Esempio 2: Dinosauro nella Giungla

**Input:**
```
Prompt: "un dinosauro verde che raccoglie gemme in una giungla"
Categoria: Platformer
Difficoltà: Medium
```

**Output:**
```typescript
{
  player: {
    sprite: "🦖",
    speed: 7,
    jumpPower: 13
  },
  world: {
    backgroundColor: "#2d5016", // verde foresta
    theme: "forest"
  },
  collectibles: {
    sprite: "💎",
    count: 20
  },
  goal: {
    type: "reach_score",
    target: 15
  }
}
```

**Meccaniche:**
- Salto più corto (più difficile)
- Più oggetti da raccogliere
- Piattaforme più distanziate

---

### Esempio 3: Robot Volante

**Input:**
```
Prompt: "un robot che vola tra i grattacieli e raccoglie monete"
Categoria: Platformer
Difficoltà: Hard
```

**Output:**
```typescript
{
  player: {
    sprite: "🤖",
    speed: 9,
    jumpPower: 11,
    canFly: true // special ability
  },
  world: {
    backgroundColor: "#34495E",
    theme: "city"
  },
  collectibles: {
    sprite: "🪙",
    count: 30
  },
  obstacles: {
    type: "moving",
    sprites: ["🚁", "🛸"]
  }
}
```

---

## 🧠 Memory Game Examples

### Esempio 1: Animali della Fattoria

**Input:**
```
Prompt: "memory game con gli animali della fattoria"
Categoria: Memory
Difficoltà: Facile
```

**Output:**
```typescript
{
  cards: {
    sprites: ["🐷", "🐮", "🐔", "🐴", "🐑", "🦆"],
    pairs: 6
  },
  difficulty: {
    timeToMemorize: 3, // secondi
    cardFlipSpeed: "slow"
  },
  goal: {
    type: "complete_level",
    target: 6,
    description: "Trova tutte le 6 coppie!"
  }
}
```

**Meccaniche:**
- 12 carte totali (6 coppie)
- Grid 3x4
- Tempo illimitato
- Mosse illimitate

---

### Esempio 2: Frutta Colorata

**Input:**
```
Prompt: "trova le coppie di frutta colorata"
Categoria: Memory
Difficoltà: Medium
```

**Output:**
```typescript
{
  cards: {
    sprites: ["🍎", "🍊", "🍋", "🍇", "🍓", "🍉", "🍑", "🍌"],
    pairs: 8
  },
  difficulty: {
    timeToMemorize: 2,
    cardFlipSpeed: "medium"
  }
}
```

**Differenze:**
- 16 carte (8 coppie)
- Grid 4x4
- Più carte = più difficile

---

## ➕ Math Quiz Examples

### Esempio 1: Addizioni con Orso

**Input:**
```
Prompt: "quiz di addizioni facili con un orso"
Categoria: Math
Difficoltà: Facile
```

**Output:**
```typescript
{
  character: {
    sprite: "🐻",
    encouragements: ["Bravo!", "Ottimo!", "Continua così!"]
  },
  questions: {
    operation: "addition",
    maxNumber: 10,
    count: 10
  },
  difficulty: {
    timePerQuestion: 0, // illimitato
    showHints: true
  }
}
```

**Esempio Domande:**
```
5 + 3 = ?
2 + 7 = ?
8 + 1 = ?
```

---

### Esempio 2: Moltiplicazioni con Razzo

**Input:**
```
Prompt: "problemi di moltiplicazione nello spazio con un razzo"
Categoria: Math
Difficoltà: Hard
```

**Output:**
```typescript
{
  character: {
    sprite: "🚀",
    theme: "space"
  },
  questions: {
    operation: "multiplication",
    maxNumber: 12, // tavola pitagorica
    count: 15
  },
  difficulty: {
    timePerQuestion: 15, // 15 secondi per risposta
    showHints: false
  }
}
```

**Esempio Domande:**
```
7 × 8 = ?
9 × 6 = ?
4 × 12 = ?
```

---

## 🎮 Advanced Prompt Features

### Multi-Element Prompts

**Input:**
```
Prompt: "un coniglio bianco che salta nelle nuvole rosa e raccoglie carote arancioni evitando uccelli"
Categoria: Platformer
```

**Parsing Avanzato:**
```typescript
{
  player: {
    sprite: "🐰",
    color: "white"
  },
  world: {
    platforms: {
      color: "#FFB6C1", // rosa
      sprite: "☁️"
    }
  },
  collectibles: {
    sprite: "🥕",
    color: "orange"
  },
  obstacles: {
    sprites: ["🐦"],
    behavior: "avoid" // danno se tocchi
  }
}
```

---

### Emotion-Based Themes

**Input:**
```
Prompt: "gioco felice e colorato con un sole sorridente"
```

**Theme Detection:**
```typescript
{
  theme: "happy",
  colors: {
    primary: "#F1C40F", // giallo sole
    secondary: "#FF6B9D", // rosa
    background: "#87CEEB" // cielo
  },
  character: {
    sprite: "☀️",
    animation: "bounce" // animazione allegra
  },
  music: "upbeat" // musica allegra (future)
}
```

---

## 🎯 Tips per Prompt Perfetti

### ✅ Prompt Buoni

```
✓ "un gatto che salta tra le nuvole e raccoglie stelle"
✓ "memory game con animali della foresta"
✓ "addizioni facili con un robot nello spazio"
✓ "dinosauro che corre e salta sulle rocce"
```

**Perché funzionano:**
- Character chiaro
- Azione specifica
- Ambientazione descritta
- Obiettivo implicito/esplicito

### ❌ Prompt Da Evitare

```
✗ "gioco"                    // troppo vago
✗ "qualcosa di divertente"   // non specifico
✗ "fai tu"                   // nessuna info
✗ "akjsdhakjshdkj"          // nonsense
```

---

## 🚀 Prompt Templates

### Template Platformer
```
[CHARACTER] che [ACTION] tra/nelle [SETTING] e raccoglie [COLLECTIBLE]
```

**Esempi:**
- "coniglio che salta tra le montagne e raccoglie carote"
- "pesce che nuota nell'oceano e raccoglie perle"
- "alieno che vola nello spazio e raccoglie cristalli"

### Template Memory
```
memory game con [THEME]
```

**Esempi:**
- "memory game con emoji divertenti"
- "trova le coppie di veicoli"
- "memory con frutta tropicale"

### Template Math
```
[OPERATION] con [CHARACTER] nel/nello [SETTING]
```

**Esempi:**
- "addizioni con un orso nella foresta"
- "sottrazioni con un pinguino al polo nord"
- "moltiplicazioni con un astronauta nello spazio"

---

## 🎨 Prompt + Difficulty Matrix

| Prompt | Facile | Medio | Difficile |
|--------|--------|-------|-----------|
| Platformer | 10 oggetti, salto alto | 15 oggetti, salto medio | 20+ oggetti, salto basso |
| Memory | 6 coppie | 8 coppie | 12 coppie |
| Math | +/- fino a 10 | × fino a 5 | × fino a 12 |

---

## 📊 Prompt Analytics

### Elementi più Usati (Demo Data)

**Characters:**
1. 🐱 Gatto (32%)
2. 🦖 Dinosauro (18%)
3. 🤖 Robot (15%)
4. 🐶 Cane (12%)
5. 👽 Alieno (10%)

**Settings:**
1. ☁️ Nuvole/Cielo (28%)
2. 🌳 Foresta (22%)
3. 🚀 Spazio (20%)
4. 🌊 Mare (15%)
5. 🏙️ Città (10%)

**Collectibles:**
1. ⭐ Stelle (35%)
2. 🪙 Monete (25%)
3. 💎 Gemme (20%)
4. 🍎 Frutta (12%)
5. 🌸 Fiori (8%)

---

## 🎯 Casi d'Uso Reali

### Scuola Elementare
**Scenario:** Insegnante crea quiz matematici per classe 3°

```
Prompt: "addizioni e sottrazioni fino a 100 con un maestro saggio"
Categoria: Math
Difficoltà: Medium
```

**Uso:** 25 studenti giocano contemporaneamente, ognuno con il proprio ritmo.

---

### Casa - Pomeriggio
**Scenario:** Bambino di 8 anni crea gioco per sorella di 6 anni

```
Prompt: "un unicorno che raccoglie arcobaleni nelle nuvole"
Categoria: Platformer
Difficoltà: Facile
```

**Uso:** Gioco custom fatto su misura! Sorella felicissima.

---

### Doposcuola
**Scenario:** Educatore crea attività di gruppo

```
Prompt: "memory game con bandiere del mondo"
Categoria: Memory
```

**Uso:** 4 bambini a turno, imparano geografia giocando.

---

**🎮 Sperimenta e Crea!**

La bellezza di YouGames è che ogni prompt è unico. Prova, gioca, modifica!
