'use client';

import { useEffect, useState } from 'react';
import { getBookings, updateBookingStatus } from '@/lib/db';
import type { Booking } from '@/lib/types';

const STATUS_COLORS: Record<string, string> = {
  pending: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  confirmed: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  completed: 'text-ice-blue bg-ice-blue/10 border-ice-blue/20',
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    getBookings()
      .then((data) => setBookings(data as Booking[]))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdateStatus = async (id: string, status: Booking['status']) => {
    try {
      await updateBookingStatus(id, status);
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    } catch {
      alert('Update failed — check Firebase connection.');
    }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-light text-alabaster mb-1">Bookings</h1>
        <p className="font-mono text-xs text-alabaster/30 tracking-wider">
          {bookings.length} booking{bookings.length !== 1 ? 's' : ''} received
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'pending', 'confirmed', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 font-mono text-xs tracking-widest uppercase border transition-all duration-200 ${
              filter === f
                ? 'border-ice-blue text-ice-blue bg-ice-blue/5'
                : 'border-white/10 text-alabaster/30 hover:border-white/20 hover:text-alabaster/50'
            }`}
          >
            {f}
            {f !== 'all' && (
              <span className="ml-2 text-alabaster/20">
                ({bookings.filter((b) => b.status === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-6 h-6 border border-ice-blue/30 border-t-ice-blue rounded-full animate-spin mx-auto" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center border border-white/5">
          <p className="font-display text-2xl text-alabaster/20">No bookings {filter !== 'all' ? `with status "${filter}"` : 'yet'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((booking) => (
            <div
              key={booking.id}
              className="border border-white/5 p-5 hover:border-white/10 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-body text-sm font-medium text-alabaster">{booking.name}</span>
                    <span
                      className={`px-2 py-0.5 border font-mono text-[9px] tracking-widest uppercase ${STATUS_COLORS[booking.status] ?? ''}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <a
                    href={`tel:${booking.phone}`}
                    className="font-mono text-xs text-ice-blue/60 hover:text-ice-blue transition-colors"
                  >
                    {booking.phone}
                  </a>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xs text-alabaster/30 mb-1">
                    {new Date(booking.created_at).toLocaleDateString('en-GB', {
                      day: '2-digit', month: 'short', year: 'numeric',
                    })}
                  </div>
                  {booking.service && (
                    <div className="font-body text-xs text-alabaster/50">{booking.service}</div>
                  )}
                </div>
              </div>

              {booking.message && (
                <p className="mt-3 font-body text-xs text-alabaster/35 border-t border-white/5 pt-3 leading-relaxed">
                  {booking.message}
                </p>
              )}

              {/* Status actions */}
              <div className="mt-4 flex gap-2">
                {(['pending', 'confirmed', 'completed'] as Booking['status'][]).map((s) => (
                  <button
                    key={s}
                    onClick={() => handleUpdateStatus(booking.id, s)}
                    disabled={booking.status === s}
                    className={`px-3 py-1 font-mono text-[10px] tracking-wider uppercase border transition-all duration-200 disabled:opacity-30 disabled:cursor-default ${
                      booking.status === s
                        ? STATUS_COLORS[s]
                        : 'border-white/10 text-alabaster/25 hover:border-white/20 hover:text-alabaster/50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
