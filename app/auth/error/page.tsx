'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import AuthLayout from '@/app/components/auth/AuthLayout';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'CredentialsSignin':
        return 'Invalid email or password. Please check your credentials and try again.';
      case 'OAuthSignin':
        return 'Error occurred during OAuth sign-in. Please try again.';
      case 'OAuthCallback':
        return 'Error occurred during OAuth callback. Please try again.';
      case 'OAuthCreateAccount':
        return 'Could not create OAuth account. Please try again.';
      case 'EmailCreateAccount':
        return 'Could not create account with this email. Please try again.';
      case 'Callback':
        return 'Error occurred during authentication callback. Please try again.';
      case 'OAuthAccountNotLinked':
        return 'This account is already linked to another provider. Please sign in with your original provider.';
      case 'EmailSignin':
        return 'Error occurred during email sign-in. Please try again.';
      case 'SessionRequired':
        return 'You need to be signed in to access this page.';
      default:
        return 'An authentication error occurred. Please try again.';
    }
  };

  return (
    <>
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Authentication Error
            </h3>
            <p className="mt-1 text-sm text-red-700">
              {getErrorMessage(error)}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Link
          href="/auth/signin"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Try signing in again
        </Link>

        <Link
          href="/auth/register"
          className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Create a new account
        </Link>
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/auth/forgot-password"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Forgot your password?
        </Link>
      </div>
    </>
  );
}

export default function AuthError() {
  return (
    <AuthLayout
      title="Authentication Error"
      subtitle="We encountered an issue while trying to sign you in"
      backText="← Back to BoardSource"
      backHref="/"
    >
      <Suspense fallback={<div>Loading...</div>}>
        <AuthErrorContent />
      </Suspense>
    </AuthLayout>
  );
}
