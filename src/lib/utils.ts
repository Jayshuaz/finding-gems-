import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

export function formatWalkingTime(minutes: number): string {
  if (minutes < 1) return 'Less than 1 min walk';
  if (minutes < 60) return `${Math.round(minutes)} min walk`;
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}min walk`;
}

export function formatPrice(priceMin: number | null, priceMax: number | null): string {
  if (priceMin === null && priceMax === null) return 'Price not available';
  const formatter = new Intl.NumberFormat('en-KE');
  if (priceMin !== null && priceMax !== null) {
    return `KSh ${formatter.format(priceMin)} - ${formatter.format(priceMax)}`;
  }
  if (priceMin !== null) return `From KSh ${formatter.format(priceMin)}`;
  return `Up to KSh ${formatter.format(priceMax!)}`;
}

export function formatTimeAgo(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return then.toLocaleDateString('en-KE', { month: 'short', day: 'numeric' });
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    property: '🏠', food: '🍽️', entertainment: '🎭', lifestyle: '💆',
    shopping: '🛍️', essentials: '🏥', education: '📚', outdoor: '🌲',
  };
  return icons[category] || '📍';
}

export function getScoreColor(score: number): string {
  if (score >= 8) return 'text-emerald-400';
  if (score >= 6) return 'text-yellow-400';
  if (score >= 4) return 'text-orange-400';
  return 'text-red-400';
}

export function getScoreBgColor(score: number): string {
  if (score >= 8) return 'bg-emerald-500/20 text-emerald-400';
  if (score >= 6) return 'bg-yellow-500/20 text-yellow-400';
  if (score >= 4) return 'bg-orange-500/20 text-orange-400';
  return 'bg-red-500/20 text-red-400';
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function calculateWalkingTime(distanceMeters: number): number {
  return distanceMeters / 80;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}