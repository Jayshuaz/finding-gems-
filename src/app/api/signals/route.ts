import { NextRequest, NextResponse } from 'next/server';
import { signalFeedSchema } from '@/lib/validators';
import { MOCK_SIGNALS, MOCK_PLACES } from '@/lib/mock-data';
import type { Signal } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = {
      lat: parseFloat(searchParams.get('lat') || ''),
      lng: parseFloat(searchParams.get('lng') || ''),
      radiusM: searchParams.get('radiusM') ? parseInt(searchParams.get('radiusM')!) : 5000,
      cursor: searchParams.get('cursor') || undefined,
      pageSize: searchParams.get('pageSize') ? parseInt(searchParams.get('pageSize')!) : 20,
    };

    const validation = signalFeedSchema.safeParse(params);
    if (!validation.success) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid parameters', details: validation.error.flatten().fieldErrors } },
        { status: 400 }
      );
    }

    const { pageSize, cursor } = validation.data;

    // Enrich signals with place data
    const signals: Signal[] = MOCK_SIGNALS.map((signal) => {
      const place = signal.placeId ? MOCK_PLACES.find((p) => p.id === signal.placeId) : null;
      return { ...signal, place: place || undefined };
    });

    // Cursor pagination
    const cursorIndex = cursor ? signals.findIndex((s) => s.id === cursor) : -1;
    const startIndex = cursorIndex >= 0 ? cursorIndex + 1 : 0;
    const paginated = signals.slice(startIndex, startIndex + pageSize);

    const nextCursor = paginated.length === pageSize ? paginated[paginated.length - 1].id : null;

    return NextResponse.json({
      data: paginated,
      pagination: { nextCursor, hasMore: startIndex + pageSize < signals.length },
    });
  } catch (error) {
    console.error('Signals API error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch signals' } },
      { status: 500 }
    );
  }
}