import { useEffect } from 'react';

interface AccountStatsProps {
  stats: {
    boardsListed: number;
    boardsActive: number;
    boardsSold: number;
    boardsPending: number;
  };
  isLoadingStats: boolean;
  onLoadStats: () => void;
}

export default function AccountStats({
  stats,
  isLoadingStats,
  onLoadStats,
}: AccountStatsProps) {
  useEffect(() => {
    onLoadStats();
  }, [onLoadStats]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Account Stats</h3>
        <button
          onClick={onLoadStats}
          disabled={isLoadingStats}
          className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer disabled:cursor-not-allowed"
          title="Refresh stats"
        >
          <svg
            className={`w-4 h-4 ${isLoadingStats ? 'animate-spin' : ''}`}
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
        </button>
      </div>
      {isLoadingStats ? (
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Loading...</span>
            <div className="w-6 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Boards Listed</span>
            <span className="font-medium text-gray-900">
              {stats.boardsListed}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Boards Active</span>
            <span className="font-medium text-green-600">
              {stats.boardsActive}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Boards Sold</span>
            <span className="font-medium text-blue-600">
              {stats.boardsSold}
            </span>
          </div>
          {stats.boardsPending > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Boards Pending</span>
              <span className="font-medium text-yellow-600">
                {stats.boardsPending}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
