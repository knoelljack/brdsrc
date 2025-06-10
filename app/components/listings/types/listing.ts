// Import global types
import type { SurfboardCondition, ListingStatus } from '@/types/surfboard';

// Form-specific data interfaces
export interface BaseListingData {
  title: string;
  brand: string;
  length: string;
  price: number;
  condition: SurfboardCondition;
  description: string;
  location: string;
  city: string;
  state: string;
}

export interface CreateListingData extends BaseListingData {
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

export interface EditListingData extends BaseListingData {
  id: string;
  images: string[];
  status: ListingStatus;
}

// Component prop interfaces
export interface ListingFormProps {
  data: Partial<BaseListingData>;
  onChange: (name: string, value: string | number) => void;
  isSubmitting?: boolean;
  showRequiredAsterisk?: boolean;
}

// Re-export commonly used constants for convenience
export {
  SURFBOARD_CONDITIONS as LISTING_CONDITION_OPTIONS,
  LISTING_STATUSES as LISTING_STATUS_OPTIONS,
  US_STATES,
} from '@/types/surfboard';
