import { getUniqueStates, getLocationsByState } from '@/app/data/surfboards';

interface FilterBarProps {
  locationFilter: string;
  lengthFilter: string;
  priceFilter: string;
  conditionFilter?: string;
  sortBy: string;
  onLocationChange: (value: string) => void;
  onLengthChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onConditionChange?: (value: string) => void;
  onSortChange: (value: string) => void;
  totalCount?: number;
  searchTerm?: string;
}

export default function FilterBar({
  locationFilter,
  lengthFilter,
  priceFilter,
  conditionFilter,
  sortBy,
  onLocationChange,
  onLengthChange,
  onPriceChange,
  onConditionChange,
  onSortChange,
  totalCount,
  searchTerm,
}: FilterBarProps) {
  const states = getUniqueStates();
  const locationsByState = getLocationsByState();

  const selectClassName =
    'custom-select appearance-none bg-white px-4 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 hover:border-gray-400 transition-colors cursor-pointer w-full min-w-0';

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
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-bold text-gray-900">
            Available Surfboards
            {totalCount !== undefined && (
              <span className="text-lg font-normal text-gray-600 ml-2">
                ({totalCount})
              </span>
            )}
          </h3>
          {searchTerm && (
            <p className="text-sm text-gray-600">
              Search results for:{' '}
              <span className="font-medium">&quot;{searchTerm}&quot;</span>
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:flex gap-3">
          <div className="min-w-[140px]">
            <SelectWithIcon
              className={selectClassName}
              value={locationFilter}
              onChange={e => onLocationChange(e.target.value)}
            >
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
          </div>
          <div className="min-w-[120px]">
            <SelectWithIcon
              className={selectClassName}
              value={lengthFilter}
              onChange={e => onLengthChange(e.target.value)}
            >
              <option value="">All Lengths</option>
              <option value="Under 7'">Under 7&apos;</option>
              <option value="7' - 9'">7&apos; - 9&apos;</option>
              <option value="Over 9'">Over 9&apos;</option>
            </SelectWithIcon>
          </div>
          <div className="min-w-[110px]">
            <SelectWithIcon
              className={selectClassName}
              value={priceFilter}
              onChange={e => onPriceChange(e.target.value)}
            >
              <option value="">All Prices</option>
              <option value="Under $400">Under $400</option>
              <option value="$400 - $600">$400 - $600</option>
              <option value="Over $600">Over $600</option>
            </SelectWithIcon>
          </div>
          {onConditionChange && (
            <div className="min-w-[130px]">
              <SelectWithIcon
                className={selectClassName}
                value={conditionFilter || ''}
                onChange={e => onConditionChange(e.target.value)}
              >
                <option value="">All Conditions</option>
                <option value="Excellent">Excellent</option>
                <option value="Very Good">Very Good</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </SelectWithIcon>
            </div>
          )}
          <div className="min-w-[160px]">
            <SelectWithIcon
              className={selectClassName}
              value={sortBy}
              onChange={e => onSortChange(e.target.value)}
            >
              <option value="newest">Sort by: Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="length-short">Length: Short to Long</option>
              <option value="distance">Distance: Closest First</option>
            </SelectWithIcon>
          </div>
        </div>
      </div>
    </div>
  );
}
