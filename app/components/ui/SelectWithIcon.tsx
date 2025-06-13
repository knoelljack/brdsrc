import React from 'react';

interface SelectWithIconProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
  className?: string;
}

export default function SelectWithIcon({
  children,
  className = '',
  ...props
}: SelectWithIconProps) {
  const defaultClassName =
    'custom-select appearance-none bg-white px-4 py-3 pr-10 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 hover:border-gray-400 transition-colors cursor-pointer w-full';

  return (
    <div className="relative">
      <select className={className || defaultClassName} {...props}>
        {children}
      </select>
      <svg
        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
  );
}
