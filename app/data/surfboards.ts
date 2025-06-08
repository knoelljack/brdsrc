export interface Surfboard {
  id: number;
  title: string;
  brand: string;
  length: string;
  price: number;
  condition: 'Excellent' | 'Very Good' | 'Good';
  location: string;
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
    description: 'Modern hybrid design combining performance and paddle power.',
  },
];
