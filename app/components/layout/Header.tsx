import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt="BoardSource Logo"
              width={64}
              height={64}
              className="h-16 w-16"
            />
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-gray-900 leading-tight">
                BoardSource
              </h1>
              <span className="text-xs text-gray-500 leading-tight">
                Surfboard Marketplace
              </span>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a
              href="#"
              className="text-gray-700 hover:text-gray-900 transition-colors font-medium py-2 cursor-pointer"
            >
              Browse
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-gray-900 transition-colors font-medium py-2 cursor-pointer"
            >
              Sell
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-gray-900 transition-colors font-medium py-2 cursor-pointer"
            >
              About
            </a>
            <button className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium ml-2 cursor-pointer">
              Sign In
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
