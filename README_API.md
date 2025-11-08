# Mirage-TV - Frontend Application

## 📺 Vue d'ensemble

Mirage-TV est une application de streaming vidéo moderne construite avec React, TypeScript et Zustand. Elle s'intègre avec l'API Mirage-TV (v0.9.1) pour offrir une expérience de visionnage complète similaire à Netflix.

## 🚀 Fonctionnalités

- ✅ **Authentification complète** : Inscription, connexion, déconnexion, récupération de mot de passe
- ✅ **Catalogue de contenu** : Films, séries, épisodes avec pagination
- ✅ **Navigation par catégories** : Parcourir le contenu par genre
- ✅ **Contenu mis en avant** : Bannière héroïque, contenu tendance
- ✅ **Liste de favoris** : Gérer sa liste personnelle de médias
- ✅ **Historique de visionnage** : Continuer à regarder là où vous vous êtes arrêté
- ✅ **Lecture vidéo sécurisée** : URLs signées avec suivi de progression
- ✅ **Gestion d'abonnement** : Détails et annulation d'abonnement
- ✅ **Gestion de profil** : Modification du nom, email, mot de passe

## 🏗️ Architecture

Le projet suit une architecture propre (Clean Architecture) avec séparation des responsabilités :

```
src/
├── core/                           # Logique métier
│   ├── domain/
│   │   └── types.ts               # Types TypeScript de l'API
│   └── hooks/                     # Hooks React personnalisés
│       ├── useAuth.ts
│       ├── useMedia.ts
│       ├── useFavorites.ts
│       └── index.ts
│
├── infrastructure/                # Couche infrastructure
│   ├── adapters/
│   │   ├── api/                   # Services API
│   │   │   ├── AuthService.ts
│   │   │   ├── UserService.ts
│   │   │   ├── MediaService.ts
│   │   │   ├── FeaturedMediaService.ts
│   │   │   ├── VideoService.ts
│   │   │   ├── CategoryService.ts
│   │   │   ├── ViewingHistoryService.ts
│   │   │   ├── FavoritesService.ts
│   │   │   ├── SubscriptionService.ts
│   │   │   └── index.ts
│   │   └── http/
│   │       └── HttpClient.ts      # Client HTTP centralisé
│   ├── config/
│   │   └── api.config.ts          # Configuration API
│   └── store/                     # Gestion d'état Zustand
│       ├── authStore.ts
│       ├── mediaStore.ts
│       ├── featuredStore.ts
│       ├── favoritesStore.ts
│       ├── viewingHistoryStore.ts
│       ├── subscriptionStore.ts
│       ├── categoryStore.ts
│       └── index.ts
│
└── views/                         # Composants de pages
    ├── HomePage.tsx
    ├── LoginPage.tsx
    ├── WatchPage.tsx
    └── ...
```

## 📦 Installation

```bash
# Cloner le repository
git clone <repository-url>
cd mirage

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
VITE_API_BASE_URL=http://localhost:8080
```

### Configuration Vite pour le proxy API

Si votre backend tourne sur un autre port, configurez le proxy dans `vite.config.ts` :

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
```

## 🔐 Authentification

L'API utilise des cookies HTTP-only pour la gestion de session.

### Exemple d'utilisation

```typescript
import { useAuth } from '@/core/hooks';

function LoginComponent() {
  const { login, isAuthenticated, user } = useAuth();

  const handleLogin = async () => {
    const result = await login({
      mail: 'user@example.com',
      password: 'password123'
    });

    if (result.success) {
      console.log('Connecté avec succès !');
    } else {
      console.error('Erreur :', result.error);
    }
  };
}
```

## 📊 Gestion d'État

### Stores Zustand

Chaque domaine fonctionnel a son propre store :

#### AuthStore
```typescript
import { useAuthStore } from '@/infrastructure/store';

const { user, isAuthenticated, login, logout } = useAuthStore();
```

#### MediaStore
```typescript
import { useMediaStore } from '@/infrastructure/store';

const { movies, fetchMovies, currentMedia } = useMediaStore();
```

#### FavoritesStore
```typescript
import { useFavoritesStore } from '@/infrastructure/store';

const { favorites, toggleFavorite } = useFavoritesStore();
```

## 🎬 Lecture Vidéo

### Obtenir les URLs de lecture sécurisées

```typescript
import { videoService } from '@/infrastructure/adapters/api';

// Nécessite un abonnement actif
const videoUrls = await videoService.getVideoUrls(mediaId);

// videoUrls contient :
// - source: URL principale signée
// - subtitles: Tableau de sous-titres
// - trailerURL: URL de la bande-annonce (optionnel)
```

### Suivi de progression

```typescript
import { viewingHistoryService } from '@/infrastructure/adapters/api';

// Créer une entrée d'historique
await viewingHistoryService.createHistoryEntry({
  mediaId: 'uuid',
  progress: 0.0
});

