import { NextRequest, NextResponse } from 'next/server';

interface OpenStreetMapResult {
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    region?: string;
    administrative_area_level_1?: string;
    'ISO3166-2-lvl4'?: string;
    country?: string;
  };
}

export async function GET(request: NextRequest) {
  console.log('🌍 Reverse geocode API called');

  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    console.log('📍 Coordinates:', { lat, lon });

    if (!lat || !lon) {
      console.log('❌ Missing coordinates');
      return NextResponse.json(
        { error: 'Missing coordinates' },
        { status: 400 }
      );
    }

    console.log('🌐 Making request to OpenStreetMap reverse geocode...');

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'BoardSource/1.0 (surfboard listing service)',
        },
      }
    );

    console.log('🌐 OpenStreetMap reverse response status:', response.status);

    if (!response.ok) {
      console.error('❌ OpenStreetMap reverse geocode error:', response.status);
      throw new Error(`Reverse geocode error: ${response.status}`);
    }

    const data: OpenStreetMapResult = await response.json();
    console.log('📊 Reverse geocode data received:', data.display_name);

    if (!data.address) {
      console.log('❌ No address found in response');
      return NextResponse.json({ error: 'No address found' }, { status: 404 });
    }

    const result = {
      address: data.display_name,
      city:
        data.address.city || data.address.town || data.address.village || '',
      state:
        data.address.state ||
        data.address.region ||
        data.address.administrative_area_level_1 ||
        data.address['ISO3166-2-lvl4'] ||
        '',
      latitude: parseFloat(data.lat),
      longitude: parseFloat(data.lon),
    };

    console.log('✅ Reverse geocode result:', result);

    return NextResponse.json(result);
  } catch (error) {
    console.error('💥 Reverse geocode API error:', error);
    return NextResponse.json(
      { error: 'Failed to reverse geocode' },
      { status: 500 }
    );
  }
}
