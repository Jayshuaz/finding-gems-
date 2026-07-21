'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, RefreshCw } from 'lucide-react';
import { EventCard } from '@/components/events/event-card';
import { EventCardSkeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { Button } from '@/components/ui/button';
import { useEvents } from '@/hooks/use-events';

export function EventsPanel() {
  const { events, loading, error, fetchEvents } = useEvents();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const upcoming = events.filter((e) => new Date(e.startTime) > new Date());

  return (
    <div className="h-full w-full md:w-96 bg-background/95 backdrop-blur-md border-r overflow-y-auto">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <CalendarDays className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Events</h2>
              <p className="text-xs text-muted-foreground">
                {upcoming.length} upcoming event{upcoming.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={fetchEvents} title="Refresh events">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {loading && events.length === 0 && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        )}

        {error && <ErrorState message={error} onRetry={fetchEvents} />}

        {!loading && !error && events.length === 0 && (
          <EmptyState
            icon="📅"
            title="No events found"
            description="No upcoming events in your area. Check back later or expand your search."
            action={
              <Button variant="outline" onClick={fetchEvents}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            }
          />
        )}

        {!error && events.length > 0 && (
          <div className="space-y-4">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}