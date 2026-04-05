'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getServices, deleteService } from '@/lib/db';
import type { Service } from '@/lib/types';

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const load = async () => {
    try {
      const data = await getServices();
      setServices(data as Service[]);
    } catch {
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await deleteService(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (e) {
      alert('Delete failed — check Firebase connection.');
    } finally {
      setDeleting(null);
    }
  };

  const filtered = services.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.category?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-light text-alabaster mb-1">Services</h1>
          <p className="font-mono text-xs text-alabaster/30 tracking-wider">
            {services.length} service{services.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Link
          href="/admin/services/new"
          className="px-5 py-2.5 bg-ice-blue text-obsidian font-mono text-xs tracking-widest uppercase hover:bg-deep-teal hover:text-alabaster transition-all duration-300"
        >
          + New Service
        </Link>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search services..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm bg-white/[0.03] border border-white/10 text-alabaster text-sm px-4 py-2.5 placeholder-alabaster/25 focus:outline-none focus:border-ice-blue/40 mb-6 font-body"
      />

      {/* Table */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-6 h-6 border border-ice-blue/30 border-t-ice-blue rounded-full animate-spin mx-auto" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center border border-white/5">
          <p className="font-display text-2xl text-alabaster/20 mb-3">
            {search ? 'No results' : 'No services yet'}
          </p>
          {!search && (
            <Link href="/admin/services/new" className="font-mono text-xs text-ice-blue hover:underline">
              Create your first service →
            </Link>
          )}
        </div>
      ) : (
        <div className="border border-white/5 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
            <span className="font-mono text-[10px] tracking-widest uppercase text-alabaster/25 w-14">Image</span>
            <span className="font-mono text-[10px] tracking-widest uppercase text-alabaster/25">Service</span>
            <span className="font-mono text-[10px] tracking-widest uppercase text-alabaster/25">Category</span>
            <span className="font-mono text-[10px] tracking-widest uppercase text-alabaster/25">Price</span>
            <span className="font-mono text-[10px] tracking-widest uppercase text-alabaster/25">Actions</span>
          </div>

          {filtered.map((service, i) => (
            <div
              key={service.id}
              className={`grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center px-4 py-3 transition-colors hover:bg-white/[0.02] ${
                i < filtered.length - 1 ? 'border-b border-white/5' : ''
              }`}
            >
              {/* Thumbnail */}
              <div className="w-14 h-10 relative overflow-hidden bg-white/5 flex-shrink-0">
                {service.image_url ? (
                  <Image src={service.image_url} alt={service.title} fill className="object-cover" sizes="56px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-alabaster/20 text-xs">—</div>
                )}
              </div>

              {/* Title + featured */}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-body text-sm text-alabaster/80 truncate">{service.title}</span>
                  {service.featured && (
                    <span className="px-1.5 py-0.5 bg-ice-blue/10 text-ice-blue font-mono text-[9px] tracking-widest uppercase flex-shrink-0">
                      Featured
                    </span>
                  )}
                </div>
                <p className="font-mono text-xs text-alabaster/25 mt-0.5 truncate">{service.description.slice(0, 60)}...</p>
              </div>

              {/* Category */}
              <span className="font-mono text-xs text-alabaster/35 whitespace-nowrap">
                {service.category?.name ?? '—'}
              </span>

              {/* Price */}
              <span className="font-mono text-sm text-ice-blue whitespace-nowrap">
                {service.price ? `$${service.price}` : '—'}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/services/${service.id}/edit`}
                  className="font-mono text-xs text-alabaster/40 hover:text-ice-blue transition-colors px-2 py-1"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(service.id, service.title)}
                  disabled={deleting === service.id}
                  className="font-mono text-xs text-alabaster/25 hover:text-red-400 transition-colors px-2 py-1 disabled:opacity-40"
                >
                  {deleting === service.id ? '...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
