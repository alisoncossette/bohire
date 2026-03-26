'use client';

import { useState } from 'react';

enum OnboardingStep {
  WORLD_ID = 'world-id',
  GITHUB = 'github',
  LINKEDIN = 'linkedin',
  AI_ASSESSMENT = 'ai-assessment',
  COMPLETE = 'complete',
}

export default function OnboardPage() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(OnboardingStep.WORLD_ID);
  const [worldIdVerified, setWorldIdVerified] = useState(false);
  const [linkedinConnected, setLinkedinConnected] = useState(false);
  const [assessing, setAssessing] = useState(false);
  const [assessmentComplete, setAssessmentComplete] = useState(false);

  const handleWorldIdVerify = async () => {
    try {
      // In production, integrate with @worldcoin/minikit-js
      // For now, simulate verification
      setWorldIdVerified(true);
      setCurrentStep(OnboardingStep.GITHUB);
    } catch (error) {
      console.error('World ID verification failed:', error);
    }
  };

  const handleGithubConnect = async () => {
    try {
      // Redirect to GitHub OAuth
      const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
      const redirectUri = `${window.location.origin}/api/auth/github/callback`;
      window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=read:user,repo`;
    } catch (error) {
      console.error('GitHub connection failed:', error);
    }
  };

  const handleLinkedinConnect = async () => {
    // Optional step - can skip
    setLinkedinConnected(true);
    setCurrentStep(OnboardingStep.AI_ASSESSMENT);
  };

  const handleSkipLinkedin = () => {
    setCurrentStep(OnboardingStep.AI_ASSESSMENT);
  };

  const handleAIAssessment = async () => {
    setAssessing(true);
    try {
      const response = await fetch('/api/ai/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();

      if (data.success) {
        setAssessmentComplete(true);

        // Generate resume
        await fetch('/api/ai/resume', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        setCurrentStep(OnboardingStep.COMPLETE);
      }
    } catch (error) {
      console.error('AI assessment failed:', error);
    } finally {
      setAssessing(false);
    }
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
        <div className="flex items-center justify-between mb-12">
          {[
            { id: OnboardingStep.WORLD_ID, label: 'World ID' },
            { id: OnboardingStep.GITHUB, label: 'GitHub' },
            { id: OnboardingStep.LINKEDIN, label: 'LinkedIn' },
            { id: OnboardingStep.AI_ASSESSMENT, label: 'AI Assessment' },
          ].map((step, idx, arr) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    currentStep === step.id
                      ? 'bg-gradient-to-r from-green to-teal'
                      : worldIdVerified || linkedinConnected || assessmentComplete
                      ? 'bg-green'
                      : 'bg-gray-700'
                  }`}
                >
                  {idx + 1}
                </div>
                <span className="text-xs mt-2 text-gray-400">{step.label}</span>
              </div>
              {idx < arr.length - 1 && (
                <div className="flex-1 h-1 bg-gray-700 mx-2" />
              )}
            </div>
          ))}
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

          {currentStep === OnboardingStep.GITHUB && (
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green to-teal rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </div>
              <h2 className="text-3xl font-bold mb-4">Connect GitHub</h2>
              <p className="text-gray-400 mb-8">
                We&apos;ll analyze your repositories to build an accurate technical profile.
              </p>
              <button
                onClick={handleGithubConnect}
                className="px-8 py-3 bg-gradient-to-r from-green to-teal rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Connect GitHub
              </button>
            </div>
          )}

          {currentStep === OnboardingStep.LINKEDIN && (
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green to-teal rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
              <h2 className="text-3xl font-bold mb-4">Import LinkedIn (Optional)</h2>
              <p className="text-gray-400 mb-8">
                Add your professional work history to complement your technical skills.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleLinkedinConnect}
                  className="px-8 py-3 bg-gradient-to-r from-green to-teal rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Connect LinkedIn
                </button>
                <button
                  onClick={handleSkipLinkedin}
                  className="px-8 py-3 glass-panel font-medium hover:bg-white/5 transition-colors"
                >
                  Skip for Now
                </button>
              </div>
            </div>
          )}

          {currentStep === OnboardingStep.AI_ASSESSMENT && (
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green to-teal rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold mb-4">AI Code Assessment</h2>
              <p className="text-gray-400 mb-8">
                Claude AI will analyze your GitHub repositories and generate a professional assessment and resume.
              </p>
              <button
                onClick={handleAIAssessment}
                disabled={assessing}
                className="px-8 py-3 bg-gradient-to-r from-green to-teal rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {assessing ? 'Analyzing your code...' : 'Start AI Assessment'}
              </button>
              {assessing && (
                <p className="text-sm text-gray-500 mt-4">
                  This may take a minute. Claude is reading your code...
                </p>
              )}
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
