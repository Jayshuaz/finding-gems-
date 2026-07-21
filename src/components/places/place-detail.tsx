'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Shield,
  Wallet,
  TrendingUp,
  Star,
  Navigation,
  Heart,
  Share2,
  X,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn, formatDistance, formatPrice, formatWalkingTime, getScoreBgColor } from '@/lib/utils';
import type { Place } from '@/types';

interface PlaceDetailProps {
  place: Place;
  onClose: () => void;
  onNavigate?: (place: Place) => void;
}

export function PlaceDetail({ place, onClose, onNavigate }: PlaceDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'scores' | 'hours'>('overview');
  const [isSaved, setIsSaved] = useState(false);
  const [imageError, setImageError] = useState(false);

  const scoreLabels: Record<string, string> = {
    safety: 'Safety',
    affordability: 'Affordability',
    popularity: 'Popularity',
    investmentPotential: 'Investment Potential',
    walkability: 'Walkability',
    nightlife: 'Nightlife',
    familyFriendliness: 'Family Friendly',
    internetSpeed: 'Internet Speed',
    cleanliness: 'Cleanliness',
    accessibility: 'Accessibility',
    petFriendliness: 'Pet Friendly',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed inset-x-0 bottom-0 z-50 max-h-[90vh] overflow-y-auto rounded-t-3xl bg-background shadow-2xl md:max-w-md md:left-1/2 md:-translate-x-1/2"
      role="dialog"
      aria-modal="true"
      aria-label={`Details for ${place.name}`}
    >
      {/* Close handle + buttons */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md rounded-t-3xl pt-2 pb-2 px-4">
        <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-2" />
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close panel">
            <X className="h-4 w-4" />
          </Button>
          <div className="flex gap-1">
            <Button
              variant={isSaved ? 'gem' : 'ghost'}
              size="icon-sm"
              onClick={() => setIsSaved(!isSaved)}
              aria-label={isSaved ? 'Remove from saved' : 'Save place'}
            >
              <Heart className={cn('h-4 w-4', isSaved && 'fill-current')} />
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="Share">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-52 bg-muted mx-4 rounded-2xl overflow-hidden">
        {!imageError && place.imageUrl ? (
          <img
            src={place.imageUrl}
            alt={place.name}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-6xl bg-gradient-to-br from-primary/10 to-accent/10">
            {{
              property: '🏠',
              food: '🍽️',
              entertainment: '🎭',
              lifestyle: '💆',
              shopping: '🛍️',
              essentials: '🏥',
              education: '📚',
              outdoor: '🌲',
            }[place.category] || '📍'}
          </div>
        )}
        {place.isGem && (
          <div className="absolute top-3 left-3">
            <Badge variant="gem" className="animate-pulse">
              💎 Hidden Gem
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Title */}
        <div>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">{place.name}</h2>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="h-3.5 w-3.5" />
                {place.address || place.city}
                {place.distanceM && (
                  <>
                    <span className="mx-1">·</span>
                    <Navigation className="h-3 w-3" />
                    {formatDistance(place.distanceM)}
                    {place.walkingTimeMin && ` (${formatWalkingTime(place.walkingTimeMin)})`}
                  </>
                )}
              </p>
            </div>
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="h-5 w-5 fill-current" />
              <span className="font-bold">{place.averageRating}</span>
              <span className="text-xs text-muted-foreground">({place.reviewCount})</span>
            </div>
          </div>

          {place.gemExplanation && (
            <div className="mt-2 p-3 bg-gem/10 rounded-xl flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-gem flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gem leading-relaxed">{place.gemExplanation}</p>
            </div>
          )}
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 p-1 bg-muted rounded-xl">
          {(['overview', 'scores', 'hours'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'flex-1 py-2 text-sm font-medium rounded-lg transition-colors capitalize',
                activeTab === tab
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {place.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">{place.description}</p>
              )}

              {(place.priceMin || place.priceMax) && (
                <div className="p-3 bg-muted/50 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">Price Range</p>
                  <p className="font-bold text-lg">{formatPrice(place.priceMin, place.priceMax)}</p>
                </div>
              )}

              {place.amenities.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2 font-medium">Amenities</p>
                  <div className="flex flex-wrap gap-1.5">
                    {place.amenities.map((a) => (
                      <span
                        key={a}
                        className="text-xs bg-muted px-2.5 py-1 rounded-full text-foreground/80"
                      >
                        {a.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact */}
              <div className="flex flex-wrap gap-2">
                {place.phone && (
                  <Button variant="outline" size="sm">
                    <Phone className="h-3.5 w-3.5 mr-1.5" /> Call
                  </Button>
                )}
                {place.website && (
                  <Button variant="outline" size="sm">
                    <Globe className="h-3.5 w-3.5 mr-1.5" /> Website
                  </Button>
                )}
                {onNavigate && (
                  <Button variant="outline" size="sm" onClick={() => onNavigate(place)}>
                    <Navigation className="h-3.5 w-3.5 mr-1.5" /> Directions
                  </Button>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'scores' && (
            <motion.div
              key="scores"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2"
            >
              {Object.entries(place.scores)
                .filter(([, v]) => v !== undefined)
                .map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground capitalize">
                      {scoreLabels[key] || key}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-28 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all',
                            value >= 8
                              ? 'bg-emerald-500'
                              : value >= 6
                              ? 'bg-yellow-500'
                              : value >= 4
                              ? 'bg-orange-500'
                              : 'bg-red-500'
                          )}
                          style={{ width: `${value * 10}%` }}
                        />
                      </div>
                      <span className={cn('text-sm font-bold w-6 text-right', getScoreBgColor(value).split(' ')[1])}>
                        {value}
                      </span>
                    </div>
                  </div>
                ))}
            </motion.div>
          )}

          {activeTab === 'hours' && (
            <motion.div
              key="hours"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2"
            >
              {place.hours && Object.keys(place.hours).length > 0 ? (
                Object.entries(place.hours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between text-sm">
                    <span className="text-muted-foreground capitalize">{day}</span>
                    <span className="font-medium">{hours as string}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Hours not available
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Safe area padding */}
      <div className="h-8" />
    </motion.div>
  );
}