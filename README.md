# BoardSource - Surfboard Marketplace

A modern marketplace for buying and selling surfboards, built with Next.js, TypeScript, and Prisma.

## Features

- **User Authentication** - Secure sign-up/sign-in with NextAuth.js
- **Surfboard Listings** - Create, edit, and manage surfboard listings
- **Image Upload** - Upload multiple photos with Vercel Blob storage
- **Location Autocomplete** - Smart location search with coordinates for nearby features
- **Advanced Search & Filtering** - Filter by location, price, condition, length
- **Nearby Surfboards** - Find boards near your location using GPS
- **Responsive Design** - Works great on desktop and mobile

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Vercel account (for blob storage)
- Google Cloud account (for Places API)

### Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Database
DATABASE_URL="your_postgresql_connection_string"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN="your_vercel_blob_token"

# Google Maps API (for location autocomplete)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your_google_maps_api_key"
```

### Google Places API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Places API** and **Geocoding API**
4. Create an API key in **Credentials**
5. Restrict the API key to your domain for security
6. Add the key to your `.env.local` as `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

**Note:** The location autocomplete will fallback to OpenStreetMap Nominatim (free) if Google Places API is not configured.

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd brdsrc

# Install dependencies
npm install

# Set up the database
npx prisma migrate dev

# Start the development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Location Features

### For Users

- **Smart Location Search**: Start typing any city or address to get autocomplete suggestions
- **Automatic Coordinates**: Locations are automatically geocoded for accurate distance calculations
- **Nearby Surfboards**: Find boards within customizable radius (25-200 miles)
- **Distance Display**: See exact distance to each surfboard

### For Developers

- **Fallback Support**: Works with or without Google Places API
- **Coordinate Storage**: Latitude/longitude stored in database for fast nearby searches
- **Haversine Formula**: Accurate distance calculations between coordinates

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **File Storage**: Vercel Blob
- **Location Services**: Google Places API + OpenStreetMap fallback

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
