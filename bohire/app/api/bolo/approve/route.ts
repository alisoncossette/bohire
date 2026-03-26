import { NextRequest, NextResponse } from 'next/server';
import { boloClient } from '@/lib/bolospot';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { requestId } = body;

    if (!requestId) {
      return NextResponse.json(
        { success: false, error: 'Request ID required' },
        { status: 400 }
      );
    }

    // Approve request via Bolospot SDK
    const result = await boloClient.approveBolo(requestId);

    // In a real app, send email notification to requester

    return NextResponse.json({
      success: result.success,
      grant: result.grant,
      message: 'Access request approved',
    });
  } catch (error) {
    console.error('Approve request error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to approve request' },
      { status: 500 }
    );
  }
}
