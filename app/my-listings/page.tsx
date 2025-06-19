'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';
import DeleteConfirmationModal from '../components/listings/DeleteConfirmationModal';
import EmptyListingsState from '../components/listings/EmptyListingsState';
import ErrorState from '../components/listings/ErrorState';
import ListingsSection from '../components/listings/ListingsSection';
import ListingsSummary from '../components/listings/ListingsSummary';
import LoadingState from '../components/listings/LoadingState';
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
        {isLoading && <LoadingState />}

        {/* Error State */}
        {error && <ErrorState error={error} />}

        {/* Listings Content */}
        {!isLoading && !error && (
          <>
            {listings.length === 0 ? (
              <EmptyListingsState />
            ) : (
              <div className="space-y-12">
                <ListingsSummary
                  totalListings={listings.length}
                  activeCount={activeListings.length}
                  soldCount={soldListings.length}
                />

                <ListingsSection
                  title="Active Listings"
                  count={activeListings.length}
                  listings={activeListings}
                  badgeColor="green"
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteListing}
                  updatingListingId={updatingListingId}
                />

                <ListingsSection
                  title="Sold Listings"
                  count={soldListings.length}
                  listings={soldListings}
                  badgeColor="gray"
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteListing}
                  updatingListingId={updatingListingId}
                />
              </div>
            )}
          </>
        )}
      </main>

      <Footer />

      <DeleteConfirmationModal
        isOpen={deleteConfirm.isOpen}
        listing={deleteConfirm.listing}
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
