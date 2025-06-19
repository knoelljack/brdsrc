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

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  listing: UserListing | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmationModal({
  isOpen,
  listing,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) {
  if (!isOpen || !listing) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <svg
            className="w-6 h-6 text-red-600 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900">
            Delete Listing
          </h3>
        </div>

        <p className="text-gray-600 mb-2">
          Are you sure you want to delete this listing?
        </p>

        <div className="bg-gray-50 rounded-lg p-3 mb-6">
          <p className="font-medium text-gray-900">{listing.title}</p>
          <p className="text-sm text-gray-600">
            {listing.brand} • ${listing.price.toLocaleString()}
          </p>
        </div>

        <p className="text-sm text-red-600 mb-6">
          This action cannot be undone. The listing will be permanently removed.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Deleting...
              </>
            ) : (
              'Delete Listing'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
