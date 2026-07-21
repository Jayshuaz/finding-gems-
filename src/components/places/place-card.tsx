'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Clock, Shield, Wallet, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn, formatDistance, formatPrice, getScoreColor, getScoreBgColor } from '@/lib/utils';
import type { Place } from '@/types';

interface PlaceCardProps {
  place: Place;
  onSelect?: (place: Place) => void;
  isSelected?: boolean;
  variant?: 'default' | 'compact' | 'featured';
}

export function PlaceCard({ place, onSelect, isSelected, variant = 'default' }: PlaceCardProps) {
  const [imageError, setImageError] = useState(false);

  const categoryEmoji =
    {
      property: '🏠',
      food: '🍽️',
      entertainment: '🎭',
      lifestyle: '💆',
      shopping: '🛍️',
      essentials: '🏥',
      education: '📚',
      outdoor: '🌲',
    }[place.category] || '📍';

  if (variant === 'compact') {
    return (
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => onSelect?.(place)}
        className={cn(
          'w-full text-left transition-colors rounded-xl',
          isSelected && 'ring-2 ring-primary ring-offset-2'
        )}
      >
        <Card className="overflow-hidden">
          <div className="flex items-center gap-3 p-3">
            <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
              {!imageError && place.imageUrl ? (
                <img
                  src={place.imageUrl}
                  alt={place.name}
                  className="h-full w-full object-cover"
                  onError={() => setImageError(true)}
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl bg-muted">
                  {categoryEmoji}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm truncate">{place.name}</p>
                {place.isGem && <span className="text-xs">💎</span>}
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">
                  {place.distanceM ? formatDistance(place.distanceM) : place.city}
                </span>
                {place.averageRating > 0 && (
                  <>
                    <Star className="h-3 w-3 flex-shrink-0 text-yellow-500 fill-yellow-500" />
                    <span>{place.averageRating}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
      className={cn(isSelected && 'ring-2 ring-primary ring-offset-2 rounded-2xl')}
    >
      <Card
        className={cn(
          'overflow-hidden cursor-pointer transition-all',
          place.isGem && 'border-gem/30 shadow-lg shadow-gem/5'
        )}
        onClick={() => onSelect?.(place)}
        role="article"
        aria-label={`${place.name} - ${place.category}`}
      >
        {/* Image */}
        <div className="relative h-40 overflow-hidden bg-muted">
          {!imageError && place.imageUrl ? (
            <img
              src={place.imageUrl}
              alt={place.name}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-6xl bg-gradient-to-br from-primary/10 to-accent/10">
              {categoryEmoji}
            </div>
          )}
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {place.isGem && (
              <Badge variant="gem" className="animate-pulse">
                💎 Hidden Gem
              </Badge>
            )}
            {place.isFeatured && (
              <Badge variant="signal" className="animate-pulse">
                ✨ Featured
              </Badge>
            )}
          </div>
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="backdrop-blur-sm bg-black/40 text-white border-0">
              {place.category}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Title & Distance */}
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-foreground leading-tight line-clamp-1">{place.name}</h3>
              {place.distanceM && (
                <span className="text-xs text-muted-foreground flex-shrink-0 font-medium">
                  {formatDistance(place.distanceM)}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {place.address || place.city || 'Nairobi'}
            </p>
          </div>

          {/* Description */}
          {place.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {place.description}
            </p>
          )}

          {/* Scores Preview */}
          <div className="flex flex-wrap gap-1.5">
            {place.scores.safety && (
              <span className={cn('inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded', getScoreBgColor(place.scores.safety))}>
                <Shield className="h-3 w-3" />
                {place.scores.safety}
              </span>
            )}
            {place.scores.affordability && (
              <span className={cn('inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded', getScoreBgColor(place.scores.affordability))}>
                <Wallet className="h-3 w-3" />
                {place.scores.affordability}
              </span>
            )}
            {place.scores.popularity && (
              <span className={cn('inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded', getScoreBgColor(place.scores.popularity))}>
                <TrendingUp className="h-3 w-3" />
                {place.scores.popularity}
              </span>
            )}
          </div>

          {/* Price */}
          {(place.priceMin || place.priceMax) && (
            <p className="text-sm font-semibold text-foreground">
              {formatPrice(place.priceMin, place.priceMax)}
            </p>
          )}

          {/* Amenities */}
          {place.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {place.amenities.slice(0, 3).map((amenity) => (
                <span
                  key={amenity}
                  className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground"
                >
                  {amenity.replace(/_/g, ' ')}
                </span>
              ))}
              {place.amenities.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{place.amenities.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* CTA */}
          <Button variant="outline" size="sm" className="w-full mt-2">
            View Details
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}