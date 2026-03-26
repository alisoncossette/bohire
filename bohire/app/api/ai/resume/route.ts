import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assessment, repos, linkedinData, githubUsername } = body;

    if (!assessment) {
      return NextResponse.json(
        { success: false, error: 'Assessment data required' },
        { status: 400 }
      );
    }

    const prompt = `Generate a professional resume for a software developer based on their verified GitHub activity and AI assessment.

GitHub Username: ${githubUsername}
AI Assessment: ${JSON.stringify(assessment, null, 2)}
${linkedinData ? `LinkedIn Profile: ${JSON.stringify(linkedinData, null, 2)}` : 'No LinkedIn data available'}

Top Repositories:
${/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
repos.slice(0, 10).map((r: any) => `- ${r.name}: ${r.description || 'No description'} (${r.language || 'Unknown'}) - ${r.stars} stars`).join('\n')}

Create a professional, honest resume in markdown format. Include:

1. Professional Summary (2-3 sentences based on actual work)
2. Technical Skills (based on verified GitHub languages and frameworks)
3. Notable Projects (top 3-5 from their repos with real details)
4. Experience Level: ${assessment.level}

${linkedinData ? '5. Work Experience (from LinkedIn)' : ''}

IMPORTANT:
- Only mention technologies they've actually used in their repos
- Base project descriptions on real repository data
- Don't embellish or add skills not evidenced in the data
- Be concise and factual
- Focus on impact and technical depth
- If LinkedIn data is provided, integrate it naturally

Format in clean markdown with proper headers.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 3000,
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

    const resume = content.text;

    return NextResponse.json({
      success: true,
      resume,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('AI resume generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Resume generation failed' },
      { status: 500 }
    );
  }
}
