'use client';

import { useState, useEffect } from 'react';
import type { CandidateProfile } from '@/lib/types';

interface Grant {
  id: string;
  requester: string;
  grantedAt: string;
}

interface PendingRequest {
  id: string;
  requester: string;
  message?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
    loadGrants();
    loadPendingRequests();
  }, []);

  const loadProfile = async () => {
    // In production, fetch from API
    // Mock data for demo
    setProfile({
      id: '1',
      worldIdVerified: true,
      worldIdHash: '0x1234...5678',
      githubUsername: 'developer',
      githubConnected: true,
      linkedinConnected: false,
      handle: 'developer',
      createdAt: new Date().toISOString(),
      aiAssessment: {
        skills: ['TypeScript', 'React', 'Node.js', 'Python', 'PostgreSQL'],
        level: 'senior',
        topProjects: [
          {
            name: 'awesome-project',
            description: 'A full-stack application with real-time features',
            techStack: ['React', 'Node.js', 'WebSocket'],
            impact: 'Built scalable real-time messaging system handling 10k+ concurrent users',
          },
        ],
        summary: 'Experienced full-stack developer with strong focus on modern web technologies and scalable architectures.',
        strengths: ['Clean code', 'System design', 'Performance optimization'],
        codeQuality: 8,
        activityLevel: 'high',
        assessedAt: new Date().toISOString(),
      },
      aiResume: 'Full AI-generated resume would be here...',
    });
    setLoading(false);
  };

  const loadGrants = async () => {
    try {
      const response = await fetch('/api/bolo/grants');
      const data = await response.json();
      setGrants(data.grants || []);
    } catch (error) {
      console.error('Failed to load grants:', error);
    }
  };

  const loadPendingRequests = async () => {
    try {
      const response = await fetch('/api/bolo/pending');
      const data = await response.json();
      setPendingRequests(data.requests || []);
    } catch (error) {
      console.error('Failed to load pending requests:', error);
    }
  };

  const handleRevoke = async (grantId: string) => {
    try {
      await fetch('/api/bolo/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grantId }),
      });
      loadGrants();
    } catch (error) {
      console.error('Failed to revoke grant:', error);
    }
  };

  const handleApprove = async (requestId: string) => {
    try {
      await fetch('/api/bolo/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId }),
      });
      loadPendingRequests();
      loadGrants();
    } catch (error) {
      console.error('Failed to approve request:', error);
    }
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-400">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="glass-panel p-8 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold">@{profile.handle}</h1>
                {profile.worldIdVerified && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-green/20 border border-green rounded-full">
                    <svg className="w-4 h-4 text-green" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-green font-medium">Verified Human</span>
                  </div>
                )}
              </div>
              <p className="text-gray-400 mb-4">
                {profile.aiAssessment?.summary || 'Professional profile verified via World ID and GitHub analysis'}
              </p>
              <div className="flex gap-4">
                {profile.githubConnected && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    <span>github.com/{profile.githubUsername}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Profile URL</div>
              <div className="text-green font-mono">
                {typeof window !== 'undefined' && `${window.location.origin}/request/${profile.handle}`}
              </div>
            </div>
          </div>
        </div>

        {/* Evidence Profile */}
        {profile.evidenceProfile && (
          <div className="space-y-8">
            {/* AI Summary */}
            {profile.evidenceProfile.aiSummary && (
              <div className="glass-panel p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Evidence-Based Assessment
                </h2>
                <p className="text-gray-300 leading-relaxed">{profile.evidenceProfile.aiSummary}</p>
                <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Cryptographically signed: {profile.evidenceProfile.signature.substring(0, 16)}...</span>
                </div>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-panel p-4 text-center">
                <div className="text-3xl font-bold text-green">{profile.evidenceProfile.totalCommits.toLocaleString()}</div>
                <div className="text-sm text-gray-400 mt-1">Total Commits</div>
              </div>
              <div className="glass-panel p-4 text-center">
                <div className="text-3xl font-bold text-green">{profile.evidenceProfile.analyzedRepos}</div>
                <div className="text-sm text-gray-400 mt-1">Repositories</div>
              </div>
              <div className="glass-panel p-4 text-center">
                <div className="text-3xl font-bold text-green">{profile.evidenceProfile.commitPatterns.longestStreak}</div>
                <div className="text-sm text-gray-400 mt-1">Day Streak</div>
              </div>
              <div className="glass-panel p-4 text-center">
                <div className="text-3xl font-bold text-green">{profile.evidenceProfile.collaborationScore}</div>
                <div className="text-sm text-gray-400 mt-1">Collaboration</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Languages with Evidence */}
              <div className="glass-panel p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-green" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified Skills
                </h2>
                <div className="space-y-3">
                  {profile.evidenceProfile.languages.slice(0, 6).map((lang) => (
                    <div key={lang.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{lang.name}</span>
                        <span className="text-sm text-green font-mono">{lang.commitCount} commits</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green to-teal"
                          style={{ width: `${lang.percentage}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {lang.linesChanged.toLocaleString()} lines changed
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Commit Patterns */}
              <div className="glass-panel p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Commit Activity
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-2">Consistency Score</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green to-teal"
                          style={{ width: `${profile.evidenceProfile.commitPatterns.consistency}%` }}
                        />
                      </div>
                      <span className="text-green font-bold">{profile.evidenceProfile.commitPatterns.consistency}%</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-400">Avg. commits/week</div>
                      <div className="text-2xl font-bold text-green">
                        {profile.evidenceProfile.commitPatterns.averageCommitsPerWeek}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Longest streak</div>
                      <div className="text-2xl font-bold text-green">
                        {profile.evidenceProfile.commitPatterns.longestStreak} days
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Last active</div>
                    <div className="text-sm text-gray-300">
                      {new Date(profile.evidenceProfile.commitPatterns.lastActiveDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Repositories */}
            <div className="glass-panel p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-green" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                Top Repositories
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {profile.evidenceProfile.topRepositories.slice(0, 6).map((repo) => (
                  <div key={repo.name} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-bold text-green">{repo.name}</div>
                        {repo.primaryLanguage && (
                          <div className="text-xs text-gray-400">{repo.primaryLanguage}</div>
                        )}
                      </div>
                      {repo.isPrivate && (
                        <span className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded text-xs text-yellow-500">
                          Private
                        </span>
                      )}
                    </div>
                    {repo.description && (
                      <p className="text-sm text-gray-400 mb-3">{repo.description}</p>
                    )}
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <div className="text-gray-500">Commits</div>
                        <div className="font-mono text-green">{repo.commits}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Lines +</div>
                        <div className="font-mono text-green">+{repo.linesAdded.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Complexity</div>
                        <div className="font-mono text-green">{repo.complexityScore}/100</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Problem Domains */}
            <div className="glass-panel p-6">
              <h2 className="text-2xl font-bold mb-4">Problem Domains</h2>
              <div className="flex flex-wrap gap-3">
                {profile.evidenceProfile.problemDomains.map((domain) => (
                  <span key={domain} className="px-4 py-2 bg-green/20 border border-green rounded-full text-sm font-medium">
                    {domain}
                  </span>
                ))}
              </div>
            </div>

            {/* Share Profile Button */}
            <div className="glass-panel p-6 text-center">
              <h2 className="text-2xl font-bold mb-4">Share Your Evidence Profile</h2>
              <p className="text-gray-400 mb-6">
                Employers can request access via Bolospot. You control who sees your verified profile.
              </p>
              <button className="px-8 py-3 bg-gradient-to-r from-green to-teal rounded-lg font-medium hover:opacity-90 transition-opacity">
                Copy Share Link
              </button>
            </div>
          </div>
        )}

        {/* Legacy AI Assessment (fallback) */}
        {!profile.evidenceProfile && profile.aiAssessment && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* AI Assessment */}
            <div className="glass-panel p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                AI Assessment
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-400 mb-2">Level</div>
                  <div className="text-xl font-bold gradient-text capitalize">{profile.aiAssessment.level}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-2">Skills</div>
                  <div className="flex flex-wrap gap-2">
                    {profile.aiAssessment.skills.map((skill) => (
                      <span key={skill} className="px-3 py-1 bg-green/20 border border-green/50 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-2">Code Quality</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green to-teal"
                        style={{ width: `${profile.aiAssessment.codeQuality * 10}%` }}
                      />
                    </div>
                    <span className="text-green font-bold">{profile.aiAssessment.codeQuality}/10</span>
                  </div>
                </div>
              </div>
            </div>

            {/* GitHub Stats */}
            <div className="glass-panel p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-green" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                Top Projects
              </h2>
              <div className="space-y-4">
                {profile.aiAssessment.topProjects.map((project) => (
                  <div key={project.name} className="border-l-2 border-green pl-4">
                    <div className="font-bold">{project.name}</div>
                    <p className="text-sm text-gray-400 mb-2">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <span key={tech} className="text-xs px-2 py-1 bg-gray-700 rounded">{tech}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div className="glass-panel p-6 mt-8">
            <h2 className="text-2xl font-bold mb-4">Pending Access Requests</h2>
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <div className="font-bold">{request.requester}</div>
                    <div className="text-sm text-gray-400">{request.message || 'Would like to view your profile'}</div>
                  </div>
                  <button
                    onClick={() => handleApprove(request.id)}
                    className="px-4 py-2 bg-green rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Approve
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Grants */}
        <div className="glass-panel p-6 mt-8">
          <h2 className="text-2xl font-bold mb-4">Active Access Grants</h2>
          {grants.length === 0 ? (
            <p className="text-gray-400">No active grants. Employers will need to request access to view your profile.</p>
          ) : (
            <div className="space-y-3">
              {grants.map((grant) => (
                <div key={grant.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <div className="font-bold">{grant.requester}</div>
                    <div className="text-sm text-gray-400">
                      Granted {new Date(grant.grantedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRevoke(grant.id)}
                    className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"
                  >
                    Revoke
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
