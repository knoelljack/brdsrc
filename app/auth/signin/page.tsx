'use client';

import { getProviders, getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import AuthLayout from '@/app/components/auth/AuthLayout';
import OAuthButtons from '@/app/components/auth/OAuthButtons';
import AuthForm from '@/app/components/auth/AuthForm';
import TermsModal from '@/app/components/ui/TermsModal';
import PrivacyModal from '@/app/components/ui/PrivacyModal';

interface Provider {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
}

function SignInContent() {
  const [providers, setProviders] = useState<Record<string, Provider> | null>(
    null
  );
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  useEffect(() => {
    const fetchProviders = async () => {
      const providers = await getProviders();
      setProviders(providers);
    };

    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        router.push('/');
      }
    };

    fetchProviders();
    checkSession();
  }, [router]);

  return (
    <AuthLayout
      title="Sign in to BoardSource"
      subtitle="Connect with surfers worldwide and discover your perfect board"
    >
      {message && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-600">{message}</p>
        </div>
      )}

      <div className="space-y-4">
        <OAuthButtons providers={providers} />
        <AuthForm providers={providers} />
      </div>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              By signing in, you agree to our
            </span>
          </div>
        </div>
        <div className="mt-2 text-center">
          <button
            type="button"
            onClick={() => setShowTermsModal(true)}
            className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            Terms of Service
          </button>
          <span className="text-gray-400 mx-2">•</span>
          <button
            type="button"
            onClick={() => setShowPrivacyModal(true)}
            className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            Privacy Policy
          </button>
        </div>
      </div>

      {/* Modals */}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
      <PrivacyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />
    </AuthLayout>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}
