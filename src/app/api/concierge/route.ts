import { NextRequest, NextResponse } from 'next/server';
import { conciergeQuerySchema } from '@/lib/validators';
import { MOCK_PLACES } from '@/lib/mock-data';
import { calculateDistance, calculateWalkingTime } from '@/lib/utils';
import type { Place, ExtractedParams } from '@/types';

function extractParams(query: string): ExtractedParams {
  const q = query.toLowerCase();
  const params: ExtractedParams = {};

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

  if (q.match(/rooftop/i)) params.subcategory = 'rooftop';
  if (q.match(/cafe|coffee/i)) params.subcategory = 'cafe';

  const priceMatch = q.match(/under\s*(?:KSh|KES)?\s*(\d[\d,]*)/i);
  if (priceMatch) params.maxPrice = parseInt(priceMatch[1].replace(/,/g, ''));

  return params;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = conciergeQuerySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid query', details: validation.error.flatten().fieldErrors } },
        { status: 400 }
      );
    }

    const { query, lat, lng, radiusM } = validation.data;

    // Extract structured params (in production: use OpenAI)
    const params = extractParams(query);

    const center = { lat: lat || -1.2921, lng: lng || 36.8219 };
    let results = [...MOCK_PLACES];

    if (params.category) results = results.filter((p) => p.category === params.category);
    if (params.subcategory)
      results = results.filter((p) => p.subcategory?.toLowerCase() === params.subcategory?.toLowerCase());
    if (params.maxPrice) results = results.filter((p) => (p.priceMin || 0) <= params.maxPrice!);

    const withDistances: Place[] = results.map((p) => {
      const dm = calculateDistance(center.lat, center.lng, p.latitude, p.longitude);
      return { ...p, distanceM: Math.round(dm), walkingTimeMin: Math.round(calculateWalkingTime(dm)) };
    });

    const sorted = withDistances.sort((a, b) => (a.distanceM || 0) - (b.distanceM || 0));
    const top = sorted.slice(0, 5);

    const explanation =
      top.length > 0
        ? `Found ${top.length} ${params.category || 'place'}${top.length > 1 ? 's' : ''} nearby${
            params.maxPrice ? ` under KSh ${params.maxPrice.toLocaleString()}` : ''
          }.`
        : 'No exact matches found. Try broadening your search.';

    return NextResponse.json({
      data: {
        places: top,
        explanation,
        extractedParams: params,
      },
    });
  } catch (error) {
    console.error('Concierge API error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to process query' } },
      { status: 500 }
    );
  }
}