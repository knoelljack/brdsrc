'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useProfileData } from '../hooks/useProfileData';
import { useAccountStats } from '../hooks/useAccountStats';
import ProfileInformation from '../components/profile/ProfileInformation';
import ProfileSidebar from '../components/profile/ProfileSidebar';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const {
    formData,
    isEditing,
    isLoading,
    setIsEditing,
    handleInputChange,
    handleSave,
    handleCancel,
  } = useProfileData();

  const { stats, isLoadingStats, loadStats } = useAccountStats();

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
        <Footer />
      </div>
    );
  }

  // Redirect if not authenticated
  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <ProfileInformation
              formData={formData}
              isEditing={isEditing}
              isLoading={isLoading}
              onToggleEdit={() => setIsEditing(true)}
              onInputChange={handleInputChange}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ProfileSidebar
              stats={stats}
              isLoadingStats={isLoadingStats}
              onLoadStats={loadStats}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
