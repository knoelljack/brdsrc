import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface AccountStats {
  boardsListed: number;
  boardsActive: number;
  boardsSold: number;
  boardsPending: number;
}

export function useAccountStats() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<AccountStats>({
    boardsListed: 0,
    boardsActive: 0,
    boardsSold: 0,
    boardsPending: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  const loadStats = useCallback(async () => {
    if (session?.user?.email) {
      try {
        setIsLoadingStats(true);
        const response = await fetch('/api/profile/stats');
        if (response.ok) {
          const statsData = await response.json();
          setStats(statsData);
        }
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setIsLoadingStats(false);
      }
    }
  }, [session?.user?.email]);

  return {
    stats,
    isLoadingStats,
    loadStats,
  };
}
