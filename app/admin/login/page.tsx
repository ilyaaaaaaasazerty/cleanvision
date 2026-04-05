'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!auth) {
        setError('Firebase not configured. Add your Firebase credentials to .env.local');
        setLoading(false);
        return;
      }
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/admin');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-3 mb-8 font-display text-xl font-light tracking-[0.15em] text-alabaster uppercase">
            <div className="relative w-10 h-10 overflow-hidden">
              <img src="/logo.png" alt="Logo" className="object-contain w-full h-full" />
            </div>
            <span>AMIN<span className="text-ice-blue"> CRYSTAL CLEAN</span></span>
          </Link>
          <p className="font-mono text-xs tracking-[0.3em] text-alabaster/30 uppercase">Admin Access</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="font-mono text-[10px] tracking-widest uppercase text-alabaster/40 block mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 text-alabaster text-sm px-4 py-3 placeholder-alabaster/25 focus:outline-none focus:border-ice-blue/40 font-body"
              placeholder="admin@amin-clean.dz"
            />
          </div>

          <div>
            <label className="font-mono text-[10px] tracking-widest uppercase text-alabaster/40 block mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 text-alabaster text-sm px-4 py-3 placeholder-alabaster/25 focus:outline-none focus:border-ice-blue/40 font-body"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="font-mono text-xs text-red-400/80 tracking-wider">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-ice-blue text-obsidian font-mono text-xs tracking-widest uppercase hover:bg-deep-teal hover:text-alabaster transition-all duration-300 disabled:opacity-50 mt-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/" className="font-mono text-xs text-alabaster/20 hover:text-ice-blue transition-colors tracking-wider">
            ← Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
