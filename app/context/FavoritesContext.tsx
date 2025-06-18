'use client';

import { useSession } from 'next-auth/react';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Surfboard } from '../data/surfboards';

export interface FavoriteSurfboard extends Surfboard {
  favoritedAt: string;
}

interface FavoritesContextType {
  favorites: FavoriteSurfboard[];
  isLoading: boolean;
  error: string | null;
  isFavorited: (surfboardId: string) => boolean;
  addToFavorites: (surfboardId: string) => Promise<boolean>;
  removeFromFavorites: (surfboardId: string) => Promise<boolean>;
  toggleFavorite: (surfboardId: string) => Promise<boolean>;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState<FavoriteSurfboard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's favorites
  const fetchFavorites = useCallback(async () => {
    // Don't fetch if session is loading or user is not authenticated
    if (status === 'loading' || !session?.user) {
      setFavorites([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/favorites');

      if (!response.ok) {
        if (response.status === 401) {
          setFavorites([]);
          return;
        }
        throw new Error('Failed to fetch favorites');
      }

      const data = await response.json();
      setFavorites(data.favorites || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch favorites'
      );
      console.error('Error fetching favorites:', err);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user, status]);

  // Load favorites on mount and when session changes
  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Check if a surfboard is favorited
  const isFavorited = useCallback(
    (surfboardId: string): boolean => {
      return favorites.some(fav => fav.id === surfboardId);
    },
    [favorites]
  );

  // Add surfboard to favorites
  const addToFavorites = useCallback(
    async (surfboardId: string): Promise<boolean> => {
      if (!session?.user) {
        setError('You must be logged in to add favorites');
        return false;
      }

      try {
        setError(null);

        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ surfboardId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to add to favorites');
        }

        // Refresh favorites to get the updated list
        await fetchFavorites();
        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to add to favorites'
        );
        console.error('Error adding to favorites:', err);
        return false;
      }
    },
    [fetchFavorites, session?.user]
  );

  // Remove surfboard from favorites
  const removeFromFavorites = useCallback(
    async (surfboardId: string): Promise<boolean> => {
      if (!session?.user) {
        setError('You must be logged in to remove favorites');
        return false;
      }

      try {
        setError(null);

        const response = await fetch(`/api/favorites/${surfboardId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to remove from favorites');
        }

        // Update local state immediately for better UX
        setFavorites(prev => prev.filter(fav => fav.id !== surfboardId));
        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to remove from favorites'
        );
        console.error('Error removing from favorites:', err);
        return false;
      }
    },
    [session?.user]
  );

  // Toggle favorite status
  const toggleFavorite = useCallback(
    async (surfboardId: string): Promise<boolean> => {
      if (isFavorited(surfboardId)) {
        return await removeFromFavorites(surfboardId);
      } else {
        return await addToFavorites(surfboardId);
      }
    },
    [isFavorited, addToFavorites, removeFromFavorites]
  );

  const value: FavoritesContextType = {
    favorites,
    isLoading,
    error,
    isFavorited,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    refreshFavorites: fetchFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextType {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
