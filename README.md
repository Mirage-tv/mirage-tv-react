# Mirage - Application Frontend

Mirage est une plateforme moderne de streaming et de gestion de médias, conçue avec React et TypeScript, et configurée pour être performante et sécurisée.

## Stack Technique

- **Framework** : [React 19](https://react.dev/)
- **Langage** : [TypeScript](https://www.typescriptlang.org/)
- **Gestionnaire d'état** : [Zustand](https://zustand.docs.pmnd.rs/getting-started/introduction) (Stores légers et réutilisables)
- **Routage** : [React Router DOM v7](https://reactrouter.com/)
- **Outil de build** : [Vite](https://vite.dev/)
- **Serveur & Déploiement** : [Cloudflare Wrangler](https://developers.cloudflare.com/workers/wrangler/)

## Développement Local

### Prérequis

Assurez-vous d'avoir [Node.js](https://nodejs.org/) installé sur votre machine.

### Installation

1. Installez les dépendances du projet :

   ```bash
   npm install
   ```

2. Créez un fichier `.env` à la racine si vous devez surcharger les variables d'environnement.

### Lancement du serveur de développement

Pour démarrer l'application localement avec rechargement à chaud (HMR) :

```bash
npm run dev
```

L'application sera accessible par défaut sur `http://localhost:5173`.

## Build et Déploiement

### Production Build

Pour compiler l'application et générer les assets optimisés pour la production :

```bash
npm run build
```

Les fichiers générés se trouveront dans le répertoire `dist/`.

### Déploiement (Cloudflare)

Pour compiler et déployer directement sur Cloudflare via Wrangler :

```bash
npm run deploy
```

## 🔍 Qualité du Code

Pour lancer l'analyse statique du code (linter) :

```bash
npm run lint
```
