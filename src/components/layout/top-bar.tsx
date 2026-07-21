'use client';

import { Menu, MapPin, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUIStore, useMapStore } from '@/store';

export function TopBar() {
  const { toggleSidebar, activeTab, setConciergeOpen } = useUIStore();
  const userLocation = useMapStore((s) => s.userLocation);

  return (
    <header className="h-14 border-b bg-background/95 backdrop-blur-md flex items-center justify-between px-4 gap-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" onClick={toggleSidebar} aria-label="Toggle sidebar">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden sm:flex items-center gap-1.5 text-sm">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          <span className="text-muted-foreground">
            {userLocation ? (
              <>
                {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
              </>
            ) : (
              'Nairobi, KE'
            )}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon-sm" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-signal-trending rounded-full" />
        </Button>
        <Badge variant="secondary" className="hidden sm:inline-flex">
          {activeTab === 'explore' && 'Explore'}
          {activeTab === 'signals' && 'Signal Feed'}
          {activeTab === 'events' && 'Events'}
          {activeTab === 'gems' && 'Hidden Gems'}
        </Badge>
      </div>
    </header>
  );
}