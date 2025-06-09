import { Surfboard } from '@/app/data/surfboards';
import SurfboardCard from './SurfboardCard';

interface SurfboardGridProps {
  boards: Surfboard[];
}

export default function SurfboardGrid({ boards }: SurfboardGridProps) {
  if (boards.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No surfboards found
        </h3>
        <p className="text-gray-600">
          Try adjusting your filters to see more results.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Results count */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          Showing {boards.length} surfboard{boards.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Surfboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        {boards.map(board => (
          <SurfboardCard key={board.id} board={board} />
        ))}
      </div>
    </>
  );
}
