import React from 'react';

interface FormInputProps {
  id: string;
  name: string;
  type?: 'text' | 'email' | 'tel' | 'number' | 'textarea';
  value: string | number;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  min?: string;
  rows?: number;
  className?: string; // For additional custom classes
  label?: string;
  helpText?: string;
}

const baseInputClasses =
  'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900 placeholder-gray-500';

export default function FormInput({
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  min,
  rows = 4,
  className = '',
  label,
  helpText,
}: FormInputProps) {
  const inputClasses = `${baseInputClasses} ${className} ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}`;

  const renderInput = () => {
    if (type === 'textarea') {
      return (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows}
          className={`${inputClasses} resize-none`}
        />
      );
    }

    return (
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={min}
        className={inputClasses}
      />
    );
  };

  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label} {required && '*'}
        </label>
      )}
      {renderInput()}
      {helpText && <p className="text-sm text-gray-500 mt-2">{helpText}</p>}
    </div>
  );
}
