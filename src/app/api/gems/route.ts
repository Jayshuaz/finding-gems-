import { NextRequest, NextResponse } from 'next/server';
import { MOCK_PLACES } from '@/lib/mock-data';
import { calculateDistance, calculateWalkingTime } from '@/lib/utils';
import type { Place } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || '-1.2921');
    const lng = parseFloat(searchParams.get('lng') || '36.8219');

    const gems = MOCK_PLACES.filter((p) => p.isGem).map((p) => {
      const dm = calculateDistance(lat, lng, p.latitude, p.longitude);
      return { ...p, distanceM: Math.round(dm), walkingTimeMin: Math.round(calculateWalkingTime(dm)) };
    });

    return NextResponse.json({
      data: gems,
      meta: { totalResults: gems.length },
    });
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch gems' } },
      { status: 500 }
    );
  }
}