import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Your work speaks for itself.
            <br />
            <span className="gradient-text">Now prove it.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-12">
            Build a verified professional profile powered by World ID, real GitHub analysis, and AI-generated resume.
            <br />
            No fake profiles. No self-reported fluff. Just proof of work.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/onboard"
              className="px-8 py-4 bg-gradient-to-r from-green to-teal rounded-lg text-lg font-medium hover:opacity-90 transition-opacity"
            >
              Get Verified
            </Link>
            <Link
              href="#how-it-works"
              className="px-8 py-4 glass-panel text-lg font-medium hover:bg-white/5 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            What makes <span className="gradient-text">BoHire</span> different
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* World ID */}
            <div className="glass-panel p-8">
              <div className="w-12 h-12 bg-gradient-to-r from-green to-teal rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">World ID Verified</h3>
              <p className="text-gray-400">
                Proves you are a real, unique human. No fake profiles, no bot farms.
                One person, one verified identity.
              </p>
            </div>

            {/* GitHub Analysis */}
            <div className="glass-panel p-8">
              <div className="w-12 h-12 bg-gradient-to-r from-green to-teal rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">AI GitHub Analysis</h3>
              <p className="text-gray-400">
                Claude AI analyzes your ACTUAL repos and commits. Real code quality assessment,
                not self-reported skills.
              </p>
            </div>

            {/* LinkedIn Import */}
            <div className="glass-panel p-8">
              <div className="w-12 h-12 bg-gradient-to-r from-green to-teal rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">LinkedIn Integration</h3>
              <p className="text-gray-400">
                Import real work history via OAuth. Combine your professional experience
                with technical verification.
              </p>
            </div>

            {/* AI Resume */}
            <div className="glass-panel p-8">
              <div className="w-12 h-12 bg-gradient-to-r from-green to-teal rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">AI-Generated Resume</h3>
              <p className="text-gray-400">
                Claude reads your code and writes an honest resume based on what you actually built.
                No exaggeration, just facts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bolospot Permission Layer */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="glass-panel p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Built on <span className="gradient-text">Bolospot Protocol</span>
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Employers request a &apos;bohire bolo&apos; (permission) to view your profile.
              You control access and can revoke instantly. Your data, your rules.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Grant access instantly</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Revoke anytime</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Full transparency</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to prove your skills?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join developers who believe in proof of work, not just claims.
          </p>
          <Link
            href="/onboard"
            className="inline-block px-12 py-4 bg-gradient-to-r from-green to-teal rounded-lg text-xl font-medium hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}
