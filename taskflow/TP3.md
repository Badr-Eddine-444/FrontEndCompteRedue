# TP3 — TaskFlow (React Router, auth, Axios, json-server)

Ce fichier résume le **contenu et la structure** du TP3. Les **réponses détaillées aux questions** du sujet (Q1, Q2, …) sont dans **`REPONSES.md`**.

---

## Objectif

Application **TaskFlow** avec :

- **React Router** : `/login`, `/dashboard`, `/projects/:id`, redirections `/` et `*`.
- **Authentification** : contexte React (`AuthProvider`, `useAuth`, `authReducer`), page **Login** (Axios vers `json-server`).
- **Routes protégées** : composant `ProtectedRoute` (redirection vers `/login` avec `state.from`).
- **Données** : **Axios** + **json-server** (`db.json`) pour `users`, `projects`, `columns`.
- **Dashboard** : chargement des projets et colonnes, **POST** nouveau projet, **PUT** renommer, **DELETE** supprimer, gestion erreurs / chargement sur l’ajout.
- **Détail projet** : page `ProjectDetail` avec chargement par `id`.
- **Sidebar** : **`NavLink`** vers chaque projet + styles actifs.

---

## Lancer le projet

```bash
npm install
```

Terminal 1 — API fictive (port **3000** par défaut dans ce projet) :

```bash
npm run server
```

Terminal 2 — interface Vite :

```bash
npm run dev
```

Compte de test (voir aussi `REPONSES.md`) : email et mot de passe définis dans `db.json` → section **`users`**.

---

## Arborescence utile (`src/`)

| Zone | Fichiers |
|------|-----------|
| Entrée | `main.tsx` (`BrowserRouter`, `AuthProvider`), `App.tsx` (`Routes`, `Route`, `Navigate`) |
| API | `api/axios.ts` |
| Auth | `features/auth/` — `Login.tsx`, `AuthContext.tsx`, `authenticationContext.ts`, `useAuth.ts`, `authReducer.ts` |
| Pages | `pages/Dashboard.tsx`, `pages/ProjectDetail.tsx` (+ CSS modules associés) |
| Composants | `components/` — `Header`, `Sidebar`, `MainContent`, `ProjectForm`, `ProtectedRoute` |

---

## Points techniques à réviser

- **`<Navigate />` vs `navigate()`** dans `ProtectedRoute` → `REPONSES.md` (Q1).
- **`navigate(from, { replace: true })`** après login → Q2.
- **Mise à jour locale après POST** vs re-fetch GET → Q3.
- **Scénarios de test des routes** → Q4.
- **`NavLink` vs `Link`** → Q5.
- **`ProjectForm`** POST vs PUT → Q6.
- **Erreurs Axios** (serveur arrêté, 404) → Q7, Q8.

---

## Fichier complémentaire

- **`REPONSES.md`** — réponses rédigées aux questions du TP (bugs volontaires, sécurité, etc.).

Pour le TP suivant (UI MUI / Bootstrap), voir la branche **`TP4`** et le fichier **`TP4.md`**.
