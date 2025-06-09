'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import AuthLayout from '@/app/components/auth/AuthLayout';
import ResetPasswordForm from '@/app/components/auth/ResetPasswordForm';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">
            Invalid or missing reset token. Please request a new password reset.
          </p>
        </div>
        <a
          href="/auth/forgot-password"
          className="text-gray-600 hover:text-gray-900"
        >
          ← Request new reset link
        </a>
      </div>
    );
  }

  return <ResetPasswordForm token={token} />;
}

export default function ResetPassword() {
  return (
    <AuthLayout
      title="Create new password"
      subtitle="Enter your new password below"
      backText="← Back to sign in"
      backHref="/auth/signin"
    >
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordContent />
      </Suspense>
    </AuthLayout>
  );
}
