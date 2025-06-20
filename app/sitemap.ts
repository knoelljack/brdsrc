import { MetadataRoute } from 'next';

// Type for board data from API
interface BoardSitemapData {
  id: string | number;
  updatedAt?: string;
  createdAt: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://boardsource.com';

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/browse`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sell`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/auth/signin`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/auth/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  try {
    // Fetch active board listings for dynamic routes
    const response = await fetch(`${baseUrl}/api/surfboards?status=active`, {
      cache: 'no-store',
    });

    if (response.ok) {
      const data = await response.json();
      const boards = data.surfboards || [];

      const boardRoutes: MetadataRoute.Sitemap = boards.map(
        (board: BoardSitemapData) => ({
          url: `${baseUrl}/boards/${board.id}`,
          lastModified: new Date(board.updatedAt || board.createdAt),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        })
      );

      return [...staticRoutes, ...boardRoutes];
    }
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  // Return static routes if dynamic fetch fails
  return staticRoutes;
}
