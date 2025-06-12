'use client';

import { use, useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Surfboard } from '@/app/data/surfboards';
import Header from '@/app/components/layout/Header';
import Footer from '@/app/components/layout/Footer';
import { getConditionStyles } from '@/app/types/filters';

interface BoardDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function BoardDetailPage({ params }: BoardDetailPageProps) {
  const { id } = use(params);
  const [board, setBoard] = useState<Surfboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await fetch(`/api/boards/${id}`);

        if (response.status === 404) {
          notFound();
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch board details');
        }

        const data = await response.json();
        setBoard(data.surfboard);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load board');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBoard();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading board details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !board) {
    notFound();
  }

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
                    {board.images[0].startsWith('data:') ? (
                      // Use regular img tag for base64 data URLs (Next.js Image doesn't support data URLs)
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={board.images[0]}
                        alt={board.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      // Use Next.js Image for regular URLs
                      <Image
                        src={board.images[0]}
                        alt={board.title}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>

                  {/* Thumbnail Grid (if more than 1 image) */}
                  {board.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {board.images.slice(1, 5).map((image, index) => (
                        <div
                          key={index}
                          className="aspect-square bg-gray-100 rounded-md overflow-hidden relative"
                        >
                          {image.startsWith('data:') ? (
                            // Use regular img tag for base64 data URLs (Next.js Image doesn't support data URLs)
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={image}
                              alt={`${board.title} - Image ${index + 2}`}
                              className="w-full h-full object-cover cursor-pointer hover:opacity-75 transition-opacity"
                            />
                          ) : (
                            // Use Next.js Image for regular URLs
                            <Image
                              src={image}
                              alt={`${board.title} - Image ${index + 2}`}
                              fill
                              className="object-cover cursor-pointer hover:opacity-75 transition-opacity"
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {board.title}
                </h1>
                <p className="text-2xl font-bold text-gray-900">
                  ${board.price}
                </p>
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
                  <span className="font-medium text-gray-900">
                    📍 {board.city}, {board.state}
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

              <div className="space-y-4">
                <button className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors font-medium cursor-pointer">
                  Contact Seller
                </button>
                <button className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium cursor-pointer">
                  Save to Favorites
                </button>
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
