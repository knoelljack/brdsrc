import { useState } from 'react';
import FormInput from '../../ui/FormInput';
import LocationAutocomplete from '../../ui/LocationAutocomplete';
import { ListingFormProps, US_STATES } from '../types/listing';

interface LocationInfoProps extends ListingFormProps {
  mode?: 'create' | 'edit';
  showLocationField?: boolean;
  showCityState?: boolean;
  onLocationSelect?: (location: {
    address: string;
    displayLocation: string;
    city: string;
    state: string;
    latitude: number;
    longitude: number;
    neighborhood?: string;
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
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

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
    displayLocation: string;
    city: string;
    state: string;
    latitude: number;
    longitude: number;
    neighborhood?: string;
  }) => {
    // Update form data with location details - use displayLocation for better UX
    onChange('location', location.displayLocation);
    onChange('city', location.city);
    onChange('state', location.state);

    // Call the callback if provided (for coordinates)
    if (onLocationSelect) {
      onLocationSelect(location);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      return;
    }

    setIsGettingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords;

        try {
          // Reverse geocode to get address using our internal API
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

          const response = await fetch(
            `/api/reverse-geocode?lat=${latitude}&lon=${longitude}`,
            {
              signal: controller.signal,
            }
          );

          clearTimeout(timeoutId);

          if (response.ok) {
            const locationData = await response.json();
            handleLocationAutocomplete(locationData);
            setLocationError(null);
          } else {
            const errorData = await response.json();
            setLocationError(
              errorData.error || 'Unable to determine your address.'
            );
          }
        } catch (error) {
          console.error('Error reverse geocoding:', error);
          if (error instanceof Error && error.name === 'AbortError') {
            setLocationError(
              'Location lookup timed out. Please try typing your location instead.'
            );
          } else {
            setLocationError(
              'Unable to determine your address. Please try typing your location.'
            );
          }
        } finally {
          setIsGettingLocation(false);
        }
      },
      error => {
        console.error('Error getting location:', error);
        let errorMessage = 'Unable to get your location.';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              'Location access denied. Please enable location permissions or type your location below.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage =
              'Location information unavailable. Please try typing your location below.';
            break;
          case error.TIMEOUT:
            errorMessage =
              'Location request timed out. Please try typing your location below.';
            break;
          default:
            errorMessage =
              'Unable to retrieve your location. Please try typing your location below.';
        }

        setLocationError(errorMessage);
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000, // Reduced to 10 seconds like the working home page
        maximumAge: 300000, // 5 minutes cache
      }
    );
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

          <div className="space-y-3">
            <LocationAutocomplete
              value={data.location || ''}
              onChange={handleLocationAutocomplete}
              placeholder="Start typing a city or address..."
              required
            />

            <div className="flex items-center gap-3">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="text-sm text-gray-500">or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isGettingLocation}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGettingLocation ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  Getting your location...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Use My Current Location
                </>
              )}
            </button>

            {locationError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{locationError}</p>
              </div>
            )}
          </div>

          <p className="text-sm text-gray-500 mt-2">
            Start typing to search for your location, or use your current
            location. This helps other users find boards near them.
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
