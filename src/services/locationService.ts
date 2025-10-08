import { database } from '../config/db';

interface LocationData {
  lat: number;
  lng: number;
  heading?: number;
  timestamp: number;
}

interface LocationUpdateResult {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Update rider location in Firebase Realtime Database
 */
export async function updateRiderLocation(
  riderId: number,
  location: LocationData,
): Promise<LocationUpdateResult> {
  try {
    // Validate location data
    if (!location.lat || !location.lng) {
      throw new Error('Invalid location data: latitude and longitude are required');
    }

    if (location.lat < -90 || location.lat > 90) {
      throw new Error('Invalid latitude: must be between -90 and 90');
    }

    if (location.lng < -180 || location.lng > 180) {
      throw new Error('Invalid longitude: must be between -180 and 180');
    }

    // Update location in Firebase
    await database.ref(`riders/${riderId}`).set({
      lat: location.lat.toString(),
      lng: location.lng.toString(),
      heading: location.heading || 0,
      timestamp: location.timestamp || Date.now(),
      lastUpdated: new Date().toISOString(),
    });

    console.log(`✅ Location updated for rider ${riderId}: (${location.lat}, ${location.lng})`);

    return {
      success: true,
      message: 'Location updated successfully',
    };
  } catch (error) {
    console.error('Error updating rider location:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update location';
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Get rider's current location from Firebase
 */
export async function getRiderLocation(riderId: number): Promise<LocationData | null> {
  try {
    const snapshot = await database.ref(`riders/${riderId}`).get();

    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.val();
    return {
      lat: parseFloat(data.lat),
      lng: parseFloat(data.lng),
      heading: data.heading || 0,
      timestamp: data.timestamp || Date.now(),
    };
  } catch (error) {
    console.error('Error fetching rider location:', error);
    return null;
  }
}

/**
 * Delete rider location (when they go offline)
 */
export async function deleteRiderLocation(riderId: number): Promise<LocationUpdateResult> {
  try {
    await database.ref(`riders/${riderId}`).remove();

    console.log(`✅ Location removed for rider ${riderId}`);

    return {
      success: true,
      message: 'Location removed successfully',
    };
  } catch (error) {
    console.error('Error removing rider location:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to remove location';
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Batch update - useful for getting multiple rider locations at once
 */
export async function getMultipleRiderLocations(
  riderIds: number[],
): Promise<Map<number, LocationData>> {
  const locations = new Map<number, LocationData>();

  for (const riderId of riderIds) {
    const location = await getRiderLocation(riderId);
    if (location) {
      locations.set(riderId, location);
    }
  }

  return locations;
}
