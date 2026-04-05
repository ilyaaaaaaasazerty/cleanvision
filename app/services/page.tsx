'use client';

import { useEffect, useState } from 'react';
import { getServices, getCategories } from '@/lib/db';
import ServicesPageClient from './ServicesPageClient';
import type { Service, Category } from '@/lib/types';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    Promise.all([
      getServices().catch(() => []),
      getCategories().catch(() => []),
    ]).then(([svcs, cats]) => {
      setServices(svcs as Service[]);
      setCategories(cats as Category[]);
    });
  }, []);

  return <ServicesPageClient services={services} categories={categories} />;
}
