// Core domain types for Mirage-TV based on OpenAPI specification v0.9.1

// ============================================================================
// Enums → Const Objects
// ============================================================================

export const AgeRange = {
  AllAges: "0+",
  SixPlus: "6+",
  TwelvePlus: "12+",
  SixteenPlus: "16+",
  EighteenPlus: "18+",
} as const;
export type AgeRange = (typeof AgeRange)[keyof typeof AgeRange];

export const VideoQuality = {
  SD: "sd",
  HD: "hd",
  TwoK: "2k",
  FourK: "4k",
} as const;
export type VideoQuality = (typeof VideoQuality)[keyof typeof VideoQuality];

export const SubscriptionStatus = {
  Active: "active",
  Cancelled: "cancelled",
  Expired: "expired",
  GracePeriod: "gracePeriod",
} as const;
export type SubscriptionStatus = (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];

export const PaymentStatus = {
  Succeeded: "succeeded",
  Failed: "failed",
  Pending: "pending",
  Refunded: "refunded",
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const PlanDuration = {
  Weekly: "weekly",
  Monthly: "monthly",
  Yearly: "yearly",
} as const;
export type PlanDuration = (typeof PlanDuration)[keyof typeof PlanDuration];

// ============================================================================
// Basic Types
// ============================================================================

export type Subtitle = {
  readonly language: string;
  readonly url: string;
};

export type VideoURLsDTO = {
  readonly source: string;
  readonly subtitles: readonly Subtitle[];
  readonly trailerURL?: string | null;
  readonly trailer?: string | null; // Alternative field name from API
};

export type EpisodeInfo = {
  readonly [key: string]: unknown;
};

export type Media = {
  readonly [key: string]: unknown;
};

// ============================================================================
// Media Types
// ============================================================================

export type MediaThumbnail = {
  readonly id?: string | null;
  readonly name: string;
  readonly thumbnailUrl: string;
  readonly isFavorite: boolean;
  readonly progress?: number | null;
  readonly videoURLs?: VideoURLsDTO;
};

export type MediaPreview = {
  readonly id?: string | null;
  readonly name: string;
  readonly synopsis: string;
  readonly duration: string;
  readonly ageRange: AgeRange;
  readonly quality: VideoQuality;
  readonly posterURL?: string | null;
  readonly videoURLs?: VideoURLsDTO;
};

export type MediaDTO = {
  readonly id?: string | null;
  readonly name: string;
  readonly synopsis: string;
  readonly duration: string;
  readonly ageRange: AgeRange;
  readonly quality: VideoQuality;
  readonly thunbailURL: string;
  readonly isFavorite: boolean;
  readonly progress?: number | null;
  readonly episodeInfo?: EpisodeInfo;
  readonly videoURL?: VideoURLsDTO;
};

export type FeaturedMediaDTO = {
  readonly id?: string | null;
  readonly previewMedia: MediaPreview;
  readonly label?: string | null;
};

// ============================================================================
// Series/Shows Types
// ============================================================================

export type SeriePreview = {
  readonly id?: string | null;
  readonly title: string;
  readonly description?: string | null;
  readonly posterURL?: string | null;
  readonly totalSeasons: number;
  readonly numberOfmedias: number;
};

export type SerieDTO = {
  readonly id?: string | null;
  readonly title: string;
  readonly description?: string | null;
  readonly posterURL?: string | null;
  readonly totalSeasons: number;
  readonly medias: readonly Media[];
};

// ============================================================================
// Pagination Types
// ============================================================================

export type PageMetadata = {
  readonly page: number;
  readonly per: number;
  readonly total: number;
};

export type PageMediaThumbnail = {
  readonly items: readonly MediaThumbnail[];
  readonly metadata: PageMetadata;
};

export type PageSeriePreview = {
  readonly items: readonly SeriePreview[];
  readonly metadata: PageMetadata;
};

// ============================================================================
// User & Auth Types
// ============================================================================

export type UserDTO = {
  readonly name: string;
  readonly mail: string;
  readonly planName?: string | null;
};

export type CreateUserReq = {
  readonly name: string;
  readonly mail: string;
  readonly password: string;
};

export type LoginReq = {
  readonly mail: string;
  readonly password: string;
};

export type UpdateUserNameReq = {
  readonly name: string;
};

export type UpdateUserMailReq = {
  readonly mail: string;
};

export type UpdateUserPasswordReq = {
  readonly password: string;
};

// ============================================================================
// Subscription & Payment Types
// ============================================================================

export type InvoiceDTO = {
  readonly id?: string | null;
  readonly amountCents: number;
  readonly status: PaymentStatus;
  readonly paidAt?: string | null;
  readonly stripeRef?: string | null;
};

export type SubscriptionDTO = {
  readonly id?: string | null;
  readonly planName: string;
  readonly price: number;
  readonly status: SubscriptionStatus;
  readonly startDate: string;
  readonly endDate?: string | null;
  readonly invoices: readonly InvoiceDTO[];
};

export type CancelSubReq = {
  readonly id: string;
};

export type PlanDTO = {
  readonly id?: string | null;
  readonly name: string;
  readonly priceCents: number;
  readonly duration: PlanDuration;
};

export type StripeConfigRes = {
  readonly publishableKey: string;
};

export type CheckoutSessionReq = {
  readonly planId: string;
};

export type CheckoutSessionRes = {
  readonly sessionId: string;
  readonly url: string;
};

export type ConfirmCheckoutReq = {
  readonly sessionId: string;
};

// ============================================================================
// Viewing History Types
// ============================================================================

export type CreateViewingHistoryRequest = {
  readonly mediaId: string;
  readonly progress: number;
};

export type UpdateViewingHistoryRequest = {
  readonly mediaId: string;
  readonly progress: number;
};

// ============================================================================
// Favorites Types
// ============================================================================

export type ToggleFavoriteReq = {
  readonly mediaId: string;
};

// ============================================================================
// Categories Types
// ============================================================================

export type AvailableCategories = {
  readonly list: readonly string[];
};

// ============================================================================
// Search Types
// ============================================================================

export type MediaSearchResponse = {
  readonly movies: PageMediaThumbnail;
  readonly series: PageSeriePreview;
};

// ============================================================================
// API Response Types
// ============================================================================

export type HTTPResponseStatus = number;

export type APIError = {
  readonly message: string;
  readonly statusCode: number;
};
