import { NextRequest, NextResponse } from 'next/server';

// Simple reverse geocoding using OpenStreetMap Nominatim API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!lat || !lon) {
      return NextResponse.json(
        { error: 'Missing latitude or longitude parameters' },
        { status: 400 }
      );
    }

    // Use OpenStreetMap Nominatim API for reverse geocoding
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`;

    const response = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'BrdSrc/1.0 (https://brdsrc.vercel.app)', // Required by OSM
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.display_name) {
      return NextResponse.json(
        { error: 'No address found for coordinates' },
        { status: 404 }
      );
    }

    // Extract city and state from the address components
    const address = data.address || {};
    const city =
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      address.county ||
      'Unknown City';

    const state = address.state || 'Unknown State';

    // Build display location (similar to autocomplete logic)
    const neighborhood = address.neighbourhood || address.suburb;
    let displayLocation = '';

    if (neighborhood && city && neighborhood !== city) {
      displayLocation = `${neighborhood}, ${city}, ${state}`;
    } else {
      displayLocation = `${city}, ${state}`;
    }

    const result = {
      address: data.display_name,
      displayLocation,
      city,
      state,
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
      neighborhood: neighborhood || undefined,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return NextResponse.json(
      { error: 'Failed to reverse geocode coordinates' },
      { status: 500 }
    );
  }
}
