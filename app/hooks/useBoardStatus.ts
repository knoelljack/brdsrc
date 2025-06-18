import { useState } from 'react';

export const useBoardStatus = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateBoardStatus = async (
    boardId: string,
    status: 'active' | 'sold'
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/boards/${boardId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update board status');
      }

      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateBoardStatus,
    isLoading,
    error,
  };
};
