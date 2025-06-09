interface HeroSectionProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function HeroSection({
  searchTerm,
  onSearchChange,
}: HeroSectionProps) {
  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-5xl font-bold mb-4">Find Your Perfect Board</h2>
        <p className="text-xl mb-8 text-gray-300">
          Discover quality surfboards from surfers worldwide
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search boards..."
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg text-white text-lg placeholder-gray-300 bg-gray-800/50 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-white focus:border-white backdrop-blur-sm"
          />
          <button
            onClick={() => onSearchChange('')}
            className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-md cursor-pointer"
          >
            {searchTerm ? 'Clear' : 'Search'}
          </button>
        </div>
      </div>
    </section>
  );
}
