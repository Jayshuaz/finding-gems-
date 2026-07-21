import { NextRequest, NextResponse } from 'next/server';
import { placeFilterSchema } from '@/lib/validators';
import { MOCK_PLACES } from '@/lib/mock-data';
import { calculateDistance, calculateWalkingTime } from '@/lib/utils';
import type { Place } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = {
      lat: parseFloat(searchParams.get('lat') || ''),
      lng: parseFloat(searchParams.get('lng') || ''),
      radiusM: searchParams.get('radiusM') ? parseInt(searchParams.get('radiusM')!) : 5000,
      category: searchParams.get('category') || undefined,
      subcategory: searchParams.get('subcategory') || undefined,
      minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
      query: searchParams.get('query') || undefined,
      cursor: searchParams.get('cursor') || undefined,
      pageSize: searchParams.get('pageSize') ? parseInt(searchParams.get('pageSize')!) : 20,
    };

    const validation = placeFilterSchema.safeParse(params);
    if (!validation.success) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid parameters', details: validation.error.flatten().fieldErrors } },
        { status: 400 }
      );
    }

    const { lat, lng, radiusM, category, pageSize, cursor } = validation.data;

    // Filter places
    let places = [...MOCK_PLACES];

    if (category) {
      places = places.filter((p) => p.category === category);
    }

    // Compute distances
    const withDistances: Place[] = places.map((p) => {
      const distanceM = calculateDistance(lat, lng, p.latitude, p.longitude);
      return {
        ...p,
        distanceM: Math.round(distanceM),
        walkingTimeMin: Math.round(calculateWalkingTime(distanceM)),
      };
    });

    // Filter by radius
    const withinRadius = withDistances.filter((p) => (p.distanceM || 0) <= radiusM);

    // Sort by distance
    const sorted = withinRadius.sort((a, b) => (a.distanceM || 99999) - (b.distanceM || 99999));

    // Cursor-based pagination
    const cursorIndex = cursor ? sorted.findIndex((p) => p.id === cursor) : -1;
    const startIndex = cursorIndex >= 0 ? cursorIndex + 1 : 0;
    const paginated = sorted.slice(startIndex, startIndex + pageSize);

    const nextCursor = paginated.length === pageSize ? paginated[paginated.length - 1].id : null;

    return NextResponse.json({
      data: paginated,
      pagination: {
        nextCursor,
        hasMore: startIndex + pageSize < sorted.length,
      },
      meta: {
        totalResults: sorted.length,
        searchRadiusM: radiusM,
      },
    });
  } catch (error) {
    console.error('Places API error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch places' } },
      { status: 500 }
    );
  }
}