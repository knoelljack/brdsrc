import { useSession } from 'next-auth/react';

export default function ProfileAvatar() {
  const { data: session } = useSession();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
          {session?.user?.name?.charAt(0) ||
            session?.user?.email?.charAt(0) ||
            'U'}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {session?.user?.name || 'User'}
        </h3>
        <p className="text-gray-600 text-sm">{session?.user?.email}</p>
        <p className="text-gray-500 text-xs mt-2">
          Member since {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
