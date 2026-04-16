# TP Next.js (App Router) — Réponses

Projet : **`taskflow-next`** (dossier `taskflow/taskflow-next`).  
API fictive : **json-server** sur le port **4000** (`npm run server`).  
Next : **http://localhost:3000** (`npm run dev`).

---

## Partie 2 — Routing par dossiers

### Q2 — Combien de fichiers pour la route `/login` ? Comparaison avec React Router

- **Next.js (App Router) :** **1 fichier** créé pour la route : `app/login/page.tsx` (le dossier `login/` fait partie du chemin de la route, pas un fichier séparé « route »). Aucun fichier central de routes à modifier.
- **React Router (Vite) :** en général **au minimum 3 endroits** : le composant de page, une ligne `<Route path="/login" element={<Login />} />` dans `App.tsx`, et l’**import** du composant dans `App.tsx`.

**Synthèse :** Next.js déduit l’URL du **chemin des fichiers** ; React Router impose de **déclarer explicitement** chaque route dans un routeur.

---

## Partie 2.4 — Route dynamique

### Q3 — `useParams()` (React) vs récupération de `id` (Next.js)

- **React (CSR / SPA) :** `useParams()` est un **hook côté client** ; l’`id` est lu dans le navigateur après le rendu du routeur.
- **Next.js (App Router, Server Component) :** `params` est passé au composant **en props** (dans les versions récentes, `params` peut être une **Promise** à `await`). Le rendu peut être préparé **côté serveur**.

**Différence fondamentale :** côté Next en RSC, la page peut s’exécuter sur le **serveur** avec l’`id` déjà connu, sans hook client ; en SPA React classique, l’accès aux paramètres d’URL passe par le **runtime navigateur** et des hooks.

---

## Partie 4 — Server Component & fetch

### Q5 — Lignes de code : SPA React vs Next (dashboard)

**React SPA (indicatif) :** il fallait typiquement **20 à 40+ lignes** selon le style : `useState` pour `projects` + `loading` + `error`, `useEffect` avec `fetch`, `.then` / `async` + `setProjects`, gestion du loading, JSX conditionnel.

**Next (Server Component) ici :** une fonction **`async`**, un **`fetch`**, **`await res.json()`**, puis le **return JSX** — de l’ordre d’**une quinzaine de lignes** utiles sans états locaux de chargement.

**Gain conceptuel :** pas de `useState` / `useEffect` / `setProjects` pour ce cas d’affichage pur servi par le serveur.

### Q6 — F12 > Network : voit-on `GET /projects` ?

**Souvent non** pour la requête vers **json-server (`:4000`)** : le `fetch` s’exécute dans le **serveur Next.js** pendant le rendu de la page. Le navigateur reçoit surtout le **document HTML** déjà généré (et les assets Next / RSC payload selon version).

**Exception :** si la page ou un composant client refait un `fetch` côté navigateur, alors la requête apparaît dans l’onglet Network du navigateur.

---

## Partie 5 — Client Component (`use client`)

### Q7 — Pourquoi `'use client'` ici et pas sur le Dashboard ?

- **Dashboard :** affichage de données via **`fetch` côté serveur** dans un composant **async** → Server Component, pas d’interactivité React locale obligatoire.
- **Login :** **`useState`**, **`onChange`**, **`onSubmit`**, **`useRouter`** → interactivité et hooks **côté client** → il faut la directive **`'use client'`**.

### Q8 — Équivalent de `useNavigate()` (react-router-dom) en Next.js

- **`useRouter()`** depuis **`next/navigation`**, avec notamment **`router.push('/chemin')`** pour une navigation programmée (équivalent courant de `navigate('/chemin')`).

---

## Partie 6 — View source (preuve SSR)

### Q9 — React SPA (`localhost:5173/dashboard`) : que voit-on dans le code source (Ctrl+U) ?

Souvent un **document minimal** : racine vide type `<div id="root"></div>` et des **balises `<script>`**. Les **noms des projets n’apparaissent pas** dans le HTML initial : le contenu est injecté **après** exécution du JavaScript dans le navigateur.

### Q10 — Next (`localhost:3000/dashboard`) : les noms des projets sont-ils dans le HTML ?

**Oui**, ils sont en général **déjà présents dans le HTML** renvoyé (SSR / rendu serveur du Server Component), ce qui améliore le **premier affichage** et l’**indexation** (SEO) par rapport à une SPA pure.

---

## Partie 7 — Réflexion

### Q11 — Header dans `layout.tsx` qui ne se remonte pas à la navigation ; équivalent React Router ?

En Next, le **`layout.tsx`** parent entoure les **segments enfants** : le layout **persiste** quand seul le segment (page) change.

En **React Router**, on obtient un comportement proche en plaçant le **Header au-dessus** de l’élément rendu par **`<Outlet />`** dans une **route parente** (layout route), plutôt que de dupliquer le header dans chaque page.

### Q12 — Layout spécifique au Dashboard avec Sidebar : où créer le fichier ?

Créer un fichier **`app/dashboard/layout.tsx`** : il s’applique à **`/dashboard`** et à ses sous-routes (ex. éventuels sous-segments), en enveloppant le `{children}` avec la sidebar.

### Q13 — Le Dashboard est un Server Component : peut-on utiliser `onClick` ?

**Non** (pas directement sur le même composant serveur) : les gestionnaires d’événements comme **`onClick`** exigent un composant **client** (interactivité dans le navigateur). Un Server Component ne sérialise pas de callbacks vers le client.

### Q14 — Bouton « + Nouveau projet » : faut-il tout passer en Client Component ?

**Non.** Bonne pratique : garder la page en **Server Component** et extraire un petit composant **`'use client'`** (ex. `NewProjectButton.tsx`) qui porte l’**`onClick`** / formulaire, ou utiliser des **Server Actions** pour la mutation.

### Q15 — `fetch` Server Component vers `:4000` : avantage sécurité

Le navigateur **ne voit pas** l’URL `http://localhost:4000` pour ce fetch serveur : la requête part du **runtime Node** du serveur Next. Cela évite d’**exposer l’API interne** au client (moins de surface d’attaque, possibilité de garder l’API sur un réseau privé en production).  
**Note :** en production il faudrait une auth réelle, HTTPS, et ne pas exposer json-server tel quel.

---

## Complément — Gestion d’erreur projet (`app/projects/[id]/page.tsx`)

Si `res.ok` est faux (404, etc.), la page affiche **« Projet non trouvé »** et un lien retour dashboard, **sans** `useState` / `useEffect` / état `loading` côté client comme dans l’ancien `ProjectDetail.tsx` React : la branche **`if (!res.ok)`** suffit dans le flux **async** serveur.
