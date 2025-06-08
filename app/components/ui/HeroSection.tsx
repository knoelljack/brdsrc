export default function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold mb-4">
          Find Your Perfect Wave Rider
        </h2>
        <p className="text-xl mb-8 text-blue-100">
          Discover quality surfboards from surfers worldwide
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search boards..."
            className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Search
          </button>
        </div>
      </div>
    </section>
  );
}
