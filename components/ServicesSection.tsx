'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';
import type { Service } from '@/lib/types';

gsap.registerPlugin(ScrollTrigger);

interface ServicesSectionProps {
  services?: Service[];
}

export default function ServicesSection({ services }: ServicesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const displayServices = services || [];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(
        headingRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 80%',
          },
        }
      );

      // Cards stagger
      const cards = gridRef.current?.querySelectorAll('.service-card-gsap');
      if (cards?.length) {
        gsap.fromTo(
          cards,
          { y: 80, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.12,
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 75%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [displayServices.length]);

  if (displayServices.length === 0) {
    return (
      <section className="py-20 px-6 bg-obsidian text-center">
        <p className="font-display text-2xl text-alabaster/20 italic">No services curated yet.</p>
        <p className="font-mono text-[10px] text-alabaster/10 mt-2 uppercase tracking-widest">Check back soon</p>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="py-32 px-6 bg-obsidian relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-deep-teal/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-ice-blue/4 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div ref={headingRef} className="mb-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-ice-blue" />
            <span className="font-mono text-xs tracking-[0.4em] text-ice-blue/70 uppercase">
              Our Services
            </span>
          </div>
          <h2 className="font-display text-5xl md:text-7xl font-light leading-none">
            <span className="text-alabaster">Precision</span>
            <br />
            <span className="italic text-alabaster/40">in every service</span>
          </h2>
        </div>

        {/* Services grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {displayServices.slice(0, 6).map((service: Service, i: number) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>

        {/* View all link */}
        <div className="mt-16 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-3 font-body text-sm tracking-widest uppercase text-ice-blue/70 hover:text-ice-blue transition-colors duration-300 group"
          >
            View All Services
            <span className="w-8 h-px bg-ice-blue/40 group-hover:w-16 transition-all duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <Link href={`/services/${service.id}`} className="group">
      <div
        ref={cardRef}
        className="service-card service-card-gsap relative overflow-hidden bg-white/[0.02] border border-white/[0.05] hover:border-ice-blue/20 transition-all duration-500"
        style={{ cursor: 'pointer' }}
      >
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <div className="absolute inset-0 bg-obsidian/60 z-10 group-hover:bg-obsidian/40 transition-colors duration-500" />
          {service.image_url && (
            <Image
              src={service.image_url}
              alt={service.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          {/* Category badge */}
          {service.category && (
            <div className="absolute top-4 left-4 z-20">
              <span className="font-mono text-xs tracking-widest uppercase text-ice-blue/80 bg-obsidian/60 px-2 py-1">
                {service.category.name}
              </span>
            </div>
          )}
          {/* Featured indicator */}
          {service.featured && (
            <div className="absolute top-4 right-4 z-20 w-2 h-2 bg-ice-blue rounded-full" />
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-display text-xl font-light text-alabaster mb-2 group-hover:text-ice-blue transition-colors duration-300">
            {service.title}
          </h3>
          <p className="font-body text-sm text-alabaster/40 leading-relaxed mb-4 line-clamp-2">
            {service.description}
          </p>

          <div className="flex items-center justify-between">
            {service.price && (
              <span className="font-mono text-sm text-ice-blue/60">
                From{' '}
                <span className="text-ice-blue font-medium">
                  ${service.price.toLocaleString()}
                </span>
              </span>
            )}
            <span className="font-mono text-xs tracking-widest uppercase text-alabaster/30 group-hover:text-ice-blue group-hover:translate-x-1 transition-all duration-300">
              Details →
            </span>
          </div>
        </div>

        {/* Hover accent line */}
        <div className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-ice-blue/0 via-ice-blue to-ice-blue/0 w-0 group-hover:w-full transition-all duration-500" />
      </div>
    </Link>
  );
}
