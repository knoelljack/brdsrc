'use client';

import { useRouter } from 'next/navigation';

export default function EmptyListingsState() {
  const router = useRouter();

  return (
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
  );
}
