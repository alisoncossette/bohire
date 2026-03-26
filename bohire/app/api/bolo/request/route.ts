import { NextRequest, NextResponse } from 'next/server';
import { boloClient } from '@/lib/bolospot';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { requester, requesterName, target, message } = body;

    if (!requester || !target) {
      return NextResponse.json(
        { success: false, error: 'Requester and target required' },
        { status: 400 }
      );
    }

    // Send bolo request via Bolospot SDK
    const result = await boloClient.requestBolo({
      requester: requesterName || requester,
      target,
      resource: 'profile',
      message,
    });

    // In a real app, also send email notification to the candidate
    // and store request in database

    return NextResponse.json({
      success: true,
      requestId: result.requestId,
      message: 'Access request sent successfully',
    });
  } catch (error) {
    console.error('Bolo request error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send access request' },
      { status: 500 }
    );
  }
}
