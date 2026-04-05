import ServiceForm from '@/components/admin/ServiceForm';
import Link from 'next/link';

export default function NewServicePage() {
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
        <span className="font-mono text-xs text-alabaster/50 tracking-wider">New Service</span>
      </div>
      <h1 className="font-display text-3xl font-light text-alabaster mb-8">Create Service</h1>
      <ServiceForm mode="create" />
    </div>
  );
}
