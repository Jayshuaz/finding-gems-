'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, RefreshCw } from 'lucide-react';
import { SignalCard } from '@/components/signals/signal-card';
import { SignalSkeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { Button } from '@/components/ui/button';
import { useSignals } from '@/hooks/use-signals';

export function SignalsPanel() {
  const { signals, loading, error, fetchSignals } = useSignals();

  useEffect(() => {
    fetchSignals();
  }, [fetchSignals]);

  return (
    <div className="h-full w-full md:w-96 bg-background/95 backdrop-blur-md border-r overflow-y-auto">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-signal-new/20 flex items-center justify-center">
              <Zap className="h-4 w-4 text-signal-new" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Signal Feed</h2>
              <p className="text-xs text-muted-foreground">Real-time local opportunities</p>
            </div>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={fetchSignals} title="Refresh signals">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {loading && signals.length === 0 && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <SignalSkeleton key={i} />
            ))}
          </div>
        )}

        {error && <ErrorState message={error} onRetry={fetchSignals} />}

        {!loading && !error && signals.length === 0 && (
          <EmptyState
            icon="📡"
            title="No signals yet"
            description="We're monitoring your area for new opportunities. Check back soon!"
            action={
              <Button variant="outline" onClick={fetchSignals}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            }
          />
        )}

        {!error && signals.length > 0 && (
          <div className="space-y-3">
            {signals.map((signal, i) => (
              <SignalCard key={signal.id} signal={signal} index={i} />
            ))}
            <p className="text-xs text-muted-foreground text-center py-2">
              Showing {signals.length} signals · Updated just now
            </p>
          </div>
        )}
      </div>
    </div>
  );
}