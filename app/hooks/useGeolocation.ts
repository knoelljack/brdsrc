import { useEffect, useState } from 'react';

interface GeolocationState {
  userLocation: { lat: number; lng: number } | null;
  locationError: string | null;
  isLoading: boolean;
}

export const useGeolocation = (shouldRequest: boolean): GeolocationState => {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (shouldRequest && !userLocation) {
      setIsLoading(true);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            setLocationError(null);
            setIsLoading(false);
          },
          error => {
            console.error('Error getting location:', error);
            setLocationError(
              'Unable to get your location. Please enable location services.'
            );
            setIsLoading(false);
          }
        );
      } else {
        setLocationError('Geolocation is not supported by this browser.');
        setIsLoading(false);
      }
    }
  }, [shouldRequest, userLocation]);

  return { userLocation, locationError, isLoading };
};
