import FormInput from '../../ui/FormInput';
import LocationAutocomplete from '../../ui/LocationAutocomplete';
import { ListingFormProps, US_STATES } from '../types/listing';

interface LocationInfoProps extends ListingFormProps {
  mode?: 'create' | 'edit';
  showLocationField?: boolean;
  showCityState?: boolean;
  onLocationSelect?: (location: {
    address: string;
    city: string;
    state: string;
    latitude: number;
    longitude: number;
  }) => void;
}

export default function LocationInfo({
  data,
  onChange,
  showRequiredAsterisk = true,
  mode = 'edit',
  showLocationField = true,
  showCityState = true,
  onLocationSelect,
}: LocationInfoProps) {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  const handleLocationAutocomplete = (location: {
    address: string;
    city: string;
    state: string;
    latitude: number;
    longitude: number;
  }) => {
    // Update form data with location details
    onChange('location', location.address);
    onChange('city', location.city);
    onChange('state', location.state);

    // Call the callback if provided (for coordinates)
    if (onLocationSelect) {
      onLocationSelect(location);
    }
  };

  const selectClassName =
    'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900';

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>

      {showLocationField && mode === 'edit' && (
        <div className="mb-6">
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Location{showRequiredAsterisk ? ' *' : ''}
          </label>
          <LocationAutocomplete
            value={data.location || ''}
            onChange={handleLocationAutocomplete}
            placeholder="Start typing a city or address..."
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Where is the board located for pickup/viewing?
          </p>
        </div>
      )}

      {showCityState && mode === 'create' && (
        <div className="mb-6">
          <label
            htmlFor="location-search"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Location{showRequiredAsterisk ? ' *' : ''}
          </label>
          <LocationAutocomplete
            value={data.location || ''}
            onChange={handleLocationAutocomplete}
            placeholder="Start typing a city or address..."
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Start typing to search for your location. This helps other users
            find boards near them.
          </p>
        </div>
      )}

      {showCityState && mode === 'create' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <FormInput
            id="city"
            label={`City${showRequiredAsterisk ? ' *' : ''}`}
            name="city"
            type="text"
            value={data.city || ''}
            onChange={handleInputChange}
            placeholder="e.g., San Diego"
            required
            disabled
          />

          <div>
            <label
              htmlFor="state"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              State{showRequiredAsterisk ? ' *' : ''}
            </label>
            <select
              id="state"
              name="state"
              value={data.state || ''}
              onChange={handleSelectChange}
              required
              disabled
              className={`${selectClassName} bg-gray-50`}
            >
              <option value="">Select state</option>
              {US_STATES.map(state => (
                <option key={state.value} value={state.value}>
                  {state.label}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              City and state are automatically filled when you select a location
              above.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
