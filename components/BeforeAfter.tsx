'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function BeforeAfter() {
  const sectionRef = useRef<HTMLElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [revealed, setRevealed] = useState(false);

  // Auto-reveal on scroll entry
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section heading reveal
      gsap.fromTo(
        '.ba-heading',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      );

      // Auto-sweep animation on entry
      ScrollTrigger.create({
        trigger: sliderRef.current,
        start: 'top 70%',
        onEnter: () => {
          if (!revealed) {
            setRevealed(true);
            gsap.fromTo(
              { val: 50 },
              { val: 50 },
              {
                val: 25,
                duration: 1.5,
                ease: 'power2.inOut',
                onUpdate: function () {
                  setPosition(this.targets()[0].val);
                },
                onComplete: () => {
                  gsap.to(
                    { val: 25 },
                    {
                      val: 75,
                      duration: 2,
                      ease: 'power2.inOut',
                      onUpdate: function () {
                        setPosition(this.targets()[0].val);
                      },
                      onComplete: () => {
                        gsap.to(
                          { val: 75 },
                          {
                            val: 50,
                            duration: 1,
                            ease: 'power2.out',
                            onUpdate: function () {
                              setPosition(this.targets()[0].val);
                            },
                          }
                        );
                      },
                    }
                  );
                },
              }
            );
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [revealed]);

  const updatePosition = useCallback((clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (isDragging) updatePosition(e.clientX); };
    const onUp = () => setIsDragging(false);
    const onTouch = (e: TouchEvent) => {
      if (isDragging) updatePosition(e.touches[0].clientX);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onTouch);
    document.addEventListener('touchend', onUp);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onTouch);
      document.removeEventListener('touchend', onUp);
    };
  }, [isDragging, updatePosition]);

  const images = {
    before: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    after: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80',
  };

  return (
    <section ref={sectionRef} className="py-32 px-6 bg-obsidian relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-deep-teal/3 to-obsidian pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="ba-heading mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-px bg-ice-blue" />
              <span className="font-mono text-xs tracking-[0.4em] text-ice-blue/70 uppercase">
                Transformation
              </span>
            </div>
            <h2 className="font-display text-5xl md:text-6xl font-light leading-none">
              <span className="text-alabaster">The</span>{' '}
              <span className="italic text-alabaster/40">difference</span>
              <br />
              <span className="text-alabaster">is undeniable</span>
            </h2>
          </div>
          <p className="font-body text-sm text-alabaster/40 max-w-xs leading-relaxed">
            Drag the handle to reveal the transformation. Every surface, treated with exceptional care.
          </p>
        </div>

        {/* Slider */}
        <div
          ref={sliderRef}
          className="relative w-full h-[500px] overflow-hidden cursor-col-resize select-none"
          style={{ touchAction: 'none' }}
          onMouseDown={handleMouseDown}
          onTouchStart={(e) => {
            setIsDragging(true);
            updatePosition(e.touches[0].clientX);
          }}
        >
          {/* BEFORE (right side, full) */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${images.before})`,
              filter: 'grayscale(30%) brightness(0.6)',
            }}
          >
            <div className="absolute bottom-6 right-6 font-mono text-xs tracking-widest uppercase text-alabaster/50">
              Before
            </div>
          </div>

          {/* AFTER (left side, clipped) */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${images.after})`,
              clipPath: `inset(0 ${100 - position}% 0 0)`,
            }}
          >
            <div className="absolute bottom-6 left-6 font-mono text-xs tracking-widest uppercase text-ice-blue/70">
              After
            </div>
          </div>

          {/* Divider line */}
          <div
            className="absolute top-0 bottom-0 w-px bg-white/40 shadow-[0_0_12px_rgba(168,220,235,0.6)]"
            style={{ left: `${position}%` }}
          />

          {/* Handle */}
          <div
            ref={handleRef}
            className="before-after-handle absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 w-12 h-12 rounded-full bg-obsidian border-2 border-ice-blue/60 flex items-center justify-center shadow-lg shadow-black/40 hover:scale-110 transition-transform"
            style={{ left: `${position}%` }}
            onMouseDown={handleMouseDown}
            onTouchStart={(e) => {
              setIsDragging(true);
              updatePosition(e.touches[0].clientX);
            }}
          >
            <svg className="w-5 h-5 text-ice-blue" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 5l-4 5 4 5M13 5l4 5-4 5" strokeWidth="1.5" stroke="currentColor" fill="none" />
            </svg>
          </div>

          {/* Labels overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-6 transition-all duration-200"
              style={{ left: `${Math.min(position - 5, 80)}%`, opacity: position < 90 ? 1 : 0 }}
            >
              <span className="font-mono text-xs tracking-widest uppercase text-ice-blue bg-obsidian/60 px-2 py-1">
                After
              </span>
            </div>
            <div
              className="absolute top-6 transition-all duration-200"
              style={{ left: `${Math.max(position + 2, 5)}%`, opacity: position > 10 ? 1 : 0 }}
            >
              <span className="font-mono text-xs tracking-widest uppercase text-alabaster/50 bg-obsidian/60 px-2 py-1">
                Before
              </span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-12 grid grid-cols-3 gap-8 border-t border-white/5 pt-12">
          {[
            { value: '100%', label: 'Satisfaction Rate' },
            { value: '3×', label: 'Cleaner Than Standard' },
            { value: '24h', label: 'Fresh Scent Duration' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-4xl md:text-5xl font-light text-ice-blue mb-2">
                {stat.value}
              </div>
              <div className="font-mono text-xs tracking-widest uppercase text-alabaster/40">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
