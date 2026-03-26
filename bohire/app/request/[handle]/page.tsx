'use client';

import { useState, use } from 'react';

export default function RequestPage({ params }: { params: Promise<{ handle: string }> }) {
  const resolvedParams = use(params);
  const [requesterEmail, setRequesterEmail] = useState('');
  const [requesterName, setRequesterName] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/bolo/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requester: requesterEmail,
          requesterName,
          target: resolvedParams.handle,
          resource: 'profile',
          message,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Failed to send request:', error);
      alert('Failed to send request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <div className="container mx-auto px-6 max-w-md">
          <div className="glass-panel p-8 text-center">
            <div className="w-16 h-16 bg-green rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4">Request Sent!</h2>
            <p className="text-gray-400">
              @{resolvedParams.handle} has been notified of your access request.
              You&apos;ll receive an email once they approve.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-6 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Request Access to{' '}
            <span className="gradient-text">@{resolvedParams.handle}</span>
          </h1>
          <p className="text-xl text-gray-400">
            Send a bolo request to view this candidate&apos;s verified profile
          </p>
        </div>

        <div className="glass-panel p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                value={requesterEmail}
                onChange={(e) => setRequesterEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green transition-colors"
                placeholder="john@company.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Message (Optional)
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green transition-colors resize-none"
                placeholder="Tell the candidate why you'd like to view their profile..."
              />
            </div>

            <div className="bg-teal/10 border border-teal/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-teal mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="text-sm text-gray-300">
                  <p className="font-medium mb-1">How BoHire works:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-400">
                    <li>The candidate will receive your request</li>
                    <li>They can approve or ignore it</li>
                    <li>If approved, you&apos;ll get access to their verified profile</li>
                    <li>They can revoke access at any time</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-4 bg-gradient-to-r from-green to-teal rounded-lg text-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Sending Request...' : 'Send Access Request'}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          Powered by <span className="text-green">Bolospot Protocol</span>
        </div>
      </div>
    </div>
  );
}
