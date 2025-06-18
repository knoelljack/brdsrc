'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';
import ProfileInformation from '../components/profile/ProfileInformation';
import ProfileSidebar from '../components/profile/ProfileSidebar';
import DeleteAccountModal from '../components/ui/DeleteAccountModal';
import { useAccountStats } from '../hooks/useAccountStats';
import { useProfileData } from '../hooks/useProfileData';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
          <div className="lg:col-span-2 space-y-8">
            <ProfileInformation
              formData={formData}
              isEditing={isEditing}
              isLoading={isLoading}
              onToggleEdit={() => setIsEditing(true)}
              onInputChange={handleInputChange}
              onSave={handleSave}
              onCancel={handleCancel}
            />

            {/* Danger Zone */}
            <div className="bg-white rounded-lg shadow-sm border border-red-200">
              <div className="border-b border-red-200 px-6 py-4">
                <h3 className="text-lg font-semibold text-red-600">
                  Danger Zone
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Irreversible and destructive actions
                </p>
              </div>
              <div className="px-6 py-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-base font-medium text-gray-900">
                      Delete Account
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Permanently delete your account and all associated data.
                      This action cannot be undone.
                    </p>
                    <div className="mt-3 text-xs text-gray-500">
                      <p className="font-medium mb-1">This will delete:</p>
                      <ul className="space-y-0.5">
                        <li>• Your profile and account information</li>
                        <li>• All your surfboard listings</li>
                        <li>• Your favorites and saved boards</li>
                        <li>• All authentication sessions</li>
                      </ul>
                    </div>
                  </div>
                  <div className="ml-6">
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
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

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
