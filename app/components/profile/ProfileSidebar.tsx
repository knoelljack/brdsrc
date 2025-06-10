import ProfileAvatar from './ProfileAvatar';
import QuickActions from './QuickActions';
import AccountStats from './AccountStats';

interface ProfileSidebarProps {
  stats: {
    boardsListed: number;
    boardsActive: number;
    boardsSold: number;
    boardsPending: number;
  };
  isLoadingStats: boolean;
  onLoadStats: () => void;
}

export default function ProfileSidebar({
  stats,
  isLoadingStats,
  onLoadStats,
}: ProfileSidebarProps) {
  return (
    <div className="space-y-6">
      <ProfileAvatar />
      <QuickActions />
      <AccountStats
        stats={stats}
        isLoadingStats={isLoadingStats}
        onLoadStats={onLoadStats}
      />
    </div>
  );
}
