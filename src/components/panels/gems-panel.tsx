'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Gem, Sparkles, RefreshCw } from 'lucide-react';
import { PlaceCard } from '@/components/places/place-card';
import { PlaceCardSkeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePlaceStore } from '@/store';
import { MOCK_PLACES } from '@/lib/mock-data';
import { calculateDistance, calculateWalkingTime } from '@/lib/utils';
import type { Place } from '@/types';

export function GemsPanel() {
  const [gems, setGems] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedPlace, setSelectedPlace } = usePlaceStore();

  const fetchGems = () => {
    setLoading(true);
    setError(null);

    // Simulate fetch
    setTimeout(() => {
      try {
        const gemPlaces = MOCK_PLACES.filter((p) => p.isGem).map((p) => {
          const distanceM = calculateDistance(-1.2921, 36.8219, p.latitude, p.longitude);
          return {
            ...p,
            distanceM: Math.round(distanceM),
            walkingTimeMin: Math.round(calculateWalkingTime(distanceM)),
          };
        });
        setGems(gemPlaces);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load gems');
        setLoading(false);
      }
    }, 800);
  };

  useEffect(() => {
    fetchGems();
  }, []);

  return (
    <div className="h-full w-full md:w-96 bg-background/95 backdrop-blur-md border-r overflow-y-auto">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gem/20 flex items-center justify-center">
              <Gem className="h-4 w-4 text-gem" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Hidden Gems</h2>
              <p className="text-xs text-muted-foreground">AI-discovered underrated places</p>
            </div>
          </div>
          <Badge variant="gem">Beta</Badge>
        </div>

        <div className="p-4 rounded-2xl bg-gem/5 border border-gem/20">
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-gem flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Our AI scans for exceptional places with high ratings but low visitor counts, off the
              beaten path, and beloved by locals. Gems refresh every 24 hours.
            </p>
          </div>
        </div>

        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <PlaceCardSkeleton key={i} />
            ))}
          </div>
        )}

        {error && <ErrorState message={error} onRetry={fetchGems} />}

        {!loading && !error && gems.length === 0 && (
          <EmptyState
            icon="💎"
            title="No gems today"
            description="Our AI is still analyzing your area. Gems appear when we find truly exceptional underrated spots."
            action={
              <Button variant="gem" onClick={fetchGems}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Check Again
              </Button>
            }
          />
        )}

        {!loading && !error && gems.length > 0 && (
          <div className="space-y-3">
            {gems.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                onSelect={setSelectedPlace}
                isSelected={selectedPlace?.id === place.id}
                variant="default"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}