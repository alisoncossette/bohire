'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 border-b border-white/10 backdrop-blur-xl bg-dark-bg/80">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold gradient-text">BoHire</div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-300 hover:text-green transition-colors">
              Home
            </Link>
            <Link href="/onboard" className="text-gray-300 hover:text-green transition-colors">
              Get Started
            </Link>
            <Link href="/profile" className="text-gray-300 hover:text-green transition-colors">
              Profile
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              href="/onboard"
              className="px-6 py-2 bg-gradient-to-r from-green to-teal rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
