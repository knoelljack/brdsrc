// Global surfboard domain types - used across multiple features

export type SurfboardCondition = 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';

export type ListingStatus = 'active' | 'pending' | 'sold';

// These constants are used in filters, listings, forms, etc.
export const SURFBOARD_CONDITIONS: SurfboardCondition[] = [
  'New',
  'Like New',
  'Good',
  'Fair',
  'Poor',
] as const;

export const LISTING_STATUSES = [
  { value: 'active' as const, label: 'Active' },
  { value: 'pending' as const, label: 'Pending Sale' },
  { value: 'sold' as const, label: 'Sold' },
] as const;

// US States - used in multiple forms and filters
export const US_STATES = [
  { value: 'CA', label: 'California' },
  { value: 'FL', label: 'Florida' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'OR', label: 'Oregon' },
  { value: 'TX', label: 'Texas' },
  { value: 'WA', label: 'Washington' },
  { value: 'VA', label: 'Virginia' },
  { value: 'AZ', label: 'Arizona' },
] as const;

// Core surfboard data structure
export interface BaseSurfboard {
  id: string;
  title: string;
  brand: string;
  length: string;
  price: number;
  condition: SurfboardCondition;
  description: string;
  location: string;
  city: string;
  state: string;
  images: string[];
  status: ListingStatus;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}
