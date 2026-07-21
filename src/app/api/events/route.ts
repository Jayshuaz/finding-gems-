import { NextRequest, NextResponse } from 'next/server';
import { eventsFilterSchema } from '@/lib/validators';
import { MOCK_EVENTS, MOCK_PLACES } from '@/lib/mock-data';
import type { Event } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = {
      lat: parseFloat(searchParams.get('lat') || ''),
      lng: parseFloat(searchParams.get('lng') || ''),
      radiusM: searchParams.get('radiusM') ? parseInt(searchParams.get('radiusM')!) : 10000,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      category: searchParams.get('category') || undefined,
      cursor: searchParams.get('cursor') || undefined,
      pageSize: searchParams.get('pageSize') ? parseInt(searchParams.get('pageSize')!) : 20,
    };

    const validation = eventsFilterSchema.safeParse(params);
    if (!validation.success) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid parameters', details: validation.error.flatten().fieldErrors } },
        { status: 400 }
      );
    }

    const { pageSize, cursor } = validation.data;

    // Enrich events with venue
    const events: Event[] = MOCK_EVENTS.map((event) => {
      const venue = event.venueId ? MOCK_PLACES.find((p) => p.id === event.venueId) : null;
      return { ...event, venue: venue || undefined };
    });

    const cursorIndex = cursor ? events.findIndex((e) => e.id === cursor) : -1;
    const startIndex = cursorIndex >= 0 ? cursorIndex + 1 : 0;
    const paginated = events.slice(startIndex, startIndex + pageSize);
    const nextCursor = paginated.length === pageSize ? paginated[paginated.length - 1].id : null;

    return NextResponse.json({
      data: paginated,
      pagination: { nextCursor, hasMore: startIndex + pageSize < events.length },
    });
  } catch (error) {
    console.error('Events API error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch events' } },
      { status: 500 }
    );
  }
}