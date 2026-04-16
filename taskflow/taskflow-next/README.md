# TaskFlow — Next.js (App Router)

## Prérequis

Deux terminaux :

1. **API (json-server), port 4000**

```bash
npm run server
```

2. **Application Next.js**

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Compte de test (login)

- Email : `john@taskflow.test`
- Mot de passe : `123456`

## Structure (récap)

- `app/page.tsx` — accueil `/`
- `app/login/page.tsx` — `/login` (`'use client'`)
- `app/dashboard/page.tsx` — `/dashboard` (Server Component + `fetch`)
- `app/projects/[id]/page.tsx` — `/projects/:id` (Server Component + `fetch`)
- `app/layout.tsx` — header persistant + `{children}`
- `db.json` — données json-server (aligné avec le TP React)

Réponses aux questions du TP : **`reponse.md`**.
