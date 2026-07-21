'use client';

import { useCallback } from 'react';
import { useEventStore } from '@/store';
import { MOCK_EVENTS, MOCK_PLACES } from '@/lib/mock-data';
import type { Event } from '@/types';

export function useEvents() {
  const { events, loading, error, setEvents, setLoading, setError } = useEventStore();

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      // In production: await apiClient.get<Event[]>('/events', params);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const enriched: Event[] = MOCK_EVENTS.map((event) => {
        const venue = event.venueId
          ? MOCK_PLACES.find((p) => p.id === event.venueId)
          : null;
        return { ...event, venue: venue || undefined };
      });

      setEvents(enriched);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events');
    }
  }, [setEvents, setLoading, setError]);

  return {
    events,
    loading,
    error,
    fetchEvents,
  };
}