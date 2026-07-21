'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/components/layout/sidebar';
import { TopBar } from '@/components/layout/top-bar';
import { MapView } from '@/components/map/map-view';
import { ExplorePanel } from '@/components/panels/explore-panel';
import { SignalsPanel } from '@/components/panels/signals-panel';
import { EventsPanel } from '@/components/panels/events-panel';
import { GemsPanel } from '@/components/panels/gems-panel';
import { ConciergePanel } from '@/components/concierge/concierge-panel';
import { PlaceDetail } from '@/components/places/place-detail';
import { useUIStore, usePlaceStore, useMapStore } from '@/store';
import { usePlaces } from '@/hooks/use-places';
import { useSignals } from '@/hooks/use-signals';
import { useEvents } from '@/hooks/use-events';

export default function HomePage() {
  const { activeTab } = useUIStore();
  const { selectedPlace, setSelectedPlace } = usePlaceStore();
  const { places, loading, error, refetch } = usePlaces();
  const { signals, fetchSignals } = useSignals();
  const { events, fetchEvents } = useEvents();

  // Fetch data on mount
  useEffect(() => {
    fetchSignals();
    fetchEvents();
  }, [fetchSignals, fetchEvents]);

  // Request geolocation
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          useMapStore.getState().setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          useMapStore.getState().setMapCenter({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          // Default to Nairobi center
        },
        { enableHighAccuracy: false, timeout: 8000 }
      );
    }
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <TopBar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {/* Map Background */}
          <div className="absolute inset-0">
            <MapView />
          </div>

          {/* Overlay Panel */}
          <div className="relative z-10 flex-1 pointer-events-none">
            <div className="pointer-events-auto h-full">
              <AnimatePresence mode="wait">
                {activeTab === 'explore' && <ExplorePanel key="explore" />}
                {activeTab === 'signals' && <SignalsPanel key="signals" />}
                {activeTab === 'events' && <EventsPanel key="events" />}
                {activeTab === 'gems' && <GemsPanel key="gems" />}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>

      {/* Bottom Sheet / Place Detail */}
      <AnimatePresence>
        {selectedPlace && (
          <PlaceDetail
            key={selectedPlace.id}
            place={selectedPlace}
            onClose={() => setSelectedPlace(null)}
          />
        )}
      </AnimatePresence>

      {/* AI Concierge Panel */}
      <ConciergePanel />
    </div>
  );
}