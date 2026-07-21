// ─── Core Types ───

export type PlaceCategory =
  | 'property'
  | 'food'
  | 'entertainment'
  | 'lifestyle'
  | 'shopping'
  | 'essentials'
  | 'education'
  | 'outdoor';

export const PLACE_CATEGORIES: { value: PlaceCategory; label: string; icon: string; color: string }[] = [
  { value: 'property', label: 'Property', icon: '🏠', color: '#3b82f6' },
  { value: 'food', label: 'Food & Drink', icon: '🍽️', color: '#f59e0b' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎭', color: '#8b5cf6' },
  { value: 'lifestyle', label: 'Lifestyle', icon: '💆', color: '#10b981' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️', color: '#ec4899' },
  { value: 'essentials', label: 'Essentials', icon: '🏥', color: '#ef4444' },
  { value: 'education', label: 'Education', icon: '📚', color: '#06b6d4' },
  { value: 'outdoor', label: 'Outdoor', icon: '🌲', color: '#84cc16' },
];

export type SignalType =
  | 'new_place'
  | 'price_drop'
  | 'price_surge'
  | 'event_upcoming'
  | 'promotion'
  | 'trending'
  | 'availability'
  | 'traffic_anomaly';

export const SIGNAL_LABELS: Record<SignalType, { label: string; icon: string; color: string }> = {
  new_place: { label: 'New Place', icon: '✨', color: '#10b981' },
  price_drop: { label: 'Price Drop', icon: '📉', color: '#059669' },
  price_surge: { label: 'Price Surge', icon: '📈', color: '#ef4444' },
  event_upcoming: { label: 'Upcoming Event', icon: '📅', color: '#3b82f6' },
  promotion: { label: 'Promotion', icon: '🎉', color: '#8b5cf6' },
  trending: { label: 'Trending', icon: '🔥', color: '#f97316' },
  availability: { label: 'New Availability', icon: '🟢', color: '#06b6d4' },
  traffic_anomaly: { label: 'Traffic Alert', icon: '🚗', color: '#dc2626' },
};

// ─── API Response Types ───

export interface PaginationMeta {
  nextCursor: string | null;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  data: T;
  pagination?: PaginationMeta;
  meta?: {
    totalResults?: number;
    searchRadiusM?: number;
    aiExplanation?: string;
  };
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

// ─── Place Types ───

export interface PlaceScore {
  safety: number;
  affordability: number;
  popularity: number;
  investmentPotential?: number;
  walkability?: number;
  nightlife?: number;
  familyFriendliness?: number;
  internetSpeed?: number;
  cleanliness?: number;
  accessibility?: number;
  petFriendliness?: number;
}

export interface PlaceHours {
  mon?: string;
  tue?: string;
  wed?: string;
  thu?: string;
  fri?: string;
  sat?: string;
  sun?: string;
}

export interface PlaceContact {
  phone?: string;
  email?: string;
  website?: string;
  social?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
}

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  subcategory: string | null;
  description: string | null;
  latitude: number;
  longitude: number;
  distanceM?: number;
  walkingTimeMin?: number;
  address: string | null;
  city: string | null;
  country: string;
  priceMin: number | null;
  priceMax: number | null;
  contact?: PlaceContact;
  hours?: PlaceHours;
  amenities: string[];
  scores: PlaceScore;
  metadata?: Record<string, unknown>;
  source: string;
  isFeatured: boolean;
  isGem: boolean;
  gemExplanation: string | null;
  reviewCount: number;
  averageRating: number;
  monthlyVisitors: number;
  imageUrl?: string;
  createdAt: string;
}

// ─── Signal Types ───

export interface Signal {
  id: string;
  type: SignalType;
  placeId: string | null;
  place?: Place;
  title: string;
  body: string | null;
  score: number;
  metadata?: Record<string, unknown>;
  expiresAt: string | null;
  createdAt: string;
}

// ─── Event Types ───

export interface Event {
  id: string;
  title: string;
  description: string | null;
  venueId: string | null;
  venue?: Place;
  startTime: string;
  endTime: string | null;
  category: string | null;
  priceMin: number | null;
  priceMax: number | null;
  source: string;
  imageUrl: string | null;
  ticketUrl: string | null;
}

// ─── Concierge Types ───

export interface ConciergeQuery {
  query: string;
  lat?: number;
  lng?: number;
  radiusM?: number;
}

export interface ExtractedParams {
  category?: PlaceCategory;
  subcategory?: string;
  maxPrice?: number;
  minPrice?: number;
  location?: string;
  amenities?: string[];
  vibe?: string;
}

export interface ConciergeResult {
  places: Place[];
  explanation: string;
  extractedParams: ExtractedParams;
  alternatives?: string[];
}

// ─── User Preferences ───

export interface UserPreferences {
  defaultRadiusM: number;
  favorites: PlaceCategory[];
  budgetMin?: number;
  budgetMax?: number;
  notifications: boolean;
}

// ─── Map Types ───

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

// ─── Component Prop Types ───

export type LoadingState = 'idle' | 'loading' | 'success' | 'error' | 'empty';