'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getServiceById } from '@/lib/db';
import ServiceDetailClient from './ServiceDetailClient';
import type { Service } from '@/lib/types';

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

  const displayService = service;

  if (!displayService) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <p className="font-display text-2xl text-alabaster/30">Service not found</p>
      </div>
    );
  }

  return <ServiceDetailClient service={displayService} />;
}
