import { z } from 'zod';
import type { PlaceCategory } from '@/types';

export const placeCategoryEnum = z.enum([
  'property',
  'food',
  'entertainment',
  'lifestyle',
  'shopping',
  'essentials',
  'education',
  'outdoor',
]) satisfies z.ZodType<PlaceCategory>;

export const conciergeQuerySchema = z.object({
  query: z.string().min(1, 'Query is required').max(500, 'Query too long'),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  radiusM: z.number().min(100).max(50000).default(5000),
});

export const placeFilterSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  radiusM: z.number().min(100).max(50000).default(5000),
  category: placeCategoryEnum.optional(),
  subcategory: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  query: z.string().optional(),
  cursor: z.string().optional(),
  pageSize: z.number().min(1).max(100).default(20),
});

export const signalFeedSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  radiusM: z.number().min(100).max(50000).default(5000),
  cursor: z.string().optional(),
  pageSize: z.number().min(1).max(50).default(20),
});

export const eventsFilterSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  radiusM: z.number().min(100).max(50000).default(10000),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  category: z.string().optional(),
  cursor: z.string().optional(),
  pageSize: z.number().min(1).max(100).default(20),
});

export const savePlaceSchema = z.object({
  placeId: z.string().min(1),
});

export const userPreferencesSchema = z.object({
  defaultRadiusM: z.number().min(100).max(50000).default(5000),
  favorites: z.array(placeCategoryEnum).default([]),
  budgetMin: z.number().min(0).optional(),
  budgetMax: z.number().min(0).optional(),
  notifications: z.boolean().default(true),
});

export type ConciergeQuery = z.infer<typeof conciergeQuerySchema>;
export type PlaceFilter = z.infer<typeof placeFilterSchema>;
export type SignalFeedQuery = z.infer<typeof signalFeedSchema>;
export type EventsFilter = z.infer<typeof eventsFilterSchema>;
export type SavePlaceInput = z.infer<typeof savePlaceSchema>;
export type UserPreferencesInput = z.infer<typeof userPreferencesSchema>;