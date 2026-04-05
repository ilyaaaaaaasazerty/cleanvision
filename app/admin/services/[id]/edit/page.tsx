'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getServiceById } from '@/lib/db';
import ServiceForm from '@/components/admin/ServiceForm';
import type { Service } from '@/lib/types';

export default function EditServicePage() {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServiceById(id)
      .then((data) => setService(data as Service))
      .catch(() => setService(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-6 h-6 border border-ice-blue/30 border-t-ice-blue rounded-full animate-spin" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="py-20 text-center">
        <p className="font-display text-2xl text-alabaster/20 mb-4">Service not found</p>
        <Link href="/admin/services" className="font-mono text-xs text-ice-blue hover:underline">
          ← Back to services
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <Link
          href="/admin/services"
          className="font-mono text-xs text-alabaster/30 hover:text-ice-blue transition-colors tracking-wider"
        >
          ← Services
        </Link>
        <span className="text-alabaster/10">/</span>
        <span className="font-mono text-xs text-alabaster/50 tracking-wider truncate max-w-xs">
          {service.title}
        </span>
      </div>
      <h1 className="font-display text-3xl font-light text-alabaster mb-8">Edit Service</h1>
      <ServiceForm mode="edit" initial={service} />
    </div>
  );
}
