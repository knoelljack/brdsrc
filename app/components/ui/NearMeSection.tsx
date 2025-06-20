'use client';

import { getSurfboardsNearLocation, Surfboard } from '@/app/data/surfboards';
import { useCallback, useEffect, useState } from 'react';
import SelectWithIcon from './SelectWithIcon';
import SurfboardCard from './SurfboardCard';

interface NearMeSectionProps {
  defaultRadius?: number;
}

export default function NearMeSection({
  defaultRadius = 50,
}: NearMeSectionProps) {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [nearbyBoards, setNearbyBoards] = useState<
    (Surfboard & { distance?: number })[]
  >([]);
  const [radius, setRadius] = useState(defaultRadius);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [hasRequested, setHasRequested] = useState(false);
  const [allSurfboards, setAllSurfboards] = useState<Surfboard[]>([]);
  const [fetchingBoards, setFetchingBoards] = useState(false);

  // Fetch real surfboards from API
  useEffect(() => {
    const fetchSurfboards = async () => {
      setFetchingBoards(true);
      try {
        const response = await fetch('/api/surfboards/browse');
        if (response.ok) {
          const data = await response.json();
          setAllSurfboards(data.surfboards);
        } else {
          console.error('Failed to fetch surfboards');
          setAllSurfboards([]);
        }
      } catch (error) {
        console.error('Error fetching surfboards:', error);
        setAllSurfboards([]);
      } finally {
        setFetchingBoards(false);
      }
    };

    fetchSurfboards();
  }, []);

  // Use the utility function from surfboards data
  const getSurfboardsNearLocationFromCombined = useCallback(
    (
      userLat: number,
      userLng: number,
      radiusMiles: number = 50
    ): (Surfboard & { distance?: number })[] => {
      return getSurfboardsNearLocation(
        allSurfboards,
        userLat,
        userLng,
        radiusMiles
      );
    },
    [allSurfboards]
  );

  const selectClassName =
    'custom-select appearance-none bg-white px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 hover:border-gray-400 transition-colors cursor-pointer w-full';

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    setLoading(true);
    setError('');
    setHasRequested(true);

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setLoading(false);
      },
      error => {
        let errorMessage = 'Unable to retrieve your location.';

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

        setError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  useEffect(() => {
    if (location && allSurfboards.length > 0) {
      const boards = getSurfboardsNearLocationFromCombined(
        location.lat,
        location.lng,
        radius
      );
      setNearbyBoards(boards);
    }
  }, [location, radius, allSurfboards, getSurfboardsNearLocationFromCombined]);

  if (!hasRequested) {
    return (
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="mb-4">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
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
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Find Surfboards Near You
          </h3>
          <p className="text-gray-600 mb-6">
            Discover surfboards available for pickup in your area. We&apos;ll
            show you the closest options first.
          </p>
          <button
            onClick={requestLocation}
            disabled={fetchingBoards}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {fetchingBoards ? (
              <>
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Loading boards...
              </>
            ) : (
              '📍 Find Boards Near Me'
            )}
          </button>
          <p className="text-xs text-gray-500 mt-3">
            We&apos;ll only use your location to show nearby surfboards
          </p>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Getting your location...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="mb-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={requestLocation}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-1">
            Surfboards Near You
          </h3>
          <p className="text-sm text-gray-600">
            Found {nearbyBoards.length} boards within {radius} miles
          </p>
        </div>
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <label htmlFor="radius" className="text-sm font-medium text-gray-700">
            Radius:
          </label>
          <SelectWithIcon
            id="radius"
            value={radius}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setRadius(Number(e.target.value))
            }
            className={selectClassName}
          >
            <option value={25}>25 miles</option>
            <option value={50}>50 miles</option>
            <option value={100}>100 miles</option>
            <option value={200}>200 miles</option>
          </SelectWithIcon>
        </div>
      </div>

      {nearbyBoards.length === 0 ? (
        <div className="text-center py-8">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <p className="text-gray-600 mb-2">
            No surfboards found within {radius} miles
          </p>
          <p className="text-sm text-gray-500">
            Try increasing the search radius
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
          {nearbyBoards.slice(0, 6).map(board => (
            <div key={board.id} className="relative h-full">
              <SurfboardCard board={board} />
              {board.distance && (
                <div className="absolute top-2 right-2 bg-gray-900 text-white text-xs px-2 py-1 rounded-full">
                  {board.distance.toFixed(1)} mi
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {nearbyBoards.length > 6 && (
        <div className="text-center mt-6">
          <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors font-medium text-sm cursor-pointer">
            View All {nearbyBoards.length} Nearby Boards
          </button>
        </div>
      )}
    </section>
  );
}
