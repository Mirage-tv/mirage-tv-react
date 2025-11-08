# Mirage-TV API Integration Documentation

## Overview

This document describes the complete API integration for the Mirage-TV React application based on the OpenAPI specification v0.9.1.

## Architecture

The application follows a clean architecture pattern with the following layers:

```
src/
├── core/
│   ├── domain/          # Domain types and models
│   │   └── types.ts     # All TypeScript types from OpenAPI schemas
│   └── hooks/           # Custom React hooks
│       ├── useAuth.ts
│       ├── useMedia.ts
│       ├── useFavorites.ts
│       └── index.ts
├── infrastructure/
│   ├── adapters/
│   │   ├── api/         # API service adapters
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
│   │   └── http/        # HTTP client
│   │       └── HttpClient.ts
│   ├── config/          # Configuration
│   │   └── api.config.ts
│   └── store/           # State management (Zustand)
│       ├── authStore.ts
│       ├── mediaStore.ts
│       ├── featuredStore.ts
│       ├── favoritesStore.ts
│       ├── viewingHistoryStore.ts
│       ├── subscriptionStore.ts
│       ├── categoryStore.ts
│       └── index.ts
```

## Core Components

### 1. HTTP Client

The `HttpClient` class handles all HTTP communication with the API:

- **Location**: `src/infrastructure/adapters/http/HttpClient.ts`
- **Features**:
  - Automatic cookie handling (`credentials: 'include'`)
  - Error handling and response parsing
  - Query parameter support
  - JSON request/response handling

**Usage Example**:
```typescript
import { httpClient } from '@/infrastructure/adapters/http/HttpClient';

// GET request
const data = await httpClient.get('/api/v1/user');

// POST request
await httpClient.post('/api/v1/auth/login', { mail, password });
```

### 2. API Services

Each service encapsulates related API operations:

#### AuthService
```typescript
import { authService } from '@/infrastructure/adapters/api';

// Sign up
await authService.signUp({ name, mail, password });

// Login
await authService.login({ mail, password });

// Logout
await authService.logout();

// Forgot password
await authService.forgotPassword(email);
```

#### MediaService
```typescript
import { mediaService } from '@/infrastructure/adapters/api';

// Get movies with pagination
const movies = await mediaService.getMovies({ page: 1, per: 20 });

// Get shows
const shows = await mediaService.getShows({ page: 1, per: 20 });

// Get media by ID
const media = await mediaService.getMediaById(id);

// Get show with episodes
const show = await mediaService.getShowById(id);

// Browse by category
const categoryMedia = await mediaService.getMediaByCategory('action', { page: 1 });

// Up-vote media
await mediaService.upVoteMedia(mediaId);
```

#### FeaturedMediaService
```typescript
import { featuredMediaService } from '@/infrastructure/adapters/api';

// Get hero banner
const hero = await featuredMediaService.getHeroBanner();

// Get trending content
const trending = await featuredMediaService.getTrendingNow();
```

#### VideoService
```typescript
import { videoService } from '@/infrastructure/adapters/api';

// Get secure playback URLs (requires active subscription)
const videoUrls = await videoService.getVideoUrls(mediaId);
// Returns: { source, subtitles, trailerURL? }
```

#### FavoritesService
```typescript
import { favoritesService } from '@/infrastructure/adapters/api';

// Get favorites list
const favorites = await favoritesService.getFavorites();

// Toggle favorite
const isFavorite = await favoritesService.toggleFavorite({ mediaId });
```

#### ViewingHistoryService
```typescript
import { viewingHistoryService } from '@/infrastructure/adapters/api';

// Get continue-watching list
const continueWatching = await viewingHistoryService.getContinueWatching();

// Create history entry
await viewingHistoryService.createHistoryEntry({ mediaId, progress: 0.0 });

// Update progress
await viewingHistoryService.updateProgress({ id, progress: 0.5 });
```

#### SubscriptionService
```typescript
import { subscriptionService } from '@/infrastructure/adapters/api';

// Get subscription details
const subscription = await subscriptionService.getSubscription();

// Cancel subscription
await subscriptionService.cancelSubscription({ id: subscriptionId });
```

