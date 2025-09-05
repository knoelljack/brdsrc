'use client';

import { Surfboard } from '@/app/data/surfboards';
import { useFavorites } from '@/app/hooks/useFavorites';
import { getConditionStyles } from '@/app/types/filters';
import { isBoardNew } from '@/app/utils/dateUtils';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface SurfboardCardProps {
  board: Surfboard;
}

export default function SurfboardCard({ board }: SurfboardCardProps) {
  const { data: session } = useSession();
  const { isFavorited, toggleFavorite } = useFavorites();
  const [isToggling, setIsToggling] = useState(false);

  const isOwner = session?.user?.email === board?.seller?.email;
  const isBoardFavorited = isFavorited(board.id.toString());

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to board details
    e.stopPropagation();

    if (!session?.user) {
      // Redirect to sign in
      window.location.href = '/auth/signin';
      return;
    }

    setIsToggling(true);
    try {
      await toggleFavorite(board.id.toString());
    } catch (err) {
      console.error('Error toggling favorite:', err);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 h-full flex flex-col">
      {/* Board Image */}
      <div className="h-48 bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden relative">
        {/* Favorite Button */}
        {session?.user && !isOwner && (
          <button
            onClick={handleToggleFavorite}
            disabled={isToggling}
            className={`absolute top-3 left-3 p-2 rounded-full transition-all duration-200 ${
              isBoardFavorited
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
            } shadow-lg backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed z-10`}
            aria-label={
              isBoardFavorited ? 'Remove from favorites' : 'Add to favorites'
            }
          >
            {isToggling ? (
              <div className="w-5 h-5 animate-spin border-2 border-current border-t-transparent rounded-full" />
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
          </button>
        )}

        {/* New Tag */}
        {isBoardNew(board.createdAt) && (
          <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg z-10">
            New
          </span>
        )}

        {board.images && board.images.length > 0 ? (
          board.images[0].startsWith('data:') ? (
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
          )
        ) : (
          <div className="text-center text-gray-400">
            <svg
              className="mx-auto h-12 w-12 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-xs">No photos</p>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-lg font-semibold text-gray-900">{board.title}</h4>
          <span className="text-lg font-bold text-gray-900">
            ${board.price.toLocaleString()}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-2">
          {board.brand} • {board.length}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionStyles(board.condition)}`}
          >
            {board.condition}
          </span>
          <span className="text-xs text-gray-500">
            📍 {board.location || `${board.city}, ${board.state}`}
          </span>
        </div>

        <p
          className="text-sm text-gray-600 mb-4 flex-grow overflow-hidden"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            lineHeight: '1.4em',
            maxHeight: '4.2em', // 3 lines * 1.4em line-height
          }}
        >
          {board.description}
        </p>

        <Link
          href={`/boards/${board.id}`}
          className="w-full bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium cursor-pointer mt-auto text-center block"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
