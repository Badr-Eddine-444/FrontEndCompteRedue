# Réponses aux questions du TP TaskFlow

## Compte de test (json-server)

Après `npm run server`, la collection `users` dans `db.json` contient notamment :

- **Email :** `john@taskflow.test`
- **Mot de passe :** `123456`

---

## Q1 — Pourquoi `<Navigate />` et pas `navigate()` (hook) dans `ProtectedRoute` ?

`ProtectedRoute` est un composant qui **choisit quoi rendre** selon l’état (connecté ou non). Avec `<Navigate />`, la redirection est **déclarative** : on retourne un arbre React qui décrit l’UI, ce qui s’intègre naturellement au modèle « early return » (`if (!user) return <Navigate … />`). React Router gère la navigation au moment du rendu, sans effet de bord manuel dans un `useEffect`.

Le hook `useNavigate()` sert plutôt à déclencher une navigation **en réaction à un événement** (clic, soumission de formulaire, fin de traitement). On pourrait techniquement faire un `useEffect` qui appelle `navigate()` si `!user`, mais c’est plus fragile (risque de double rendu, ordre d’exécution avec StrictMode) et moins lisible qu’un simple `<Navigate replace />` au rendu.

---

## Q2 — Différence entre `navigate(from)` et `navigate(from, { replace: true })` ?

- **`navigate(from)`** : ajoute une **nouvelle entrée** dans l’historique du navigateur. La page courante (ex. `/login`) reste « en dessous » dans la pile : le bouton **Retour** peut ramener au login après une connexion réussie.
- **`navigate(from, { replace: true })`** : **remplace** l’entrée courante dans l’historique au lieu d’en ajouter une. Après redirection vers le dashboard, retour ne repasse plus par la page de login (comportement attendu après authentification).

---

## Q3 — Après un POST, pourquoi `setProjects(prev => [...prev, data])` plutôt qu’un re-fetch GET ?

- **Moins de requêtes** : pas besoin d’un second aller-retour réseau si la réponse du POST contient déjà la ressource créée (cas typique avec json-server / REST).
- **UX plus réactive** : la liste se met à jour tout de suite.
- **Cohérence** : le serveur a validé la création ; on fait confiance au `data` retourné.

Un re-fetch GET reste valide (état toujours aligné avec le serveur), mais il est souvent **redondant** quand la réponse POST est suffisante.

---

## Q4 — Scénarios de test (comportement attendu avec la config du TP)

| Scénario | Comportement attendu |
|----------|----------------------|
| **a) `/dashboard` sans être connecté** | `ProtectedRoute` détecte l’absence d’utilisateur → redirection vers `/login` avec `state.from = '/dashboard'`. |
| **b) `/projects/1` sans être connecté** | Même logique → `/login` avec `from: '/projects/1'`. |
| **c) `/nimportequoi`** | Route `*` → `<Navigate to="/dashboard" />`. Sans session, `ProtectedRoute` sur `/dashboard` n’est pas atteint directement par `*` car on arrive sur `/dashboard` puis login si non connecté. |
| **d) `/` (racine)** | Redirection vers `/dashboard` ; si non connecté, ensuite vers `/login`. |
| **e) Connecté puis bouton Retour** | Dépend de la dernière navigation : si après login on utilise `replace: true`, on évite de revenir sur le login ; sinon l’historique peut encore contenir le login. |

---

## Q5 — Différence entre `<Link>` et `<NavLink>` ? Pourquoi `NavLink` dans la sidebar ?

- **`<Link>`** : lien vers une route, **sans** notion de « route active » intégrée (pas de style par défaut selon l’URL courante).
- **`<NavLink>`** : comme `Link`, mais avec la possibilité de savoir si le `to` correspond à l’URL actuelle (`className` ou `style` sous forme de fonction avec `isActive`).

Dans la sidebar, on veut **mettre en évidence le projet courant** : fond / texte « actif ». `NavLink` évite de comparer manuellement `useLocation()` à chaque entrée.

---

## Q6 — `ProjectForm` pour POST et pour PUT : qu’est-ce qui change entre les deux usages ?

Le composant reste le même (champs nom + couleur, annuler, soumettre). Ce qui change côté **parent** :

- **POST (création)** : valeurs initiales souvent vides / couleur par défaut ; au submit → `api.post('/projects', { name, color })` ; libellé du bouton du type « Créer ».
- **PUT (modification)** : `initialName` / `initialColor` renseignés avec le projet existant ; au submit → `api.put('/projects/' + id, { ...project, name, color })` ; libellé du type « Enregistrer ».

Le formulaire ne connaît pas l’API : il appelle seulement `onSubmit(name, color)`.

---

## Q7 — Arrêter json-server et tenter un POST : le message s’affiche ?

**Oui**, si la gestion d’erreur Axios est en place : sans serveur, la requête échoue (souvent erreur réseau / pas de réponse). Le `catch` avec `axios.isAxiosError` permet d’afficher un message (statut ou message serveur, ou libellé générique). En pratique, vérifier que l’UI affiche bien la zone d’erreur (`error` non null).

---

## Q8 — Avec `fetch`, un 404 ne lance pas forcément d’erreur. Avec Axios, que se passe-til ?

Avec **`fetch`**, une réponse HTTP **404 ou 500** est considérée comme une réponse « normale » : la promesse est **résolue** ; il faut tester `response.ok` ou `response.status` et lancer une erreur à la main.

Avec **Axios**, une réponse dont le statut est hors plage **2xx** (par défaut) **rejette** la promesse : on entre dans le **`catch`**, avec un objet d’erreur Axios contenant notamment `response.status` et éventuellement `response.data`.

---

## Bugs volontaires (rappel corrigé dans le code du projet)

| Sujet | Problème | Correction typique |
|--------|-----------|---------------------|
| **Login / navigation** | `navigate(from)` empile l’historique → retour possible vers login. | `navigate(from, { replace: true })`. |
| **ProjectForm** | `onSubmit` sans `e.preventDefault()` → rechargement de page HTML. | `e.preventDefault()` dans `handleSubmit`. |
| **ProjectDetail — BUG 1** | `useEffect(..., [])` alors que `id` et `navigate` sont utilisés. | Dépendances `[id, navigate]`. |
| **ProjectDetail — BUG 2** | `authState.user.name` si `user` est absent. | `authState.user?.name`. |

---

## Note pédagogique (sécurité)

Vérifier les identifiants côté client (mot de passe en clair dans `db.json`, requête `GET /users?email=`) est **uniquement pédagogique** avec json-server. En production, l’authentification doit passer par un **backend** (hash de mot de passe, HTTPS, endpoint dédié, tokens, etc.).
