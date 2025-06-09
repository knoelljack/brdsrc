import { useEffect } from 'react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">Privacy Policy</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Effective Date:</strong> January 1, 2025
            </p>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                1. Introduction
              </h3>
              <p className="text-gray-700 mb-4">
                BoardSource is committed to protecting your privacy and personal
                information. This Privacy Policy explains how we collect, use,
                and safeguard your data when you use our surfboard marketplace
                platform.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                2. Information We Collect
              </h3>
              <p className="text-gray-700 mb-4">
                We collect the following types of information:
              </p>

              <h4 className="font-semibold text-gray-900 mb-2">
                Personal Information:
              </h4>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li>Name and email address (for account creation)</li>
                <li>Profile information you choose to provide</li>
                <li>Contact information for surfboard listings</li>
                <li>Location data (if you choose to share it)</li>
              </ul>

              <h4 className="font-semibold text-gray-900 mb-2">
                Usage Information:
              </h4>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li>Pages visited and features used</li>
                <li>Search queries and filters applied</li>
                <li>Interaction with listings and other users</li>
                <li>Device and browser information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                3. How We Use Your Information
              </h3>
              <p className="text-gray-700 mb-4">We use your information to:</p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Provide and maintain our marketplace platform</li>
                <li>Create and manage your user account</li>
                <li>Display your surfboard listings to potential buyers</li>
                <li>Facilitate communication between buyers and sellers</li>
                <li>Improve our services and user experience</li>
                <li>Prevent fraud and ensure platform security</li>
                <li>Send important service notifications (not marketing)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                4. Information Sharing
              </h3>
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or rent your personal information to
                third parties. We only share information:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>With your explicit consent</li>
                <li>
                  As part of publicly visible surfboard listings (contact info
                  you choose to share)
                </li>
                <li>When required by law or to protect our legal rights</li>
                <li>
                  With service providers who help us operate the platform (under
                  strict confidentiality)
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                5. Data Security
              </h3>
              <p className="text-gray-700 mb-4">
                We implement industry-standard security measures to protect your
                personal information:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Encrypted data transmission (HTTPS/SSL)</li>
                <li>Secure password hashing and storage</li>
                <li>Regular security audits and updates</li>
                <li>
                  Limited access to personal data by authorized personnel only
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                6. Your Rights and Choices
              </h3>
              <p className="text-gray-700 mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Access and review your personal information</li>
                <li>Update or correct your account information</li>
                <li>Delete your account and associated data</li>
                <li>Control what information is visible in your listings</li>
                <li>Opt out of non-essential communications</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                7. Cookies and Tracking
              </h3>
              <p className="text-gray-700 mb-4">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Keep you logged in to your account</li>
                <li>Remember your preferences and settings</li>
                <li>Analyze how our platform is used</li>
                <li>Improve our services and user experience</li>
              </ul>
              <p className="text-gray-700 mb-4">
                You can control cookies through your browser settings, though
                some features may not work properly if cookies are disabled.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                8. Third-Party Services
              </h3>
              <p className="text-gray-700 mb-4">
                Our platform may integrate with third-party services (such as
                Google OAuth for authentication). These services have their own
                privacy policies, and we encourage you to review them.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                9. Data Retention
              </h3>
              <p className="text-gray-700 mb-4">
                We retain your personal information only as long as necessary to
                provide our services and comply with legal obligations. When you
                delete your account, we will remove your personal information
                within 30 days, except where retention is required by law.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                10. Children&apos;s Privacy
              </h3>
              <p className="text-gray-700 mb-4">
                BoardSource is not intended for users under 13 years of age. We
                do not knowingly collect personal information from children
                under 13. If we become aware of such collection, we will take
                steps to delete the information promptly.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                11. Policy Updates
              </h3>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy periodically. We will notify
                users of significant changes and post the updated policy with a
                new effective date. Your continued use of BoardSource after
                changes indicates acceptance.
              </p>
            </section>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={onClose}
            className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
