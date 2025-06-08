import { Surfboard } from '@/app/data/surfboards';
import SurfboardCard from './SurfboardCard';

interface SurfboardGridProps {
  boards: Surfboard[];
}

export default function SurfboardGrid({ boards }: SurfboardGridProps) {
  return (
    <>
      {/* Surfboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {boards.map(board => (
          <SurfboardCard key={board.id} board={board} />
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center mt-12">
        <button className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors font-medium shadow-sm cursor-pointer">
          Load More Boards
        </button>
      </div>
    </>
  );
}
