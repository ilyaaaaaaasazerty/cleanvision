'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const COUNTERS = [
  { end: 2400, suffix: '+', label: 'Homes Cleaned', prefix: '' },
  { end: 98, suffix: '%', label: 'Satisfaction Rate', prefix: '' },
  { end: 7, suffix: ' yrs', label: 'Of Excellence', prefix: '' },
  { end: 150, suffix: '+', label: 'Expert Staff', prefix: '' },
];

const TESTIMONIALS = [
  {
    id: 1,
    author: 'Sophia Laurent',
    role: 'Interior Designer',
    rating: 5,
    content:
      'Amin Crystal Clean transformed my showroom before our biggest client presentation. The level of detail — the clarity on every glass surface — was beyond anything I had experienced.',
  },
  {
    id: 2,
    author: 'Marcus Chen',
    role: 'Property Manager',
    rating: 5,
    content:
      'We manage 12 luxury buildings. Amin Crystal Clean is the only team we trust for our premium units. Their consistency and professionalism is unmatched in the market.',
  },
  {
    id: 3,
    author: 'Isabelle Fontaine',
    role: 'Homeowner',
    rating: 5,
    content:
      'I was skeptical at first, but the result genuinely shocked me. My home felt like a completely different space — elevated, calm, pristine. I book them monthly now.',
  },
];

function useCounter(end: number, duration: number = 2) {
  const [count, setCount] = useState(0);
  const triggered = useRef(false);

  const trigger = () => {
    if (triggered.current) return;
    triggered.current = true;
    gsap.to({ val: 0 }, {
      val: end,
      duration,
      ease: 'power2.out',
      onUpdate: function () {
        setCount(Math.round(this.targets()[0].val));
      },
    });
  };

  return { count, trigger };
}

function CounterItem({
  counter,
  onTrigger,
}: {
  counter: typeof COUNTERS[0];
  onTrigger: (fn: () => void) => void;
}) {
  const { count, trigger } = useCounter(counter.end);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onTrigger(trigger);
  });

  return (
    <div ref={ref} className="text-center group">
      <div className="counter-number font-display text-6xl md:text-7xl font-light text-ice-blue mb-2">
        {counter.prefix}{count.toLocaleString()}{counter.suffix}
      </div>
      <div className="font-mono text-xs tracking-[0.3em] uppercase text-alabaster/40">
        {counter.label}
      </div>
    </div>
  );
}

export default function TrustSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const countersRef = useRef<HTMLDivElement>(null);
  const triggerFns = useRef<(() => void)[]>([]);
  const triggered = useRef(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.trust-heading',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.trust-heading', start: 'top 80%' },
        }
      );

      gsap.fromTo(
        '.testimonial-card',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: { trigger: '.testimonial-card', start: 'top 80%' },
        }
      );

      ScrollTrigger.create({
        trigger: countersRef.current,
        start: 'top 75%',
        onEnter: () => {
          if (!triggered.current) {
            triggered.current = true;
            triggerFns.current.forEach((fn) => fn());
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const registerTrigger = (fn: () => void) => {
    triggerFns.current.push(fn);
  };

  return (
    <section ref={sectionRef} className="py-32 px-6 bg-obsidian relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute left-0 top-1/2 w-px h-40 bg-gradient-to-b from-transparent via-ice-blue/20 to-transparent" />

      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="trust-heading mb-24 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-8 h-px bg-ice-blue" />
            <span className="font-mono text-xs tracking-[0.4em] text-ice-blue/70 uppercase">
              Why Choose Us
            </span>
            <div className="w-8 h-px bg-ice-blue" />
          </div>
          <h2 className="font-display text-5xl md:text-6xl font-light leading-none">
            <span className="text-alabaster">Numbers that speak</span>
            <br />
            <span className="italic text-alabaster/40">for themselves</span>
          </h2>
        </div>

        {/* Counters */}
        <div
          ref={countersRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-32 border-y border-white/5 py-16"
        >
          {COUNTERS.map((counter, i) => (
            <CounterItem
              key={i}
              counter={counter}
              onTrigger={registerTrigger}
            />
          ))}
        </div>

        {/* Testimonials */}
        <div>
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-px bg-ice-blue" />
              <span className="font-mono text-xs tracking-[0.4em] text-ice-blue/70 uppercase">
                Testimonials
              </span>
            </div>
            <h3 className="font-display text-3xl md:text-4xl font-light text-alabaster">
              What clients say
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="testimonial-card glass p-8 relative overflow-hidden group hover:border-ice-blue/20 transition-all duration-500"
              >
                {/* Quote mark */}
                <div className="font-display text-8xl leading-none text-ice-blue/10 absolute -top-4 -left-2 select-none">
                  "
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5 text-ice-blue" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="font-body text-sm text-alabaster/60 leading-relaxed mb-8 italic">
                  "{t.content}"
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-deep-teal to-ice-blue/40 flex items-center justify-center font-display text-sm text-alabaster">
                    {t.author[0]}
                  </div>
                  <div>
                    <div className="font-body text-sm font-medium text-alabaster">
                      {t.author}
                    </div>
                    <div className="font-mono text-xs text-ice-blue/50">
                      {t.role}
                    </div>
                  </div>
                </div>

                {/* Hover accent */}
                <div className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-ice-blue/0 via-ice-blue/40 to-ice-blue/0 w-0 group-hover:w-full transition-all duration-700" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
