'use client';

import { getProviders, getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '@/app/components/auth/AuthLayout';
import OAuthButtons from '@/app/components/auth/OAuthButtons';
import AuthForm from '@/app/components/auth/AuthForm';

interface Provider {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
}

export default function SignIn() {
  const [providers, setProviders] = useState<Record<string, Provider> | null>(
    null
  );
  const router = useRouter();

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
          <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
            Terms of Service
          </Link>
          <span className="text-gray-400 mx-2">•</span>
          <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
            Privacy Policy
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
