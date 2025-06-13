'use client';

import { useEffect, useRef, useState } from 'react';

interface LocationResult {
  address: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
}

interface LocationAutocompleteProps {
  value: string;
  onChange: (location: LocationResult) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export default function LocationAutocomplete({
  value,
  onChange,
  placeholder = 'Start typing a location...',
  className = '',
  required = false,
}: LocationAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<LocationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Update input value when prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const searchLocations = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);

    try {
      // Check if Google Places API is available
      const hasGooglePlaces =
        typeof window !== 'undefined' &&
        window.google &&
        window.google.maps &&
        window.google.maps.places;

      if (hasGooglePlaces) {
        // Use Google Places API
        const service = new window.google!.maps!.places!.AutocompleteService();

        service.getPlacePredictions(
          {
            input: query,
            types: ['(cities)'],
            componentRestrictions: { country: 'us' },
          },
          (predictions: GoogleMapsPrediction[] | null, status: string) => {
            if (
              status === window.google!.maps!.places!.PlacesServiceStatus.OK &&
              predictions
            ) {
              // Get place details for each prediction
              const placesService =
                new window.google!.maps!.places!.PlacesService(
                  document.createElement('div')
                );

              const results: LocationResult[] = [];
              let completed = 0;

              predictions
                .slice(0, 5)
                .forEach((prediction: GoogleMapsPrediction) => {
                  placesService.getDetails(
                    {
                      placeId: prediction.place_id,
                      fields: [
                        'geometry',
                        'address_components',
                        'formatted_address',
                      ],
                    },
                    (place: GoogleMapsPlace | null, detailStatus: string) => {
                      completed++;

                      if (
                        detailStatus ===
                          window.google!.maps!.places!.PlacesServiceStatus.OK &&
                        place
                      ) {
                        const city =
                          place.address_components?.find(
                            (comp: GoogleMapsAddressComponent) =>
                              comp.types.includes('locality')
                          )?.long_name || '';

                        const state =
                          place.address_components?.find(
                            (comp: GoogleMapsAddressComponent) =>
                              comp.types.includes('administrative_area_level_1')
                          )?.short_name || '';

                        if (city && state && place.geometry?.location) {
                          results.push({
                            address: place.formatted_address || '',
                            city,
                            state,
                            latitude: place.geometry.location.lat(),
                            longitude: place.geometry.location.lng(),
                          });
                        }
                      }

                      if (completed === predictions.slice(0, 5).length) {
                        setSuggestions(results);
                        setIsLoading(false);
                      }
                    }
                  );
                });
            } else {
              setSuggestions([]);
              setIsLoading(false);
            }
          }
        );
      } else {
        // Fallback to OpenStreetMap Nominatim (free geocoding service)
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=us&limit=5&addressdetails=1`
        );

        if (response.ok) {
          const data = await response.json();
          const results: LocationResult[] = data
            .filter(
              (item: OpenStreetMapResult) =>
                item.address?.city && item.address?.state
            )
            .map((item: OpenStreetMapResult) => ({
              address: item.display_name,
              city:
                item.address!.city ||
                item.address!.town ||
                item.address!.village ||
                '',
              state: item.address!.state || '',
              latitude: parseFloat(item.lat),
              longitude: parseFloat(item.lon),
            }));

          setSuggestions(results);
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error searching locations:', error);
      setSuggestions([]);
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setShowSuggestions(true);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce the search
    timeoutRef.current = setTimeout(() => {
      searchLocations(newValue);
    }, 300);
  };

  const handleSuggestionClick = (suggestion: LocationResult) => {
    setInputValue(suggestion.address);
    setShowSuggestions(false);
    setSuggestions([]);
    onChange(suggestion);
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const defaultClassName =
    'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900 placeholder-gray-500';

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(true)}
        onBlur={handleBlur}
        placeholder={placeholder}
        required={required}
        className={className || defaultClassName}
      />

      {showSuggestions && (suggestions.length > 0 || isLoading) && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="px-4 py-3 text-gray-500 text-center">
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
              Searching locations...
            </div>
          ) : (
            suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
              >
                <div className="font-medium text-gray-900">
                  {suggestion.city}, {suggestion.state}
                </div>
                <div className="text-sm text-gray-500 truncate">
                  {suggestion.address}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// Type declarations for Google Maps API
interface GoogleMapsAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface GoogleMapsGeometry {
  location: {
    lat(): number;
    lng(): number;
  };
}

interface GoogleMapsPlace {
  place_id: string;
  formatted_address?: string;
  address_components?: GoogleMapsAddressComponent[];
  geometry?: GoogleMapsGeometry;
}

interface GoogleMapsPrediction {
  place_id: string;
  description: string;
}

interface GoogleMapsAutocompleteService {
  getPlacePredictions(
    request: {
      input: string;
      types?: string[];
      componentRestrictions?: { country: string };
    },
    callback: (
      predictions: GoogleMapsPrediction[] | null,
      status: string
    ) => void
  ): void;
}

interface GoogleMapsPlacesService {
  getDetails(
    request: {
      placeId: string;
      fields: string[];
    },
    callback: (place: GoogleMapsPlace | null, status: string) => void
  ): void;
}

interface OpenStreetMapAddress {
  city?: string;
  town?: string;
  village?: string;
  state?: string;
}

interface OpenStreetMapResult {
  display_name: string;
  lat: string;
  lon: string;
  address?: OpenStreetMapAddress;
}

declare global {
  interface Window {
    google?: {
      maps?: {
        places?: {
          AutocompleteService: new () => GoogleMapsAutocompleteService;
          PlacesService: new (element: HTMLElement) => GoogleMapsPlacesService;
          PlacesServiceStatus: {
            OK: string;
          };
        };
      };
    };
  }
}
