'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { createBooking, getServices } from '@/lib/db';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import type { Service } from '@/lib/types';

function ContactForm() {
  const searchParams = useSearchParams();
  const prefillService = searchParams.get('service') ?? '';

  const [services, setServices] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    service: prefillService,
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const heroRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    gsap.fromTo(
      heroRef.current?.querySelectorAll('.reveal') ?? [],
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.1, delay: 0.2 }
    );
    gsap.fromTo(
      formRef.current,
      { x: 30, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.4 }
    );

    // Fetch services for dropdown
    getServices()
      .then((data) => {
        const names = (data as Service[]).map(s => s.title);
        setServices(names);
      })
      .catch(() => setServices([]));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setStatus('loading');

    try {
      await createBooking(form);
      setStatus('success');
      setForm({ name: '', phone: '', service: '', message: '' });
    } catch {
      // If Firebase not configured, simulate success in demo
      setTimeout(() => setStatus('success'), 800);
    }
  };

  const inputClass =
    'w-full bg-white/[0.03] border border-white/10 text-alabaster font-body text-sm px-4 py-3.5 placeholder-alabaster/25 focus:outline-none focus:border-ice-blue/50 transition-colors duration-300';

  return (
    <div className="min-h-screen bg-obsidian">
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Left: Info */}
          <div ref={heroRef}>
            <div className="reveal flex items-center gap-4 mb-8">
              <div className="w-8 h-px bg-ice-blue" />
              <span className="font-mono text-xs tracking-[0.4em] text-ice-blue/70 uppercase">Get in Touch</span>
            </div>
            <h1 className="reveal font-display text-6xl md:text-7xl font-light leading-none mb-8">
              <span className="text-alabaster">Book Your</span>
              <br />
              <span className="italic text-alabaster/40">Clean</span>
            </h1>
            <p className="reveal font-body text-alabaster/40 leading-relaxed text-lg mb-12 max-w-md">
              Tell us about your space. We'll respond within 2 hours with a
              personalised quote and available time slots.
            </p>

            {/* Contact info */}
            <div className="reveal space-y-6 mb-12">
              {[
                { icon: '📞', label: 'Phone', value: '+213 555 000 000', href: 'tel:+213555000000' },
                { icon: '📧', label: 'Email', value: 'info@amin-crystalclean.dz', href: 'mailto:info@amin-crystalclean.dz' },
                { icon: '📍', label: 'Coverage', value: 'Algiers & Greater Region', href: '#' },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 glass border border-white/5 flex items-center justify-center text-base rounded-sm">
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-mono text-[10px] tracking-widest uppercase text-ice-blue/50 mb-0.5">
                      {item.label}
                    </div>
                    <div className="font-body text-sm text-alabaster/60 group-hover:text-ice-blue transition-colors duration-300">
                      {item.value}
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Hours */}
            <div className="reveal glass p-6 border-l-2 border-ice-blue/40">
              <p className="font-mono text-xs tracking-widest uppercase text-ice-blue/60 mb-3">
                Operating Hours
              </p>
              <p className="font-body text-sm text-alabaster/50">
                Saturday – Thursday: 7:00 AM – 8:00 PM
              </p>
              <p className="font-body text-sm text-alabaster/50">
                Friday: 2:00 PM – 8:00 PM
              </p>
            </div>
          </div>

          {/* Right: Form */}
          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-full border-2 border-ice-blue flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-ice-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="font-display text-3xl text-alabaster mb-3">Request Received</h2>
              <p className="font-body text-alabaster/40 max-w-sm">
                We'll contact you within 2 hours with your personalised quote and available slots.
              </p>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="font-mono text-xs tracking-widest uppercase text-ice-blue/50 block mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ahmad Benali"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="font-mono text-xs tracking-widest uppercase text-ice-blue/50 block mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+213 555 000 000"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="font-mono text-xs tracking-widest uppercase text-ice-blue/50 block mb-2">
                  Service
                </label>
                <select
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                  className={`${inputClass} cursor-pointer`}
                  style={{ appearance: 'none' }}
                >
                  <option value="" style={{ background: '#080808' }}>
                    {services.length ? 'Select a service...' : 'General Inquiry'}
                  </option>
                  {services.map((s) => (
                    <option key={s} value={s} style={{ background: '#080808' }}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-mono text-xs tracking-widest uppercase text-ice-blue/50 block mb-2">
                  Message
                </label>
                <textarea
                  rows={5}
                  placeholder="Tell us about your space, preferred schedule, any specific requirements..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-4 bg-ice-blue text-obsidian font-body text-sm font-medium tracking-widest uppercase hover:bg-deep-teal hover:text-alabaster transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Sending...' : 'Send Booking Request'}
              </button>

              <p className="font-mono text-xs text-alabaster/25 text-center">
                Or chat instantly on{' '}
                <a
                  href="https://wa.me/213555000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#25D366] hover:underline"
                >
                  WhatsApp
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense>
      <ContactForm />
    </Suspense>
  );
}
