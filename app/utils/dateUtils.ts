/**
 * Check if a board was created within the last 7 days
 * @param createdAt - The creation date (string or Date)
 * @returns boolean - true if the board is less than 7 days old
 */
export function isBoardNew(createdAt: string | Date | undefined): boolean {
  if (!createdAt) {
    return false;
  }

  const createdDate = new Date(createdAt);
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  return createdDate > oneWeekAgo;
}

/**
 * Format a date for display (e.g., "Dec 15, 2023")
 * @param date - The date to format
 * @returns string - Formatted date string
 */
export function formatDisplayDate(date: string | Date | undefined): string {
  if (!date) {
    return '';
  }

  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Get relative time string (e.g., "2 days ago", "1 week ago")
 * @param date - The date to compare
 * @returns string - Relative time string
 */
export function getRelativeTime(date: string | Date | undefined): string {
  if (!date) {
    return '';
  }

  const now = new Date();
  const targetDate = new Date(date);
  const diffInMs = now.getTime() - targetDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return 'Today';
  } else if (diffInDays === 1) {
    return '1 day ago';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInDays < 14) {
    return '1 week ago';
  } else if (diffInDays < 30) {
    return `${Math.floor(diffInDays / 7)} weeks ago`;
  } else if (diffInDays < 60) {
    return '1 month ago';
  } else {
    return `${Math.floor(diffInDays / 30)} months ago`;
  }
}
