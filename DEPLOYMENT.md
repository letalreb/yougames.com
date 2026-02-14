# 🚀 Deploy su Vercel

## Configurazione Automatica

1. **Connetti GitHub a Vercel**
   - Vai su [vercel.com](https://vercel.com)
   - Clicca "New Project"
   - Importa il tuo repository GitHub

2. **Configurazione Build**
   - Framework Preset: Next.js (rilevato automaticamente)
   - Build Command: `npm run build`
   - Output Directory: `.next` (default)
   - Install Command: `npm install`

3. **Variabili d'Ambiente**
   
   Aggiungi queste variabili nel pannello di Vercel:
   ```
   NEXTAUTH_URL=https://tuo-dominio.vercel.app
   NEXTAUTH_SECRET=genera-un-secret-sicuro
   ```

   Per generare un secret sicuro:
   ```bash
   openssl rand -base64 32
   ```

4. **Deploy**
   - Clicca "Deploy"
   - Vercel fa build e deploy automaticamente
   - Ogni push su `main` triggera un nuovo deploy

## Vercel CLI (Opzionale)

```bash
# Installa Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy in production
vercel --prod
```

## Configurazione Dominio Custom

1. Vai su Project Settings → Domains
2. Aggiungi il tuo dominio
3. Configura DNS come indicato
4. Attendi propagazione (5-10 minuti)

## Edge Functions

Le API routes sono automaticamente deployate come Edge Functions per performance ottimali.

## Continuous Deployment

```
main branch → Vercel Production
altre branches → Preview Deployments
Pull Requests → Auto Preview
```

## Monitoraggio

- Logs: Vercel Dashboard → Logs
- Analytics: Vercel Analytics (opzionale)
- Performance: Web Vitals automatici

---

**🎉 Deployment completato! Il tuo sito è live!**
