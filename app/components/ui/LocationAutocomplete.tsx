'use client';

import { useCallback, useEffect, useRef } from 'react';

interface LocationResult {
  address: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
}

interface LocationAutocompleteProps {
  onChange: (location: LocationResult) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

interface GoogleMapsAutocompleteOptions {
  types: string[];
  componentRestrictions: { country: string };
  fields: string[];
}

interface GoogleMapsAutocomplete {
  addListener: (event: string, callback: () => void) => void;
  getPlace: () => {
    formatted_address?: string;
    address_components?: Array<{
      long_name: string;
      short_name: string;
      types: string[];
    }>;
    geometry?: {
      location: {
        lat: () => number;
        lng: () => number;
      };
    };
  };
}

declare global {
  interface Window {
    google?: {
      maps?: {
        places?: {
          Autocomplete: new (
            inputField: HTMLInputElement,
            opts?: GoogleMapsAutocompleteOptions
          ) => GoogleMapsAutocomplete;
        };
        event?: {
          clearInstanceListeners: (instance: GoogleMapsAutocomplete) => void;
        };
      };
    };
  }
}

declare const google: {
  maps: {
    places: {
      Autocomplete: new (
        inputField: HTMLInputElement,
        opts?: GoogleMapsAutocompleteOptions
      ) => GoogleMapsAutocomplete;
    };
    event: {
      clearInstanceListeners: (instance: GoogleMapsAutocomplete) => void;
    };
  };
};

export default function LocationAutocomplete({
  onChange,
  placeholder = 'Enter city and state',
  className = '',
  required = false,
}: LocationAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<GoogleMapsAutocomplete | null>(null);

  const initializeAutocomplete = useCallback(() => {
    if (!inputRef.current) {
      return;
    }

    if (!window.google?.maps?.places?.Autocomplete) {
      return;
    }

    try {
      // Clean up existing instance
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }

      // Create new autocomplete instance
      const autocomplete = new google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ['geocode'],
          componentRestrictions: { country: 'us' },
          fields: ['address_components', 'geometry', 'formatted_address'],
        }
      );

      autocompleteRef.current = autocomplete;

      // Add place selection listener
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();

        if (!place.geometry?.location || !place.address_components) {
          return;
        }

        // Extract city and state from address components
        let city = '';
        let state = '';

        for (const component of place.address_components) {
          const types = component.types;

          if (types.includes('locality')) {
            city = component.long_name;
          } else if (types.includes('administrative_area_level_1')) {
            state = component.short_name;
          }
        }

        // Fallback for city if locality not found
        if (!city) {
          for (const component of place.address_components) {
            const types = component.types;

            if (
              types.includes('sublocality') ||
              types.includes('neighborhood')
            ) {
              city = component.long_name;
              break;
            }
          }
        }

        if (city && state) {
          const result: LocationResult = {
            address: place.formatted_address || '',
            city,
            state,
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
          };

          onChange(result);
        }
      });
    } catch (error) {
      console.error('Error initializing autocomplete:', error);
    }
  }, [onChange]);

  // Initialize when Google Maps loads
  useEffect(() => {
    if (window.google?.maps?.places?.Autocomplete) {
      initializeAutocomplete();
    } else {
      // Wait for Google Maps to load
      let attempts = 0;
      const maxAttempts = 100; // 10 seconds max

      const checkGoogle = () => {
        attempts++;

        if (window.google?.maps?.places?.Autocomplete) {
          initializeAutocomplete();
        } else if (attempts < maxAttempts) {
          setTimeout(checkGoogle, 100);
        }
      };
      checkGoogle();
    }

    // Cleanup on unmount
    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [initializeAutocomplete]);

  const defaultClassName =
    'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900 placeholder-gray-500';

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder={placeholder}
      required={required}
      className={className || defaultClassName}
      autoComplete="off"
    />
  );
}
