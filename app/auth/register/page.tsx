'use client';

import AuthLayout from '@/app/components/auth/AuthLayout';
import RegisterForm from '@/app/components/auth/RegisterForm';

export default function Register() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join BoardSource and start trading surfboards"
      backText="← Back to BoardSource"
      backHref="/"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
