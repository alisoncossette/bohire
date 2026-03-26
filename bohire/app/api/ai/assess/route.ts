import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { repos, githubUsername } = body;

    if (!repos || repos.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No repositories provided' },
        { status: 400 }
      );
    }

    // Prepare repository data for analysis
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const repoSummary = repos.slice(0, 20).map((repo: any) => ({
      name: repo.name,
      description: repo.description,
      language: repo.language,
      stars: repo.stars,
      topics: repo.topics,
    }));

    const prompt = `Analyze this developer's GitHub repositories and provide a professional technical assessment.

GitHub Username: ${githubUsername}
Repositories (${repos.length} total, showing top 20):
${JSON.stringify(repoSummary, null, 2)}

Provide your assessment in the following JSON format:
{
  "skills": ["skill1", "skill2", ...],
  "level": "junior" | "mid" | "senior" | "expert",
  "topProjects": [
    {
      "name": "project-name",
      "description": "what it does",
      "techStack": ["tech1", "tech2"],
      "impact": "why it's impressive"
    }
  ],
  "summary": "2-3 sentence professional summary",
  "strengths": ["strength1", "strength2"],
  "codeQuality": 7,
  "activityLevel": "low" | "medium" | "high"
}

Base your assessment on:
- Programming languages and frameworks used
- Project complexity and variety
- Code organization (inferred from repo structure)
- Activity level and consistency
- Stars/forks as indicators of impact

Be honest and objective. Don't exaggerate.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    // Parse Claude's response
    const assessmentText = content.text;
    const jsonMatch = assessmentText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('Failed to parse assessment');
    }

    const assessment = JSON.parse(jsonMatch[0]);
    assessment.assessedAt = new Date().toISOString();

    return NextResponse.json({
      success: true,
      assessment,
    });
  } catch (error) {
    console.error('AI assessment error:', error);
    return NextResponse.json(
      { success: false, error: 'Assessment failed' },
      { status: 500 }
    );
  }
}
