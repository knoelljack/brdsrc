import { signOut } from 'next-auth/react';
import { useState } from 'react';

interface AccountDeletionState {
  isDeleting: boolean;
  error: string | null;
  deleteAccount: (confirmationText: string) => Promise<boolean>;
}

export const useAccountDeletion = (): AccountDeletionState => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteAccount = async (confirmationText: string): Promise<boolean> => {
    if (!confirmationText) {
      setError('Confirmation text is required');
      return false;
    }

    if (confirmationText !== 'DELETE MY ACCOUNT') {
      setError('Please type "DELETE MY ACCOUNT" exactly to confirm');
      return false;
    }

    try {
      setIsDeleting(true);
      setError(null);

      const response = await fetch('/api/account/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ confirmationText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete account');
      }

      // Sign out the user after successful deletion
      await signOut({ callbackUrl: '/' });
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account');
      console.error('Error deleting account:', err);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    error,
    deleteAccount,
  };
};
