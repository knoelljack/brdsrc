'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';
import MyListingCard from '../components/listings/MyListingCard';
import { useBoardStatus } from '../hooks/useBoardStatus';

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

export default function MyListingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [listings, setListings] = useState<UserListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    listing: UserListing | null;
  }>({ isOpen: false, listing: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingListingId, setUpdatingListingId] = useState<string | null>(
    null
  );
  const { updateBoardStatus } = useBoardStatus();

  // Load user's listings
  useEffect(() => {
    const loadListings = async () => {
      if (!session?.user?.email) {
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch('/api/my-listings');

        if (!response.ok) {
          throw new Error('Failed to load listings');
        }

        const data = await response.json();
        setListings(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load listings'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadListings();
  }, [session]);

  // Handle status change
  const handleStatusChange = async (
    listing: UserListing,
    newStatus: 'active' | 'sold'
  ) => {
    setUpdatingListingId(listing.id);
    try {
      await updateBoardStatus(listing.id, newStatus);

      // Update the listing in the state
      setListings(prev =>
        prev.map(l => (l.id === listing.id ? { ...l, status: newStatus } : l))
      );
    } catch (err) {
      console.error('Status update error:', err);
      alert(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setUpdatingListingId(null);
    }
  };

  // Delete listing function
  const handleDeleteListing = async (listing: UserListing) => {
    setDeleteConfirm({ isOpen: true, listing });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.listing) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/surfboards/${deleteConfirm.listing.id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete listing');
      }

      // Remove the deleted listing from the state
      setListings(prev => prev.filter(l => l.id !== deleteConfirm.listing!.id));

      // Close the confirmation modal
      setDeleteConfirm({ isOpen: false, listing: null });

      // Show success message
      alert('Listing deleted successfully!');
    } catch (err) {
      console.error('Delete error:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete listing');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({ isOpen: false, listing: null });
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && deleteConfirm.isOpen && !isDeleting) {
        cancelDelete();
      }
    };

    if (deleteConfirm.isOpen) {
      document.addEventListener('keydown', handleEscKey);
      return () => document.removeEventListener('keydown', handleEscKey);
    }
  }, [deleteConfirm.isOpen, isDeleting]);

  // Redirect if not authenticated
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  // Separate listings by status
  const activeListings = listings.filter(l => l.status === 'active');
  const soldListings = listings.filter(l => l.status === 'sold');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                My Listings
              </h1>
              <p className="text-gray-600">
                Manage your surfboard listings and track their status
              </p>
            </div>
            <button
              onClick={() => router.push('/sell')}
              className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
            >
              + List New Board
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-3 text-gray-600">Loading your listings...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-400 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Listings Content */}
        {!isLoading && !error && (
          <>
            {listings.length === 0 ? (
              // Empty State
              <div className="text-center py-16">
                <svg
                  className="w-16 h-16 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No listings yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start by listing your first surfboard to connect with buyers.
                </p>
                <button
                  onClick={() => router.push('/sell')}
                  className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  List Your First Board
                </button>
              </div>
            ) : (
              // Listings Sections
              <div className="space-y-12">
                {/* Summary */}
                <div className="mb-6">
                  <p className="text-gray-600">
                    {listings.length} listing{listings.length !== 1 ? 's' : ''}{' '}
                    total • {activeListings.length} active •{' '}
                    {soldListings.length} sold
                  </p>
                </div>

                {/* Active Listings Section */}
                {activeListings.length > 0 && (
                  <div>
                    <div className="flex items-center mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">
                        Active Listings
                      </h2>
                      <span className="ml-3 bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                        {activeListings.length}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {activeListings.map(listing => (
                        <MyListingCard
                          key={listing.id}
                          listing={listing}
                          onStatusChange={handleStatusChange}
                          onDelete={handleDeleteListing}
                          isUpdating={updatingListingId === listing.id}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Sold Listings Section */}
                {soldListings.length > 0 && (
                  <div>
                    <div className="flex items-center mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">
                        Sold Listings
                      </h2>
                      <span className="ml-3 bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                        {soldListings.length}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {soldListings.map(listing => (
                        <MyListingCard
                          key={listing.id}
                          listing={listing}
                          onStatusChange={handleStatusChange}
                          onDelete={handleDeleteListing}
                          isUpdating={updatingListingId === listing.id}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />

      {/* Delete Confirmation Modal */}
      {deleteConfirm.isOpen && deleteConfirm.listing && (
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
              <p className="font-medium text-gray-900">
                {deleteConfirm.listing.title}
              </p>
              <p className="text-sm text-gray-600">
                {deleteConfirm.listing.brand} • $
                {deleteConfirm.listing.price.toLocaleString()}
              </p>
            </div>

            <p className="text-sm text-red-600 mb-6">
              This action cannot be undone. The listing will be permanently
              removed.
            </p>

            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                disabled={isDeleting}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
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
      )}
    </div>
  );
}
