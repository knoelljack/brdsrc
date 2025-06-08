export default function FilterBar() {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">
          Available Surfboards
        </h3>
        <div className="flex flex-wrap gap-2">
          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500">
            <option>All Lengths</option>
            <option>Under 6&apos;</option>
            <option>6&apos; - 7&apos;</option>
            <option>7&apos; - 9&apos;</option>
            <option>Over 9&apos;</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500">
            <option>All Prices</option>
            <option>Under $400</option>
            <option>$400 - $600</option>
            <option>Over $600</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500">
            <option>Sort by: Newest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Length: Short to Long</option>
          </select>
        </div>
      </div>
    </div>
  );
}
