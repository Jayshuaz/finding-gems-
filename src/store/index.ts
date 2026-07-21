import { create } from 'zustand';
import type { Place, Signal, Event, GeoPoint, PlaceCategory, UserPreferences } from '@/types';

interface MapState {
  userLocation: GeoPoint | null;
  mapCenter: GeoPoint;
  zoom: number;
  selectedPlaceId: string | null;
  setUserLocation: (location: GeoPoint) => void;
  setMapCenter: (center: GeoPoint) => void;
  setZoom: (zoom: number) => void;
  setSelectedPlaceId: (id: string | null) => void;
}

export const useMapStore = create<MapState>((set) => ({
  userLocation: null,
  mapCenter: { lat: -1.2921, lng: 36.8219 }, // Nairobi center
  zoom: 14,
  selectedPlaceId: null,
  setUserLocation: (location) => set({ userLocation: location }),
  setMapCenter: (center) => set({ mapCenter: center }),
  setZoom: (zoom) => set({ zoom }),
  setSelectedPlaceId: (id) => set({ selectedPlaceId: id }),
}));

interface PlaceState {
  places: Place[];
  loading: boolean;
  error: string | null;
  selectedPlace: Place | null;
  setPlaces: (places: Place[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedPlace: (place: Place | null) => void;
}

export const usePlaceStore = create<PlaceState>((set) => ({
  places: [],
  loading: false,
  error: null,
  selectedPlace: null,
  setPlaces: (places) => set({ places, loading: false, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
  setSelectedPlace: (place) => set({ selectedPlace: place }),
}));

interface SignalState {
  signals: Signal[];
  loading: boolean;
  error: string | null;
  setSignals: (signals: Signal[]) => void;
  addSignal: (signal: Signal) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useSignalStore = create<SignalState>((set) => ({
  signals: [],
  loading: false,
  error: null,
  setSignals: (signals) => set({ signals, loading: false, error: null }),
  addSignal: (signal) =>
    set((state) => ({ signals: [signal, ...state.signals].slice(0, 50) })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
}));

interface EventState {
  events: Event[];
  loading: boolean;
  error: string | null;
  setEvents: (events: Event[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useEventStore = create<EventState>((set) => ({
  events: [],
  loading: false,
  error: null,
  setEvents: (events) => set({ events, loading: false, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
}));

interface SearchState {
  query: string;
  category: PlaceCategory | null;
  radiusM: number;
  setQuery: (query: string) => void;
  setCategory: (category: PlaceCategory | null) => void;
  setRadiusM: (radius: number) => void;
  reset: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  category: null,
  radiusM: 5000,
  setQuery: (query) => set({ query }),
  setCategory: (category) => set({ category }),
  setRadiusM: (radiusM) => set({ radiusM }),
  reset: () => set({ query: '', category: null, radiusM: 5000 }),
}));

interface ConciergeState {
  isOpen: boolean;
  messages: { role: 'user' | 'assistant'; content: string; places?: Place[] }[];
  loading: boolean;
  streamText: string;
  setOpen: (isOpen: boolean) => void;
  addMessage: (msg: { role: 'user' | 'assistant'; content: string; places?: Place[] }) => void;
  setLoading: (loading: boolean) => void;
  setStreamText: (text: string) => void;
  clearMessages: () => void;
}

export const useConciergeStore = create<ConciergeState>((set) => ({
  isOpen: false,
  messages: [],
  loading: false,
  streamText: '',
  setOpen: (isOpen) => set({ isOpen }),
  addMessage: (msg) =>
    set((state) => ({ messages: [...state.messages, msg] })),
  setLoading: (loading) => set({ loading }),
  setStreamText: (streamText) => set({ streamText }),
  clearMessages: () => set({ messages: [], streamText: '' }),
}));

interface UIState {
  sidebarOpen: boolean;
  conciergeOpen: boolean;
  activeTab: 'explore' | 'signals' | 'events' | 'gems';
  darkMode: boolean;
  toggleSidebar: () => void;
  setConciergeOpen: (open: boolean) => void;
  setActiveTab: (tab: 'explore' | 'signals' | 'events' | 'gems') => void;
  toggleDarkMode: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  conciergeOpen: false,
  activeTab: 'explore',
  darkMode: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setConciergeOpen: (open) => set({ conciergeOpen: open }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
}));