#### UserService
```typescript
import { userService } from '@/infrastructure/adapters/api';

// Get user profile
const profile = await userService.getProfile();

// Update name
await userService.updateName({ name: 'New Name' });

// Update email
await userService.updateEmail({ mail: 'new@email.com' });

// Update password
await userService.updatePassword({ password: 'newPassword123' });

// Delete account
await userService.deleteAccount();
```

### 3. Zustand Stores

Stores manage application state and integrate with API services:

#### Auth Store
```typescript
import { useAuthStore } from '@/infrastructure/store';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuthStore();

  // Use state and actions
}
```

#### Media Store
```typescript
import { useMediaStore } from '@/infrastructure/store';

function MyComponent() {
  const {
    movies,
    shows,
    fetchMovies,
    fetchShowById
  } = useMediaStore();

  // Load content
  useEffect(() => {
    fetchMovies({ page: 1, per: 20 });
  }, [fetchMovies]);
}
```

### 4. Custom Hooks

High-level hooks for React components:

#### useAuth Hook
```typescript
import { useAuth } from '@/core/hooks';

function LoginComponent() {
  const {
    isAuthenticated,
    login,
    logout,
    user,
    isSubscriber
  } = useAuth();

  const handleLogin = async (credentials) => {
    const result = await login(credentials);
    if (result.success) {
      // Navigate to home
    } else {
      // Show error: result.error
    }
  };
}
```

#### useMedia Hook
```typescript
import { useMedia } from '@/core/hooks';

function BrowseComponent() {
  const {
    movies,
    loadMovies,
    currentMedia,
    loadMediaById,
    isLoadingMovies
  } = useMedia();

  useEffect(() => {
    loadMovies({ page: 1, per: 20 });
  }, [loadMovies]);
}
```

#### useFavorites Hook
```typescript
import { useFavorites } from '@/core/hooks';

function MediaCard({ mediaId }) {
  const {
    isFavorite,
    toggleFavorite,
    favorites
  } = useFavorites();

  const handleToggle = async () => {
    const result = await toggleFavorite(mediaId);
    if (result.success) {
      console.log('Is now favorite:', result.isFavorite);
    }
  };

  return (
    <button onClick={handleToggle}>
      {isFavorite(mediaId) ? '❤️' : '🤍'}
    </button>
  );
}
```

## Authentication Flow

### Session Management

The API uses HTTP-only cookies for session management:

1. **Sign Up/Login**: Session cookie is automatically set by the server
2. **Authenticated Requests**: Cookie is automatically included via `credentials: 'include'`
3. **Logout**: Session cookie is cleared
4. **401 Responses**: User should be redirected to login

### Example Login Flow

```typescript
import { useAuth } from '@/core/hooks';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const result = await login({
      mail: formData.get('email'),
      password: formData.get('password')
    });

    if (result.success) {
      navigate('/');
    } else {
      alert(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
```

## Pagination

All paginated endpoints support consistent query parameters:

- `page`: Page index starting at 1 (default: 1)
- `per`: Items per page (default: 20, max: 100)

**Example**:
```typescript
const movies = await mediaService.getMovies({ page: 2, per: 30 });
console.log(movies.metadata); // { page: 2, per: 30, total: 150 }
console.log(movies.items); // Array of MediaThumbnail
```

## Error Handling

All API calls can throw `APIError`:

```typescript
interface APIError {
  message: string;
  statusCode: number;
}
```

**Handling Errors**:
```typescript
try {
  await mediaService.getMovies();
} catch (error) {
  if (error.statusCode === 401) {
    // Redirect to login
  } else if (error.statusCode === 429) {
    // Rate limited
  } else {
    console.error('Error:', error.message);
  }
}
```

**Common Status Codes**:
- `200`: OK
- `201`: Created
- `204`: No Content
- `400`: Bad Request
- `401`: Unauthorized (need login)
- `404`: Not Found
- `429`: Too Many Requests (rate limited)
- `500`: Internal Server Error

## Video Playback

### Getting Secure URLs

