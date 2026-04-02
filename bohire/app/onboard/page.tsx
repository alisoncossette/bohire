'use client';

import { useState } from 'react';

enum OnboardingStep {
  WORLD_ID = 'world-id',
  GITHUB_CONNECT = 'github-connect',
  SELECT_REPOS = 'select-repos',
  RUN_ANALYSIS = 'run-analysis',
  REVIEW_PROFILE = 'review-profile',
  PUBLISH = 'publish',
  COMPLETE = 'complete',
}

interface Repo {
  name: string;
  description?: string;
  language?: string;
  private: boolean;
  updated: string;
}

export default function OnboardPage() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(OnboardingStep.WORLD_ID);
  const [worldIdVerified, setWorldIdVerified] = useState(false); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [githubToken, setGithubToken] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [claudeApiKey, setClaudeApiKey] = useState('');
  const [repos, setRepos] = useState<Repo[]>([]);
  const [selectedRepos, setSelectedRepos] = useState<Set<string>>(new Set());
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [analyzing, setAnalyzing] = useState(false); // eslint-disable-line @typescript-eslint/no-unused-vars
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [evidenceProfile, setEvidenceProfile] = useState<any>(null);
  const [analysisProgress, setAnalysisProgress] = useState('');

  const handleWorldIdVerify = async () => {
    try {
      // In production, integrate with @worldcoin/minikit-js
      // For now, simulate verification
      setWorldIdVerified(true);
      setCurrentStep(OnboardingStep.GITHUB_CONNECT);
    } catch (error) {
      console.error('World ID verification failed:', error);
    }
  };

  const handleGithubConnect = async () => {
    if (!githubToken || !githubUsername) {
      alert('Please enter both GitHub token and username');
      return;
    }

    setLoadingRepos(true);
    try {
      const response = await fetch(`/api/github/repos?username=${githubUsername}`, {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setRepos(data.repos || []);
        // Auto-select all public repos by default
        const publicRepos = new Set<string>(data.repos.filter((r: Repo) => !r.private).map((r: Repo) => r.name as string));
        setSelectedRepos(publicRepos);
        setCurrentStep(OnboardingStep.SELECT_REPOS);
      } else {
        alert('Failed to fetch repositories. Please check your token and username.');
      }
    } catch (error) {
      console.error('GitHub connection failed:', error);
      alert('Failed to connect to GitHub');
    } finally {
      setLoadingRepos(false);
    }
  };

  const toggleRepo = (repoName: string) => {
    const newSelected = new Set(selectedRepos);
    if (newSelected.has(repoName)) {
      newSelected.delete(repoName);
    } else {
      newSelected.add(repoName);
    }
    setSelectedRepos(newSelected);
  };

  const handleRunAnalysis = async () => {
    if (selectedRepos.size === 0) {
      alert('Please select at least one repository to analyze');
      return;
    }

    setAnalyzing(true);
    setAnalysisProgress('Initializing analysis...');
    setCurrentStep(OnboardingStep.RUN_ANALYSIS);

    try {
      setAnalysisProgress(`Analyzing ${selectedRepos.size} repositories...`);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          githubToken,
          githubUsername,
          claudeApiKey: claudeApiKey || undefined,
          selectedRepos: Array.from(selectedRepos),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setEvidenceProfile(data.profile);
        setAnalysisProgress('Analysis complete!');
        setCurrentStep(OnboardingStep.REVIEW_PROFILE);
      } else {
        alert(`Analysis failed: ${data.error}`);
        setCurrentStep(OnboardingStep.SELECT_REPOS);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Failed to analyze repositories');
      setCurrentStep(OnboardingStep.SELECT_REPOS);
    } finally {
      setAnalyzing(false);
    }
  };

  const handlePublish = () => {
    // In production, save to database/Bolospot
    setCurrentStep(OnboardingStep.COMPLETE);
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Get <span className="gradient-text">Verified</span>
        </h1>
        <p className="text-xl text-gray-400 text-center mb-12">
          Complete these steps to build your verified professional profile
        </p>

        {/* Progress Stepper */}
        <div className="flex items-center justify-between mb-12 overflow-x-auto">
          {[
            { id: OnboardingStep.WORLD_ID, label: 'Verify' },
            { id: OnboardingStep.GITHUB_CONNECT, label: 'Connect' },
            { id: OnboardingStep.SELECT_REPOS, label: 'Select' },
            { id: OnboardingStep.RUN_ANALYSIS, label: 'Analyze' },
            { id: OnboardingStep.REVIEW_PROFILE, label: 'Review' },
            { id: OnboardingStep.PUBLISH, label: 'Publish' },
          ].map((step, idx, arr) => {
            const stepIndex = Object.values(OnboardingStep).indexOf(currentStep);
            const thisStepIndex = Object.values(OnboardingStep).indexOf(step.id);
            const isCompleted = thisStepIndex < stepIndex;
            const isCurrent = currentStep === step.id;

            return (
              <div key={step.id} className="flex items-center flex-1 min-w-0">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      isCurrent
                        ? 'bg-gradient-to-r from-green to-teal'
                        : isCompleted
                        ? 'bg-green'
                        : 'bg-gray-700'
                    }`}
                  >
                    {isCompleted ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <span className="text-xs mt-2 text-gray-400 whitespace-nowrap">{step.label}</span>
                </div>
                {idx < arr.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 ${isCompleted ? 'bg-green' : 'bg-gray-700'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="glass-panel p-8">
          {currentStep === OnboardingStep.WORLD_ID && (
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green to-teal rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold mb-4">Verify with World ID</h2>
              <p className="text-gray-400 mb-8">
                Prove you&apos;re a unique human. This prevents fake profiles and bot accounts.
              </p>
              <button
                onClick={handleWorldIdVerify}
                className="px-8 py-3 bg-gradient-to-r from-green to-teal rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Verify with World ID
              </button>
              <p className="text-sm text-gray-500 mt-4">
                Powered by Worldcoin&apos;s World ID
              </p>
            </div>
          )}

          {currentStep === OnboardingStep.GITHUB_CONNECT && (
            <div>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green to-teal rounded-full mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                </div>
                <h2 className="text-3xl font-bold mb-4">Connect GitHub</h2>
                <p className="text-gray-400 mb-2">
                  We&apos;ll analyze your repositories to generate evidence-based skills with receipts.
                </p>
                <p className="text-sm text-gray-500">
                  Your code stays private. We only read metadata and commit history.
                </p>
              </div>

              <div className="space-y-4 max-w-md mx-auto">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium mb-2">
                    GitHub Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green transition-colors"
                    placeholder="your-username"
                  />
                </div>

                <div>
                  <label htmlFor="token" className="block text-sm font-medium mb-2">
                    GitHub Personal Access Token
                  </label>
                  <input
                    type="password"
                    id="token"
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green transition-colors font-mono text-sm"
                    placeholder="ghp_..."
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    <a href="https://github.com/settings/tokens/new?scopes=repo,read:user" target="_blank" rel="noopener noreferrer" className="text-green hover:underline">
                      Create a token
                    </a>
                    {' '}with &apos;repo&apos; and &apos;read:user&apos; scopes
                  </p>
                </div>

                <div>
                  <label htmlFor="claude-key" className="block text-sm font-medium mb-2">
                    Claude API Key (Optional)
                  </label>
                  <input
                    type="password"
                    id="claude-key"
                    value={claudeApiKey}
                    onChange={(e) => setClaudeApiKey(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green transition-colors font-mono text-sm"
                    placeholder="sk-ant-..."
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    For AI-generated summary. Leave blank to skip.
                  </p>
                </div>

                <button
                  onClick={handleGithubConnect}
                  disabled={loadingRepos}
                  className="w-full px-8 py-3 bg-gradient-to-r from-green to-teal rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loadingRepos ? 'Loading repositories...' : 'Continue'}
                </button>
              </div>
            </div>
          )}

          {currentStep === OnboardingStep.SELECT_REPOS && (
            <div>
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold mb-4">Select Repositories</h2>
                <p className="text-gray-400">
                  Choose which repositories to include in your evidence profile.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Selected: {selectedRepos.size} of {repos.length} repositories
                </p>
              </div>

              <div className="max-h-96 overflow-y-auto space-y-2 mb-6">
                {repos.map((repo) => (
                  <div
                    key={repo.name}
                    onClick={() => toggleRepo(repo.name)}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedRepos.has(repo.name)
                        ? 'bg-green/10 border-green'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            selectedRepos.has(repo.name) ? 'bg-green border-green' : 'border-gray-500'
                          }`}>
                            {selectedRepos.has(repo.name) && (
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <span className="font-bold">{repo.name}</span>
                          {repo.private && (
                            <span className="px-2 py-0.5 bg-yellow-500/20 border border-yellow-500/50 rounded text-xs text-yellow-500">
                              Private
                            </span>
                          )}
                        </div>
                        {repo.description && (
                          <p className="text-sm text-gray-400 mt-2">{repo.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          {repo.language && <span>{repo.language}</span>}
                          <span>Updated {new Date(repo.updated).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedRepos(new Set(repos.map(r => r.name)))}
                  className="flex-1 px-4 py-2 glass-panel rounded-lg hover:bg-white/5 transition-colors text-sm"
                >
                  Select All
                </button>
                <button
                  onClick={() => setSelectedRepos(new Set())}
                  className="flex-1 px-4 py-2 glass-panel rounded-lg hover:bg-white/5 transition-colors text-sm"
                >
                  Deselect All
                </button>
              </div>

              <button
                onClick={handleRunAnalysis}
                disabled={selectedRepos.size === 0}
                className="w-full mt-6 px-8 py-3 bg-gradient-to-r from-green to-teal rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Analyze Selected Repositories
              </button>
            </div>
          )}

          {currentStep === OnboardingStep.RUN_ANALYSIS && (
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green to-teal rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold mb-4">Analyzing Your Code</h2>
              <p className="text-gray-400 mb-4">{analysisProgress}</p>
              <p className="text-sm text-gray-500">
                This may take a few minutes. We&apos;re reading commit history, calculating metrics, and generating your evidence profile...
              </p>
              <div className="mt-8 max-w-md mx-auto">
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green to-teal animate-pulse" style={{ width: '70%' }} />
                </div>
              </div>
            </div>
          )}

          {currentStep === OnboardingStep.REVIEW_PROFILE && evidenceProfile && (
            <div>
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold mb-4">Review Your Evidence Profile</h2>
                <p className="text-gray-400">
                  Here&apos;s what we found. This is what employers will see.
                </p>
              </div>

              <div className="space-y-6">
                {evidenceProfile.aiSummary && (
                  <div className="glass-panel p-6">
                    <h3 className="text-xl font-bold mb-3">AI Summary</h3>
                    <p className="text-gray-300">{evidenceProfile.aiSummary}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="glass-panel p-4 text-center">
                    <div className="text-2xl font-bold text-green">{evidenceProfile.totalCommits.toLocaleString()}</div>
                    <div className="text-xs text-gray-400 mt-1">Commits</div>
                  </div>
                  <div className="glass-panel p-4 text-center">
                    <div className="text-2xl font-bold text-green">{evidenceProfile.analyzedRepos}</div>
                    <div className="text-xs text-gray-400 mt-1">Repos</div>
                  </div>
                  <div className="glass-panel p-4 text-center">
                    <div className="text-2xl font-bold text-green">{evidenceProfile.commitPatterns.longestStreak}</div>
                    <div className="text-xs text-gray-400 mt-1">Day Streak</div>
                  </div>
                  <div className="glass-panel p-4 text-center">
                    <div className="text-2xl font-bold text-green">{evidenceProfile.languages.length}</div>
                    <div className="text-xs text-gray-400 mt-1">Languages</div>
                  </div>
                </div>

                <div className="glass-panel p-6">
                  <h3 className="text-xl font-bold mb-4">Top Languages</h3>
                  <div className="space-y-2">
                    {evidenceProfile.languages.slice(0, 5).map((lang: { name: string; commitCount: number; percentage: number }) => (
                      <div key={lang.name} className="flex items-center justify-between">
                        <span>{lang.name}</span>
                        <span className="text-green font-mono text-sm">{lang.commitCount} commits</span>
                      </div>
                    ))}
                  </div>
                </div>

                {evidenceProfile.problemDomains.length > 0 && (
                  <div className="glass-panel p-6">
                    <h3 className="text-xl font-bold mb-4">Problem Domains</h3>
                    <div className="flex flex-wrap gap-2">
                      {evidenceProfile.problemDomains.map((domain: string) => (
                        <span key={domain} className="px-3 py-1 bg-green/20 border border-green rounded-full text-sm">
                          {domain}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setCurrentStep(OnboardingStep.PUBLISH)}
                className="w-full mt-6 px-8 py-3 bg-gradient-to-r from-green to-teal rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Looks Good - Publish Profile
              </button>
            </div>
          )}

          {currentStep === OnboardingStep.PUBLISH && (
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green to-teal rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold mb-4">Publish to BoHire</h2>
              <p className="text-gray-400 mb-8">
                Your evidence profile will be stored on Bolospot. Employers can request access, and you control who sees it.
              </p>
              <button
                onClick={handlePublish}
                className="px-8 py-3 bg-gradient-to-r from-green to-teal rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Publish My Profile
              </button>
            </div>
          )}

          {currentStep === OnboardingStep.COMPLETE && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold mb-4">You&apos;re All Set!</h2>
              <p className="text-gray-400 mb-8">
                Your verified professional profile is ready. Employers can now request access to view it.
              </p>
              <a
                href="/profile"
                className="inline-block px-8 py-3 bg-gradient-to-r from-green to-teal rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                View My Profile
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
