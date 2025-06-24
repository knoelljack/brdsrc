'use client';

import { useCallback, useEffect, useRef } from 'react';

interface LocationResult {
  address: string; // Full formatted address as displayed
  displayLocation: string; // Specific location name (e.g., "Venice, Los Angeles, CA" or "Manhattan Beach, CA")
  city: string; // Administrative city for database/filtering
  state: string;
  latitude: number;
  longitude: number;
  neighborhood?: string; // Specific neighborhood if available
}

interface LocationAutocompleteProps {
  onChange: (location: LocationResult) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  value?: string;
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
  value,
}: LocationAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<GoogleMapsAutocomplete | null>(null);

  // Update input value when value prop changes
  useEffect(() => {
    if (inputRef.current && value !== undefined) {
      inputRef.current.value = value;
    }
  }, [value]);

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

        // Extract location information from address components
        let city = '';
        let state = '';
        let neighborhood = '';
        let sublocality = '';
        let administrativeCity = '';

        // First pass: collect all relevant location components
        for (const component of place.address_components) {
          const types = component.types;

          if (types.includes('neighborhood')) {
            neighborhood = component.long_name;
          } else if (
            types.includes('sublocality') ||
            types.includes('sublocality_level_1')
          ) {
            sublocality = component.long_name;
          } else if (types.includes('locality')) {
            administrativeCity = component.long_name;
          } else if (types.includes('administrative_area_level_1')) {
            state = component.short_name;
          }
        }

        // Build the best display location and determine database city
        let displayLocation = '';
        let specificLocation = '';

        // Prioritize neighborhood > sublocality > administrative city
        if (neighborhood) {
          specificLocation = neighborhood;
          city = administrativeCity || neighborhood; // Use administrative city for database, fallback to neighborhood
        } else if (sublocality) {
          specificLocation = sublocality;
          city = administrativeCity || sublocality;
        } else if (administrativeCity) {
          specificLocation = administrativeCity;
          city = administrativeCity;
        }

        // Build display location string
        if (
          specificLocation &&
          administrativeCity &&
          specificLocation !== administrativeCity
        ) {
          // Show "Venice, Los Angeles, CA" for neighborhoods
          displayLocation = `${specificLocation}, ${administrativeCity}, ${state}`;
        } else if (specificLocation) {
          // Show "Los Angeles, CA" for cities
          displayLocation = `${specificLocation}, ${state}`;
        }

        // Fallback if we couldn't extract proper location info
        if (!city) {
          for (const component of place.address_components) {
            const types = component.types;
            if (
              types.includes('postal_town') ||
              types.includes('administrative_area_level_3')
            ) {
              city = component.long_name;
              break;
            }
          }
        }

        if (city && state && displayLocation) {
          const result: LocationResult = {
            address: place.formatted_address || '',
            displayLocation,
            city: administrativeCity || city, // Use administrative city for database consistency
            state,
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
            neighborhood: neighborhood || sublocality || undefined,
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
