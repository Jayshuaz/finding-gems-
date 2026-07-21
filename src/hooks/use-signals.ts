'use client';

import { useCallback } from 'react';
import { useSignalStore, useMapStore } from '@/store';
import { MOCK_SIGNALS, MOCK_PLACES } from '@/lib/mock-data';
import type { Signal } from '@/types';

export function useSignals() {
  const { signals, loading, error, setSignals, setLoading, setError } = useSignalStore();
  const userLocation = useMapStore((s) => s.userLocation);

  const fetchSignals = useCallback(async () => {
    setLoading(true);
    try {
      // In production: await apiClient.get<Signal[]>('/signals', { lat, lng, radiusM });
      await new Promise((resolve) => setTimeout(resolve, 500));

      const enriched: Signal[] = MOCK_SIGNALS.map((signal) => {
        const place = signal.placeId
          ? MOCK_PLACES.find((p) => p.id === signal.placeId)
          : null;
        return { ...signal, place: place || undefined };
      });

      setSignals(enriched);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load signals');
    }
  }, [setSignals, setLoading, setError, userLocation]);

  return {
    signals,
    loading,
    error,
    fetchSignals,
  };
}