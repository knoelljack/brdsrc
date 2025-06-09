'use client';

import AuthLayout from '@/app/components/auth/AuthLayout';
import ForgotPasswordForm from '@/app/components/auth/ForgotPasswordForm';

export default function ForgotPassword() {
  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email address and we'll send you a link to reset your password"
      backText="← Back to sign in"
      backHref="/auth/signin"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
