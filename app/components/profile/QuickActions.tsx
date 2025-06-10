import { useRouter } from 'next/navigation';

export default function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      name: 'List a Surfboard',
      href: '/sell',
      primary: true,
    },
    {
      name: 'View My Listings',
      href: '/my-listings',
      primary: false,
    },
    {
      name: 'Browse Boards',
      href: '/browse',
      primary: false,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Quick Actions
      </h3>
      <div className="space-y-3">
        {actions.map(action => (
          <button
            key={action.name}
            onClick={() => router.push(action.href)}
            className={`w-full px-4 py-2 rounded-lg transition-colors cursor-pointer ${
              action.primary
                ? 'bg-gray-900 text-white hover:bg-gray-800'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {action.name}
          </button>
        ))}
      </div>
    </div>
  );
}
