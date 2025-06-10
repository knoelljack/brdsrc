import { useState, useCallback } from 'react';
import { BaseListingData } from '../types/listing';

interface UseListingFormProps {
  initialData?: Partial<BaseListingData>;
  mode?: 'create' | 'edit';
}

export function useListingForm({
  initialData,
  mode = 'create',
}: UseListingFormProps = {}) {
  const [formData, setFormData] = useState<Partial<BaseListingData>>({
    title: '',
    brand: '',
    length: '',
    price: 0,
    condition: undefined,
    description: '',
    location: '',
    city: '',
    state: '',
    ...initialData,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = useCallback(
    (name: string, value: string | number) => {
      setFormData(prev => ({
        ...prev,
        [name]:
          name === 'price'
            ? typeof value === 'string'
              ? parseFloat(value) || 0
              : value
            : value,
      }));
      setIsDirty(true);

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.brand?.trim()) {
      newErrors.brand = 'Brand is required';
    }

    if (!formData.length?.trim()) {
      newErrors.length = 'Length is required';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.condition) {
      newErrors.condition = 'Condition is required';
    }

    if (mode === 'create' && !formData.city?.trim()) {
      newErrors.city = 'City is required for new listings';
    }

    if (mode === 'create' && !formData.state?.trim()) {
      newErrors.state = 'State is required for new listings';
    }

    if (mode === 'edit' && !formData.location?.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, mode]);

  const resetForm = useCallback(() => {
    setFormData({
      title: '',
      brand: '',
      length: '',
      price: 0,
      condition: undefined,
      description: '',
      location: '',
      city: '',
      state: '',
      ...initialData,
    });
    setErrors({});
    setIsDirty(false);
  }, [initialData]);

  return {
    formData,
    errors,
    isDirty,
    handleChange,
    validateForm,
    resetForm,
    setFormData,
  };
}
