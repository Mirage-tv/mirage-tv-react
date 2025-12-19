// API Configuration for Mirage-TV
// All API endpoints and configuration constants

export const API_CONFIG = {
  BASE_URL: "/api/v1",
  VERSION: "0.9.9",
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    SIGN_UP: "/api/v1/auth/sign-up",
    LOGIN: "/api/v1/auth/login",
    LOGOUT: "/api/v1/auth/logout",
    FORGOT_PASSWORD: "/api/v1/auth/forgot-password",
  },

  // User endpoints
  USER: {
    GET_PROFILE: "/api/v1/user",
    DELETE_ACCOUNT: "/api/v1/user",
    UPDATE_NAME: "/api/v1/user/update-name",
    UPDATE_EMAIL: "/api/v1/user/update-mail",
    UPDATE_PASSWORD: "/api/v1/user/update-password",
  },

  // Media endpoints
  MEDIA: {
    GET_BY_ID: (id: string) => `/api/v1/media/${id}`,
    MOVIES: "/api/v1/media/movies",
    SHOWS: "/api/v1/media/shows",
    GET_SHOW_BY_ID: (id: string) => `/api/v1/media/shows/${id}`,
    CATEGORY: (category: string) => `/api/v1/media/category/${category}`,
    UP_VOTE: (id: string) => `/api/v1/media/up-vote/${id}`,
  },

  // Featured Media endpoints
  FEATURED: {
    HERO_BANNER: "/api/v1/featured-media/hero-banner",
    TRENDING_NOW: "/api/v1/featured-media/trending-now",
  },

  // Video endpoints
  VIDEO: {
    GET_URL: "/api/v1/video-url",
  },

  // Categories endpoints
  CATEGORIES: {
    LIST: "/api/v1/categories",
  },

  // Viewing History endpoints
  HISTORY: {
    CONTINUE_WATCHING: "/api/v1/history/continue-watching",
    CREATE: "/api/v1/history",
    UPDATE: "/api/v1/history/update",
  },

  // Favorites endpoints
  FAVORITES: {
    LIST: "/api/v1/favorites",
    TOGGLE: "/api/v1/favorites/toggle",
  },

  // Subscription endpoints
  SUBSCRIPTION: {
    GET: "/api/v1/sub",
    PLANS: "/api/v1/sub/plans",
    CONFIG: "/api/v1/sub/config",
    CHECKOUT: "/api/v1/sub/checkout",
    CONFIRM: "/api/v1/sub/confirm",
    CANCEL: "/api/v1/sub/cancel",
  },

  // FAQ endpoints
  FAQ: {
    LIST: "/api/v1/faq",
  },

  // Report endpoints
  REPORT: {
    CREATE: "/api/v1/report",
  },
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PER_PAGE: 20,
  MAX_PER_PAGE: 100,
} as const;

// Rate limit information (from API docs)
export const RATE_LIMITS = {
  SIGN_UP: "Rate limited on 429 Too Many Requests",
  LOGIN: "Rate limited on 429 Too Many Requests",
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;
