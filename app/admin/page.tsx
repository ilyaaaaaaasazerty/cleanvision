'use client';

import { useEffect, useState } from 'react';
import { getServices, getCategories, getBookings } from '@/lib/supabaseClient';
import Link from 'next/link';

interface Stats { services: number; categories: number; bookings: number; pending: number }

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ services: 0, categories: 0, bookings: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getServices().catch(() => []),
      getCategories().catch(() => []),
      getBookings().catch(() => []),
    ]).then(([svcs, cats, bookings]) => {
      const arr = bookings as Array<{ status: string }>;
      setStats({
        services: (svcs as unknown[]).length,
        categories: (cats as unknown[]).length,
        bookings: arr.length,
        pending: arr.filter((b) => b.status === 'pending').length,
      });
      setLoading(false);
    });
  }, []);

  const cards = [
    { label: 'Total Services', value: stats.services, href: '/admin/services', color: 'from-deep-teal/20 to-transparent', accent: 'text-ice-blue' },
    { label: 'Categories', value: stats.categories, href: '/admin/categories', color: 'from-blue-900/15 to-transparent', accent: 'text-blue-400' },
    { label: 'All Bookings', value: stats.bookings, href: '/admin/bookings', color: 'from-emerald-900/15 to-transparent', accent: 'text-emerald-400' },
    { label: 'Pending', value: stats.pending, href: '/admin/bookings', color: 'from-amber-900/15 to-transparent', accent: 'text-amber-400' },
  ];

  const quickLinks = [
    { label: 'Add New Service', href: '/admin/services/new', description: 'Create a service listing' },
    { label: 'Add Category', href: '/admin/categories', description: 'Manage service categories' },
    { label: 'View Bookings', href: '/admin/bookings', description: 'Manage client requests' },
    { label: 'View Website', href: '/', description: 'See the live site', external: true },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-light text-alabaster mb-1">Dashboard</h1>
        <p className="font-mono text-xs text-alabaster/30 tracking-wider">Overview of your CleanVision CMS</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={`relative overflow-hidden rounded bg-gradient-to-br ${card.color} border border-white/5 p-5 hover:border-white/10 transition-all duration-300 group`}
          >
            <p className="font-mono text-xs tracking-wider text-alabaster/35 uppercase mb-3">{card.label}</p>
            <p className={`font-display text-4xl font-light ${card.accent}`}>
              {loading ? '—' : card.value}
            </p>
            <span className="absolute bottom-4 right-4 font-mono text-xs text-alabaster/15 group-hover:text-alabaster/30 transition-colors">→</span>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="font-mono text-xs tracking-[0.3em] uppercase text-ice-blue/50 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {quickLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            target={link.external ? '_blank' : undefined}
            className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300 group"
          >
            <div>
              <p className="font-body text-sm text-alabaster/70 group-hover:text-alabaster transition-colors">{link.label}</p>
              <p className="font-mono text-xs text-alabaster/25 mt-0.5">{link.description}</p>
            </div>
            <span className="text-alabaster/20 group-hover:text-ice-blue transition-colors group-hover:translate-x-1 duration-300">→</span>
          </Link>
        ))}
      </div>

      {/* Info bar */}
      <div className="mt-10 p-4 border border-deep-teal/20 bg-deep-teal/5">
        <p className="font-mono text-xs text-ice-blue/60 tracking-wider">
          💡 Configure your Supabase credentials in <code className="text-ice-blue">.env.local</code> to activate live data. See <code className="text-ice-blue">supabase-schema.sql</code> for the database setup.
        </p>
      </div>
    </div>
  );
}
