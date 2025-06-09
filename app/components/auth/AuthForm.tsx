'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';

interface Provider {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
}

interface AuthFormProps {
  providers: Record<string, Provider> | null;
}

export default function AuthForm({ providers }: AuthFormProps) {
  // Only show if credentials provider is available
  if (!providers?.credentials) return null;

  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">
            Or continue with email
          </span>
        </div>
      </div>

      <form
        onSubmit={e => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          signIn('credentials', {
            email: formData.get('email'),
            password: formData.get('password'),
            callbackUrl: '/',
          });
        }}
        className="space-y-4"
      >
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Sign in with Email
        </button>
      </form>

      <div className="text-center">
        <Link
          href="/auth/register"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Don&apos;t have an account? Sign up
        </Link>
      </div>
    </>
  );
}
