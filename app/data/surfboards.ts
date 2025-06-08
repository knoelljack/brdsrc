export interface Surfboard {
  id: number;
  title: string;
  brand: string;
  length: string;
  price: number;
  condition: 'Excellent' | 'Very Good' | 'Good';
  location: string;
  city: string;
  state: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  description: string;
}

export const surfboards: Surfboard[] = [
  {
    id: 1,
    title: 'Classic Longboard',
    brand: 'Ocean Dreams',
    length: '9\'6"',
    price: 650,
    condition: 'Excellent',
    location: 'Malibu, CA',
    city: 'Malibu',
    state: 'CA',
    coordinates: { lat: 34.0259, lng: -118.7798 },
    description:
      'Perfect for beginners and cruising. Barely used, excellent condition.',
  },
  {
    id: 2,
    title: 'Performance Shortboard',
    brand: 'Wave Rider',
    length: '6\'2"',
    price: 480,
    condition: 'Good',
    location: 'Huntington Beach, CA',
    city: 'Huntington Beach',
    state: 'CA',
    coordinates: { lat: 33.6603, lng: -117.9992 },
    description:
      'High-performance shortboard for experienced surfers. Some dings but rides great.',
  },
  {
    id: 3,
    title: 'Fish Twin Fin',
    brand: 'Retro Surf Co',
    length: '5\'8"',
    price: 420,
    condition: 'Very Good',
    location: 'Santa Cruz, CA',
    city: 'Santa Cruz',
    state: 'CA',
    coordinates: { lat: 36.9741, lng: -122.0308 },
    description:
      'Classic fish design with twin fin setup. Great for smaller waves.',
  },
  {
    id: 4,
    title: 'Mid-Length Funboard',
    brand: 'SurfCraft',
    length: '7\'6"',
    price: 550,
    condition: 'Excellent',
    location: 'San Diego, CA',
    city: 'San Diego',
    state: 'CA',
    coordinates: { lat: 32.7157, lng: -117.1611 },
    description: 'Versatile mid-length board perfect for all skill levels.',
  },
  {
    id: 5,
    title: 'Vintage Single Fin',
    brand: 'Classic Boards',
    length: '9\'0"',
    price: 750,
    condition: 'Good',
    location: 'Venice Beach, CA',
    city: 'Venice Beach',
    state: 'CA',
    coordinates: { lat: 33.985, lng: -118.4695 },
    description:
      'Authentic vintage longboard with single fin. A true classic with character.',
  },
  {
    id: 6,
    title: 'Modern Hybrid',
    brand: 'NextGen Surf',
    length: '6\'8"',
    price: 520,
    condition: 'Very Good',
    location: 'Encinitas, CA',
    city: 'Encinitas',
    state: 'CA',
    coordinates: { lat: 33.0369, lng: -117.292 },
    description: 'Modern hybrid design combining performance and paddle power.',
  },
  {
    id: 7,
    title: 'Retro Gun',
    brand: 'Big Wave Co',
    length: '7\'2"',
    price: 680,
    condition: 'Excellent',
    location: 'Half Moon Bay, CA',
    city: 'Half Moon Bay',
    state: 'CA',
    coordinates: { lat: 37.4636, lng: -122.4286 },
    description: 'Big wave gun perfect for overhead conditions. Minimal use.',
  },
  {
    id: 8,
    title: 'Mini Mal',
    brand: 'Learn2Surf',
    length: '8\'0"',
    price: 380,
    condition: 'Good',
    location: 'Santa Monica, CA',
    city: 'Santa Monica',
    state: 'CA',
    coordinates: { lat: 34.0195, lng: -118.4912 },
    description: 'Perfect beginner board with soft top. Great for learning.',
  },
  {
    id: 9,
    title: 'Step-Up Board',
    brand: 'Pro Shaper',
    length: '6\'6"',
    price: 620,
    condition: 'Very Good',
    location: 'Oceanside, CA',
    city: 'Oceanside',
    state: 'CA',
    coordinates: { lat: 33.1959, lng: -117.3795 },
    description:
      'High-performance step-up for bigger waves. Recently serviced.',
  },
  {
    id: 10,
    title: 'Foam Board',
    brand: 'Safe Surf',
    length: '9\'0"',
    price: 280,
    condition: 'Good',
    location: 'Manhattan Beach, CA',
    city: 'Manhattan Beach',
    state: 'CA',
    coordinates: { lat: 33.8847, lng: -118.4109 },
    description: 'Soft foam board ideal for beginners and kids. Very safe.',
  },
  // Adding more diverse locations
  {
    id: 11,
    title: 'Travel Board',
    brand: 'Nomad Surf',
    length: '6\'0"',
    price: 450,
    condition: 'Excellent',
    location: 'Phoenix, AZ',
    city: 'Phoenix',
    state: 'AZ',
    coordinates: { lat: 33.4484, lng: -112.074 },
    description:
      'Compact travel board perfect for surf trips. Lightweight construction.',
  },
  {
    id: 12,
    title: 'Longboard Classic',
    brand: 'East Coast Shapers',
    length: '9\'2"',
    price: 590,
    condition: 'Very Good',
    location: 'Virginia Beach, VA',
    city: 'Virginia Beach',
    state: 'VA',
    coordinates: { lat: 36.8529, lng: -75.978 },
    description: 'East coast classic longboard. Great for Atlantic waves.',
  },
  {
    id: 13,
    title: 'Shortboard Pro',
    brand: 'Florida Surf Co',
    length: '6\'1"',
    price: 520,
    condition: 'Good',
    location: 'Miami, FL',
    city: 'Miami',
    state: 'FL',
    coordinates: { lat: 25.7617, lng: -80.1918 },
    description: 'High-performance shortboard shaped for Florida conditions.',
  },
  {
    id: 14,
    title: 'Custom Shaped',
    brand: 'Austin Shapers',
    length: '7\'0"',
    price: 700,
    condition: 'Excellent',
    location: 'Austin, TX',
    city: 'Austin',
    state: 'TX',
    coordinates: { lat: 30.2672, lng: -97.7431 },
    description: 'Custom shaped board. Owner moving, never used in salt water.',
  },
  {
    id: 15,
    title: 'Collector Board',
    brand: 'Vintage Surf',
    length: '8\'6"',
    price: 850,
    condition: 'Very Good',
    location: 'Portland, OR',
    city: 'Portland',
    state: 'OR',
    coordinates: { lat: 45.5152, lng: -122.6784 },
    description: 'Vintage collector board from the 80s. Rare find.',
  },
  {
    id: 16,
    title: 'Cold Water Board',
    brand: 'Pacific Northwest',
    length: '6\'4"',
    price: 480,
    condition: 'Good',
    location: 'Seattle, WA',
    city: 'Seattle',
    state: 'WA',
    coordinates: { lat: 47.6062, lng: -122.3321 },
    description:
      'Perfect for Pacific Northwest conditions. Thick wetsuit not included.',
  },
];

// Utility function to get unique locations
export const getUniqueLocations = (): string[] => {
  const locations = surfboards.map(board => board.location);
  return Array.from(new Set(locations)).sort();
};

// Utility function to get unique cities for cleaner display
export const getUniqueCities = (): string[] => {
  const cities = surfboards.map(board => board.city);
  return Array.from(new Set(cities)).sort();
};

// Utility function to get unique states
export const getUniqueStates = (): string[] => {
  const states = surfboards.map(board => board.state);
  return Array.from(new Set(states)).sort();
};

// Group locations by state for hierarchical filtering
export const getLocationsByState = (): Record<string, string[]> => {
  const locationsByState: Record<string, string[]> = {};

  surfboards.forEach(board => {
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
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in miles
};

// Get surfboards within a certain radius of coordinates
export const getSurfboardsNearLocation = (
  userLat: number,
  userLng: number,
  radiusMiles: number = 50
): Surfboard[] => {
  return surfboards
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
