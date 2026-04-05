'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, isConfigured } from '@/lib/firebase';

const NAV = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    label: 'Services',
    href: '/admin/services',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2l9 7-9 7-9-7z" /><path d="M3 15l9 7 9-7" />
      </svg>
    ),
  },
  {
    label: 'Categories',
    href: '/admin/categories',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 6h16M4 12h16M4 18h7" />
      </svg>
    ),
  },
  {
    label: 'Bookings',
    href: '/admin/bookings',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ email?: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!auth || !isConfigured) {
      setUser({ email: 'demo@cleanvision.dz' });
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setUser({ email: 'demo@cleanvision.dz' });
      } else {
        setUser({ email: firebaseUser.email });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-6 h-6 border border-ice-blue/30 border-t-ice-blue rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex" style={{ fontFamily: 'var(--font-body)' }}>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 w-60 bg-[#0D0D0D] border-r border-white/5 z-30 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-6 h-6 relative">
              <div className="absolute inset-0 bg-deep-teal rounded-full opacity-60" />
              <div className="absolute inset-1 bg-ice-blue rounded-full opacity-40" />
              <div className="absolute inset-2 bg-alabaster rounded-full" />
            </div>
            <span className="font-display text-sm font-light tracking-[0.15em] text-alabaster">
              CLEAN<span className="text-ice-blue">VISION</span>
            </span>
          </Link>
          <p className="font-mono text-[10px] text-alabaster/25 tracking-wider mt-1 uppercase">Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`admin-nav-item flex items-center gap-3 px-3 py-2.5 rounded text-sm border-l-2 transition-all duration-200 ${
                  active
                    ? 'border-deep-teal bg-deep-teal/10 text-ice-blue'
                    : 'border-transparent text-alabaster/40 hover:text-alabaster/70 hover:bg-white/3'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-deep-teal to-ice-blue/40 flex items-center justify-center font-display text-xs text-alabaster">
              {user?.email?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <span className="font-mono text-xs text-alabaster/40 truncate">{user?.email}</span>
          </div>
          <button
            onClick={async () => {
              if (auth) await signOut(auth);
              router.push('/admin/login');
            }}
            className="w-full text-left font-mono text-xs text-alabaster/25 hover:text-red-400 transition-colors uppercase tracking-wider"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-60 min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="h-14 border-b border-white/5 flex items-center px-6 gap-4 sticky top-0 bg-[#0A0A0A] z-10">
          <button
            className="lg:hidden text-alabaster/40 hover:text-alabaster"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link
            href="/"
            className="ml-auto font-mono text-xs text-alabaster/25 hover:text-ice-blue transition-colors tracking-wider uppercase"
          >
            ← View Site
          </Link>
        </header>

        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
