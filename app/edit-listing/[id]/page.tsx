'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import FormInput from '../../components/ui/FormInput';

interface ListingData {
  id: string;
  title: string;
  brand: string;
  length: string;
  price: number;
  condition: string;
  description: string;
  location: string;
  city: string;
  state: string;
  images: string[];
  status: string;
}

export default function EditListingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ListingData>>({
    title: '',
    brand: '',
    length: '',
    price: 0,
    condition: '',
    description: '',
    location: '',
    city: '',
    state: '',
    images: [],
    status: 'active',
  });

  useEffect(() => {
    const loadListing = async () => {
      if (!session?.user?.email || !id) return;

      try {
        setIsLoading(true);
        const response = await fetch(`/api/edit-listing/${id}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to load listing');
        }

        const listing = await response.json();
        setFormData(listing);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load listing');
      } finally {
        setIsLoading(false);
      }
    };

    loadListing();
  }, [session, id]);

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

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (
      !formData.title ||
      !formData.brand ||
      !formData.length ||
      !formData.price ||
      !formData.condition ||
      !formData.location
    ) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch(`/api/edit-listing/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update listing');
      }

      router.push('/my-listings');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/my-listings');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-3 text-gray-600">Loading listing...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (error && !formData.id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Header />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-400 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-red-800">{error}</p>
            </div>
            <button
              onClick={handleCancel}
              className="mt-4 bg-red-100 text-red-800 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
            >
              Back to My Listings
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Edit Listing
          </h1>
          <p className="text-gray-600">Update your surfboard listing details</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-400 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                id="title"
                label="Board Title"
                name="title"
                type="text"
                value={formData.title || ''}
                onChange={handleInputChange}
                placeholder="e.g., Used 6'2 Shortboard"
                required
              />
              <FormInput
                id="brand"
                label="Brand"
                name="brand"
                type="text"
                value={formData.brand || ''}
                onChange={handleInputChange}
                placeholder="e.g., Lost, DHD, Firewire"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                id="length"
                label="Length"
                name="length"
                type="text"
                value={formData.length || ''}
                onChange={handleInputChange}
                placeholder="e.g., 6'2"
                required
              />
              <FormInput
                id="price"
                label="Price ($)"
                name="price"
                type="number"
                value={formData.price || ''}
                onChange={handleInputChange}
                placeholder="0"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="condition"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Condition <span className="text-red-500">*</span>
                </label>
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                >
                  <option value="">Select condition</option>
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status || 'active'}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending Sale</option>
                  <option value="sold">Sold</option>
                </select>
              </div>
            </div>

            <FormInput
              id="location"
              label="Location"
              name="location"
              type="text"
              value={formData.location || ''}
              onChange={handleInputChange}
              placeholder="e.g., San Diego, CA"
              helpText="Where is the board located for pickup/viewing?"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                id="city"
                label="City"
                name="city"
                type="text"
                value={formData.city || ''}
                onChange={handleInputChange}
                placeholder="e.g., San Diego"
              />
              <FormInput
                id="state"
                label="State"
                name="state"
                type="text"
                value={formData.state || ''}
                onChange={handleInputChange}
                placeholder="e.g., CA"
              />
            </div>

            <FormInput
              id="description"
              label="Description"
              name="description"
              type="textarea"
              value={formData.description || ''}
              onChange={handleInputChange}
              placeholder="Describe the surfboard's condition, history, and any notable features..."
              helpText="Provide details about dings, repairs, performance, etc."
            />

            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="flex-1 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Updating...' : 'Update Listing'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
