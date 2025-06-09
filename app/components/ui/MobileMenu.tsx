'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import AuthButton from './AuthButton';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLinkClick = () => {
    onClose();
  };

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
      onClick={handleBackdropClick}
    >
      <div className="bg-white h-full w-full shadow-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">Menu</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-2"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="p-6 space-y-6">
          <Link
            href="/browse"
            onClick={handleLinkClick}
            className="block text-gray-700 hover:text-gray-900 transition-colors font-medium text-xl py-4 px-6 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            Browse Boards
          </Link>

          <Link
            href="/sell"
            onClick={handleLinkClick}
            className="block text-gray-700 hover:text-gray-900 transition-colors font-medium text-xl py-4 px-6 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            Sell Your Board
          </Link>

          <Link
            href="/about"
            onClick={handleLinkClick}
            className="block text-gray-700 hover:text-gray-900 transition-colors font-medium text-xl py-4 px-6 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            About
          </Link>

          <div className="pt-6 border-t border-gray-200">
            <div onClick={handleLinkClick}>
              <AuthButton />
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
