# ⚡ Quick Start Guide

Get YouGames running in **5 minutes**!

## Prerequisites

```bash
node --version  # Must be >= 18.0.0
npm --version   # Must be >= 9.0.0
```

Don't have Node? [Download here](https://nodejs.org/)

---

## 🚀 Installation

### Option 1: Complete Setup (Recommended)

```bash
# Clone repository
git clone https://github.com/your-username/yougames.com.git
cd yougames.com

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Generate auth secret
echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" >> .env.local
echo "NEXTAUTH_URL=http://localhost:3000" >> .env.local

# Start development server
npm run dev
```

**Open**: http://localhost:3000

---

### Option 2: One-Line Install

```bash
git clone https://github.com/your-username/yougames.com.git && cd yougames.com && npm install && cp .env.example .env.local && npm run dev
```

---

## ✅ Verify Installation

You should see:

1. ✅ Purple gradient background
2. ✅ Big "🎮 Crea il Tuo Gioco! 🎮" heading
3. ✅ Orange "INIZIA A CREARE!" button
4. ✅ Three feature cards below
5. ✅ No errors in console

**Success!** 🎉

---

## 🎮 Create Your First Game

### Step 1: Click "INIZIA A CREARE!"

### Step 2: Select Category
- Click any category (try **Platformer** first)
- Big card should show checkmark when selected

### Step 3: Write Prompt
```
un gatto che salta tra le nuvole e raccoglie stelle
```

### Step 4: Choose Difficulty
- Click **Facile** (Easy)

### Step 5: Generate!
- Click "GENERA GIOCO!"
- Wait ~2 seconds
- **Game appears!** 🎮

### Step 6: Play!
- Use **Arrow Keys** or **WASD** to move
- Use **Space** to jump
- Collect 10 stars to win!

---

## 🎯 What You Can Do Now

### Create Different Games

**Platformer:**
```
un dinosauro che raccoglie gemme nella giungla
```

**Memory:**
```
memory game con animali della fattoria
```

**Math Quiz:**
```
addizioni facili con un orso
```

### Save Your Games
1. Click "💾 Salva Gioco"
2. Go to Gallery
3. See all your saved games!

### Share Games
1. Click "🔗 Condividi"
2. Copy the link
3. Send to friends!

---

## 🛠️ Troubleshooting

### Port 3000 Already in Use?

```bash
PORT=3001 npm run dev
```

Then open: http://localhost:3001

### Canvas Not Showing?

1. Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
2. Check browser console for errors
3. Try different browser (Chrome recommended)

### Game Not Generating?

1. Check prompt is at least 10 characters
2. Make sure category is selected
3. Check browser console for API errors

### Fresh Install

```bash
rm -rf node_modules .next
npm install
npm run dev
```

---

## 📱 Mobile Testing

```bash
# Get your local IP
ifconfig | grep "inet " | grep -v 127.0.0.1

# Example: 192.168.1.100

# Update .env.local
NEXTAUTH_URL=http://192.168.1.100:3000

# Restart server
npm run dev

# Open on phone
http://192.168.1.100:3000
```

---

## 🚀 Deploy to Production (Vercel)

### 1-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/yougames.com)

### Manual Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Done!** Your game creator is live! 🎉

---

## 📚 Next Steps

1. **Read Full Docs**
   - [ARCHITECTURE.md](ARCHITECTURE.md) - System design
   - [SETUP.md](SETUP.md) - Detailed setup
   - [EXAMPLES.md](EXAMPLES.md) - Prompt examples

2. **Customize**
   - Edit colors in `tailwind.config.ts`
   - Add new game templates in `src/lib/templates/`
   - Customize UI in components

3. **Extend**
   - Add more categories
   - Improve AI parsing
   - Add sound effects
   - Create teacher mode

---

## 🎯 Quick Commands Reference

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Run production build
npm run lint         # Check code quality
npm run type-check   # TypeScript validation
```

---

## 💡 Pro Tips

1. **Use descriptive prompts**: More details = better games
2. **Test different difficulties**: See how mechanics change
3. **Save your favorites**: Build your game library
4. **Share with friends**: Games work on any device!

---

## 🆘 Get Help

**Something not working?**

1. Check [SETUP.md](SETUP.md) troubleshooting section
2. Search [GitHub Issues](https://github.com/your-username/yougames.com/issues)
3. Open new issue with:
   - Browser/OS version
   - Console errors
   - Steps to reproduce

---

## 🎉 You're Ready!

Start creating amazing games for kids! 🎮

**Happy Game Making!** ✨
