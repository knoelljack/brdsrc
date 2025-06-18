import { useEffect, useMemo, useState } from 'react';
import { surfboards as dummySurfboards, Surfboard } from '../data/surfboards';

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

    // Combine dummy and real surfboards
    const allSurfboards = useMemo(() => {
        // Add offset to dummy board IDs to avoid conflicts
        const adjustedDummyBoards = dummySurfboards.map(board => ({
            ...board,
            id: (board.id as number) + 10000,
        }));

        return [...realSurfboards, ...adjustedDummyBoards];
    }, [realSurfboards]);

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
