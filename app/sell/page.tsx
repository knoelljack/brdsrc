'use client';

import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';
import {
  BasicBoardInfo,
  BoardConditionStatus,
  BoardDescription,
  ContactInfo,
  LocationInfo,
  useListingForm,
} from '../components/listings';

const ImageUploadCloud = dynamic(
  () => import('../components/ui/ImageUploadCloud'),
  {
    ssr: false,
  }
);

export default function SellPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [coordinates, setCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const { formData, handleChange, validateForm, resetForm } = useListingForm({
    mode: 'create',
  });

  // Contact info state
  const [contactInfo, setContactInfo] = useState({
    contactName: session?.user?.name || '',
    contactEmail: session?.user?.email || '',
    contactPhone: '',
  });

  const handleLocationSelect = (location: {
    address: string;
    city: string;
    state: string;
    latitude: number;
    longitude: number;
  }) => {
    setCoordinates({
      latitude: location.latitude,
      longitude: location.longitude,
    });
  };

  const handleContactChange = (name: string, value: string) => {
    setContactInfo(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.id) {
      alert('You must be signed in to create a listing');
      return;
    }

    if (!validateForm()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload images using the upload API route
      const imageUrls: string[] = [];

      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || 'Upload failed');
        }

        const uploadResult = await uploadResponse.json();
        imageUrls.push(uploadResult.url);
      }

      // Create the listing with coordinates
      const listingData = {
        ...formData,
        images: imageUrls,
        userId: session.user.id,
        latitude: coordinates?.latitude || null,
        longitude: coordinates?.longitude || null,
      };

      const response = await fetch('/api/surfboards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create listing');
      }

      await response.json();

      // Reset form and redirect
      resetForm();
      setSelectedFiles([]);
      setCoordinates(null);
      router.push('/profile?tab=listings');
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to create listing. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Sell Your Surfboard
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              List your surfboard on BoardSource and connect with surfers
              worldwide. It&apos;s free, fast, and easy to get started.
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {status === 'loading' ? (
          // Loading state
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        ) : !session ? (
          // Not authenticated - show gated message
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Sign In Required
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                You must be logged in to list a surfboard on BoardSource. Sign
                in or create an account to get started.
              </p>
              <div className="space-y-4">
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gray-900 hover:bg-gray-800 transition-colors"
                >
                  Sign In to List Your Board
                </Link>
                <div className="text-sm text-gray-500">
                  Don&apos;t have an account?{' '}
                  <Link
                    href="/auth/register"
                    className="font-medium text-gray-900 hover:text-gray-700"
                  >
                    Create one here
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Authenticated - show the form
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Surfboard Details
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Provide accurate information to help buyers find your board
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  Signed in as{' '}
                  <span className="font-medium">{session.user?.email}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              <BasicBoardInfo data={formData} onChange={handleChange} />

              <BoardConditionStatus data={formData} onChange={handleChange} />

              <LocationInfo
                data={formData}
                onChange={handleChange}
                mode="create"
                onLocationSelect={handleLocationSelect}
              />

              <BoardDescription data={formData} onChange={handleChange} />

              {/* Image Upload */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <ImageUploadCloud
                  onImagesChange={setSelectedFiles}
                  maxImages={8}
                  initialImages={selectedFiles}
                />
              </div>

              <ContactInfo data={contactInfo} onChange={handleContactChange} />

              {/* Privacy Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Privacy Notice
                    </h3>
                    <div className="mt-1 text-sm text-blue-700">
                      <p>
                        To protect your privacy, we will only display your first
                        name on the listing details. Your email and phone number
                        will only be shared with serious inquirers when they
                        contact you about your board.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms and Submit */}
              <div className="border-t border-gray-200 pt-8">
                <div className="mb-6">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      required
                      className="mt-1 mr-3 h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-500"
                    />
                    <span className="text-sm text-gray-700">
                      I agree to BoardSource&apos;s{' '}
                      <a href="#" className="text-gray-900 hover:underline">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-gray-900 hover:underline">
                        Privacy Policy
                      </a>
                      . I confirm that I own this surfboard and have the right
                      to sell it.
                    </span>
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Listing...
                      </>
                    ) : (
                      'List My Surfboard'
                    )}
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    Save as Draft
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Help Section */}
        {session && (
          <div className="mt-12 bg-gray-50 rounded-lg p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Need Help?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Pricing Tips</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Research similar boards currently for sale</li>
                  <li>• Consider the board&apos;s age and condition</li>
                  <li>• Factor in brand reputation and model popularity</li>
                  <li>• Be competitive but fair to yourself</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Photo & Listing Tips
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Upload photos from multiple angles</li>
                  <li>• Show any damage or wear clearly</li>
                  <li>• Write a detailed, honest description</li>
                  <li>• Include dimensions and volume if known</li>
                  <li>• Respond promptly to inquiries</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
