'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getServiceById } from '@/lib/db';
import ServiceDetailClient from './ServiceDetailClient';
import type { Service } from '@/lib/types';

const FALLBACK: Record<string, Service> = {
  '1': {
    id: '1',
    title: 'Residential Deep Clean',
    description: 'Every corner, every surface — transformed. Our deep clean protocol leaves your home immaculate from ceiling to floor. We use eco-friendly, hospital-grade products safe for your family and pets.',
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    price: 120,
    featured: true,
    category_id: '1',
    created_at: '',
    category: { id: '1', name: 'Residential', created_at: '' },
  },
};

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServiceById(id)
      .then((data) => setService(data as Service | null))
      .catch(() => setService(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="w-6 h-6 border border-ice-blue/30 border-t-ice-blue rounded-full animate-spin" />
      </div>
    );
  }

  const displayService = service || FALLBACK[id] || null;

  if (!displayService) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <p className="font-display text-2xl text-alabaster/30">Service not found</p>
      </div>
    );
  }

  return <ServiceDetailClient service={displayService} />;
}
