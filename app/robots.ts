import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/auth/',
          '/profile/',
          '/my-listings/',
          '/favorites/',
          '/edit-listing/',
          '/sell/',
          '/_next/',
          '/admin/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/auth/',
          '/profile/',
          '/my-listings/',
          '/favorites/',
          '/edit-listing/',
          '/sell/',
          '/_next/',
          '/admin/',
        ],
      },
    ],
    sitemap: 'https://brdsrc.com/sitemap.xml',
  };
}
