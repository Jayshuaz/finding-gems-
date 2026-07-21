'use client';

import { useCallback, useEffect, useRef } from 'react';
import { usePlaceStore, useMapStore, useSearchStore } from '@/store';
import { MOCK_PLACES } from '@/lib/mock-data';
import { calculateDistance, calculateWalkingTime } from '@/lib/utils';
import type { Place } from '@/types';

export function usePlaces() {
  const { places, loading, error, setPlaces, setLoading, setError, setSelectedPlace } =
    usePlaceStore();
  const userLocation = useMapStore((s) => s.userLocation);
  const { category, radiusM } = useSearchStore();
  const fetchedRef = useRef(false);

  const fetchPlaces = useCallback(async () => {
    setLoading(true);
    try {
      // In production, this would call the API
      // const response = await apiClient.get<Place[]>('/places', { lat, lng, radiusM, category });
      // setPlaces(response.data);

      // For now, use mock data with computed distances
      await new Promise((resolve) => setTimeout(resolve, 600));

      const center = userLocation || { lat: -1.2921, lng: 36.8219 };

      let filtered = MOCK_PLACES;
      if (category) {
        filtered = filtered.filter((p) => p.category === category);
      }

      const withDistances: Place[] = filtered.map((p) => {
        const distanceM = calculateDistance(
          center.lat,
          center.lng,
          p.latitude,
          p.longitude
        );
        return {
          ...p,
          distanceM: Math.round(distanceM),
          walkingTimeMin: Math.round(calculateWalkingTime(distanceM)),
        };
      });

      const sorted = withDistances.sort((a, b) => (a.distanceM || 99999) - (b.distanceM || 99999));
      setPlaces(sorted.filter((p) => (p.distanceM || 0) <= radiusM));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load places');
    }
  }, [setPlaces, setLoading, setError, userLocation, category, radiusM]);

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      fetchPlaces();
    }
  }, [fetchPlaces]);

  const refetch = useCallback(() => {
    fetchedRef.current = false;
    fetchPlaces();
  }, [fetchPlaces]);

  return {
    places,
    loading,
    error,
    refetch,
    selectPlace: setSelectedPlace,
  };
}