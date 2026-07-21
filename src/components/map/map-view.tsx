'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ZoomIn, ZoomOut, Navigation, Layers, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useMapStore, usePlaceStore } from '@/store';
import type { Place } from '@/types';

// Since we can't actually load Mapbox on server/without token,
// we render a beautiful mock map with place pins
export function MapView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { userLocation, mapCenter, zoom, setMapCenter, setSelectedPlaceId } = useMapStore();
  const { places, selectedPlace, setSelectedPlace } = usePlaceStore();
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isLocating, setIsLocating] = useState(false);

  const center = userLocation || mapCenter;
  const scale = Math.max(0.5, Math.min(3, zoom / 12));

  const requestLocation = useCallback(() => {
    setIsLocating(true);
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
          setIsLocating(false);
        },
        () => {
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setIsLocating(false);
    }
  }, []);

  const handleDrag = useCallback(
    (e: React.MouseEvent) => {
      if (e.buttons !== 1) return;
      setPanOffset((prev) => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY,
      }));
    },
    []
  );

  return (
    <div className="relative w-full h-full bg-[#1a1b2e] overflow-hidden" ref={containerRef}>
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: `${30 * scale}px ${30 * scale}px`,
          transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
        }}
        onMouseMove={handleDrag}
      />

      {/* Places as dots */}
      <div
        className="absolute inset-0"
        style={{ transform: `translate(${panOffset.x}px, ${panOffset.y}px)` }}
      >
        {places.map((place) => {
          const dx = (place.longitude - center.lng) * 50000 * scale;
          const dy = (center.lat - place.latitude) * 50000 * scale;
          const isSelected = selectedPlace?.id === place.id;

          return (
            <motion.button
              key={place.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: Math.random() * 0.3 }}
              onClick={() => setSelectedPlace(place)}
              className={cn(
                'absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer',
                isSelected && 'z-10'
              )}
              style={{
                left: `calc(50% + ${dx}px)`,
                top: `calc(50% + ${dy}px)`,
              }}
              aria-label={place.name}
            >
              {isSelected ? (
                <motion.div
                  layoutId="selectedPin"
                  className="relative"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="h-8 w-8 rounded-full bg-primary border-2 border-background shadow-lg flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                </motion.div>
              ) : (
                <div
                  className={cn(
                    'h-3 w-3 rounded-full border-2 border-background shadow-md transition-all hover:scale-150',
                    place.isGem
                      ? 'bg-gem animate-pulse'
                      : place.isFeatured
                      ? 'bg-signal-trending'
                      : place.category === 'food'
                      ? 'bg-yellow-500'
                      : place.category === 'entertainment'
                      ? 'bg-purple-500'
                      : place.category === 'property'
                      ? 'bg-blue-500'
                      : place.category === 'shopping'
                      ? 'bg-pink-500'
                      : place.category === 'lifestyle'
                      ? 'bg-emerald-500'
                      : place.category === 'outdoor'
                      ? 'bg-green-500'
                      : place.category === 'essentials'
                      ? 'bg-red-500'
                      : 'bg-cyan-500'
                  )}
                >
                  {/* Place label on hover */}
                  <div className="absolute left-4 top-0 bg-background/90 backdrop-blur-sm px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow text-foreground">
                    {place.name}
                  </div>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Watermark / attribution */}
      <div className="absolute bottom-2 left-2 text-xs text-white/20">
        Gems Signals Map © 2024
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button
          variant="secondary"
          size="icon-sm"
          className="shadow-lg bg-background/80 backdrop-blur-md"
          onClick={() => useMapStore.getState().setZoom(zoom + 2)}
          aria-label="Zoom in"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon-sm"
          className="shadow-lg bg-background/80 backdrop-blur-md"
          onClick={() => useMapStore.getState().setZoom(Math.max(4, zoom - 2))}
          aria-label="Zoom out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon-sm"
          className="shadow-lg bg-background/80 backdrop-blur-md mt-2"
          onClick={requestLocation}
          disabled={isLocating}
          aria-label="Find my location"
        >
          {isLocating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Navigation className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* No places state */}
      {places.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-6 rounded-2xl bg-background/80 backdrop-blur-md">
            <MapPin className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No places found in this area</p>
            <p className="text-xs text-muted-foreground/50">Try expanding your search radius</p>
          </div>
        </div>
      )}
    </div>
  );
}