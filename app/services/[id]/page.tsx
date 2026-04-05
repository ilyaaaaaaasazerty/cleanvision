import { getServiceById, getServices } from '@/lib/supabaseClient';
import ServiceDetailClient from './ServiceDetailClient';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  try {
    const services = await getServices();
    return services.map((s: { id: string }) => ({ id: s.id }));
  } catch {
    return [];
  }
}

export default async function ServiceDetailPage({ params }: { params: { id: string } }) {
  let service = null;

  try {
    service = await getServiceById(params.id);
  } catch {
    // Check fallback
  }

  if (!service) {
    // Use fallback data for demo
    const fallbacks: Record<string, object> = {
      '1': { id: '1', title: 'Residential Deep Clean', description: 'Every corner, every surface — transformed. Our deep clean protocol leaves your home immaculate from ceiling to floor. We use eco-friendly, hospital-grade products safe for your family and pets.', image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80', price: 120, featured: true, category_id: '1', created_at: '', category: { id: '1', name: 'Residential', created_at: '' } },
    };
    service = fallbacks[params.id] || null;
  }

  if (!service) return notFound();

  return <ServiceDetailClient service={service as never} />;
}
