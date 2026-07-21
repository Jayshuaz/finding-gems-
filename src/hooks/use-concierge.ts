'use client';

import { useCallback } from 'react';
import { useConciergeStore, useMapStore } from '@/store';
import { usePlaceStore } from '@/store';
import { MOCK_PLACES } from '@/lib/mock-data';
import { calculateDistance, calculateWalkingTime } from '@/lib/utils';
import type { Place, ConciergeResult, ExtractedParams } from '@/types';

// Simple NLP keyword extraction for demo (in production, use OpenAI)
function extractParams(query: string): ExtractedParams {
  const q = query.toLowerCase();
  const params: ExtractedParams = {};

  // Category extraction
  if (q.match(/food|restaurant|cafe|eat|cuisine|dining|drink|bar|pub|coffee/i))
    params.category = 'food';
  else if (q.match(/entertainment|club|lounge|music|concert|show|cinema|movie/i))
    params.category = 'entertainment';
  else if (q.match(/property|apartment|house|rent|buy|land|hotel|airbnb/i))
    params.category = 'property';
  else if (q.match(/shopping|mall|shop|store|boutique|market|buy/i))
    params.category = 'shopping';
  else if (q.match(/outdoor|park|trail|hike|beach|camp|nature|forest/i))
    params.category = 'outdoor';
  else if (q.match(/hospital|clinic|doctor|police|bank|atm|pharmacy|fuel/i))
    params.category = 'essentials';
  else if (q.match(/spa|massage|gym|salon|yoga|workout|fitness|swim/i))
    params.category = 'lifestyle';
  else if (q.match(/school|university|college|library|study|learn/i))
    params.category = 'education';

  // Subcategory
  if (q.match(/rooftop/i)) params.subcategory = 'rooftop';
  if (q.match(/cafe|coffee/i)) params.subcategory = 'cafe';
  if (q.match(/fine dining|premium/i)) params.subcategory = 'fine_dining';
  if (q.match(/street food/i)) params.subcategory = 'street_food';

  // Price extraction
  const priceMatch = q.match(/under\s*(?:KSh|KES)?\s*(\d[\d,]*)/i);
  if (priceMatch) params.maxPrice = parseInt(priceMatch[1].replace(/,/g, ''));
  const minPriceMatch = q.match(/(?:above|over)\s*(?:KSh|KES)?\s*(\d[\d,]*)/i);
  if (minPriceMatch) params.minPrice = parseInt(minPriceMatch[1].replace(/,/g, ''));

  // Amenities
  const amenities: string[] = [];
  if (q.match(/wifi|internet/i)) amenities.push('wifi');
  if (q.match(/parking/i)) amenities.push('parking');
  if (q.match(/pool|swimming/i)) amenities.push('pool');
  if (q.match(/outdoor/i)) amenities.push('outdoor_seating');
  if (amenities.length) params.amenities = amenities;

  // Vibe
  if (q.match(/romantic|date/i)) params.vibe = 'romantic';
  if (q.match(/family|kids/i)) params.vibe = 'family';
  if (q.match(/quiet|calm|peaceful/i)) params.vibe = 'quiet';
  if (q.match(/lively|trending|popular|hot/i)) params.vibe = 'lively';

  return params;
}

function generateExplanation(places: Place[], params: ExtractedParams): string {
  if (places.length === 0) {
    return 'No exact matches found nearby. Try expanding your search radius or adjusting your filters.';
  }
  const count = places.length;
  const categoryLabel = params.category
    ? params.category.charAt(0).toUpperCase() + params.category.slice(1)
    : '';
  const distance = places[0].distanceM
    ? `${places[0].distanceM < 1000 ? `${Math.round(places[0].distanceM)}m` : `${(places[0].distanceM / 1000).toFixed(1)}km`}`
    : '';

  let explanation = `Found ${count} ${categoryLabel || 'place'}${count > 1 ? 's' : ''}`;
  if (distance) explanation += ` within about ${distance} of you`;
  if (params.maxPrice) explanation += ` under KSh ${params.maxPrice.toLocaleString()}`;
  if (params.amenities?.length) explanation += ` with ${params.amenities.join(', ')}`;
  if (params.vibe) explanation += ` in a ${params.vibe} setting`;
  explanation += '.';

  return explanation;
}

export function useConcierge() {
  const { isOpen, messages, loading, streamText, setOpen, addMessage, setLoading, setStreamText, clearMessages } =
    useConciergeStore();
  const userLocation = useMapStore((s) => s.userLocation);
  const setPlaces = usePlaceStore((s) => s.setPlaces);
  const setSelectedPlace = usePlaceStore((s) => s.setSelectedPlace);

  const sendQuery = useCallback(
    async (query: string) => {
      if (!query.trim()) return;

      addMessage({ role: 'user', content: query });
      setLoading(true);
      setStreamText('');

      try {
        // Extract parameters locally (in production, send to API which uses OpenAI)
        const params = extractParams(query);
        const center = userLocation || { lat: -1.2921, lng: 36.8219 };

        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Filter places based on extracted params
        let results = [...MOCK_PLACES];

        if (params.category) {
          results = results.filter((p) => p.category === params.category);
        }
        if (params.subcategory) {
          results = results.filter(
            (p) => p.subcategory?.toLowerCase() === params.subcategory?.toLowerCase()
          );
        }
        if (params.maxPrice) {
          results = results.filter((p) => (p.priceMin || 0) <= params.maxPrice!);
        }
        if (params.amenities?.length) {
          results = results.filter((p) =>
            params.amenities!.every((a) => p.amenities.includes(a))
          );
        }

        // Compute distances
        const withDistances: Place[] = results.map((p) => {
          const distanceM = calculateDistance(
            center.lat,
            center.lng,
            p.latitude,
            p.longitude
          );
          return {
            ...p,
            distanceM: Math.round(distanceM),
            walkingTimeMin: Math.round(calculateWalkingTime(distanceM)),
          };
        });

        const sorted = withDistances.sort((a, b) => (a.distanceM || 99999) - (b.distanceM || 99999));
        const topResults = sorted.slice(0, 5);

        const explanation = generateExplanation(topResults, params);

        setStreamText(explanation);

        await new Promise((resolve) => setTimeout(resolve, 500));

        addMessage({
          role: 'assistant',
          content: explanation,
          places: topResults,
        });

        setPlaces(topResults);
      } catch (err) {
        addMessage({
          role: 'assistant',
          content: 'Sorry, I had trouble processing your request. Please try again.',
        });
      } finally {
        setLoading(false);
        setStreamText('');
      }
    },
    [
      addMessage,
      setLoading,
      setStreamText,
      userLocation,
      setPlaces,
      setOpen,
    ]
  );

  return {
    isOpen,
    messages,
    loading,
    streamText,
    setOpen,
    sendQuery,
    clearMessages,
  };
}