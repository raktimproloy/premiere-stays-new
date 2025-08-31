import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Helper function to update guest in OwnerRez
async function updateGuestInOwnerRez(guestId: number, guestData: any) {
  const username = process.env.NEXT_PUBLIC_OWNERREZ_USERNAME || "info@premierestaysmiami.com";
  const password = process.env.NEXT_PUBLIC_OWNERREZ_ACCESS_TOKEN || "pt_1xj6mw0db483n2arxln6rg2zd8xockw2";
  const v2Url = process.env.NEXT_PUBLIC_OWNERREZ_API_V2 || "https://api.ownerrez.com/v2";

  if (!username || !password || !v2Url) {
    throw new Error('API credentials not configured');
  }

  const auth = Buffer.from(`${username}:${password}`).toString('base64');
  
  const response = await fetch(`${v2Url}/guests/${guestId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(guestData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OwnerRez API error: ${response.status} - ${error.message || 'Unknown error'}`);
  }

  return await response.json();
}

// Helper function to parse full name into first and last name
function parseFullName(fullName: string): { first_name: string; last_name: string } {
  const nameParts = fullName.trim().split(' ');
  
  if (nameParts.length === 1) {
    return {
      first_name: nameParts[0],
      last_name: ''
    };
  }
  
  const first_name = nameParts[0];
  const last_name = nameParts.slice(1).join(' ');
  
  return { first_name, last_name };
}

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('authToken')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const result = await authService.verifyToken(token);

    if (!result.valid || !result.user) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Return user data without password
    const { password, ...userWithoutPassword } = result.user;
    
    return NextResponse.json({
      success: true,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Get profile API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('authToken')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const result = await authService.verifyToken(token);

    if (!result.valid || !result.user) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    const { 
      fullName, 
      phone, 
      dob, 
      profileImage, 
      contactPerson, 
      mailingAddress, 
      desiredService,
      // Business fields
      proofOfOwnership,
      businessLicenseNumber,
      taxId,
      bankAccountInfo,
      taxForm
    } = await request.json();

    // Validate required fields
    if (!fullName || !phone || !dob) {
      return NextResponse.json(
        { success: false, message: 'Full name, phone, and date of birth are required' },
        { status: 400 }
      );
    }

    // Validate admin-specific fields if user is admin
    if (result.user.role === 'admin') {
      if (!mailingAddress || !desiredService) {
        return NextResponse.json(
          { success: false, message: 'Mailing address and desired service are required for admin users' },
          { status: 400 }
        );
      }
      
      // Validate new required business fields
      if (!proofOfOwnership || !businessLicenseNumber || !bankAccountInfo || !taxForm) {
        return NextResponse.json(
          { success: false, message: 'Proof of ownership, business license number, bank account info, and tax form are required for admin users' },
          { status: 400 }
        );
      }
    }

    // Validate phone format (basic validation)
    // const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    // if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    //   return NextResponse.json(
    //     { success: false, message: 'Invalid phone number format' },
    //     { status: 400 }
    //   );
    // }

    // Validate date format (MM-DD-YYYY)
    // const dateRegex = /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])-\d{4}$/;
    // if (!dateRegex.test(dob)) {
    //   return NextResponse.json(
    //     { success: false, message: 'Invalid date format. Use MM-DD-YYYY' },
    //     { status: 400 }
    //   );
    // }

    const client = await clientPromise;
    const db = client.db("premiere-stays");

    // Prepare update data for MongoDB
    const updateData: any = {
      fullName,
      phone,
      dob,
      updatedAt: new Date()
    };

    // Add profile image if provided
    if (profileImage) {
      updateData.profileImage = profileImage;
    }

    // Add admin-specific fields if user is admin
    if (result.user.role === 'admin') {
      updateData.contactPerson = contactPerson || '';
      updateData.mailingAddress = mailingAddress || '';
      updateData.desiredService = desiredService || '';
      // Business fields
      updateData.proofOfOwnership = proofOfOwnership || '';
      updateData.businessLicenseNumber = businessLicenseNumber || '';
      updateData.taxId = taxId || '';
      updateData.bankAccountInfo = bankAccountInfo || '';
      updateData.taxForm = taxForm || '';
    }

    // Update user in MongoDB
    const mongoResult = await db.collection("users").updateOne(
      { _id: new ObjectId(result.user._id) },
      { $set: updateData }
    );

    if (mongoResult.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Update guest in OwnerRez if guestId exists
    if (result.user.guestId) {
      try {
        const { first_name, last_name } = parseFullName(fullName);
        
        const ownerRezData = {
          first_name,
          last_name,
          phones: [
            {
              number: phone,
              type: 'mobile',
              is_default: true
            }
          ]
        };

        await updateGuestInOwnerRez(result.user.guestId, ownerRezData);
      } catch (ownerRezError) {
        console.error('OwnerRez update error:', ownerRezError);
        // Continue with MongoDB update even if OwnerRez fails
        // You might want to log this for monitoring
      }
    }

    // Get updated user data
    const updatedUser = await db.collection("users").findOne({
      _id: new ObjectId(result.user._id)
    });

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: 'Failed to retrieve updated user data' },
        { status: 500 }
      );
    }

    // Return updated user data without password
    const { password, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Update profile API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update profile',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 