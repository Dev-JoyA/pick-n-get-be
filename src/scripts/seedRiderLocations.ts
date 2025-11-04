import { database } from '../config/db.ts';
import { Rider } from '../models/riderModel.ts';

async function seedRiderLocations() {
  try {
    // Get all riders from MongoDB
    const riders = await Rider.find({});

    console.log(`Found ${riders.length} riders in MongoDB`);

    // Victoria Island, Lagos coordinates (approximate)
    const baseCoords = { lat: 6.4281, lng: 3.4219 };

    for (const rider of riders) {
      // Add slight variation to coordinates for each rider
      const lat = baseCoords.lat + (Math.random() - 0.5) * 0.1; // ~5km radius
      const lng = baseCoords.lng + (Math.random() - 0.5) * 0.1;

      await database.ref(`riders/${rider.id}`).set({
        lat,
        lng,
        lastUpdated: new Date().toISOString(),
      });

      console.log(`✅ Added location for rider ${rider.id} (${rider.name})`);
    }

    console.log('✅ All rider locations seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding locations:', error);
    process.exit(1);
  }
}

seedRiderLocations();
