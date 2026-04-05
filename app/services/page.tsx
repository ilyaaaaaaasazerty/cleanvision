import { getServices, getCategories } from '@/lib/supabaseClient';
import ServicesPageClient from './ServicesPageClient';

export const revalidate = 60;

export default async function ServicesPage() {
  let services = [];
  let categories = [];

  try {
    [services, categories] = await Promise.all([getServices(), getCategories()]);
  } catch {
    // Show fallback data if Supabase not configured
  }

  return <ServicesPageClient services={services} categories={categories} />;
}
