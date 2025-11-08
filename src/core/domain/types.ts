// Core domain types for Mirage-TV based on OpenAPI specification v0.9.1

// ============================================================================
// Enums
// ============================================================================

export enum AgeRange {
  AllAges = "0+",
  SixPlus = "6+",
  TwelvePlus = "12+",
  SixteenPlus = "16+",
  EighteenPlus = "18+"
}

export enum VideoQuality {
  SD = "sd",
  HD = "hd",
  TwoK = "2K",
  FourK = "4k"
}

export enum SubscriptionStatus {
  Active = "active",
  Cancelled = "cancelled",
  Expired = "expired",
  GracePeriod = "gracePeriod"
}

export enum PaymentStatus {
  Succeeded = "succeeded",
  Failed = "failed",
  Pending = "pending",
  Refunded = "refunded"
}

// ============================================================================
// Basic Types
// ============================================================================

export interface Subtitle {
  language: string;
  url: string;
}

export interface VideoURLsDTO {
  source: string;
  subtitles: Subtitle[];
  trailerURL?: string | null;
}

export interface EpisodeInfo {
  // Placeholder for episode-specific info
  [key: string]: any;
}

export interface Media {
  // Generic media type
  [key: string]: any;
}

// ============================================================================
// Media Types
// ============================================================================

export interface MediaThumbnail {
  id?: string | null;
  name: string;
  thumbnailUrl: string;
  isFavorite: boolean;
  progress?: number | null;
  videoURLs?: VideoURLsDTO;
}

export interface MediaPreview {
  id?: string | null;
  name: string;
  synopsis: string;
  duration: string;
  ageRange: AgeRange;
  quality: VideoQuality;
  posterURL?: string | null;
  videoURLs?: VideoURLsDTO;
}

export interface MediaDTO {
  id?: string | null;
  name: string;
  synopsis: string;
  duration: string;
  ageRange: AgeRange;
  quality: VideoQuality;
  thunbailURL: string;
  isFavorite: boolean;
  progress?: number | null;
  episodeInfo?: EpisodeInfo;
  videoURL?: VideoURLsDTO;
}

export interface FeaturedMediaDTO {
  id?: string | null;
  previewMedia: MediaPreview;
  label?: string | null;
}

// ============================================================================
// Series/Shows Types
// ============================================================================

export interface SeriePreview {
  id?: string | null;
  title: string;
  description?: string | null;
  posterURL?: string | null;
  totalSeasons: number;
  numberOfmedias: number;
}

export interface SerieDTO {
  id?: string | null;
  title: string;
  description?: string | null;
  posterURL?: string | null;
  totalSeasons: number;
  medias: Media[];
}

// ============================================================================
// Pagination Types
// ============================================================================

export interface PageMetadata {
  page: number;
  per: number;
  total: number;
}

export interface PageMediaThumbnail {
  items: MediaThumbnail[];
  metadata: PageMetadata;
}

export interface PageSeriePreview {
  items: SeriePreview[];
  metadata: PageMetadata;
}

// ============================================================================
// User & Auth Types
// ============================================================================

export interface UserDTO {
  name: string;
  mail: string;
  planName?: string | null;
}

export interface CreateUserReq {
  name: string;
  mail: string;
  password: string;
}

export interface LoginReq {
  mail: string;
  password: string;
}

export interface UpdateUserNameReq {
  name: string;
}

export interface UpdateUserMailReq {
  mail: string;
}

export interface UpdateUserPasswordReq {
  password: string;
}

// ============================================================================
// Subscription & Payment Types
// ============================================================================

export interface InvoiceDTO {
  id?: string | null;
  amountCents: number;
  status: PaymentStatus;
  paidAt?: string | null;
  stripeRef?: string | null;
}

export interface SubscriptionDTO {
  id?: string | null;
  planName: string;
  price: number;
  status: SubscriptionStatus;
  startDate: string;
  endDate?: string | null;
  invoices: InvoiceDTO[];
}

export interface CancelSubReq {
  id: string;
}

// ============================================================================
// Viewing History Types
// ============================================================================

export interface CreateViewingHistoryRequest {
  mediaId: string;
  progress: number;
}

export interface UpdateViewingHistoryRequest {
  id: string;
  progress: number;
}

// ============================================================================
// Favorites Types
// ============================================================================

export interface ToggleFavoriteReq {
  mediaId: string;
}

// ============================================================================
// Categories Types
// ============================================================================

export interface AvailableCategories {
  list: string[];
}

// ============================================================================
// API Response Types
// ============================================================================

export type HTTPResponseStatus = number;

export interface APIError {
  message: string;
  statusCode: number;
}
