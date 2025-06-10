import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface ProfileData {
  name: string;
  email: string;
  location: string;
  phone: string;
}

export function useProfileData() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState<ProfileData>({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    location: '',
    phone: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load profile data when session is available
  useEffect(() => {
    const loadProfile = async () => {
      if (session?.user?.email) {
        try {
          setIsLoading(true);
          const response = await fetch('/api/profile');
          if (response.ok) {
            const profileData = await response.json();
            setFormData({
              name: profileData.name || '',
              email: profileData.email || '',
              location: profileData.location || '',
              phone: profileData.phone || '',
            });
          }
        } catch (error) {
          console.error('Failed to load profile:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadProfile();
  }, [session]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Profile update failed:', error);
        alert(error.error || 'Failed to update profile');
        return;
      }

      const updatedUser = await response.json();

      // Update form data with the response
      setFormData(prev => ({
        ...prev,
        ...updatedUser,
      }));
      setIsEditing(false);

      // Show success message
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: session?.user?.name || '',
      email: session?.user?.email || '',
      location: '',
      phone: '',
    });
    setIsEditing(false);
  };

  return {
    formData,
    isEditing,
    isLoading,
    setIsEditing,
    handleInputChange,
    handleSave,
    handleCancel,
  };
}
