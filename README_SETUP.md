# Mirage - Setup Instructions

## ✅ Ce qui est déjà fait

Toute l'architecture est en place :
- ✅ Architecture hexagonale complète (Domain, Use Cases, Ports, Adapters)
- ✅ Store Zustand configuré
- ✅ Routes React Router
- ✅ Composants React avec BEM
- ✅ Styles CSS mobile-first en REM
- ✅ HTTP Client avec gestion des sessions
- ✅ Tous les repositories et use cases

## 🚀 Pour voir l'application fonctionner

### Option 1 : Avec un vrai backend

Il faut un backend qui répond aux endpoints suivants :
- GET /movies/trending
- GET /movies/:id
- GET /categories
- POST /auth/signin
- POST /auth/signup
- etc.

### Option 2 : Avec des données mockées (pour tester rapidement)

Créez un fichier `src/infrastructure/adapters/api/MockMovieRepository.ts` avec des données en dur.

## 📝 Configuration actuelle

- URL de l'API : `http://localhost:3000/api` (défini dans .env)
- Port dev frontend : http://localhost:5174/

## 🎨 Structure créée

```
src/
├── core/                     # Cœur métier
│   ├── domain/              # Entités
│   ├── useCases/            # Cas d'usage
│   └── ports/               # Interfaces
├── infrastructure/           # Implémentations techniques
│   ├── adapters/
│   │   ├── api/            # Repositories API
│   │   └── http/           # HTTP Client
│   ├── store/              # Zustand
│   └── config/             # Configuration
├── views/                   # Interface utilisateur
│   ├── components/         # Composants réutilisables
│   └── pages/              # Pages
└── styles/                 # Styles globaux
```

## 🛠️ Commandes disponibles

```bash
npm run dev      # Lance le dev server
npm run build    # Build pour la production
npm run preview  # Prévisualise le build
```

## 📦 Dépendances installées

- React 19
- React Router Dom 7
- Zustand 5
- Zod 3

## 🎯 Prochaines étapes

1. Créer un backend ou utiliser des mocks
2. Tester les pages : /, /signin, /signup
3. Ajouter plus de pages (détail film, profil, etc.)
