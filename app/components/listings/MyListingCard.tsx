'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

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

interface MyListingCardProps {
  listing: UserListing;
  onStatusChange: (listing: UserListing, newStatus: 'active' | 'sold') => void;
  onDelete: (listing: UserListing) => void;
  isUpdating: boolean;
}

export default function MyListingCard({
  listing,
  onStatusChange,
  onDelete,
  isUpdating,
}: MyListingCardProps) {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'sold':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'pending':
        return 'Pending Sale';
      case 'sold':
        return 'Sold';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="aspect-video bg-gray-100 relative">
        {listing.thumbnailUrl ? (
          <Image
            src={listing.thumbnailUrl}
            alt={listing.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(listing.status)}`}
          >
            {getStatusText(listing.status)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-lg">
            {listing.title}
          </h3>
          <span className="text-xl font-bold text-gray-900">
            ${listing.price.toLocaleString()}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-3">
          {listing.brand} • {listing.length} • {listing.condition}
        </p>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {listing.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            📍 {listing.location || `${listing.city}, ${listing.state}`}
          </span>
          <span>Listed {new Date(listing.createdAt).toLocaleDateString()}</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 mt-4">
          {/* Primary Actions - Only show for active listings */}
          {listing.status === 'active' && (
            <div className="flex gap-2">
              <button
                onClick={() => router.push(`/boards/${listing.id}`)}
                className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer text-sm"
              >
                View
              </button>
              <button
                onClick={() => router.push(`/edit-listing/${listing.id}`)}
                className="flex-1 bg-gray-900 text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer text-sm"
              >
                Edit
              </button>
            </div>
          )}

          {/* Status Management */}
          <div className="flex gap-2">
            {listing.status === 'active' ? (
              <button
                onClick={() => onStatusChange(listing, 'sold')}
                disabled={isUpdating}
                className="flex-1 bg-orange-600 text-white px-3 py-2 rounded-lg hover:bg-orange-700 transition-colors cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isUpdating ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                    Updating...
                  </>
                ) : (
                  'Mark as Sold'
                )}
              </button>
            ) : (
              <button
                onClick={() => onStatusChange(listing, 'active')}
                disabled={isUpdating}
                className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isUpdating ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                    Updating...
                  </>
                ) : (
                  'Relist as Active'
                )}
              </button>
            )}
            <button
              onClick={() => onDelete(listing)}
              className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors cursor-pointer text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
