import { Store } from '../models/Store.js';
import { NotFoundError } from '../utils/AppError.js';

interface StoreFilters {
  latitude?: number;
  longitude?: number;
  radius?: number; // in kilometers
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 - Latitude of first point
 * @param lng1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lng2 - Longitude of second point
 * @returns Distance in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100; // Round to 2 decimal places
};

/**
 * Get all active stores with optional location-based filtering
 * @param filters - Optional filters for location-based search
 * @returns Array of stores with distance if location provided
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getAllStores = async (filters?: StoreFilters): Promise<any[]> => {
  // Get all active stores
  const stores = await Store.find({ isActive: true }).sort({ name: 1 }).lean();

  // If location filters provided, calculate distances and filter by radius
  if (
    filters?.latitude !== undefined &&
    filters?.longitude !== undefined &&
    filters?.radius !== undefined
  ) {
    const storesWithDistance = [];

    for (const store of stores) {
      const distance = calculateDistance(
        filters.latitude,
        filters.longitude,
        store.latitude,
        store.longitude
      );

      if (distance <= filters.radius) {
        storesWithDistance.push({
          ...store,
          id: store._id?.toString(),
          distance,
          isOpenNow: await Store.findById(store._id).then((s) =>
            s ? s.isOpenNow() : false
          ),
        });
      }
    }

    // Sort by distance
    storesWithDistance.sort((a, b) => a.distance - b.distance);
    return storesWithDistance;
  }

  // Return stores with isOpenNow status
  const result = [];
  for (const store of stores) {
    const storeDoc = await Store.findById(store._id);
    result.push({
      ...store,
      id: store._id?.toString(),
      isOpenNow: storeDoc ? storeDoc.isOpenNow() : false,
    });
  }
  return result;
};

/**
 * Get store by ID
 * @param storeId - Store ID
 * @returns Store details
 * @throws NotFoundError if store not found or inactive
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getStoreById = async (storeId: string): Promise<any> => {
  const store = await Store.findOne({ _id: storeId, isActive: true });

  if (!store) {
    throw new NotFoundError('Store not found');
  }

  const storeData = store.toObject();
  return {
    ...storeData,
    id: storeData._id?.toString(),
    isOpenNow: store.isOpenNow(),
  };
};

/**
 * Get store by slug
 * @param slug - Store slug
 * @returns Store details
 * @throws NotFoundError if store not found or inactive
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getStoreBySlug = async (slug: string): Promise<any> => {
  const store = await Store.findOne({ slug, isActive: true });

  if (!store) {
    throw new NotFoundError('Store not found');
  }

  const storeData = store.toObject();
  return {
    ...storeData,
    id: storeData._id?.toString(),
    isOpenNow: store.isOpenNow(),
  };
};

/**
 * Get available pickup times for a store
 * @param storeId - Store ID
 * @param date - Optional date (defaults to today)
 * @returns Array of available pickup time slots
 * @throws NotFoundError if store not found or inactive
 */
export const getAvailablePickupTimes = async (storeId: string, date?: Date) => {
  const store = await Store.findOne({ _id: storeId, isActive: true });

  if (!store) {
    throw new NotFoundError('Store not found');
  }

  const pickupTimes = store.getPickupTimes(date);

  return {
    storeId: String(store._id),
    storeName: store.name,
    date: date || new Date(),
    pickupTimes,
  };
};

/**
 * Get store gallery images
 * @param storeId - Store ID
 * @returns Gallery images array
 * @throws NotFoundError if store not found or inactive
 */
export const getStoreGallery = async (storeId: string) => {
  const store = await Store.findOne({ _id: storeId, isActive: true });

  if (!store) {
    throw new NotFoundError('Store not found');
  }

  return {
    storeId: String(store._id),
    storeName: store.name,
    images: store.images || [],
  };
};

/**
 * Get store opening hours
 * @param storeId - Store ID
 * @returns Opening hours and special hours
 * @throws NotFoundError if store not found or inactive
 */
export const getStoreHours = async (storeId: string) => {
  const store = await Store.findOne({ _id: storeId, isActive: true });

  if (!store) {
    throw new NotFoundError('Store not found');
  }

  return {
    storeId: String(store._id),
    storeName: store.name,
    openingHours: store.openingHours,
    specialHours: store.specialHours || [],
    isOpenNow: store.isOpenNow(),
  };
};

/**
 * Get store location details
 * @param storeId - Store ID
 * @returns Location information including address and coordinates
 * @throws NotFoundError if store not found or inactive
 */
export const getStoreLocation = async (storeId: string) => {
  const store = await Store.findOne({ _id: storeId, isActive: true });

  if (!store) {
    throw new NotFoundError('Store not found');
  }

  return {
    storeId: String(store._id),
    storeName: store.name,
    address: store.address,
    city: store.city,
    state: store.state,
    postalCode: store.postalCode,
    country: store.country,
    latitude: store.latitude,
    longitude: store.longitude,
  };
};
