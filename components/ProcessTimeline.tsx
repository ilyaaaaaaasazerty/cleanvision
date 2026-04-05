'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    number: '01',
    title: 'Book',
    subtitle: 'In 60 seconds',
    description:
      'Choose your service, select a time slot that works for you. Our booking system is frictionless by design.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'We Arrive',
    subtitle: 'Punctual, equipped',
    description:
      'Our team arrives at the agreed time with all professional-grade equipment and eco-conscious products.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'We Clean',
    subtitle: 'With obsessive care',
    description:
      'Every surface, corner, and detail receives our complete attention. We work systematically to achieve perfection.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'You Relax',
    subtitle: 'Perfection delivered',
    description:
      'Walk into your transformed space. If anything falls short of perfect, we return immediately — no questions asked.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
];

export default function ProcessTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading
      gsap.fromTo(
        '.process-heading',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.process-heading', start: 'top 80%' },
        }
      );

      // Animated line grow
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.5,
          ease: 'power2.inOut',
          transformOrigin: 'left center',
          scrollTrigger: {
            trigger: lineRef.current,
            start: 'top 75%',
          },
        }
      );

      // Steps stagger
      gsap.fromTo(
        '.process-step',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.18,
          scrollTrigger: {
            trigger: '.process-steps',
            start: 'top 75%',
          },
        }
      );

      // Individual step icon spin
      stepsRef.current.forEach((step, i) => {
        if (!step) return;
        gsap.fromTo(
          step.querySelector('.step-icon'),
          { rotation: -20, scale: 0.7, opacity: 0 },
          {
            rotation: 0,
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: 'back.out(1.5)',
            delay: i * 0.18,
            scrollTrigger: {
              trigger: step,
              start: 'top 80%',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 px-6 bg-obsidian relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-deep-teal/3 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="process-heading mb-24">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-ice-blue" />
            <span className="font-mono text-xs tracking-[0.4em] text-ice-blue/70 uppercase">
              How It Works
            </span>
          </div>
          <h2 className="font-display text-5xl md:text-6xl font-light leading-none">
            <span className="text-alabaster">A process built</span>
            <br />
            <span className="italic text-alabaster/40">for perfection</span>
          </h2>
        </div>

        {/* Desktop: Horizontal timeline */}
        <div className="hidden lg:block">
          {/* Connector line */}
          <div className="relative mb-16">
            <div className="absolute top-0 left-0 right-0 h-px bg-white/5" />
            <div
              ref={lineRef}
              className="h-px bg-gradient-to-r from-deep-teal via-ice-blue to-deep-teal"
              style={{ transformOrigin: 'left' }}
            />
          </div>

          {/* Steps */}
          <div className="process-steps grid grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <div
                key={step.number}
                className="process-step relative"
                ref={(el) => { if (el) stepsRef.current[i] = el; }}
              >
                {/* Number */}
                <div className="font-mono text-[10px] tracking-widest text-ice-blue/40 mb-4 uppercase">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="step-icon w-12 h-12 rounded-full glass border border-ice-blue/20 flex items-center justify-center text-ice-blue mb-6">
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="font-display text-2xl font-light text-alabaster mb-1">
                  {step.title}
                </h3>
                <p className="font-mono text-xs text-ice-blue/50 tracking-wider mb-3">
                  {step.subtitle}
                </p>
                <p className="font-body text-sm text-alabaster/40 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: Vertical timeline */}
        <div className="lg:hidden relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-white/5" />
          <div
            ref={lineRef}
            className="absolute left-6 top-0 w-px bg-gradient-to-b from-deep-teal via-ice-blue to-deep-teal"
            style={{ height: '100%', transformOrigin: 'top' }}
          />

          <div className="process-steps space-y-16">
            {STEPS.map((step, i) => (
              <div
                key={step.number}
                className="process-step pl-16 relative"
                ref={(el) => { if (el) stepsRef.current[i] = el; }}
              >
                {/* Node */}
                <div className="step-icon absolute left-0 w-12 h-12 rounded-full glass border border-ice-blue/20 flex items-center justify-center text-ice-blue">
                  {step.icon}
                </div>

                <div className="font-mono text-[10px] tracking-widest text-ice-blue/40 mb-2 uppercase">
                  {step.number}
                </div>
                <h3 className="font-display text-2xl font-light text-alabaster mb-1">
                  {step.title}
                </h3>
                <p className="font-mono text-xs text-ice-blue/50 tracking-wider mb-3">
                  {step.subtitle}
                </p>
                <p className="font-body text-sm text-alabaster/40 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
