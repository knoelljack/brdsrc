import { Surfboard } from '@/app/data/surfboards';
import {
  CONDITION_OPTIONS,
  LENGTH_OPTIONS,
  PRICE_OPTIONS,
  SORT_OPTIONS,
} from '@/app/types/filters';
import SelectWithIcon from './SelectWithIcon';

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
  allSurfboards?: Surfboard[]; // New prop for combined data
}

// Generate location filters dynamically from combined data
const getUniqueStatesFromData = (boards: Surfboard[]): string[] => {
  const states = boards.map(board => board.state).filter(Boolean);
  return Array.from(new Set(states)).sort();
};

const getLocationsByStateFromData = (
  boards: Surfboard[]
): Record<string, string[]> => {
  const locationsByState: Record<string, string[]> = {};

  boards.forEach(board => {
    if (board.state && board.city) {
      if (!locationsByState[board.state]) {
        locationsByState[board.state] = [];
      }
      if (!locationsByState[board.state].includes(board.city)) {
        locationsByState[board.state].push(board.city);
      }
    }
  });

  // Sort cities within each state
  Object.keys(locationsByState).forEach(state => {
    locationsByState[state].sort();
  });

  return locationsByState;
};

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
  allSurfboards = [],
}: FilterBarProps) {
  const states = getUniqueStatesFromData(allSurfboards);
  const locationsByState = getLocationsByStateFromData(allSurfboards);

  const selectClassName =
    'custom-select appearance-none bg-white px-4 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 hover:border-gray-400 transition-colors cursor-pointer w-full';

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
          <div className="min-w-40">
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
          <div className="min-w-36">
            <SelectWithIcon
              className={selectClassName}
              value={lengthFilter}
              onChange={e => onLengthChange(e.target.value)}
            >
              {LENGTH_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectWithIcon>
          </div>
          <div className="min-w-32">
            <SelectWithIcon
              className={selectClassName}
              value={priceFilter}
              onChange={e => onPriceChange(e.target.value)}
            >
              {PRICE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectWithIcon>
          </div>
          {onConditionChange && (
            <div className="min-w-40">
              <SelectWithIcon
                className={selectClassName}
                value={conditionFilter || ''}
                onChange={e => onConditionChange(e.target.value)}
              >
                <option value="">All Conditions</option>
                {CONDITION_OPTIONS.map(condition => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </SelectWithIcon>
            </div>
          )}
          <div className="min-w-44">
            <SelectWithIcon
              className={selectClassName}
              value={sortBy}
              onChange={e => onSortChange(e.target.value)}
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectWithIcon>
          </div>
        </div>
      </div>
    </div>
  );
}
