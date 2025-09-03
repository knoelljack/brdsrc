import { SurfboardCondition } from '@/types/surfboard';

export interface Surfboard {
  id: number | string; // Can be number (dummy data) or string (database)
  title: string;
  brand: string;
  length: string;
  price: number;
  condition: SurfboardCondition;
  location: string;
  city: string;
  state: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  description: string;
  // Optional fields from database
  createdAt?: string | Date;
  images?: string[];
  userId?: string;
  status?: string;
  seller?: {
    name: string | null;
    email: string | null;
    phone: string | null;
    userType?: string | null;
    shopName?: string | null;
    shopAddress?: string | null;
    shopWebsite?: string | null;
    shopDescription?: string | null;
  };
}

// PRODUCTION: No dummy data - all surfboards come from database
export const surfboards: Surfboard[] = [];

// Utility function to get unique locations from real surfboards
export const getUniqueLocations = (boards: Surfboard[]): string[] => {
  const locations = boards.map(board => board.location);
  return Array.from(new Set(locations)).sort();
};

// Utility function to get unique brands from real surfboards
export const getUniqueBrands = (boards: Surfboard[]): string[] => {
  const brands = boards.map(board => board.brand);
  return Array.from(new Set(brands)).sort();
};

// Group locations by state for hierarchical filtering
export const getLocationsByState = (
  boards: Surfboard[]
): Record<string, string[]> => {
  const locationsByState: Record<string, string[]> = {};

  boards.forEach(board => {
    if (!locationsByState[board.state]) {
      locationsByState[board.state] = [];
    }
    if (!locationsByState[board.state].includes(board.city)) {
      locationsByState[board.state].push(board.city);
    }
  });

  // Sort cities within each state
  Object.keys(locationsByState).forEach(state => {
    locationsByState[state].sort();
  });

  return locationsByState;
};

// Calculate distance between two coordinates (Haversine formula)
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 3959; // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Get surfboards within a certain radius of coordinates
export const getSurfboardsNearLocation = (
  boards: Surfboard[],
  userLat: number,
  userLng: number,
  radiusMiles: number = 50
): (Surfboard & { distance?: number })[] => {
  return boards
    .filter(board => {
      if (!board.coordinates) return false;
      const distance = calculateDistance(
        userLat,
        userLng,
        board.coordinates.lat,
        board.coordinates.lng
      );
      return distance <= radiusMiles;
    })
    .map(board => ({
      ...board,
      distance: board.coordinates
        ? calculateDistance(
            userLat,
            userLng,
            board.coordinates.lat,
            board.coordinates.lng
          )
        : undefined,
    }))
    .sort((a, b) => (a.distance || 0) - (b.distance || 0));
};
