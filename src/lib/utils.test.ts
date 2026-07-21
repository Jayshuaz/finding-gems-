import { describe, it, expect } from 'vitest';
import {
  formatDistance,
  formatPrice,
  formatTimeAgo,
  calculateDistance,
  cn,
  truncate,
} from './utils';

describe('formatDistance', () => {
  it('formats meters correctly', () => {
    expect(formatDistance(500)).toBe('500m');
  });
  it('formats kilometers correctly', () => {
    expect(formatDistance(1500)).toBe('1.5km');
  });
  it('rounds meters', () => {
    expect(formatDistance(1234)).toBe('1.2km');
  });
});

describe('formatPrice', () => {
  it('handles both prices', () => {
    const result = formatPrice(1000, 5000);
    expect(result).toContain('1,000');
    expect(result).toContain('5,000');
  });
  it('handles min only', () => {
    expect(formatPrice(2000, null)).toContain('From');
    expect(formatPrice(2000, null)).toContain('2,000');
  });
  it('handles null prices', () => {
    expect(formatPrice(null, null)).toBe('Price not available');
  });
});

describe('calculateDistance', () => {
  it('returns 0 for same point', () => {
    expect(calculateDistance(0, 0, 0, 0)).toBe(0);
  });
  it('calculates approximate distance between Nairobi points', () => {
    // Nairobi CBD to Westlands (~3km)
    const distance = calculateDistance(-1.2921, 36.8219, -1.2645, 36.8047);
    expect(distance).toBeGreaterThan(2000);
    expect(distance).toBeLessThan(5000);
  });
});

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2');
  });
  it('handles conditionals', () => {
    expect(cn('base', true && 'active', false && 'inactive')).toBe('base active');
  });
});

describe('truncate', () => {
  it('truncates long strings', () => {
    expect(truncate('Hello World!', 5)).toBe('Hello...');
  });
  it('keeps short strings', () => {
    expect(truncate('Hi', 10)).toBe('Hi');
  });
});