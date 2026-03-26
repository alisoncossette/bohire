import { NextRequest, NextResponse } from 'next/server';
import { boloClient } from '@/lib/bolospot';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { grantId } = body;

    if (!grantId) {
      return NextResponse.json(
        { success: false, error: 'Grant ID required' },
        { status: 400 }
      );
    }

    // Revoke grant via Bolospot SDK
    const result = await boloClient.revokeBolo(grantId);

    return NextResponse.json({
      success: result.success,
      message: 'Access revoked successfully',
    });
  } catch (error) {
    console.error('Revoke grant error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to revoke grant' },
      { status: 500 }
    );
  }
}
