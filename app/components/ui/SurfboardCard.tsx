import { Surfboard } from '@/app/data/surfboards';

interface SurfboardCardProps {
  board: Surfboard;
}

export default function SurfboardCard({ board }: SurfboardCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100">
      {/* Placeholder Image */}
      <div className="h-48 bg-gray-100 flex items-center justify-center">
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
          <p className="text-xs">Image placeholder</p>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-lg font-semibold text-gray-900">{board.title}</h4>
          <span className="text-lg font-bold text-gray-900">
            ${board.price}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-2">
          {board.brand} • {board.length}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              board.condition === 'Excellent'
                ? 'bg-green-100 text-green-800'
                : board.condition === 'Very Good'
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {board.condition}
          </span>
          <span className="text-xs text-gray-500">📍 {board.location}</span>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {board.description}
        </p>

        <button className="w-full bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium cursor-pointer">
          View Details
        </button>
      </div>
    </div>
  );
}
