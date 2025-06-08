import { getUniqueStates, getLocationsByState } from '@/app/data/surfboards';

export default function FilterBar() {
  const states = getUniqueStates();
  const locationsByState = getLocationsByState();

  const selectClassName =
    "appearance-none bg-white px-4 py-2.5 pr-8 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 hover:border-gray-400 transition-colors cursor-pointer bg-[url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27m6 8 4 4 4-4%27/%3e%3c/svg%3e')] bg-[position:right_0.5rem_center] bg-[size:1.5em_1.5em] bg-no-repeat";

  return (
    <div className="mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h3 className="text-2xl font-bold text-gray-900">
          Available Surfboards
        </h3>
        <div className="grid grid-cols-2 lg:flex gap-3">
          <select className={selectClassName}>
            <option value="">All Locations</option>
            <option value="near-me" className="font-semibold">
              📍 Near Me
            </option>
            <optgroup label="──────────────"></optgroup>
            {states.map(state => (
              <optgroup key={state} label={`${state} ────────`}>
                {locationsByState[state].map(city => (
                  <option key={`${city}-${state}`} value={`${city},${state}`}>
                    {city}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <select className={selectClassName}>
            <option>All Lengths</option>
            <option>Under 6&apos;</option>
            <option>6&apos; - 7&apos;</option>
            <option>7&apos; - 9&apos;</option>
            <option>Over 9&apos;</option>
          </select>
          <select className={selectClassName}>
            <option>All Prices</option>
            <option>Under $400</option>
            <option>$400 - $600</option>
            <option>Over $600</option>
          </select>
          <select className={selectClassName}>
            <option>Sort by: Newest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Length: Short to Long</option>
            <option>Distance: Closest First</option>
          </select>
        </div>
      </div>
    </div>
  );
}
