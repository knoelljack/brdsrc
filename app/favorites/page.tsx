'use client';

import Footer from '@/app/components/layout/Footer';
import Header from '@/app/components/layout/Header';
import SurfboardGrid from '@/app/components/ui/SurfboardGrid';
import { useFavorites } from '@/app/hooks/useFavorites';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function FavoritesPage() {
  const { status } = useSession();
  const { favorites, isLoading, error, refreshFavorites } = useFavorites();

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                My Favorites
              </h1>
              <p className="text-gray-600">
                Surfboards you&apos;ve saved for later
              </p>
            </div>

            {favorites.length > 0 && (
              <button
                onClick={refreshFavorites}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
              >
                <svg
                  className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Favorites
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {favorites.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Latest Added
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {favorites.length > 0
                      ? new Date(favorites[0].favoritedAt).toLocaleDateString()
                      : 'None'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex">
              <svg
                className="w-5 h-5 text-red-400 mr-3 mt-0.5"
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
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  Error loading favorites
                </h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <button
                  onClick={refreshFavorites}
                  className="text-sm text-red-800 underline hover:text-red-900 mt-2"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your favorites...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && favorites.length === 0 && (
          <div className="text-center py-16">
            <svg
              className="mx-auto h-24 w-24 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No favorites yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start browsing surfboards and save the ones you like!
            </p>
            <Link
              href="/browse"
              className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Browse Surfboards
            </Link>
          </div>
        )}

        {/* Favorites Grid */}
        {!isLoading && !error && favorites.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Saved Surfboards ({favorites.length})
              </h2>
              <div className="text-sm text-gray-600">
                Sorted by most recently added
              </div>
            </div>
            <SurfboardGrid boards={favorites} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
