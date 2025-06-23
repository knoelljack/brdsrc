import { useEffect, useState } from 'react';
import { Surfboard } from '../data/surfboards';

interface SurfboardsState {
  allSurfboards: Surfboard[];
  realSurfboards: Surfboard[];
  isLoading: boolean;
  error: string | null;
}

export const useSurfboards = (): SurfboardsState => {
  const [realSurfboards, setRealSurfboards] = useState<Surfboard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // PRODUCTION: Only use real surfboards from database
  const allSurfboards = realSurfboards;

  // Fetch real surfboards from API
  useEffect(() => {
    const fetchSurfboards = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/surfboards/browse');
        if (response.ok) {
          const data = await response.json();
          setRealSurfboards(data.surfboards);
        } else {
          throw new Error('Failed to fetch surfboards');
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch surfboards';
        setError(errorMessage);
        console.error('Error fetching surfboards:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurfboards();
  }, []);

  return {
    allSurfboards,
    realSurfboards,
    isLoading,
    error,
  };
};
