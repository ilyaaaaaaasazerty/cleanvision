'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import Link from 'next/link';
import type { Service } from '@/lib/types';

interface Props { service: Service }

export default function ServiceDetailClient({ service }: Props) {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      heroRef.current?.querySelectorAll('.reveal-item') ?? [],
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.12, delay: 0.2 }
    );
  }, []);

  const includes = [
    'Full surface sanitisation',
    'Eco-certified products',
    'Trained, vetted team',
    'Post-service inspection',
    'Satisfaction guarantee',
    'Free follow-up if needed',
  ];

  return (
    <div className="min-h-screen bg-obsidian">
      {/* Hero */}
      <div ref={heroRef} className="relative pt-32 pb-0 overflow-hidden">
        {/* Background image */}
        {service.image_url && (
          <div className="absolute inset-0 h-[70vh]">
            <Image
              src={service.image_url}
              alt={service.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-obsidian/70 via-obsidian/80 to-obsidian" />
          </div>
        )}

        <div className="relative max-w-6xl mx-auto px-6 pb-24">
          {/* Breadcrumb */}
          <div className="reveal-item flex items-center gap-2 mb-12 font-mono text-xs text-alabaster/30 tracking-wider">
            <Link href="/" className="hover:text-ice-blue transition-colors">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-ice-blue transition-colors">Services</Link>
            <span>/</span>
            <span className="text-alabaster/50">{service.title}</span>
          </div>

          {/* Category */}
          {service.category && (
            <div className="reveal-item mb-4">
              <span className="font-mono text-xs tracking-[0.4em] uppercase text-ice-blue/70">
                {service.category.name}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="reveal-item font-display text-5xl md:text-7xl font-light leading-none mb-6 max-w-3xl">
            <span className="text-alabaster">{service.title}</span>
          </h1>

          {/* Price */}
          {service.price && (
            <div className="reveal-item mb-8">
              <span className="font-mono text-sm text-alabaster/40">Starting from </span>
              <span className="font-display text-3xl text-ice-blue">${service.price}</span>
            </div>
          )}

          {/* CTA row */}
          <div className="reveal-item flex flex-wrap gap-4">
            <Link
              href={`/contact?service=${encodeURIComponent(service.title)}`}
              className="px-8 py-4 bg-ice-blue text-obsidian font-body text-sm font-medium tracking-widest uppercase hover:bg-deep-teal hover:text-alabaster transition-all duration-300"
            >
              Book This Service
            </Link>
            <a
              href={`https://wa.me/213555000000?text=${encodeURIComponent(`Hello! I'm interested in: ${service.title}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border border-white/15 text-alabaster/60 font-body text-sm tracking-widest uppercase hover:border-ice-blue/40 hover:text-ice-blue transition-all duration-300"
            >
              Ask on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Description */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl font-light text-alabaster mb-6">
              About This Service
            </h2>
            <p className="font-body text-alabaster/50 leading-relaxed text-lg mb-8">
              {service.description}
            </p>
            <p className="font-body text-alabaster/40 leading-relaxed">
              Our trained team arrives fully equipped with professional-grade, eco-certified cleaning solutions.
              We follow a systematic protocol ensuring no surface is overlooked. Every booking includes a
              post-service quality inspection and our no-questions-asked return guarantee.
            </p>
          </div>

          {/* Includes sidebar */}
          <div>
            <div className="glass p-8">
              <h3 className="font-mono text-xs tracking-[0.3em] uppercase text-ice-blue/70 mb-6">
                What's Included
              </h3>
              <ul className="space-y-4">
                {includes.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border border-ice-blue/40 flex items-center justify-center flex-shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-ice-blue" />
                    </div>
                    <span className="font-body text-sm text-alabaster/60">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-8 border-t border-white/5">
                <p className="font-mono text-xs text-alabaster/30 tracking-wider mb-4">
                  Questions? We're here.
                </p>
                <a
                  href="tel:+213555000000"
                  className="font-display text-lg text-ice-blue hover:text-alabaster transition-colors"
                >
                  +213 555 000 000
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back link */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <Link
          href="/services"
          className="inline-flex items-center gap-3 font-mono text-xs tracking-widest uppercase text-alabaster/30 hover:text-ice-blue transition-colors duration-300 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
          All Services
        </Link>
      </div>
    </div>
  );
}
