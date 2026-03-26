import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { proof, merkle_root, nullifier_hash, verification_level } = body;

    // In production, verify with World ID
    // For development/demo mode:
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({
        success: true,
        verified: true,
        nullifier_hash: nullifier_hash || 'demo_hash_' + Date.now(),
      });
    }

    // Production World ID verification
    const worldIdResponse = await fetch(
      `https://developer.worldcoin.org/api/v1/verify/${process.env.NEXT_PUBLIC_WORLD_APP_ID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merkle_root,
          nullifier_hash,
          proof,
          verification_level,
          action: process.env.NEXT_PUBLIC_WORLD_ACTION || 'verify-candidate',
        }),
      }
    );

    const worldIdData = await worldIdResponse.json();

    if (worldIdData.success) {
      return NextResponse.json({
        success: true,
        verified: true,
        nullifier_hash,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'World ID verification failed',
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('World ID verification error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Verification failed',
      },
      { status: 500 }
    );
  }
}
