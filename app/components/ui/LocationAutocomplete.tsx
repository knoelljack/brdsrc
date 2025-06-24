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

// Google Maps type declarations
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

// Simple interface declarations for Google Maps
interface GoogleMapsLatLng {
  lat(): number;
  lng(): number;
}

interface GoogleMapsAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface GoogleMapsPlaceResult {
  geometry?: {
    location: GoogleMapsLatLng;
  };
  address_components?: GoogleMapsAddressComponent[];
  formatted_address?: string;
}

interface GoogleMapsAutocomplete {
  addListener(eventName: string, handler: () => void): void;
  getPlace(): GoogleMapsPlaceResult;
}

interface GoogleMapsAutocompleteOptions {
  types?: string[];
  componentRestrictions?: {
    country: string;
  };
  fields?: string[];
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
    console.log('🔧 initializeAutocomplete called');
    console.log('📱 User agent:', navigator.userAgent);
    console.log('🌍 Google available:', !!window.google);
    console.log('🗺️ Google maps available:', !!window.google?.maps);
    console.log('📍 Google places available:', !!window.google?.maps?.places);
    console.log(
      '🔍 Autocomplete constructor available:',
      !!window.google?.maps?.places?.Autocomplete
    );

    // Check if API key is present in the script
    const scripts = document.querySelectorAll(
      'script[src*="maps.googleapis.com"]'
    );
    const mapsScript = Array.from(scripts).find(script =>
      script.getAttribute('src')?.includes('maps.googleapis.com')
    );
    if (mapsScript) {
      const src = mapsScript.getAttribute('src');
      const hasKey = src?.includes('key=') && !src.includes('key=&');
      console.log('🔑 API key present in script:', hasKey);
      console.log('📜 Script src:', src?.substring(0, 100) + '...');
    } else {
      console.error('❌ No Google Maps script found');
    }

    if (!inputRef.current) {
      console.error('❌ Input ref not available');
      return;
    }

    if (!window.google?.maps?.places?.Autocomplete) {
      console.error('❌ Google Places Autocomplete not available');
      return;
    }

    console.log('✅ All requirements met, creating autocomplete...');

    try {
      // Clean up existing instance
      if (autocompleteRef.current) {
        console.log('🧹 Cleaning up existing autocomplete instance');
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }

      // Create new autocomplete instance
      console.log('🏗️ Creating new autocomplete instance');
      const autocomplete = new google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ['geocode'],
          componentRestrictions: { country: 'us' },
          fields: ['address_components', 'geometry', 'formatted_address'],
        }
      );

      console.log('✅ Autocomplete instance created successfully');
      autocompleteRef.current = autocomplete;

      // Add place selection listener
      console.log('👂 Adding place_changed listener');
      autocomplete.addListener('place_changed', () => {
        console.log('🎯 place_changed event fired!');
        const place = autocomplete.getPlace();
        console.log('📍 Place result:', place);

        if (!place.geometry?.location || !place.address_components) {
          console.warn('❌ Invalid place data:', {
            hasGeometry: !!place.geometry,
            hasLocation: !!place.geometry?.location,
            hasAddressComponents: !!place.address_components,
          });
          return;
        }

        console.log('🔍 Processing address components...');
        // Extract city and state from address components
        let city = '';
        let state = '';

        for (const component of place.address_components) {
          const types = component.types;

          if (types.includes('locality')) {
            city = component.long_name;
            console.log('🏙️ Found locality:', city);
          } else if (types.includes('administrative_area_level_1')) {
            state = component.short_name;
            console.log('🗺️ Found state:', state);
          }
        }

        // Fallback for city if locality not found
        if (!city) {
          console.log('🔍 No locality found, checking fallbacks...');
          for (const component of place.address_components) {
            const types = component.types;

            if (
              types.includes('sublocality') ||
              types.includes('neighborhood')
            ) {
              city = component.long_name;
              console.log('🏘️ Found fallback city:', city);
              break;
            }
          }
        }

        console.log('📋 Final extraction result:', { city, state });

        if (city && state) {
          const result: LocationResult = {
            address: place.formatted_address || '',
            city,
            state,
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
          };

          console.log('✅ Calling onChange with result:', result);
          onChange(result);
        } else {
          console.warn('❌ Missing required data:', { city, state });
        }
      });

      console.log('✅ Autocomplete setup complete');
    } catch (error) {
      console.error('💥 Error in initializeAutocomplete:', error);
      console.error('Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
  }, [onChange]);

  // Initialize when Google Maps loads
  useEffect(() => {
    console.log('🚀 useEffect triggered');
    console.log('📊 Current state:', {
      googleAvailable: !!window.google,
      mapsAvailable: !!window.google?.maps,
      placesAvailable: !!window.google?.maps?.places,
      autocompleteAvailable: !!window.google?.maps?.places?.Autocomplete,
    });

    if (window.google?.maps?.places?.Autocomplete) {
      console.log('✅ Google Maps already loaded, initializing immediately');
      initializeAutocomplete();
    } else {
      console.log('⏳ Google Maps not ready, starting polling...');
      let attempts = 0;
      const maxAttempts = 100; // 10 seconds max

      // Wait for Google Maps to load
      const checkGoogle = () => {
        attempts++;
        console.log(`🔄 Polling attempt ${attempts}/${maxAttempts}`);

        if (window.google?.maps?.places?.Autocomplete) {
          console.log('✅ Google Maps loaded after polling, initializing...');
          initializeAutocomplete();
        } else if (attempts >= maxAttempts) {
          console.error('💥 Google Maps failed to load after maximum attempts');
          console.error('Final state:', {
            google: !!window.google,
            maps: !!window.google?.maps,
            places: !!window.google?.maps?.places,
            autocomplete: !!window.google?.maps?.places?.Autocomplete,
          });
        } else {
          setTimeout(checkGoogle, 100);
        }
      };
      checkGoogle();
    }

    // Cleanup on unmount
    return () => {
      console.log('🧹 Component unmounting, cleaning up');
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
      onFocus={() => console.log('🎯 Input focused')}
      onBlur={() => console.log('👋 Input blurred')}
      onChange={e => console.log('✏️ Input changed:', e.target.value)}
      onInput={e =>
        console.log('📝 Input event:', (e.target as HTMLInputElement).value)
      }
      onKeyDown={e => console.log('⌨️ Key down:', e.key)}
      onTouchStart={() => console.log('👆 Touch start')}
      onTouchEnd={() => console.log('👆 Touch end')}
    />
  );
}
