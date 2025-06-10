export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h5 className="text-lg font-semibold mb-4">BoardSource</h5>
            <p className="text-gray-400 text-sm">
              The ultimate marketplace for buying and selling surfboards.
            </p>
          </div>
          <div>
            <h6 className="font-semibold mb-3">Marketplace</h6>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a
                  href="/browse"
                  className="hover:text-white transition-colors"
                >
                  Browse Boards
                </a>
              </li>
              <li>
                <a href="/sell" className="hover:text-white transition-colors">
                  Sell Your Board
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h6 className="font-semibold mb-3">Support</h6>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a
                  href="mailto:hello@brdsrc.com"
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 BoardSource. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
