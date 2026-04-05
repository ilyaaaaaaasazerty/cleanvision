'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      });

      tl.fromTo(
        '.cta-line',
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: 'power2.out', transformOrigin: 'left' }
      )
        .fromTo(
          '.cta-label',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.4'
        )
        .fromTo(
          '.cta-headline',
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          '-=0.4'
        )
        .fromTo(
          '.cta-sub',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.5'
        )
        .fromTo(
          '.cta-buttons',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.4'
        );

      // Parallax background orbs
      gsap.to('.cta-orb-1', {
        y: -60,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        },
      });
      gsap.to('.cta-orb-2', {
        y: 80,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-40 px-6 overflow-hidden bg-obsidian"
    >
      {/* Background elements */}
      <div className="cta-orb-1 absolute top-1/4 left-1/4 w-96 h-96 bg-deep-teal/12 rounded-full blur-3xl pointer-events-none" />
      <div className="cta-orb-2 absolute bottom-1/4 right-1/4 w-64 h-64 bg-ice-blue/8 rounded-full blur-3xl pointer-events-none" />

      {/* Grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(rgba(168,220,235,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(168,220,235,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        <div ref={contentRef} className="text-center">
          {/* Label */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="cta-line w-12 h-px bg-ice-blue" style={{ transformOrigin: 'left' }} />
            <span className="cta-label font-mono text-xs tracking-[0.5em] text-ice-blue/70 uppercase">
              Ready to Begin
            </span>
            <div className="cta-line w-12 h-px bg-ice-blue" style={{ transformOrigin: 'right' }} />
          </div>

          {/* Headline */}
          <h2 className="cta-headline font-display text-6xl md:text-8xl lg:text-9xl font-light leading-[0.9] mb-8">
            <span className="block text-alabaster">Experience</span>
            <span className="block italic gradient-text">the Difference</span>
          </h2>

          {/* Subline */}
          <p className="cta-sub font-body text-lg text-alabaster/40 max-w-lg mx-auto leading-relaxed mb-14">
            One appointment is all it takes to understand why discerning clients
            trust Amin Crystal Clean with their most valued spaces.
          </p>

          {/* Buttons */}
          <div className="cta-buttons flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="group px-10 py-5 bg-ice-blue text-obsidian font-body text-sm font-medium tracking-widest uppercase relative overflow-hidden hover:bg-deep-teal hover:text-alabaster transition-all duration-400"
            >
              <span className="relative z-10">Book Your Service</span>
            </Link>

            <a
              href={`https://wa.me/213555000000?text=${encodeURIComponent('Hello! I\'d like to learn more about Amin Crystal Clean services.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group px-10 py-5 border border-white/15 text-alabaster/70 font-body text-sm tracking-widest uppercase hover:border-ice-blue/40 hover:text-ice-blue transition-all duration-300 flex items-center gap-3 justify-center"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat on WhatsApp
            </a>
          </div>

          {/* Trust badge */}
          <div className="mt-16 flex items-center justify-center gap-8">
            {['Insured & Certified', 'Eco Products', '100% Guarantee'].map((badge) => (
              <div key={badge} className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-ice-blue/50" />
                <span className="font-mono text-xs tracking-wider text-alabaster/30 uppercase">
                  {badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
