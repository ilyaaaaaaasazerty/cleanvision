'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';
import type { Service, Category } from '@/lib/types';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  services: Service[];
  categories: Category[];
}

export default function ServicesPageClient({ services, categories }: Props) {
  const displayServices = services;
  const displayCats = categories;

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const filtered = activeCategory
    ? displayServices.filter((s) => s.category_id === activeCategory)
    : displayServices;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
      );
    });
    return () => ctx.revert();
  }, []);

  // Animate cards on filter change
  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll('.srv-card');
    if (!cards?.length) return;
    gsap.fromTo(
      cards,
      { opacity: 0, y: 30, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power2.out', stagger: 0.07 }
    );
  }, [activeCategory]);

  return (
    <>
      {/* Hero */}
      <div
        ref={heroRef}
        className="relative pt-40 pb-24 px-6 overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(13,110,122,0.08) 0%, transparent 100%)',
        }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/3 w-80 h-80 bg-deep-teal/8 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-xs tracking-[0.5em] text-ice-blue/70 uppercase mb-6">
            What We Offer
          </p>
          <h1 className="font-display text-6xl md:text-8xl font-light leading-none mb-6">
            <span className="text-alabaster">Our</span>{' '}
            <span className="italic text-alabaster/40">Services</span>
          </h1>
          <p className="font-body text-lg text-alabaster/40 max-w-xl leading-relaxed">
            Each service is designed around a singular principle: your space, treated as if it were our own.
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-5 py-2 font-mono text-xs tracking-widest uppercase border transition-all duration-300 ${
                !activeCategory
                  ? 'border-ice-blue text-ice-blue bg-ice-blue/5'
                  : 'border-white/10 text-alabaster/40 hover:border-white/20 hover:text-alabaster/70'
              }`}
            >
              All
            </button>
            {displayCats.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 font-mono text-xs tracking-widest uppercase border transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'border-ice-blue text-ice-blue bg-ice-blue/5'
                    : 'border-white/10 text-alabaster/40 hover:border-white/20 hover:text-alabaster/70'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((service) => (
              <Link key={service.id} href={`/services/${service.id}`} className="group">
                <div className="srv-card relative overflow-hidden bg-white/[0.02] border border-white/[0.05] hover:border-ice-blue/25 transition-all duration-500 hover:-translate-y-2">
                  <div className="relative h-52 overflow-hidden bg-obsidian/50">
                    <div className="absolute inset-0 bg-obsidian/50 z-10 group-hover:bg-obsidian/30 transition-colors duration-500" />
                    {service.image_url && (
                      <Image
                        src={service.image_url}
                        alt={service.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    )}
                    {service.featured && (
                      <div className="absolute top-3 right-3 z-20 px-2 py-0.5 bg-ice-blue/90 text-obsidian font-mono text-[9px] tracking-widest uppercase">
                        Featured
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    {service.category && (
                      <span className="font-mono text-[10px] tracking-widest uppercase text-ice-blue/50 block mb-2">
                        {service.category.name}
                      </span>
                    )}
                    <h3 className="font-display text-lg font-light text-alabaster mb-2 group-hover:text-ice-blue transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="font-body text-xs text-alabaster/35 leading-relaxed mb-4 line-clamp-2">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between">
                      {service.price && (
                        <span className="font-mono text-sm text-ice-blue">
                          ${service.price.toLocaleString()}
                        </span>
                      )}
                      <span className="font-mono text-xs text-alabaster/30 group-hover:text-ice-blue group-hover:translate-x-1 transition-all duration-300">
                        →
                      </span>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-ice-blue/0 via-ice-blue to-ice-blue/0 group-hover:w-full transition-all duration-500" />
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-24">
              <p className="font-display text-2xl text-alabaster/20">No services in this category</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
