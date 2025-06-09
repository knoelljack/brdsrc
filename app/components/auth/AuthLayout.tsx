import Link from 'next/link';
import Header from '@/app/components/layout/Header';
import Footer from '@/app/components/layout/Footer';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  backText?: string;
  backHref?: string;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
  backText = '← Back to BoardSource',
  backHref = '/',
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />

      <main className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">{title}</h2>
            <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
          </div>

          <div className="bg-white py-8 px-6 shadow-sm rounded-lg border border-gray-200">
            {children}
          </div>

          <div className="text-center">
            <Link
              href={backHref}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              {backText}
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
