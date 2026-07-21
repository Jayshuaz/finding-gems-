// Prisma seed script — populates development database with sample data
// Run: npx tsx prisma/seed.ts

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample places
  const places = await Promise.all([
    prisma.place.upsert({
      where: { id: 'plc_001' },
      update: {},
      create: {
        id: 'plc_001',
        name: 'Mamba Village Nairobi',
        category: 'food',
        subcategory: 'restaurant',
        description: 'Serene lakeside restaurant famous for fresh seafood and Nyama Choma.',
        latitude: -1.3512,
        longitude: 36.7496,
        address: 'Langata Road, Nairobi',
        city: 'Nairobi',
        country: 'KE',
        priceMin: 1500,
        priceMax: 5000,
        amenities: ['wifi', 'parking', 'outdoor_seating', 'family_friendly'],
        scores: { safety: 8, affordability: 7, popularity: 9 },
        source: 'manual',
        isGem: true,
        gemExplanation: 'Hidden treasure known mostly to locals.',
        reviewCount: 340,
        averageRating: 4.3,
        monthlyVisitors: 8200,
      },
    }),
    prisma.place.upsert({
      where: { id: 'plc_002' },
      update: {},
      create: {
        id: 'plc_002',
        name: 'The Alchemist Bar',
        category: 'entertainment',
        subcategory: 'bar',
        description: 'Westlands premium cocktail bar with rooftop views.',
        latitude: -1.2645,
        longitude: 36.8047,
        address: 'Parklands Road, Westlands, Nairobi',
        city: 'Nairobi',
        country: 'KE',
        priceMin: 800,
        priceMax: 6000,
        amenities: ['wifi', 'parking', 'rooftop', 'live_music'],
        scores: { safety: 9, affordability: 5, popularity: 9, nightlife: 10 },
        source: 'manual',
        isFeatured: true,
        reviewCount: 1200,
        averageRating: 4.6,
        monthlyVisitors: 15000,
      },
    }),
    prisma.place.upsert({
      where: { id: 'plc_003' },
      update: {},
      create: {
        id: 'plc_003',
        name: 'Karura Forest Reserve',
        category: 'outdoor',
        subcategory: 'park',
        description: '1,000 hectares of urban forest with trails and waterfalls.',
        latitude: -1.2325,
        longitude: 36.8325,
        address: 'Limuru Road, Nairobi',
        city: 'Nairobi',
        country: 'KE',
        priceMin: 200,
        priceMax: 600,
        amenities: ['parking', 'bike_trails', 'walking_trails'],
        scores: { safety: 9, affordability: 9, popularity: 8, familyFriendliness: 9 },
        source: 'manual',
        reviewCount: 5200,
        averageRating: 4.7,
        monthlyVisitors: 35000,
      },
    }),
  ]);

  // Create sample signals
  await Promise.all([
    prisma.signal.upsert({
      where: { id: 'sig_001' },
      update: {},
      create: {
        id: 'sig_001',
        type: 'new_place',
        placeId: 'plc_001',
        title: 'New listing: Mamba Village',
        body: 'Check out this lakeside gem.',
        score: 0.92,
        expiresAt: new Date('2024-03-15'),
      },
    }),
    prisma.signal.upsert({
      where: { id: 'sig_002' },
      update: {},
      create: {
        id: 'sig_002',
        type: 'event_upcoming',
        placeId: 'plc_002',
        title: 'Friday Live Jazz at The Alchemist',
        body: 'Live jazz and happy hour.',
        score: 0.87,
        expiresAt: new Date('2024-03-09T23:00:00'),
      },
    }),
  ]);

  // Create sample events
  await Promise.all([
    prisma.event.upsert({
      where: { id: 'evt_001' },
      update: {},
      create: {
        id: 'evt_001',
        title: 'Nairobi Restaurant Week 2024',
        description: '10-day culinary festival at 50+ restaurants.',
        venueId: 'plc_001',
        startTime: new Date('2024-03-15T10:00:00'),
        endTime: new Date('2024-03-24T22:00:00'),
        category: 'food',
        priceMin: 1200,
        priceMax: 4500,
        source: 'manual',
      },
    }),
    prisma.event.upsert({
      where: { id: 'evt_002' },
      update: {},
      create: {
        id: 'evt_002',
        title: 'Sauti Sol Acoustic at The Alchemist',
        description: 'Intimate rooftop acoustic set.',
        venueId: 'plc_002',
        startTime: new Date('2024-03-16T19:00:00'),
        endTime: new Date('2024-03-16T23:00:00'),
        category: 'music',
        priceMin: 3000,
        priceMax: 8000,
        source: 'manual',
      },
    }),
  ]);

  console.log('✅ Seed completed successfully!');
  console.log(`   Created ${places.length} places, signals, and events.`);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });