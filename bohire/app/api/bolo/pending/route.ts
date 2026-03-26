import { NextRequest, NextResponse } from 'next/server';
import { boloClient } from '@/lib/bolospot';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    // Fetch pending requests from Bolospot
    const requests = await boloClient.getPendingRequests(userId);

    return NextResponse.json({
      success: true,
      requests,
      count: requests.length,
    });
  } catch (error) {
    console.error('Fetch pending requests error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pending requests' },
      { status: 500 }
    );
  }
}
