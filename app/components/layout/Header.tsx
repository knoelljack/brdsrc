'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AuthButton from '../ui/AuthButton';
import MobileMenu from '../ui/MobileMenu';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/"
              className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity"
            >
              <Image
                src="/logo.svg"
                alt="BoardSource Logo"
                width={64}
                height={64}
                className="h-16 w-16"
              />
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-gray-900 leading-tight">
                  BoardSource
                </h1>
                <span className="text-xs text-gray-500 leading-tight">
                  Surfboard Marketplace
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/browse"
                className="text-gray-700 hover:text-gray-900 transition-colors font-medium py-2 cursor-pointer"
              >
                Browse
              </Link>
              <Link
                href="/sell"
                className="text-gray-700 hover:text-gray-900 transition-colors font-medium py-2 cursor-pointer"
              >
                Sell
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-gray-900 transition-colors font-medium py-2 cursor-pointer"
              >
                About
              </Link>
              <AuthButton />
            </nav>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
