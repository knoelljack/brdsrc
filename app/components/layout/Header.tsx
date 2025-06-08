export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">BoardSource</h1>
            <span className="ml-2 text-sm text-gray-500">
              Surfboard Marketplace
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a
              href="#"
              className="text-gray-700 hover:text-gray-900 transition-colors font-medium py-2"
            >
              Browse
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-gray-900 transition-colors font-medium py-2"
            >
              Sell
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-gray-900 transition-colors font-medium py-2"
            >
              About
            </a>
            <button className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium ml-2">
              Sign In
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
