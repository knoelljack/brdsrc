'use client';

import Footer from '@/app/components/layout/Footer';
import Header from '@/app/components/layout/Header';
import { Surfboard } from '@/app/data/surfboards';
import { useFavorites } from '@/app/hooks/useFavorites';
import { getConditionStyles } from '@/app/types/filters';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface BoardDetailClientProps {
  board: Surfboard;
}

export default function BoardDetailClient({ board }: BoardDetailClientProps) {
  const { data: session } = useSession();
  const {
    isFavorited,
    toggleFavorite,
    isLoading: favoritesLoading,
  } = useFavorites();
  const [favoriteActionLoading, setFavoriteActionLoading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const isOwner = session?.user?.email === board?.seller?.email;
  const isBoardFavorited = isFavorited(board.id.toString());

  const handleToggleFavorite = async () => {
    if (!session?.user) {
      // Redirect to sign in
      window.location.href = '/auth/signin';
      return;
    }

    setFavoriteActionLoading(true);
    try {
      await toggleFavorite(board.id.toString());
    } catch (err) {
      console.error('Error toggling favorite:', err);
    } finally {
      setFavoriteActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-gray-700">
                Home
              </Link>
            </li>
            <li>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </li>
            <li>
              <Link href="/browse" className="hover:text-gray-700">
                Browse
              </Link>
            </li>
            <li>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </li>
            <li className="text-gray-900">{board.title}</li>
          </ol>
        </nav>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="p-8">
              {board.images && board.images.length > 0 ? (
                <div className="space-y-4">
                  {/* Main Image */}
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
                    {board.images[selectedImageIndex].startsWith('data:') ? (
                      // Use regular img tag for base64 data URLs (Next.js Image doesn't support data URLs)
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={board.images[selectedImageIndex]}
                        alt={board.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      // Use Next.js Image for regular URLs
                      <Image
                        src={board.images[selectedImageIndex]}
                        alt={board.title}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>

                  {/* Thumbnail Grid */}
                  {board.images.length > 0 && (
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                      {board.images.map((image, index) => (
                        <div
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`aspect-square bg-gray-100 rounded-md overflow-hidden relative cursor-pointer transition-all ${
                            selectedImageIndex === index
                              ? 'ring-2 ring-blue-500 ring-offset-1'
                              : 'hover:opacity-75 hover:ring-1 hover:ring-gray-300 hover:ring-offset-1'
                          }`}
                        >
                          {image.startsWith('data:') ? (
                            // Use regular img tag for base64 data URLs (Next.js Image doesn't support data URLs)
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={image}
                              alt={`${board.title} - Image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            // Use Next.js Image for regular URLs
                            <Image
                              src={image}
                              alt={`${board.title} - Image ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <svg
                      className="mx-auto h-24 w-24 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-lg">No photos available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="p-8">
              <div className="mb-6">
                {/* Status Banner for Sold Items */}
                {board.status === 'sold' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-red-500 mr-2"
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
                      <span className="text-red-800 font-medium">
                        This surfboard has been sold
                      </span>
                    </div>
                    <p className="text-red-700 text-sm mt-1">
                      This listing is no longer available for purchase
                    </p>
                  </div>
                )}

                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {board.title}
                      {board.status === 'sold' && (
                        <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                          SOLD
                        </span>
                      )}
                    </h1>
                    <p
                      className={`text-2xl font-bold ${board.status === 'sold' ? 'text-gray-500' : 'text-gray-900'}`}
                    >
                      ${board.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Brand</span>
                  <span className="font-medium text-gray-900">
                    {board.brand}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Length</span>
                  <span className="font-medium text-gray-900">
                    {board.length}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Condition</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getConditionStyles(board.condition)}`}
                  >
                    {board.condition}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Location</span>
                  <span className="text-gray-600">
                    📍 {board.location || `${board.city}, ${board.state}`}
                  </span>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {board.description}
                </p>
              </div>

              {/* Seller Contact Information */}
              {!isOwner && board.status === 'active' && (
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Contact Seller
                  </h3>
                  <div className="space-y-3">
                    {board.seller?.name && (
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 text-gray-400 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span className="text-gray-900 font-medium">
                          {board.seller.name.split(' ')[0]}{' '}
                          {/* Show only first name */}
                        </span>
                      </div>
                    )}

                    {board.seller?.email && (
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 text-gray-400 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <a
                          href={`mailto:${board.seller.email}`}
                          className="text-gray-900 hover:text-gray-700 transition-colors"
                        >
                          {board.seller.email}
                        </a>
                      </div>
                    )}

                    {board.seller?.phone && (
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 text-gray-400 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <a
                          href={`tel:${board.seller.phone}`}
                          className="text-gray-900 hover:text-gray-700 transition-colors"
                        >
                          {board.seller.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-4">
                {!isOwner && board.status === 'active' && (
                  <button
                    onClick={handleToggleFavorite}
                    disabled={favoriteActionLoading || favoritesLoading}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                      isBoardFavorited
                        ? 'bg-red-50 border border-red-200 text-red-700 hover:bg-red-100'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {favoriteActionLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current" />
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill={isBoardFavorited ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    )}
                    {isBoardFavorited
                      ? 'Remove from Favorites'
                      : 'Save to Favorites'}
                  </button>
                )}

                {/* Sold Item Notice for Non-Owners */}
                {!isOwner && board.status === 'sold' && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center text-gray-600">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm">
                        This surfboard is no longer available
                      </span>
                    </div>
                  </div>
                )}

                {isOwner && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm mb-3">
                      This is your listing
                    </p>
                    <Link
                      href={`/edit-listing/${board.id}`}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Edit Listing
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Back to Browse */}
        <div className="mt-8 text-center">
          <Link
            href="/browse"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Browse
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
