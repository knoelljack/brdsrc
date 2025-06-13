'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect } from 'react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MobileAuthSectionProps {
  onLinkClick: () => void;
}

function MobileAuthSection({ onLinkClick }: MobileAuthSectionProps) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="space-y-3">
        <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="space-y-3">
        {/* User Info */}
        <div className="px-6 py-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white font-medium">
              {session.user?.name?.charAt(0) ||
                session.user?.email?.charAt(0) ||
                'U'}
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {session.user?.name || 'User'}
              </p>
              <p className="text-sm text-gray-500">{session.user?.email}</p>
            </div>
          </div>
        </div>

        {/* Auth Links */}
        <Link
          href="/profile"
          onClick={onLinkClick}
          className="block text-gray-700 hover:text-gray-900 transition-colors font-medium text-xl py-4 px-6 rounded-lg hover:bg-gray-50"
        >
          My Profile
        </Link>

        <Link
          href="/my-listings"
          onClick={onLinkClick}
          className="block text-gray-700 hover:text-gray-900 transition-colors font-medium text-xl py-4 px-6 rounded-lg hover:bg-gray-50"
        >
          My Listings
        </Link>

        <button
          onClick={() => {
            onLinkClick();
            signOut({ callbackUrl: '/' });
          }}
          className="w-full text-left text-gray-700 hover:text-gray-900 transition-colors font-medium text-xl py-4 px-6 rounded-lg hover:bg-gray-50"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Link
        href="/auth/signin"
        onClick={onLinkClick}
        className="block bg-gray-900 text-white text-center font-medium text-xl py-4 px-6 rounded-lg hover:bg-gray-800 transition-colors"
      >
        Sign In
      </Link>

      <Link
        href="/auth/register"
        onClick={onLinkClick}
        className="block border-2 border-gray-900 text-gray-900 text-center font-medium text-xl py-4 px-6 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Create Account
      </Link>
    </div>
  );
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
            <MobileAuthSection onLinkClick={handleLinkClick} />
          </div>
        </nav>
      </div>
    </div>
  );
}
