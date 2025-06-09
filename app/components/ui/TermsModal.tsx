import { useEffect } from 'react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
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
          <h2 className="text-2xl font-bold text-gray-900">Terms of Service</h2>
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
                1. Acceptance of Terms
              </h3>
              <p className="text-gray-700 mb-4">
                By accessing and using BoardSource, you accept and agree to be
                bound by the terms and provision of this agreement. If you do
                not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                2. Use License
              </h3>
              <p className="text-gray-700 mb-4">
                BoardSource grants you a personal, non-transferable license to
                use our marketplace platform for buying and selling surfboards.
                This license is subject to the restrictions set forth in these
                Terms of Service.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                3. User Responsibilities
              </h3>
              <p className="text-gray-700 mb-4">Users are responsible for:</p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>
                  Providing accurate and truthful information about surfboards
                </li>
                <li>Owning or having legal authority to sell listed items</li>
                <li>Maintaining the security of their account credentials</li>
                <li>Complying with all applicable laws and regulations</li>
                <li>Treating other users with respect and professionalism</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                4. Prohibited Activities
              </h3>
              <p className="text-gray-700 mb-4">
                The following activities are strictly prohibited:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>
                  Listing stolen, counterfeit, or damaged goods without
                  disclosure
                </li>
                <li>Engaging in fraudulent or deceptive practices</li>
                <li>
                  Harassment, abuse, or inappropriate behavior toward other
                  users
                </li>
                <li>Spamming or posting irrelevant content</li>
                <li>Attempting to circumvent platform security measures</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                5. Service Availability
              </h3>
              <p className="text-gray-700 mb-4">
                BoardSource is provided free of charge. We strive to maintain
                service availability but cannot guarantee uninterrupted access.
                We reserve the right to modify, suspend, or discontinue services
                at any time.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                6. Limitation of Liability
              </h3>
              <p className="text-gray-700 mb-4">
                BoardSource acts as a marketplace platform only. We are not
                responsible for:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>
                  The quality, condition, or description accuracy of listed
                  items
                </li>
                <li>Disputes between buyers and sellers</li>
                <li>Financial transactions between users</li>
                <li>Delivery, pickup, or shipping arrangements</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                7. Privacy and Data
              </h3>
              <p className="text-gray-700 mb-4">
                Your privacy is important to us. Please review our Privacy
                Policy to understand how we collect, use, and protect your
                personal information.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                8. Modifications
              </h3>
              <p className="text-gray-700 mb-4">
                BoardSource reserves the right to modify these terms at any
                time. Users will be notified of significant changes, and
                continued use of the service constitutes acceptance of updated
                terms.
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
