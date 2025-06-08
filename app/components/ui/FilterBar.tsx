import { getUniqueStates, getLocationsByState } from '@/app/data/surfboards';

export default function FilterBar() {
  const states = getUniqueStates();
  const locationsByState = getLocationsByState();

  const selectClassName =
    'appearance-none bg-white px-4 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 hover:border-gray-400 transition-colors cursor-pointer w-full';

  const SelectWithIcon = ({
    children,
    className,
    ...props
  }: {
    children: React.ReactNode;
    className?: string;
  } & React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <div className="relative">
      <select className={className} {...props}>
        {children}
      </select>
      <svg
        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
  );

  return (
    <div className="mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h3 className="text-2xl font-bold text-gray-900">
          Available Surfboards
        </h3>
        <div className="grid grid-cols-2 lg:flex gap-3">
          <SelectWithIcon className={selectClassName}>
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
          </SelectWithIcon>
          <SelectWithIcon className={selectClassName}>
            <option>All Lengths</option>
            <option>Under 6&apos;</option>
            <option>6&apos; - 7&apos;</option>
            <option>7&apos; - 9&apos;</option>
            <option>Over 9&apos;</option>
          </SelectWithIcon>
          <SelectWithIcon className={selectClassName}>
            <option>All Prices</option>
            <option>Under $400</option>
            <option>$400 - $600</option>
            <option>Over $600</option>
          </SelectWithIcon>
          <SelectWithIcon className={selectClassName}>
            <option>Sort by: Newest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Length: Short to Long</option>
            <option>Distance: Closest First</option>
          </SelectWithIcon>
        </div>
      </div>
    </div>
  );
}
