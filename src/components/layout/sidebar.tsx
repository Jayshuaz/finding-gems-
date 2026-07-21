'use client';

import { motion } from 'framer-motion';
import {
  Compass,
  Zap,
  CalendarDays,
  Gem,
  Search,
  MapPin,
  SlidersHorizontal,
  Sparkles,
  User,
  Settings,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useUIStore, useSearchStore, useConciergeStore } from '@/store';
import type { PlaceCategory } from '@/types';

const categories: { value: PlaceCategory | null; label: string; icon: string }[] = [
  { value: null, label: 'All', icon: '🌍' },
  { value: 'food', label: 'Food', icon: '🍽️' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎭' },
  { value: 'lifestyle', label: 'Lifestyle', icon: '💆' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️' },
  { value: 'property', label: 'Property', icon: '🏠' },
  { value: 'outdoor', label: 'Outdoor', icon: '🌲' },
  { value: 'essentials', label: 'Essentials', icon: '🏥' },
  { value: 'education', label: 'Education', icon: '📚' },
];

const navItems = [
  { id: 'explore' as const, label: 'Explore', icon: Compass },
  { id: 'signals' as const, label: 'Signals', icon: Zap },
  { id: 'events' as const, label: 'Events', icon: CalendarDays },
  { id: 'gems' as const, label: 'Hidden Gems', icon: Gem },
];

export function Sidebar() {
  const { sidebarOpen, activeTab, setActiveTab, setConciergeOpen } = useUIStore();
  const { query, category, radiusM, setQuery, setCategory, setRadiusM } = useSearchStore();

  return (
    <aside
      className={cn(
        'h-full flex flex-col border-r bg-card transition-all duration-300',
        sidebarOpen ? 'w-80' : 'w-0 overflow-hidden'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gem flex items-center justify-center">
              <Gem className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Gems Signals</h1>
              <p className="text-xs text-muted-foreground">Discover what's around you</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 space-y-3 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search places..."
              className="pl-9"
              aria-label="Search places"
            />
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.value || 'all'}
                onClick={() => setCategory(cat.value)}
                className={cn(
                  'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all',
                  category === cat.value
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/70'
                )}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Radius slider */}
          <div className="flex items-center gap-3">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <input
              type="range"
              min={500}
              max={20000}
              step={500}
              value={radiusM}
              onChange={(e) => setRadiusM(Number(e.target.value))}
              className="flex-1 h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
              aria-label="Search radius"
            />
            <span className="text-xs font-medium text-muted-foreground w-12 text-right">
              {radiusM >= 1000 ? `${(radiusM / 1000).toFixed(1)}km` : `${radiusM}m`}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-2 space-y-1" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                activeTab === item.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.id === 'gems' && (
                <span className="ml-auto text-xs bg-gem/20 text-gem px-1.5 py-0.5 rounded-full font-semibold">
                  NEW
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="flex-1" />

        {/* AI Concierge CTA */}
        <div className="p-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setConciergeOpen(true)}
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-gem to-purple-600 text-white text-left hover:shadow-lg hover:shadow-gem/30 transition-all group"
          >
            <Sparkles className="h-5 w-5 mb-2" />
            <p className="font-bold text-sm">Ask AI Concierge</p>
            <p className="text-xs text-white/70 mt-0.5">
              Find places with natural language
            </p>
          </motion.button>
        </div>

        {/* User footer */}
        <div className="p-4 border-t flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs font-medium">Guest User</p>
              <p className="text-xs text-muted-foreground">10 searches left</p>
            </div>
          </div>
          <Button variant="ghost" size="icon-sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}