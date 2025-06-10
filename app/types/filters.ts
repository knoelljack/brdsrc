// Shared filter types for consistent filtering across the app
import type { SurfboardCondition } from '@/types/surfboard';

// Filter-specific condition mapping (browse page uses different labels)
export type FilterCondition =
  | 'Brand New'
  | 'Excellent'
  | 'Very Good'
  | 'Good'
  | 'Fair'
  | 'Poor';

export type LengthFilter = '' | "Under 7'" | "7' - 9'" | "Over 9'";

export type PriceFilter = '' | 'Under $400' | '$400 - $600' | 'Over $600';

export type SortOption =
  | 'newest'
  | 'price-low'
  | 'price-high'
  | 'length-short'
  | 'distance';

// Filter option arrays for dropdowns (browse page specific)
export const CONDITION_OPTIONS: FilterCondition[] = [
  'Brand New',
  'Excellent',
  'Very Good',
  'Good',
  'Fair',
  'Poor',
];

export const LENGTH_OPTIONS = [
  { value: '', label: 'All Lengths' },
  { value: "Under 7'", label: "Under 7'" },
  { value: "7' - 9'", label: "7' - 9'" },
  { value: "Over 9'", label: "Over 9'" },
];

export const PRICE_OPTIONS = [
  { value: '', label: 'All Prices' },
  { value: 'Under $400', label: 'Under $400' },
  { value: '$400 - $600', label: '$400 - $600' },
  { value: 'Over $600', label: 'Over $600' },
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Sort by: Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'length-short', label: 'Length: Short to Long' },
  { value: 'distance', label: 'Distance: Closest First' },
];

// Helper function to get condition styling classes
export const getConditionStyles = (
  condition: FilterCondition | SurfboardCondition
): string => {
  switch (condition) {
    case 'Brand New':
    case 'New':
      return 'bg-purple-100 text-purple-800';
    case 'Excellent':
    case 'Like New':
      return 'bg-green-100 text-green-800';
    case 'Very Good':
      return 'bg-blue-100 text-blue-800';
    case 'Good':
      return 'bg-yellow-100 text-yellow-800';
    case 'Fair':
      return 'bg-orange-100 text-orange-800';
    case 'Poor':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
