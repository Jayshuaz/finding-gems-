'use client';

import { useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Loader2, RefreshCw } from 'lucide-react';
import { PlaceCard } from '@/components/places/place-card';
import { PlaceCardSkeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { Button } from '@/components/ui/button';
import { usePlaces } from '@/hooks/use-places';
import { usePlaceStore, useSearchStore } from '@/store';

export function ExplorePanel() {
  const { places, loading, error, refetch } = usePlaces();
  const { selectedPlace, setSelectedPlace } = usePlaceStore();
  const { query, category, radiusM } = useSearchStore();
  const panelRef = useRef<HTMLDivElement>(null);

  const filteredPlaces = places.filter((p) => {
    if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
    if (category && p.category !== category) return false;
    return true;
  });

  return (
    <div
      ref={panelRef}
      className="h-full w-full md:w-96 bg-background/95 backdrop-blur-md border-r overflow-y-auto"
    >
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Explore Nearby</h2>
          <span className="text-sm text-muted-foreground">
            {places.length} place{places.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <PlaceCardSkeleton key={i} />
            ))}
          </div>
        )}

        {error && <ErrorState message={error} onRetry={refetch} />}

        {!loading && !error && filteredPlaces.length === 0 && (
          <EmptyState
            icon="🔍"
            title="No places found"
            description={
              query || category
                ? 'Try adjusting your search or filters'
                : 'No places discovered in this area yet. Try expanding the radius.'
            }
            action={
              <Button variant="outline" onClick={refetch}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            }
          />
        )}

        {!loading && !error && filteredPlaces.length > 0 && (
          <div className="space-y-3">
            {filteredPlaces.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                onSelect={setSelectedPlace}
                isSelected={selectedPlace?.id === place.id}
                variant="compact"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}