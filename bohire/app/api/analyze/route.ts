import { NextRequest, NextResponse } from 'next/server';
import { GitHubAnalyzer } from '@/lib/analyzer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { githubToken, githubUsername, claudeApiKey, selectedRepos } = body;

    if (!githubToken || !githubUsername) {
      return NextResponse.json(
        { success: false, error: 'GitHub token and username required' },
        { status: 400 }
      );
    }

    // Create analyzer instance
    const analyzer = new GitHubAnalyzer(githubToken, claudeApiKey);

    // Run the analysis
    const evidenceProfile = await analyzer.analyzeUser(githubUsername, selectedRepos);

    return NextResponse.json({
      success: true,
      profile: evidenceProfile,
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to analyze GitHub profile',
      },
      { status: 500 }
    );
  }
}
