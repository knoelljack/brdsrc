import MyListingCard from './MyListingCard';

interface UserListing {
  id: string;
  title: string;
  brand: string;
  length: string;
  condition: string;
  price: number;
  description: string;
  location: string;
  city: string;
  state: string;
  createdAt: string;
  status: 'active' | 'sold' | 'pending';
  hasImages: boolean;
  thumbnailUrl?: string;
}

interface ListingsSectionProps {
  title: string;
  count: number;
  listings: UserListing[];
  badgeColor: 'green' | 'gray';
  onStatusChange: (listing: UserListing, newStatus: 'active' | 'sold') => void;
  onDelete: (listing: UserListing) => void;
  updatingListingId: string | null;
}

export default function ListingsSection({
  title,
  count,
  listings,
  badgeColor,
  onStatusChange,
  onDelete,
  updatingListingId,
}: ListingsSectionProps) {
  if (listings.length === 0) {
    return null;
  }

  const badgeStyles = {
    green: 'bg-green-100 text-green-800',
    gray: 'bg-gray-100 text-gray-800',
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <span
          className={`ml-3 ${badgeStyles[badgeColor]} text-sm font-medium px-3 py-1 rounded-full`}
        >
          {count}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map(listing => (
          <MyListingCard
            key={listing.id}
            listing={listing}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
            isUpdating={updatingListingId === listing.id}
          />
        ))}
      </div>
    </div>
  );
}
