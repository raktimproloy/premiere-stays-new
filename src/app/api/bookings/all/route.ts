import { NextRequest, NextResponse } from 'next/server';

const username = process.env.NEXT_PUBLIC_OWNERREZ_USERNAME || "info@premierestaysmiami.com";
const password = process.env.NEXT_PUBLIC_OWNERREZ_ACCESS_TOKEN || "pt_1xj6mw0db483n2arxln6rg2zd8xockw2";
const v2Url = process.env.NEXT_PUBLIC_OWNERREZ_API_V2 || "https://api.ownerrez.com/v2";

interface Guest {
  id: number;
  first_name: string;
  last_name: string;
  email_addresses: {
    address: string;
    is_default: boolean;
    type: string;
  }[];
  phones: {
    number: string;
    is_default: boolean;
    type: string;
  }[];
}

interface Booking {
  id: number;
  arrival: string;
  departure: string;
  property_id: number;
  guest_id: number;
  status: string;
  is_block: boolean;
  created_utc: string;
  updated_utc: string;
  total_amount?: number;
  property: {
    id: number;
    name: string;
  };
  [key: string]: any;
}

interface TransformedBooking {
  id: string;
  personName: string;
  email: string;
  phone: string;
  propertyName: string;
  status: string;
  applyDate: string;
  price: string;
  arrival: string;
  departure: string;
  created_utc: string;
  updated_utc: string;
  guest_id: number;
  property_id: number;
  guest?: Guest;
}

async function fetchAllBookings(limit: number = 50, offset: number = 0, sinceDate?: string) {
  if (!username || !password || !v2Url) {
    throw new Error('API credentials not configured');
  }

  const auth = Buffer.from(`${username}:${password}`).toString('base64');
  const sinceParam = sinceDate ? `&since_utc=${sinceDate}` : '';
  const url = `${v2Url}/bookings?limit=${limit}&offset=${offset}${sinceParam}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
  });
  
  console.log('Bookings API Response:', {
    status: response.status,
    statusText: response.statusText,
    url: response.url,
    headers: Object.fromEntries(response.headers.entries())
  });

  if (!response.ok) {
    const contentType = response.headers.get('content-type') || '';
    let errorMessage: string;
    
    try {
      if (contentType.includes('application/json')) {
        const error = await response.json();
        errorMessage = error.message || 'Unknown error';
      } else {
        const errorText = await response.text();
        errorMessage = `Non-JSON response: ${errorText.substring(0, 200)}...`;
      }
    } catch (parseError) {
      errorMessage = `Failed to parse error response: ${response.statusText}`;
    }
    
    throw new Error(`OwnerRez API error: ${response.status} - ${errorMessage}`);
  }

  const data: any = await response.json();
  console.log('Bookings data received:', data);
  return data;
}

async function fetchAllGuests(createdSince?: string) {
  if (!username || !password || !v2Url) {
    throw new Error('API credentials not configured');
  }

  const auth = Buffer.from(`${username}:${password}`).toString('base64');
  const sinceParam = createdSince ? `&created_since_utc=${createdSince}` : '';
  let allGuests: Guest[] = [];
  console.log("v2Url", v2Url)
  let nextPageUrl: string | null = `${v2Url}/guests?limit=1000${sinceParam}`;

  while (nextPageUrl) {
    const response = await fetch(nextPageUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Guests API Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type') || '';
      let errorMessage: string;
      
      try {
        if (contentType.includes('application/json')) {
          const error = await response.json();
          errorMessage = error.message || 'Unknown error';
        } else {
          const errorText = await response.text();
          errorMessage = `Non-JSON response: ${errorText.substring(0, 200)}...`;
        }
      } catch (parseError) {
        errorMessage = `Failed to parse error response: ${response.statusText}`;
      }
      
      throw new Error(`OwnerRez API error: ${response.status} - ${errorMessage}`);
    }

    const data: any = await response.json();
    console.log('Guests data received:', data);
    allGuests = [...allGuests, ...(data.items || [])];
    nextPageUrl = data.next_page_url ? `https://api.ownerrez.com${data.next_page_url}` : null;
  }

  return allGuests;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const sinceDate = searchParams.get('since') || '2024-01-01T00:00:00Z';
    const guestSinceDate = searchParams.get('guestSince') || '2024-01-01T00:00:00Z';

    // Fetch bookings and guests in parallel
    const [bookingsData, guests] = await Promise.all([
      fetchAllBookings(limit, offset, sinceDate),
      fetchAllGuests(guestSinceDate)
    ]);

    console.log("bookings", bookingsData)
    console.log("guests", guests)

    // Create a map of guests by ID for quick lookup
    const guestsMap = new Map<number, Guest>();
    guests.forEach(guest => {
      guestsMap.set(guest.id, guest);
    });

    // Transform bookings with guest information
    const transformedBookings: TransformedBooking[] = bookingsData.items.map((booking: Booking) => {
      const guest = guestsMap.get(booking.guest_id);
      
      // Extract primary email and phone
      const primaryEmail = guest?.email_addresses?.find(e => e.is_default)?.address || 
                          guest?.email_addresses?.[0]?.address || 'N/A';
      const primaryPhone = guest?.phones?.find(p => p.is_default)?.number || 
                          guest?.phones?.[0]?.number || 'N/A';
      
      return {
        id: booking.id.toString(),
        personName: guest ? `${guest.first_name} ${guest.last_name}` : 'N/A',
        email: primaryEmail,
        phone: primaryPhone,
        propertyName: booking.property?.name || 'N/A',
        status: booking.status || 'Pending',
        applyDate: booking.created_utc ? booking.created_utc.split('T')[0] : '',
        price: booking.total_amount ? `$${booking.total_amount}` : 'N/A',
        arrival: booking.arrival,
        departure: booking.departure,
        created_utc: booking.created_utc,
        updated_utc: booking.updated_utc,
        guest_id: booking.guest_id,
        property_id: booking.property_id,
        guest: guest
      };
    });

    return NextResponse.json({
      bookings: transformedBookings,
      pagination: {
        total: bookingsData.total || 0,
        limit: bookingsData.limit,
        offset: bookingsData.offset,
        hasMore: !!bookingsData.next_page_url
      }
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}