// Mettre à jour la progression
await viewingHistoryService.updateProgress({
  id: 'history-entry-uuid',
  progress: 0.5  // 50% visionné
});
```

## 🎨 Composants Personnalisés

### Custom Hooks

#### useAuth
```typescript
const {
  user,              // Profil utilisateur
  isAuthenticated,   // Statut de connexion
  isSubscriber,      // A un abonnement actif
  login,             // Fonction de connexion
  logout,            // Fonction de déconnexion
  signUp,            // Fonction d'inscription
} = useAuth();
```

#### useMedia
```typescript
const {
  movies,            // Liste de films
  loadMovies,        // Charger les films
  currentMedia,      // Média actuellement sélectionné
  loadMediaById,     // Charger un média par ID
  voteMedia,         // Voter pour un média
} = useMedia();
```

#### useFavorites
```typescript
const {
  favorites,         // Liste des favoris
  toggleFavorite,    // Ajouter/retirer des favoris
  isFavorite,        // Vérifier si c'est un favori
  loadFavorites,     // Charger la liste
} = useFavorites();
```

## 📡 Services API

### Tous les services disponibles

```typescript
import {
  authService,              // Authentification
  userService,              // Gestion utilisateur
  mediaService,             // Contenu média
  featuredMediaService,     // Contenu mis en avant
  videoService,             // URLs de lecture
  categoryService,          // Catégories
  viewingHistoryService,    // Historique
  favoritesService,         // Favoris
  subscriptionService,      // Abonnements
} from '@/infrastructure/adapters/api';
```

### Exemples d'utilisation

#### Charger des films avec pagination
```typescript
const response = await mediaService.getMovies({
  page: 1,
  per: 20
});

console.log(response.items);      // Films
console.log(response.metadata);   // Info de pagination
```

#### Gérer les favoris
```typescript
// Récupérer la liste
const favorites = await favoritesService.getFavorites();

// Basculer l'état de favori
const isFavorite = await favoritesService.toggleFavorite({
  mediaId: 'uuid'
});
```

#### Parcourir par catégorie
```typescript
const categories = await categoryService.getCategories();

const categoryMedia = await mediaService.getMediaByCategory(
  'action',
  { page: 1, per: 20 }
);
```

## 🛣️ Routes

### Routes publiques
- `/` - Page d'accueil
- `/login` - Connexion
- `/signup` - Inscription
- `/forgot-password` - Récupération de mot de passe

### Routes protégées (nécessite authentification)
- `/profile` - Profil utilisateur
- `/my-list` - Liste de favoris
- `/account` - Paramètres du compte
- `/media/:id` - Détails d'un média
- `/shows/:id` - Détails d'une série

### Routes protégées (nécessite abonnement)
- `/watch/:mediaId` - Lecture vidéo

### Routes de navigation
- `/browse/movies` - Parcourir les films
- `/browse/shows` - Parcourir les séries
- `/browse/category/:category` - Parcourir par catégorie

## 🔒 Sécurité

### Cookies HTTP-Only
Les sessions sont gérées via des cookies HTTP-only sécurisés automatiquement inclus dans toutes les requêtes API grâce à `credentials: 'include'`.

### URLs signées
Les URLs de lecture vidéo sont signées par le serveur et expirées après un certain temps pour la sécurité du contenu.

### Protection des routes
Les routes sensibles vérifient l'authentification et l'abonnement avant d'afficher le contenu.

## 🎯 Gestion des erreurs

Toutes les requêtes API peuvent lever une `APIError` :

```typescript
interface APIError {
  message: string;
  statusCode: number;
}
```

### Codes de statut HTTP communs
- `200` : Succès
- `201` : Créé
- `204` : Pas de contenu
- `400` : Requête invalide
- `401` : Non autorisé (nécessite connexion)
- `404` : Non trouvé
- `429` : Trop de requêtes (rate limit)
- `500` : Erreur serveur

### Gestion des erreurs
```typescript
try {
  await mediaService.getMovies();
} catch (error: APIError) {
  if (error.statusCode === 401) {
    // Rediriger vers la page de connexion
    navigate('/login');
  } else if (error.statusCode === 429) {
    // Trop de requêtes
    showNotification('Veuillez ralentir vos requêtes');
  } else {
    // Autre erreur
    showNotification(error.message);
  }
}
```

## 📄 Types TypeScript

Tous les types sont générés depuis la spécification OpenAPI v0.9.1 :

```typescript
import {
  UserDTO,
  MediaDTO,
  MediaThumbnail,
  SubscriptionDTO,
  AgeRange,
  VideoQuality,
  SubscriptionStatus,
  PaymentStatus,
  // ... et plus
} from '@/core/domain/types';
```

## 🚦 Rate Limiting

Certains endpoints ont des limites de taux :
- Inscription : Retourne 429 si dépassé
- Connexion : Retourne 429 si dépassé

## 📚 Documentation supplémentaire

- [API_INTEGRATION.md](./API_INTEGRATION.md) - Guide complet d'intégration API
- [OpenAPI Specification](./openapi.json) - Spécification OpenAPI v0.9.1

## 🧪 Tests

```bash
# Lancer les tests unitaires
npm run test

# Lancer les tests avec couverture
npm run test:coverage

# Lancer les tests en mode watch
npm run test:watch
```

## 🏗️ Build

```bash
# Build pour la production
npm run build

# Prévisualiser le build de production
npm run preview
```

## 📝 Scripts disponibles

- `npm run dev` - Démarre le serveur de développement
- `npm run build` - Compile pour la production
- `npm run preview` - Prévisualise le build de production
- `npm run lint` - Vérifie le code avec ESLint

## 🤝 Contribution

1. Fork le projet
2. Créer une branche de fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📜 Licence

Ce projet est sous licence [MIT](LICENSE).

## 👥 Auteurs

- Votre équipe de développement

## 🙏 Remerciements

- React pour le framework frontend
- Zustand pour la gestion d'état
- Vite pour le build tool
- TypeScript pour la sécurité des types
