import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const accessToken = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!username) {
      return NextResponse.json(
        { success: false, error: 'Username required' },
        { status: 400 }
      );
    }

    // Fetch user's repositories from GitHub
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
      { headers }
    );

    if (!reposResponse.ok) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch GitHub repos' },
        { status: reposResponse.status }
      );
    }

    const repos = await reposResponse.json();

    // Format repository data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedRepos = repos.map((repo: any) => ({
      name: repo.name,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      url: repo.html_url,
      topics: repo.topics || [],
      created: repo.created_at,
      updated: repo.updated_at,
      size: repo.size,
    }));

    return NextResponse.json({
      success: true,
      repos: formattedRepos,
      count: formattedRepos.length,
    });
  } catch (error) {
    console.error('GitHub repos fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch repositories' },
      { status: 500 }
    );
  }
}
