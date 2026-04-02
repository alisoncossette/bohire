import { Anthropic } from '@anthropic-ai/sdk';
import type { EvidenceProfile, LanguageEvidence, RepositoryEvidence, CommitPatterns } from './types';
import * as crypto from 'crypto';

interface GitHubRepo {
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  private: boolean;
  html_url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
}

interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  stats?: {
    additions: number;
    deletions: number;
    total: number;
  };
}

interface RepoAnalysis {
  repo: GitHubRepo;
  commits: number;
  linesAdded: number;
  linesDeleted: number;
  languages: Map<string, number>;
  commitDates: Date[];
}

export class GitHubAnalyzer {
  private githubToken: string;
  private claudeApiKey?: string;

  constructor(githubToken: string, claudeApiKey?: string) {
    this.githubToken = githubToken;
    this.claudeApiKey = claudeApiKey;
  }

  async analyzeUser(username: string, selectedRepos?: string[]): Promise<EvidenceProfile> {
    // Fetch all repos for the user
    const repos = await this.fetchUserRepos(username);

    // Filter to selected repos if provided
    const reposToAnalyze = selectedRepos
      ? repos.filter(r => selectedRepos.includes(r.name))
      : repos;

    // Analyze each repository
    const repoAnalyses: RepoAnalysis[] = [];
    for (const repo of reposToAnalyze) {
      try {
        const analysis = await this.analyzeRepository(repo, username);
        repoAnalyses.push(analysis);
      } catch (error) {
        console.error(`Failed to analyze ${repo.name}:`, error);
      }
    }

    // Aggregate data
    const evidenceProfile = this.aggregateAnalysis(repoAnalyses);

    // Generate AI summary if Claude API key is provided
    if (this.claudeApiKey) {
      const aiSummary = await this.generateAISummary(evidenceProfile, username);
      evidenceProfile.aiSummary = aiSummary;
    }

    // Sign the profile
    evidenceProfile.signature = this.signProfile(evidenceProfile);

    return evidenceProfile;
  }

