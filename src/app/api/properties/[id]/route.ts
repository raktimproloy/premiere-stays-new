import { NextRequest, NextResponse } from 'next/server';
import { propertyService } from '@/lib/propertyService';
import { ensureThumbnailUrls } from '@/utils/propertyCache';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
  }

  try {
    // First, try to get property from OwnerRez
    const username = process.env.NEXT_PUBLIC_OWNERREZ_USERNAME || "info@premierestaysmiami.com";
    const password = process.env.NEXT_PUBLIC_OWNERREZ_ACCESS_TOKEN || "pt_1xj6mw0db483n2arxln6rg2zd8xockw2";
    const baseUrl = process.env.NEXT_PUBLIC_OWNERREZ_API_V2 || "https://api.ownerrez.com/v2";

    if (!username || !password || !baseUrl) {
      return NextResponse.json({ error: 'API credentials not configured' }, { status: 500 });
    }

    const auth = Buffer.from(`${username}:${password}`).toString('base64');
    const url = `${baseUrl}/properties/${id}`;

    let ownerRezProperty = null;
    let ownerRezError = null;

    try {
      const res = await fetch(url, {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        ownerRezProperty = await res.json();
      } else {
        const errorText = await res.text();
        try {
          const errorJson = JSON.parse(errorText);
          ownerRezError = `${res.status} - ${errorJson.message || 'Unknown error'}`;
        } catch {
          ownerRezError = `${res.status} - ${errorText || 'Unknown error'}`;
        }
      }
    } catch (error) {
      ownerRezError = 'Failed to fetch from OwnerRez API';
    }

    // Get local property data
    const localProperty = await propertyService.getPropertyByOwnerRezId(parseInt(id));

    // Merge data (OwnerRez takes priority)
    let mergedProperty = null;
    let source = '';

    if (ownerRezProperty && localProperty) {
      // Both exist - merge them
      mergedProperty = {
        ...ownerRezProperty,
        localData: {
          description: localProperty.description,
          amenities: localProperty.amenities,
          rules: localProperty.rules,
          pricing: localProperty.pricing,
          availability: localProperty.availability,
          policies: localProperty.policies,
          owner: localProperty.owner,
          status: localProperty.status,
          isVerified: localProperty.isVerified,
          images: localProperty.images,
          createdAt: localProperty.createdAt,
          updatedAt: localProperty.updatedAt,
          lastSyncedWithOwnerRez: localProperty.lastSyncedWithOwnerRez
        }
      };
      source = 'ownerrez_merged_local';
    } else if (ownerRezProperty) {
      // Only OwnerRez exists
      mergedProperty = {
        ...ownerRezProperty,
        localData: null
      };
      source = 'ownerrez_only';
    } else if (localProperty) {
      // Only local exists
      mergedProperty = {
        ...localProperty,
        ownerRezData: null,
        ownerRezError
      };
      source = 'local_only';
    } else {
      // Neither exists
      return NextResponse.json({ 
        error: 'Property not found in either OwnerRez or local database',
        ownerRezError,
        source: 'not_found'
      }, { status: 404 });
    }

    // Ensure the property has thumbnail URLs by fetching from local API if needed
    if (!mergedProperty.thumbnail_url || !mergedProperty.thumbnail_url_medium || !mergedProperty.thumbnail_url_large) {
      console.log(`Property ${mergedProperty.id} missing thumbnail URLs, ensuring they are available...`);
      const [propertyWithThumbnails] = await ensureThumbnailUrls([mergedProperty]);
      mergedProperty = propertyWithThumbnails;
    }

    return NextResponse.json({ 
      success: true, 
      property: mergedProperty,
      source,
      ownerRezError: ownerRezError || null
    });

  } catch (error) {
    console.error('Property fetch error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch property', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
  }

  try {
    const body = await request.json();

    const username = process.env.NEXT_PUBLIC_OWNERREZ_USERNAME || "info@premierestaysmiami.com";
    const password = process.env.NEXT_PUBLIC_OWNERREZ_ACCESS_TOKEN || "pt_1xj6mw0db483n2arxln6rg2zd8xockw2";
    const baseUrl = process.env.NEXT_PUBLIC_OWNERREZ_API_V1 || "https://api.ownerrez.com/v1";

    if (!username || !password) {
      return NextResponse.json({ error: 'API credentials not configured' }, { status: 500 });
    }

    const auth = Buffer.from(`${username}:${password}`).toString('base64');
    const headers = {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    };

    const res = await fetch(`${baseUrl}/properties/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.message || 'Failed to update property', details: data }, { status: res.status });
    }

    return NextResponse.json({ success: true, property: data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update property', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 