```typescript
import { videoService } from '@/infrastructure/adapters/api';

async function playMedia(mediaId: string) {
  try {
    const videoData = await videoService.getVideoUrls(mediaId);

    // videoData contains:
    // - source: Main video URL (signed)
    // - subtitles: Array of { language, url }
    // - trailerURL: Optional trailer URL

    // Use with video player
    videoPlayer.src = videoData.source;
    videoData.subtitles.forEach(sub => {
      videoPlayer.addTextTrack('subtitles', sub.language, sub.url);
    });
  } catch (error) {
    if (error.statusCode === 401) {
      // User not subscribed
      showSubscriptionPrompt();
    }
  }
}
```

## Subscription-Only Features

Some endpoints require an active subscription:

- `GET /api/v1/video-url` - Video playback URLs
- `POST /api/v1/media/up-vote/{id}` - Up-voting media
- `videoURLs` field in media thumbnails (only populated for subscribers)

**Checking Subscription**:
```typescript
const { user, isSubscriber } = useAuth();

if (isSubscriber) {
  // Show play button
} else {
  // Show "Subscribe to watch"
}
```

## Rate Limiting

The following endpoints are rate-limited:

- `POST /api/v1/auth/sign-up` - Returns 429 if exceeded
- `POST /api/v1/auth/login` - Returns 429 if exceeded

## Type Safety

All types are generated from the OpenAPI specification:

```typescript
import {
  UserDTO,
  MediaDTO,
  MediaThumbnail,
  SubscriptionDTO,
  AgeRange,
  VideoQuality,
  SubscriptionStatus
} from '@/core/domain/types';
```

## Environment Configuration

Configure the API base URL in `api.config.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: '/api/v1',
  VERSION: '0.9.1',
};
```

For development, you might proxy requests in `vite.config.ts`:

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

## Best Practices

1. **Use Custom Hooks**: Prefer `useAuth()`, `useMedia()`, etc. over direct store access
2. **Error Handling**: Always handle errors from async operations
3. **Loading States**: Use `isLoading` flags to show loading indicators
4. **Optimistic Updates**: Update UI optimistically, then sync with server
5. **Pagination**: Load more content as user scrolls
6. **Caching**: Zustand stores cache data; refresh when needed
7. **Authentication**: Check `isAuthenticated` before protected operations
8. **Subscription**: Check `isSubscriber` before subscription-only features

## Example: Complete Feature Implementation

```typescript
// BrowseMoviesPage.tsx
import { useEffect } from 'react';
import { useMedia } from '@/core/hooks';
import { useFavorites } from '@/core/hooks';

function BrowseMoviesPage() {
  const {
    movies,
    loadMovies,
    isLoadingMovies,
    moviesMetadata
  } = useMedia();

  const {
    toggleFavorite,
    isFavorite
  } = useFavorites();

  useEffect(() => {
    loadMovies({ page: 1, per: 20 });
  }, [loadMovies]);

  const handleToggleFavorite = async (mediaId: string) => {
    const result = await toggleFavorite(mediaId);
    if (!result.success) {
      alert(result.error);
    }
  };

  if (isLoadingMovies) {
    return <div>Loading movies...</div>;
  }

  return (
    <div>
      <h1>Browse Movies</h1>
      <div className="grid">
        {movies.map(movie => (
          <div key={movie.id} className="card">
            <img src={movie.thumbnailUrl} alt={movie.name} />
            <h3>{movie.name}</h3>
            <button onClick={() => handleToggleFavorite(movie.id!)}>
              {isFavorite(movie.id!) ? '❤️ Remove' : '🤍 Add to Favorites'}
            </button>
          </div>
        ))}
      </div>
      <div>
        Page {moviesMetadata?.page} of {Math.ceil((moviesMetadata?.total || 0) / (moviesMetadata?.per || 20))}
      </div>
    </div>
  );
}
```

## Testing

Mock API services for testing:

```typescript
// __mocks__/authService.ts
export const authService = {
  login: jest.fn(),
  logout: jest.fn(),
  signUp: jest.fn(),
};
```

## Additional Resources

- OpenAPI Spec: API v0.9.1
- React Router: Navigation and routing
- Zustand: State management
- Vite: Build tool and dev server
