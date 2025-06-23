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
            let errorMessage = 'Unable to get your location.';

            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage =
                  'Location access denied. Please enable location permissions.';
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage =
                  'Location information unavailable. Please try again.';
                break;
              case error.TIMEOUT:
                errorMessage = 'Location request timed out. Please try again.';
                break;
              default:
                errorMessage =
                  'Unable to retrieve your location. Please check your location settings.';
            }

            setLocationError(errorMessage);
            setIsLoading(false);
          },
          {
            enableHighAccuracy: true,
            timeout: 15000, // 15 seconds timeout
            maximumAge: 300000, // 5 minutes cache
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
