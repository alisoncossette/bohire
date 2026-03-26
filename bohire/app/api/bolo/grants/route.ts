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

    // Fetch active grants from Bolospot
    const grants = await boloClient.getGrants(userId);

    return NextResponse.json({
      success: true,
      grants,
      count: grants.length,
    });
  } catch (error) {
    console.error('Fetch grants error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch grants' },
      { status: 500 }
    );
  }
}