  private async fetchUserRepos(_username: string): Promise<GitHubRepo[]> {
    const repos: GitHubRepo[] = [];
    let page = 1;
    const perPage = 100;

    while (true) {
      const response = await fetch(
        `https://api.github.com/user/repos?per_page=${perPage}&page=${page}&affiliation=owner`,
        {
          headers: {
            'Authorization': `token ${this.githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.length === 0) break;

      repos.push(...data);

      if (data.length < perPage) break;

      page++;
    }

    return repos;
  }

  private async analyzeRepository(repo: GitHubRepo, username: string): Promise<RepoAnalysis> {
    // Fetch commits for this repo
    const commits = await this.fetchRepoCommits(repo.full_name, username);

    // Aggregate language stats
    const languages = new Map<string, number>();
    let totalLinesAdded = 0;
    let totalLinesDeleted = 0;
    const commitDates: Date[] = [];

    for (const commit of commits) {
      if (commit.stats) {
        totalLinesAdded += commit.stats.additions;
        totalLinesDeleted += commit.stats.deletions;
      }

      commitDates.push(new Date(commit.commit.author.date));

      // Track language (use repo primary language as proxy)
      if (repo.language) {
        languages.set(repo.language, (languages.get(repo.language) || 0) + 1);
      }
    }

    return {
      repo,
      commits: commits.length,
      linesAdded: totalLinesAdded,
      linesDeleted: totalLinesDeleted,
      languages,
      commitDates,
    };
  }

  private async fetchRepoCommits(fullRepoName: string, username: string): Promise<GitHubCommit[]> {
    const commits: GitHubCommit[] = [];
    let page = 1;
    const perPage = 100;
    const maxCommits = 500; // Limit to avoid rate limits

    while (commits.length < maxCommits) {
      const response = await fetch(
        `https://api.github.com/repos/${fullRepoName}/commits?per_page=${perPage}&page=${page}&author=${username}`,
        {
          headers: {
            'Authorization': `token ${this.githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        }
      );

      if (!response.ok) {
        if (response.status === 409) {
          // Empty repository
          break;
        }
        console.error(`Failed to fetch commits for ${fullRepoName}: ${response.status}`);
        break;
      }

      const data = await response.json();

      if (data.length === 0) break;

      // Fetch detailed stats for each commit
      for (const commit of data.slice(0, 50)) { // Limit detailed fetches
        try {
          const detailResponse = await fetch(
            `https://api.github.com/repos/${fullRepoName}/commits/${commit.sha}`,
            {
              headers: {
                'Authorization': `token ${this.githubToken}`,
                'Accept': 'application/vnd.github.v3+json',
              },
            }
          );

          if (detailResponse.ok) {
            const detail = await detailResponse.json();
            commits.push(detail);
          } else {
            commits.push(commit);
          }
        } catch {
          commits.push(commit);
        }
      }

      if (data.length < perPage) break;

      page++;
    }

    return commits;
  }

  private aggregateAnalysis(analyses: RepoAnalysis[]): EvidenceProfile {
    // Aggregate languages
    const languageMap = new Map<string, { commits: number; lines: number }>();
    const allCommitDates: Date[] = [];
    let totalCommits = 0;
    let _totalLinesChanged = 0;

    for (const analysis of analyses) {
      totalCommits += analysis.commits;
      _totalLinesChanged += analysis.linesAdded + analysis.linesDeleted;
      allCommitDates.push(...analysis.commitDates);

      for (const [lang, count] of analysis.languages) {
        const existing = languageMap.get(lang) || { commits: 0, lines: 0 };
        languageMap.set(lang, {
          commits: existing.commits + count,
          lines: existing.lines + analysis.linesAdded + analysis.linesDeleted,
        });
      }
    }

    // Convert language map to array
    const languages: LanguageEvidence[] = Array.from(languageMap.entries())
      .map(([name, data]) => ({
        name,
        commitCount: data.commits,
        linesChanged: data.lines,
        percentage: Math.round((data.commits / totalCommits) * 100),
      }))
      .sort((a, b) => b.commitCount - a.commitCount);

    // Build top repositories
    const topRepositories: RepositoryEvidence[] = analyses
      .map(analysis => {
        const totalLines = analysis.linesAdded + analysis.linesDeleted;
        const complexityScore = Math.min(100, Math.round(
          (analysis.commits * 0.3) +
          (totalLines / 100) +
          (analysis.languages.size * 10)
        ));

        return {
          name: analysis.repo.name,
          commits: analysis.commits,
          linesAdded: analysis.linesAdded,
          linesDeleted: analysis.linesDeleted,
          complexityScore,
          primaryLanguage: analysis.repo.language || undefined,
          isPrivate: analysis.repo.private,
          url: analysis.repo.private ? undefined : analysis.repo.html_url,
          description: analysis.repo.description || undefined,
        };
      })
      .sort((a, b) => b.commits - a.commits)
      .slice(0, 10);

    // Calculate commit patterns
    const commitPatterns = this.calculateCommitPatterns(allCommitDates);

    // Extract problem domains from repo descriptions and languages
    const problemDomains = this.extractProblemDomains(analyses);

    // Calculate collaboration score (based on repo count and commit consistency)
    const collaborationScore = Math.min(100, Math.round(
      (analyses.length * 5) +
      (commitPatterns.consistency * 0.5)
    ));

    const privateReposIncluded = analyses.some(a => a.repo.private);

    return {
      languages,
      topRepositories,
      commitPatterns,
      collaborationScore,
      problemDomains,
      totalCommits,
      analyzedRepos: analyses.length,
      privateReposIncluded,
      generatedAt: new Date().toISOString(),
      signature: '', // Will be filled later
    };
  }

  private calculateCommitPatterns(commitDates: Date[]): CommitPatterns {
    if (commitDates.length === 0) {
      return {
        consistency: 0,
        averageCommitsPerWeek: 0,
        averageCommitSize: 0,
        longestStreak: 0,
        lastActiveDate: new Date().toISOString(),
      };
    }

    // Sort by date
    commitDates.sort((a, b) => a.getTime() - b.getTime());

    const firstDate = commitDates[0];
    const lastDate = commitDates[commitDates.length - 1];
    const daysDiff = Math.max(1, (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));
    const weeks = Math.max(1, daysDiff / 7);

    const averageCommitsPerWeek = commitDates.length / weeks;

    // Calculate consistency (inverse of variance in weekly commits)
    const weeklyCommits = new Map<string, number>();
    for (const date of commitDates) {
      const weekKey = this.getWeekKey(date);
      weeklyCommits.set(weekKey, (weeklyCommits.get(weekKey) || 0) + 1);
    }

    const weeklyValues = Array.from(weeklyCommits.values());
    const mean = weeklyValues.reduce((a, b) => a + b, 0) / weeklyValues.length;
    const variance = weeklyValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / weeklyValues.length;
    const consistency = Math.max(0, Math.min(100, 100 - variance));

    // Calculate longest streak
    const longestStreak = this.calculateLongestStreak(commitDates);

    return {
      consistency: Math.round(consistency),
      averageCommitsPerWeek: Math.round(averageCommitsPerWeek * 10) / 10,
      averageCommitSize: 0, // Would need line change data per commit
      longestStreak,
      lastActiveDate: lastDate.toISOString(),
    };
  }

  private getWeekKey(date: Date): string {
    const year = date.getFullYear();
    const week = Math.floor((date.getTime() - new Date(year, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
    return `${year}-W${week}`;
  }

  private calculateLongestStreak(commitDates: Date[]): number {
    if (commitDates.length === 0) return 0;

    const uniqueDays = new Set(
      commitDates.map(date => date.toISOString().split('T')[0])
    );

    const sortedDays = Array.from(uniqueDays).sort();

    let longestStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < sortedDays.length; i++) {
      const prevDate = new Date(sortedDays[i - 1]);
      const currDate = new Date(sortedDays[i]);
      const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    return longestStreak;
  }

  private extractProblemDomains(analyses: RepoAnalysis[]): string[] {
    const domains = new Set<string>();

    // Keywords mapping to problem domains
    const domainKeywords: Record<string, string[]> = {
      'distributed systems': ['distributed', 'microservice', 'kafka', 'redis', 'queue'],
      'authentication': ['auth', 'oauth', 'jwt', 'security', 'login'],
      'data pipelines': ['pipeline', 'etl', 'data', 'analytics', 'airflow'],
      'web development': ['web', 'frontend', 'backend', 'api', 'rest'],
      'mobile development': ['mobile', 'ios', 'android', 'react-native', 'flutter'],
      'machine learning': ['ml', 'machine-learning', 'ai', 'neural', 'tensorflow'],
      'devops': ['docker', 'kubernetes', 'ci', 'cd', 'deploy', 'infrastructure'],
      'databases': ['database', 'sql', 'nosql', 'postgres', 'mongo'],
      'cloud': ['aws', 'gcp', 'azure', 'cloud', 'lambda', 'serverless'],
      'blockchain': ['blockchain', 'crypto', 'web3', 'ethereum', 'smart-contract'],
    };

    for (const analysis of analyses) {
      const text = `${analysis.repo.name} ${analysis.repo.description || ''}`.toLowerCase();

      for (const [domain, keywords] of Object.entries(domainKeywords)) {
        if (keywords.some(keyword => text.includes(keyword))) {
          domains.add(domain);
        }
      }
    }

    return Array.from(domains).slice(0, 8);
  }

  private async generateAISummary(profile: EvidenceProfile, username: string): Promise<string> {
    if (!this.claudeApiKey) {
      return '';
    }

    const anthropic = new Anthropic({ apiKey: this.claudeApiKey });

    const prompt = `Analyze this developer's GitHub evidence profile and write a concise, professional 2-3 sentence summary of their technical capabilities and work style.

Username: ${username}

Evidence Profile:
- Total Commits: ${profile.totalCommits}
- Top Languages: ${profile.languages.slice(0, 5).map(l => `${l.name} (${l.commitCount} commits)`).join(', ')}
- Top Repositories: ${profile.topRepositories.slice(0, 5).map(r => `${r.name} (${r.commits} commits)`).join(', ')}
- Commit Patterns: ${profile.commitPatterns.averageCommitsPerWeek} commits/week, ${profile.commitPatterns.consistency}% consistency, ${profile.commitPatterns.longestStreak} day streak
- Problem Domains: ${profile.problemDomains.join(', ')}
- Collaboration Score: ${profile.collaborationScore}/100

Write a factual, evidence-based summary. Focus on what the data shows, not aspirational qualities. Be direct and specific.`;

    try {
      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 200,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const textContent = message.content.find(c => c.type === 'text');
      return textContent && textContent.type === 'text' ? textContent.text : '';
    } catch (error) {
      console.error('Failed to generate AI summary:', error);
      return '';
    }
  }

  private signProfile(profile: EvidenceProfile): string {
    // Create a deterministic string representation of the profile
    const data = JSON.stringify({
      languages: profile.languages,
      topRepositories: profile.topRepositories,
      commitPatterns: profile.commitPatterns,
      collaborationScore: profile.collaborationScore,
      problemDomains: profile.problemDomains,
      totalCommits: profile.totalCommits,
      analyzedRepos: profile.analyzedRepos,
      generatedAt: profile.generatedAt,
    });

    // Generate SHA-256 hash as signature
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    return `0x${hash}`;
  }
}
