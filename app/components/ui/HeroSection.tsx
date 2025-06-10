interface HeroSectionProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
}

export default function HeroSection({
  searchTerm,
  onSearchChange,
  onSearch,
}: HeroSectionProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      onSearch();
    }
  };

  const handleSearchClick = () => {
    if (searchTerm.trim()) {
      onSearch();
    }
  };
  return (
    <section
      className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white py-20 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url(/wave-background.jpeg)',
        backgroundBlendMode: 'overlay',
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gray-900/60"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Free to Use Badge */}
        <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/30 rounded-full px-4 py-2 mb-6">
          <svg
            className="w-5 h-5 text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="text-green-400 font-medium">100% Free to Use</span>
        </div>

        <h2 className="text-5xl font-bold mb-4">Find Your Perfect Board</h2>
        <p className="text-xl mb-8 text-gray-300">
          Discover quality surfboards from surfers worldwide — no fees, no
          commissions
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search boards..."
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-4 py-3 rounded-lg text-white text-lg placeholder-gray-300 bg-gray-800/50 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-white focus:border-white backdrop-blur-sm"
          />
          <button
            onClick={handleSearchClick}
            className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-md cursor-pointer"
          >
            Search
          </button>
        </div>
      </div>
    </section>
  );
}
